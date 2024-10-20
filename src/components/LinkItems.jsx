import { Button, Checkbox, Col, Dropdown, Row, Typography } from '@douyinfe/semi-ui';
import {
  RiAddLine,
  RiDeleteBinLine,
  RiDragMoveLine,
  RiEdit2Line,
  RiExternalLinkLine,
  RiImportLine,
  RiLockLine,
  RiMore2Line,
  RiShareLine,
} from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import {
  isDeletingGroupCat,
  isUpdatingGroupCat,
  noGroupSortKey,
} from '../store/group/groupCats.js';
import {
  deleteGroupEffect,
  shareGroupLinksEffect,
  unshareGroupLinksEffect,
} from '../store/group/groupEffect.js';
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
  moveLinksEffect,
  updateLinkEffect,
} from '../store/link/linkEffect.js';
import { isUpdatingSpaceCat, useSpace, useSpaces } from '../store/space/spaceCats.js';
import { shareSpaceLinksEffect, unshareSpaceLinksEffect } from '../store/space/spaceEffect.js';
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
  const isUpdatingGroup = useCat(isUpdatingGroupCat);
  const isUpdatingSpace = useCat(isUpdatingSpaceCat);
  const isDeletingLink = useCat(isDeletingLinkCat);
  const isDeletingLinks = useCat(isDeletingLinksCat);
  const isDeletingGroup = useCat(isDeletingGroupCat);
  const isMoving = useCat(isMovingLinkCat);
  const isLoading = useCat(isLoadingLinksCat);
  const spaces = useSpaces();
  const space = useSpace(spaceId);

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
  const [showMoveLinkModal, setShowMoveLinkModal] = useState(false);
  const [showMoveLinksModal, setShowMoveLinksModal] = useState(false);

  const [showDeleteMultiple, setShowDeleteMultiple] = useState(false);
  const [linksToDelete, setLinksToDelete] = useState({});
  const [showDeleteMultipleConfirm, setShowDeleteMultipleConfirm] = useState(false);

  const [showPublicGroupConfirm, setShowPublicGroupConfirm] = useState(false);

  const [showPublicSpaceConfirm, setShowPublicSpaceConfirm] = useState(false);

  const linksToDeleteSortKeys = useMemo(() => {
    if (!showDeleteMultiple) {
      return [];
    }

    return Object.keys(linksToDelete).filter(key => linksToDelete[key]);
  }, [linksToDelete, showDeleteMultiple]);

  function renderSpaceShare() {
    if (!space) {
      return null;
    }

    if (space.linksShareId) {
      return (
        <>
          <Dropdown.Item icon={<RiExternalLinkLine />}>
            <a
              href={`https://easyy.click/s/?id=${space.linksShareId}`}
              target="_blank"
              style={{
                color: 'var(--semi-color-text-0)',
                textDecoration: 'none',
              }}
            >
              Open shared page
            </a>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => {
              setShowPublicSpaceConfirm(true);
            }}
            icon={<RiShareLine />}
          >
            Public space again
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => {
              unshareSpaceLinksEffect(spaceId);
            }}
            icon={<RiLockLine />}
          >
            Make space private
          </Dropdown.Item>
        </>
      );
    }

    return (
      <>
        <Dropdown.Item
          onClick={() => {
            setShowPublicSpaceConfirm(true);
          }}
          icon={<RiShareLine />}
        >
          Make space public
        </Dropdown.Item>
      </>
    );
  }

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
                <>
                  <Dropdown.Divider />

                  {renderSpaceShare()}

                  <Dropdown.Divider />

                  <Dropdown.Item
                    type="danger"
                    icon={<RiImportLine />}
                    onClick={() => setShowDeleteMultiple(true)}
                  >
                    Delete multiple links
                  </Dropdown.Item>
                </>
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

        {!!space?.linksShareId && (
          <Link
            href={`https://easyy.click/s/?id=${space.linksShareId}`}
            target="_blank"
            style={{
              top: '2px',
              position: 'relative',
            }}
          >
            <RiExternalLinkLine />
          </Link>
        )}
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
            {group.linksShareId ? (
              <Flex direction="row" align="center" gap="0.5rem">
                <Typography.Title heading={5}>{group.title}</Typography.Title>
                <Link
                  href={`https://easyy.click/s/?id=${group.linksShareId}`}
                  target="_blank"
                  style={{
                    top: '2px',
                    position: 'relative',
                  }}
                >
                  <RiExternalLinkLine />
                </Link>
              </Flex>
            ) : (
              <Typography.Title heading={5}>{group.title}</Typography.Title>
            )}

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
                      icon={<RiEdit2Line />}
                    >
                      Edit tag
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    {group.linksShareId ? (
                      <>
                        <Dropdown.Item icon={<RiExternalLinkLine />}>
                          <a
                            href={`https://easyy.click/s/?id=${group.linksShareId}`}
                            target="_blank"
                            style={{
                              color: 'var(--semi-color-text-0)',
                              textDecoration: 'none',
                            }}
                          >
                            Open shared page
                          </a>
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => {
                            setActiveGroup(group);
                            setShowPublicGroupConfirm(true);
                          }}
                          icon={<RiShareLine />}
                        >
                          Public tag again
                        </Dropdown.Item>

                        <Dropdown.Item
                          onClick={() => {
                            unshareGroupLinksEffect(group.sortKey, spaceId);
                          }}
                          icon={<RiLockLine />}
                        >
                          Make tag private
                        </Dropdown.Item>
                      </>
                    ) : (
                      <Dropdown.Item
                        onClick={() => {
                          setActiveGroup(group);
                          setShowPublicGroupConfirm(true);
                        }}
                        icon={<RiShareLine />}
                      >
                        Make tag public
                      </Dropdown.Item>
                    )}

                    <Dropdown.Divider />

                    {otherSpaces.length > 0 && (
                      <>
                        {otherSpaces.map(space => (
                          <Dropdown.Item
                            key={space.sortKey}
                            onClick={() => {
                              setActiveGroup(group);
                              setNewSpace(space);
                              setShowMoveLinksModal(true);
                            }}
                            disabled={isMoving}
                          >
                            Move links to "{space.title}"
                          </Dropdown.Item>
                        ))}

                        <Dropdown.Divider />
                      </>
                    )}

                    <Dropdown.Item
                      type="danger"
                      onClick={() => {
                        setActiveGroup(group);
                        setShowDeleteGroupConfirm(true);
                      }}
                      icon={<RiDeleteBinLine />}
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
                                      setShowMoveLinkModal(true);
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
              setShowDeleteMultipleConfirm(false);
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
              : 'Delete links'}
          </Button>
        </Flex>
      )}

      <GroupSelectorForMove
        open={showMoveLinkModal}
        onOpenChange={setShowMoveLinkModal}
        groupId={newSpaceGroupId}
        onSelect={setNewSpaceGroupId}
        spaceId={newSpace?.sortKey}
        onConfirm={async () => {
          if (!activeLink || !newSpace) {
            return;
          }

          await moveLinkEffect(activeLink, spaceId, newSpace.sortKey, newSpaceGroupId);

          setShowMoveLinkModal(false);
          setActiveLink(null);
          setNewSpace(null);
        }}
        isSaving={isMoving}
      />

      <GroupSelectorForMove
        open={showMoveLinksModal}
        onOpenChange={setShowMoveLinksModal}
        groupId={newSpaceGroupId}
        onSelect={setNewSpaceGroupId}
        spaceId={newSpace?.sortKey}
        onConfirm={async () => {
          if (!activeGroup || !newSpace) {
            return;
          }

          await moveLinksEffect(activeGroup.items, spaceId, newSpace.sortKey, newSpaceGroupId);

          setShowMoveLinksModal(false);
          setActiveGroup(null);
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

          await deleteLinksEffect(linksToDeleteSortKeys, { showMessage: true }, spaceId);
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
        message="After public, anyone with the shared link can see links in this tag. Are you sure?"
        open={showPublicGroupConfirm}
        onOpenChange={setShowPublicGroupConfirm}
        onConfirm={async () => {
          if (!activeGroup) {
            return;
          }

          const payload = {
            type: 'links-group',
            space: space?.title,
            group: activeGroup.title,
            links: activeGroup.items.map(link => ({
              id: link.sortKey,
              title: link.title,
              link: link.link,
            })),
          };

          await shareGroupLinksEffect(activeGroup?.sortKey, payload, spaceId);
          setShowPublicGroupConfirm(false);
          setActiveGroup(null);
        }}
        isSaving={isUpdatingGroup}
      />

      <Confirm
        message="After public, anyone with the shared link can see links in this space. Are you sure?"
        open={showPublicSpaceConfirm}
        onOpenChange={setShowPublicSpaceConfirm}
        onConfirm={async () => {
          if (!space) {
            return;
          }

          const payload = {
            type: 'links-space',
            space: space?.title,
            groups: linkGroups
              .map(group => ({
                id: group.sortKey,
                title: group.title,
                links: group.items.map(link => ({
                  id: link.sortKey,
                  title: link.title,
                  link: link.link,
                })),
              }))
              .filter(group => group.links.length > 0),
          };

          await shareSpaceLinksEffect(spaceId, payload);
          setShowPublicSpaceConfirm(false);
        }}
        isSaving={isUpdatingSpace}
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
