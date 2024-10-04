import { Button, Col, Dropdown, Row, Typography } from '@douyinfe/semi-ui';
import { RiAddLine, RiBookmarkLine, RiDragMoveLine, RiMore2Line } from '@remixicon/react';
import React, { useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { noGroupSortKey } from '../lib/constants.js';
import { isDeletingLinkCat, useLinkGroups } from '../store/link/linkCats.js';
import { deleteLinkEffect, updateLinkEffect } from '../store/link/linkEffect.js';
import { isDeletingLinkGroupCat } from '../store/linkGroup/linkGroupCats.js';
import { deleteLinkGroupEffect } from '../store/linkGroup/linkGroupEffect.js';
import { Confirm } from './Confirm.jsx';
import { Favicon } from './Favicon.jsx';
import { Flex } from './Flex.jsx';
import { Link } from './Link.jsx';
import { PageEmpty } from './PageEmpty.jsx';
import { Top10Links } from './Top10Links.jsx';

export const LinkItems = fastMemo(() => {
  const { groups: linkGroups, links } = useLinkGroups();
  const isDeletingLink = useCat(isDeletingLinkCat);
  const isDeletingGroup = useCat(isDeletingLinkGroupCat);

  const [activeLink, setActiveLink] = useState(null);
  const [showDeleteLinkConfirm, setShowDeleteLinkConfirm] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);

  if (!links.length) {
    return <PageEmpty>Which webites do you visit regularly?</PageEmpty>;
  }

  return (
    <>
      <Flex direction="row" wrap="wrap" gap="1rem" m="0 0 1.5rem">
        {links.length > 1 && (
          <Button
            onClick={() => navigateTo('/links/reorder')}
            icon={<RiDragMoveLine size={16} />}
            size="small"
          >
            Reorder links
          </Button>
        )}

        {linkGroups.length > 2 && (
          <Button
            onClick={() => navigateTo('/link-groups/reorder')}
            icon={<RiDragMoveLine size={16} />}
            size="small"
          >
            Reorder tags
          </Button>
        )}

        <Button
          onClick={() => navigateTo('/link-groups/add')}
          icon={<RiBookmarkLine size={16} />}
          size="small"
        >
          Add tag
        </Button>
      </Flex>

      <Top10Links />

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
                      ? '/links/add'
                      : `/links/add?groupId=${group.sortKey}`
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
                        navigateTo(`/link-groups/details?groupId=${group.sortKey}`);
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
                        updateLinkEffect(link.sortKey, {
                          count: (link.count || 0) + 1,
                        });
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
                              navigateTo(`/links/details?linkId=${link.sortKey}`);
                            }}
                          >
                            Edit link
                          </Dropdown.Item>
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

          await deleteLinkEffect(activeLink?.sortKey);
          setShowDeleteLinkConfirm(false);
          setActiveLink(null);
        }}
        isSaving={isDeletingLink}
      />

      <Confirm
        message={`Only this tag will be deleted, your links with this tag will be moved to "Links without tag". Go ahead?`}
        open={showDeleteGroupConfirm}
        onOpenChange={setShowDeleteGroupConfirm}
        onConfirm={async () => {
          if (!activeGroup) return;

          await deleteLinkGroupEffect(activeGroup.sortKey);
          setShowDeleteGroupConfirm(false);
          setActiveGroup(null);
        }}
        isSaving={isDeletingGroup}
      />
    </>
  );
});
