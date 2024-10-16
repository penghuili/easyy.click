import { Button, Checkbox, Col, Dropdown, Row, Typography } from '@douyinfe/semi-ui';
import { RiAddLine, RiDragMoveLine, RiImportLine, RiMore2Line } from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { isDeletingGroupCat, noGroupSortKey } from '../store/group/groupCats.js';
import { deleteGroupEffect } from '../store/group/groupEffect.js';
import {
  isDeletingLinkCat,
  isDeletingLinksCat,
  isLoadingLinksCat,
  isMovingLinkCat,
  useLinkGroups,
} from '../store/link/linkCats.js';
import {
  deleteLinkEffect,
  deleteLinksEffect,
  moveLinkEffect,
  updateLinkEffect,
} from '../store/link/linkEffect.js';
import { useSpaces } from '../store/space/spaceCats.js';
import { Confirm } from './Confirm.jsx';
import { Favicon } from './Favicon.jsx';
import { Flex } from './Flex.jsx';
import { confirmDeleteGroupMessage } from './GroupItems.jsx';
import { GroupSelectorForMove } from './GroupSelectorForMove.jsx';
import { Link } from './Link.jsx';
import { PageEmpty } from './PageEmpty.jsx';
import { PageLoading } from './PageLoading.jsx';
import { Top10Links } from './Top10Links.jsx';

