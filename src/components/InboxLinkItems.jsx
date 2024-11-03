import { Button, Checkbox, Dropdown, Typography } from '@douyinfe/semi-ui';
import {
  RiCornerUpRightLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiExternalLinkLine,
  RiMore2Line,
} from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { useItemsDates } from '../lib/useItemsDates.js';
import { formatDateTime } from '../shared/js/date.js';
import { Flex } from '../shared/semi/Flex.jsx';
import { Link } from '../shared/semi/Link.jsx';
import { PageLoading } from '../shared/semi/PageLoading.jsx';
import {
  inboxLinksStartKeyCat,
  isDeletingLinkCat,
  isLoadingInboxLinksCat,
  isMovingLinkCat,
  useLinks,
} from '../store/link/linkCats.js';
import {
  deleteLinkEffect,
  fetchInboxLinksEffect,
  moveLinkEffect,
  updateLinkEffect,
} from '../store/link/linkEffect.js';
import { inboxSpaceId } from '../store/space/spaceCats.js';
import { BulkUpdateLinks } from './BulkUpdateLinks.jsx';
import { Confirm } from './Confirm.jsx';
import { ExtensionIntro } from './ExtensionIntro.jsx';
import { Favicon } from './Favicon.jsx';
import { GroupSelectorForMove } from './GroupSelectorForMove.jsx';

export const InboxLinkItems = fastMemo(() => {
  const links = useLinks(inboxSpaceId);
  const startKey = useCat(inboxLinksStartKeyCat);
  const isDeletingLink = useCat(isDeletingLinkCat);
  const isMoving = useCat(isMovingLinkCat);
  const isLoading = useCat(isLoadingInboxLinksCat);

  const [activeLink, setActiveLink] = useState(null);
  const [showDeleteLinkConfirm, setShowDeleteLinkConfirm] = useState(false);

  const [newSpaceId, setNewSpaceId] = useState(null);
  const [newSpaceGroupId, setNewSpaceGroupId] = useState(null);
  const [showMoveLinkModal, setShowMoveLinkModal] = useState(false);

  const [linksToUpdateObj, setLinksToUpdateObj] = useState({});

  const dates = useItemsDates(links);

  const allCheckboxValue = useMemo(() => {
    const selectedCount = Object.values(linksToUpdateObj).filter(Boolean).length;
    const allCount = links?.length;
    return {
      all: !!allCount && selectedCount === allCount,
      some: selectedCount > 0 && selectedCount < allCount,
    };
  }, [links?.length, linksToUpdateObj]);

  if (!links.length) {
    return <>{isLoading ? <PageLoading /> : <ExtensionIntro />}</>;
  }

  return (
    <>
      <BulkUpdateLinks
        spaceId={inboxSpaceId}
        linksObj={linksToUpdateObj}
        onReset={() => setLinksToUpdateObj({})}
        showCancel={false}
      />

      {!!links.length && (
        <Checkbox
          checked={allCheckboxValue.all}
          onChange={e => {
            if (e.target.checked) {
              setLinksToUpdateObj(Object.fromEntries(links.map(link => [link.sortKey, link])));
            } else {
              setLinksToUpdateObj({});
            }
          }}
          style={{ marginBottom: '1rem' }}
        >
          <Typography.Text strong>Select all</Typography.Text>
        </Checkbox>
      )}

      {links.map(link => (
        <div key={link.sortKey}>
          {!!dates[link.sortKey] && (
            <Typography.Title heading={4} style={{ margin: '1rem 0 0.5rem' }}>
              {dates[link.sortKey].day} ({dates[link.sortKey].count})
            </Typography.Title>
          )}
          <Typography.Paragraph size="small" style={{ marginLeft: '1.5rem' }}>
            {formatDateTime(link.createdAt)}
          </Typography.Paragraph>
          <Flex direction="row" m="0 0 0.5rem">
            <Checkbox
              checked={!!linksToUpdateObj[link.sortKey]}
              onChange={e => {
                setLinksToUpdateObj({
                  ...linksToUpdateObj,
                  [link.sortKey]: e.target.checked ? link : null,
                });
              }}
              style={{ marginRight: '0.5rem' }}
            />

            <Typography.Paragraph ellipsis={{ rows: 1 }} style={{ flex: 1 }}>
              <Link
                href={link.link}
                target="_blank"
                onClick={() => {
                  updateLinkEffect(
                    link.sortKey,
                    {
                      count: (link.count || 0) + 1,
                    },
                    inboxSpaceId
                  );
                }}
              >
                <Favicon url={link.link} />
                {link.title}
              </Link>
            </Typography.Paragraph>

            <Dropdown
              trigger="click"
              position={'bottomLeft'}
              clickToHide
              render={
                <Dropdown.Menu>
                  <Dropdown.Item
                    icon={<RiEdit2Line />}
                    onClick={() => {
                      navigateTo(`/links/details?linkId=${link.sortKey}&spaceId=${inboxSpaceId}`);
                    }}
                  >
                    Edit link
                  </Dropdown.Item>

                  <Dropdown.Divider />

                  <Dropdown.Item
                    icon={<RiCornerUpRightLine />}
                    onClick={() => {
                      setActiveLink(link);
                      setShowMoveLinkModal(true);
                    }}
                    disabled={isMoving}
                  >
                    Move to ...
                  </Dropdown.Item>

                  <Dropdown.Divider />

                  <Dropdown.Item
                    type="danger"
                    icon={<RiDeleteBinLine />}
                    onClick={() => {
                      setActiveLink(link);
                      setShowDeleteLinkConfirm(true);
                    }}
                  >
                    Delete link
                  </Dropdown.Item>

                  {link.fromUrl && (
                    <>
                      <Dropdown.Divider />
                      <Dropdown.Item icon={<RiExternalLinkLine />}>
                        <Link href={link.fromUrl} target="_blank">
                          Source page
                        </Link>
                      </Dropdown.Item>
                    </>
                  )}
                </Dropdown.Menu>
              }
            >
              <Button
                theme="borderless"
                icon={<RiMore2Line width="20" height="20" />}
                size="small"
              />
            </Dropdown>
          </Flex>
        </div>
      ))}

      {!!startKey && (
        <Button
          theme="solid"
          onClick={() => {
            fetchInboxLinksEffect(startKey);
          }}
          disabled={isLoading}
          loading={isLoading}
          style={{
            marginTop: '1rem',
          }}
        >
          Load more
        </Button>
      )}

      <GroupSelectorForMove
        excludeSpaceId={inboxSpaceId}
        open={showMoveLinkModal}
        onOpenChange={setShowMoveLinkModal}
        groupId={newSpaceGroupId}
        onSelectGroup={setNewSpaceGroupId}
        spaceId={newSpaceId}
        onSelectSpace={setNewSpaceId}
        onConfirm={async () => {
          if (!activeLink || !newSpaceId) {
            return;
          }

          await moveLinkEffect(activeLink, inboxSpaceId, newSpaceId, newSpaceGroupId);

          setShowMoveLinkModal(false);
          setActiveLink(null);
          setNewSpaceId(null);
        }}
        isSaving={isMoving}
      />

      <Confirm
        message="Are you sure to delete this link?"
        open={showDeleteLinkConfirm}
        onOpenChange={setShowDeleteLinkConfirm}
        onConfirm={async () => {
          if (!activeLink) {
            return;
          }

          await deleteLinkEffect(activeLink?.sortKey, { showMessage: true }, inboxSpaceId);
          setShowDeleteLinkConfirm(false);
          setActiveLink(null);
        }}
        isSaving={isDeletingLink}
      />
    </>
  );
});
