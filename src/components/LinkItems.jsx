import { Button, Col, Dropdown, Row, Typography } from '@douyinfe/semi-ui';
import { RiAddLine, RiDragMoveLine, RiMore2Line } from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { noGroupSortKey } from '../lib/constants.js';
import { isDeletingGroupCat } from '../store/group/groupCats.js';
import { deleteGroupEffect } from '../store/group/groupEffect.js';
import {
  isDeletingLinkCat,
  isLoadingLinksCat,
  isMovingLinkCat,
  useLinkGroups,
} from '../store/link/linkCats.js';
import { deleteLinkEffect, moveLinkEffect, updateLinkEffect } from '../store/link/linkEffect.js';
import { useSpaces } from '../store/space/spaceCats.js';
import { Confirm } from './Confirm.jsx';
import { Favicon } from './Favicon.jsx';
import { Flex } from './Flex.jsx';
import { confirmDeleteGroupMessage } from './GroupItems.jsx';
import { Link } from './Link.jsx';
import { PageEmpty } from './PageEmpty.jsx';
import { PageLoading } from './PageLoading.jsx';
import { Top10Links } from './Top10Links.jsx';

export const LinkItems = fastMemo(({ spaceId }) => {
  const { groups: linkGroups, links } = useLinkGroups(false, spaceId);
  const isDeletingLink = useCat(isDeletingLinkCat);
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

  function renderActions() {
    return (
      <Flex direction="row" wrap="wrap" gap="1rem" m="0.5rem 0 1.5rem">
        <Button
          theme="solid"
          onClick={() => navigateTo(`/links/add?spaceId=${spaceId}`)}
          icon={<RiAddLine />}
        >
          Add link
        </Button>

        {links.length > 1 && (
          <Button
            onClick={() => navigateTo(`/links/reorder?spaceId=${spaceId}`)}
            icon={<RiDragMoveLine />}
          >
            Reorder links
          </Button>
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
                                    moveLinkEffect(link, spaceId, space.sortKey);
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
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <Typography.Text type="secondary">No links here.</Typography.Text>
          )}
        </div>
      ))}

      <Confirm
        message="Are you sure to delete this link?"
        open={showDeleteLinkConfirm}
        onOpenChange={setShowDeleteLinkConfirm}
        onConfirm={async () => {
          if (!activeLink) return;

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
          if (!activeGroup) return;

          await deleteGroupEffect(activeGroup.sortKey, spaceId);
          setShowDeleteGroupConfirm(false);
          setActiveGroup(null);
        }}
        isSaving={isDeletingGroup}
      />
    </>
  );
});