export const LinkItems = fastMemo(({ spaceId }) => {
  const { groups: linkGroups, links } = useLinkGroups(false, spaceId);
  const isDeletingLink = useCat(isDeletingLinkCat);
  const isDeletingLinks = useCat(isDeletingLinksCat);
  const isDeletingGroup = useCat(isDeletingGroupCat);
  const isMoving = useCat(isMovingLinkCat);
  const isLoading = useCat(isLoadingLinksCat);
  const spaces = useSpaces();

  const otherSpaces = useMemo(
    () => spaces.filter(space => space.sortKey !== spaceId),
    [spaceId, spaces]
  );

  const [activeLink, setActiveLink] = useState(null);
  const [showDeleteLinkConfirm, setShowDeleteLinkConfirm] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);

  const [newSpace, setNewSpace] = useState(null);
  const [newSpaceGroupId, setNewSpaceGroupId] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);

  const [showDeleteMultiple, setShowDeleteMultiple] = useState(false);
  const [linksToDelete, setLinksToDelete] = useState({});
  const [showDeleteMultipleConfirm, setShowDeleteMultipleConfirm] = useState(false);

  const linksToDeleteSortKeys = useMemo(() => {
    if (!showDeleteMultiple) {
      return [];
    }

    return Object.keys(linksToDelete).filter(key => linksToDelete[key]);
  }, [linksToDelete, showDeleteMultiple]);

  function renderActions() {
    return (
      <Flex direction="row" wrap="wrap" gap="1rem" m="0.5rem 0 1.5rem">
        <Button
          theme="solid"
          onClick={() => navigateTo(`/links/add?spaceId=${spaceId}`)}
          icon={<RiAddLine />}
        >
          Add links
        </Button>

        {links.length > 1 && (
          <Button
            onClick={() => navigateTo(`/links/reorder?spaceId=${spaceId}`)}
            icon={<RiDragMoveLine />}
          >
            Reorder links
          </Button>
        )}

        <Dropdown
          trigger="click"
          position={'bottomLeft'}
          clickToHide
          render={
            <Dropdown.Menu>
              <Dropdown.Item
                icon={<RiImportLine />}
                onClick={() => navigateTo(`/links/import?spaceId=${spaceId}`)}
              >
                Import browser bookmarks
              </Dropdown.Item>
              {links?.length > 1 && (
                <Dropdown.Item
                  type="danger"
                  icon={<RiImportLine />}
                  onClick={() => setShowDeleteMultiple(true)}
                >
                  Delete multiple links
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          }
        >
          <Button
            theme="borderless"
            icon={<RiMore2Line />}
            style={{
              marginRight: 2,
            }}
          />
        </Dropdown>
      </Flex>
    );
  }

  if (!links.length) {
    return (
      <>
        {renderActions()}
        {isLoading ? <PageLoading /> : <PageEmpty>Which webites do you visit regularly?</PageEmpty>}
      </>
    );
  }

  return (
    <>
      {renderActions()}

      <Top10Links spaceId={spaceId} />

      {linkGroups.map(group => (
        <div key={group.sortKey} style={{ marginBottom: '2rem' }}>
          <Flex direction="row" justify="between" align="center">
            <Typography.Title heading={5}>{group.title}</Typography.Title>

            <Flex direction="row" gap="1rem" align="center">
              <Button
                theme="borderless"
                icon={<RiAddLine />}
                onClick={() =>
                  navigateTo(
                    group.sortKey === noGroupSortKey
                      ? `/links/add?spaceId=${spaceId}`
                      : `/links/add?groupId=${group.sortKey}&spaceId=${spaceId}`
                  )
                }
              />
              <Dropdown
                trigger="click"
                position={'bottomLeft'}
                clickToHide
                render={
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        navigateTo(`/groups/details?groupId=${group.sortKey}&spaceId=${spaceId}`);
                      }}
                    >
                      Edit tag
                    </Dropdown.Item>
                    <Dropdown.Item
                      type="danger"
                      onClick={() => {
                        setActiveGroup(group);
                        setShowDeleteGroupConfirm(true);
                      }}
                    >
                      Delete tag
                    </Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <Button
                  theme="borderless"
                  icon={<RiMore2Line />}
                  style={{
                    marginRight: 2,
                  }}
                />
              </Dropdown>
            </Flex>
          </Flex>

          {group.items?.length ? (
            <>
              <Row type="flex">
                {group.items.map(link => (
                  <Col
                    key={link.sortKey}
                    span={12}
                    md={8}
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',

                      overflow: 'hidden',
                      position: 'relative',
                      padding: '0.5rem 1.5rem 0.5rem 0',
                    }}
                  >
                    <Link
                      href={link.link}
                      target="_blank"
                      onClick={() => {
                        updateLinkEffect(
                          link.sortKey,
                          {
                            count: (link.count || 0) + 1,
                          },
                          spaceId
                        );
                      }}
                    >
                      <Favicon url={link.link} />
                      {link.title}
                    </Link>

                    {showDeleteMultiple ? (
                      <Checkbox
                        checked={!!linksToDelete[link.sortKey]}
                        onChange={e => {
                          setLinksToDelete({ ...linksToDelete, [link.sortKey]: e.target.checked });
                        }}
                      />
                    ) : (
                      <Dropdown
                        trigger="click"
                        position={'bottomLeft'}
                        clickToHide
                        render={
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => {
                                navigateTo(
                                  `/links/details?linkId=${link.sortKey}&spaceId=${spaceId}`
                                );
                              }}
                            >
                              Edit link
                            </Dropdown.Item>

                            {otherSpaces.length > 0 && (
                              <>
                                <Dropdown.Divider />

                                {otherSpaces.map(space => (
                                  <Dropdown.Item
                                    key={space.sortKey}
                                    onClick={() => {
                                      setActiveLink(link);
                                      setNewSpace(space);
                                      setShowMoveModal(true);
                                    }}
                                    disabled={isMoving}
                                  >
                                    Move to "{space.title}"
                                  </Dropdown.Item>
                                ))}

                                <Dropdown.Divider />
                              </>
                            )}

                            <Dropdown.Item
                              type="danger"
                              onClick={() => {
                                setActiveLink(link);
                                setShowDeleteLinkConfirm(true);
                              }}
                            >
                              Delete link
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        }
                      >
                        <Button
                          theme="borderless"
                          icon={<RiMore2Line width="20" height="20" />}
                          size="small"
                          style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                          }}
                        />
                      </Dropdown>
                    )}
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <Typography.Text type="secondary">No links here.</Typography.Text>
          )}
        </div>
      ))}

      {showDeleteMultiple && (
        <Flex direction="row" justify="between">
          <Button
            onClick={() => {
              setLinksToDelete({});
              setShowDeleteMultiple(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="danger"
            theme="solid"
            onClick={() => {
              setShowDeleteMultipleConfirm(true);
            }}
            disabled={!linksToDeleteSortKeys?.length}
          >
            {linksToDeleteSortKeys?.length
              ? `Delete ${linksToDeleteSortKeys?.length} ${linksToDeleteSortKeys?.length === 1 ? 'link' : 'links'}`
              : 'Delete'}
          </Button>
        </Flex>
      )}

      <GroupSelectorForMove
        open={showMoveModal}
        onOpenChange={setShowMoveModal}
        groupId={newSpaceGroupId}
        onSelect={setNewSpaceGroupId}
        spaceId={newSpace?.sortKey}
        onConfirm={async () => {
          if (!activeLink || !newSpace) {
            return;
          }

          await moveLinkEffect(activeLink, spaceId, newSpace.sortKey, newSpaceGroupId);

          setShowMoveModal(false);
          setActiveLink(null);
          setNewSpace(null);
        }}
        isSaving={isMoving}
      />

      <Confirm
        message={'Are you sure to delete selected links?'}
        open={showDeleteMultipleConfirm}
        onOpenChange={setShowDeleteMultipleConfirm}
        onConfirm={async () => {
          if (!linksToDeleteSortKeys?.length) {
            return;
          }

          await deleteLinksEffect(linksToDeleteSortKeys, spaceId);
          setShowDeleteMultipleConfirm(false);
          setShowDeleteMultiple(false);
          setLinksToDelete({});
        }}
        isSaving={isDeletingLinks}
      />

      <Confirm
        message="Are you sure to delete this link?"
        open={showDeleteLinkConfirm}
        onOpenChange={setShowDeleteLinkConfirm}
        onConfirm={async () => {
          if (!activeLink) {
            return;
          }

          await deleteLinkEffect(activeLink?.sortKey, { showMessage: true }, spaceId);
          setShowDeleteLinkConfirm(false);
          setActiveLink(null);
        }}
        isSaving={isDeletingLink}
      />

      <Confirm
        message={confirmDeleteGroupMessage}
        open={showDeleteGroupConfirm}
        onOpenChange={setShowDeleteGroupConfirm}
        onConfirm={async () => {
          if (!activeGroup) {
            return;
          }

          await deleteGroupEffect(activeGroup.sortKey, spaceId);
          setShowDeleteGroupConfirm(false);
          setActiveGroup(null);
        }}
        isSaving={isDeletingGroup}
      />
    </>
  );
});
