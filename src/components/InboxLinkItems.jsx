import { Button, Checkbox, Dropdown, Typography } from '@douyinfe/semi-ui';
import { RiCornerUpRightLine, RiDeleteBinLine, RiEdit2Line, RiMore2Line } from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Flex } from '../shared/semi/Flex.jsx';
import { Link } from '../shared/semi/Link.jsx';
import { PageLoading } from '../shared/semi/PageLoading.jsx';
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
import { inboxSpaceId } from '../store/space/spaceCats.js';
import { Confirm } from './Confirm.jsx';
import { ExtensionIntro } from './ExtensionIntro.jsx';
import { Favicon } from './Favicon.jsx';
import { GroupSelectorForMove } from './GroupSelectorForMove.jsx';

export const InboxLinkItems = fastMemo(() => {
  const { links } = useLinkGroups(false, inboxSpaceId);
  const isDeletingLink = useCat(isDeletingLinkCat);
  const isDeletingLinks = useCat(isDeletingLinksCat);
  const isMoving = useCat(isMovingLinkCat);
  const isLoading = useCat(isLoadingLinksCat);

  const [activeLink, setActiveLink] = useState(null);
  const [showDeleteLinkConfirm, setShowDeleteLinkConfirm] = useState(false);

  const [newSpaceId, setNewSpaceId] = useState(null);
  const [newSpaceGroupId, setNewSpaceGroupId] = useState(null);
  const [showMoveLinkModal, setShowMoveLinkModal] = useState(false);

  const [linksToUpdateObj, setLinksToUpdateObj] = useState({});

  const linksToMove = useMemo(() => {
    return Object.keys(linksToUpdateObj)
      .filter(key => linksToUpdateObj[key])
      .map(key => linksToUpdateObj[key]);
  }, [linksToUpdateObj]);
  const [showSelectGroupForMoveMultiple, setShowSelectGroupForMoveMultiple] = useState(false);

  const [showDeleteMultipleConfirm, setShowDeleteMultipleConfirm] = useState(false);

  const linksToDeleteSortKeys = useMemo(() => {
    return Object.keys(linksToUpdateObj).filter(key => linksToUpdateObj[key]);
  }, [linksToUpdateObj]);

  if (!links.length) {
    return <>{isLoading ? <PageLoading /> : <ExtensionIntro />}</>;
  }

  return (
    <>
      <Flex direction="row" wrap="wrap" gap="1rem" m="0.5rem 0 1.5rem">
        <Button
          onClick={() => setShowSelectGroupForMoveMultiple(true)}
          icon={<RiCornerUpRightLine />}
          disabled={!linksToMove?.length}
        >
          Move links
        </Button>

        <Button
          type="danger"
          onClick={() => setShowDeleteMultipleConfirm(true)}
          icon={<RiDeleteBinLine />}
          disabled={!linksToDeleteSortKeys?.length}
        >
          Delete links
        </Button>
      </Flex>

      {links.map(link => (
        <Flex key={link.sortKey} direction="row" m="0 0 0.5rem">
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
              </Dropdown.Menu>
            }
          >
            <Button theme="borderless" icon={<RiMore2Line width="20" height="20" />} size="small" />
          </Dropdown>
        </Flex>
      ))}

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

      <GroupSelectorForMove
        excludeSpaceId={inboxSpaceId}
        open={showSelectGroupForMoveMultiple}
        onOpenChange={setShowSelectGroupForMoveMultiple}
        groupId={newSpaceGroupId}
        onSelectGroup={setNewSpaceGroupId}
        spaceId={newSpaceId}
        onSelectSpace={setNewSpaceId}
        onConfirm={async () => {
          if (!linksToMove?.length || !newSpaceId) {
            return;
          }

          await moveLinksEffect(linksToMove, inboxSpaceId, newSpaceId, newSpaceGroupId);

          setShowSelectGroupForMoveMultiple(false);
          setLinksToUpdateObj({});
          setNewSpaceId(null);
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

          await deleteLinksEffect(linksToDeleteSortKeys, { showMessage: true }, inboxSpaceId);
          setShowDeleteMultipleConfirm(false);
          setLinksToUpdateObj({});
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

          await deleteLinkEffect(activeLink?.sortKey, { showMessage: true }, inboxSpaceId);
          setShowDeleteLinkConfirm(false);
          setActiveLink(null);
        }}
        isSaving={isDeletingLink}
      />
    </>
  );
});
