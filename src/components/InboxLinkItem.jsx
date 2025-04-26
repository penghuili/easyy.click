import { Button, Dropdown, Typography } from '@douyinfe/semi-ui';
import {
  RiCornerUpRightLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiExternalLinkLine,
  RiMore2Line,
  RiShare2Line,
} from '@remixicon/react';
import React, { useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { canShare, share } from '../lib/share.js';
import { Link } from '../shared/semi/Link.jsx';
import { isDeletingLinkCat, isMovingLinkCat } from '../store/link/linkCats.js';
import { deleteLinkEffect, moveLinkEffect, updateLinkEffect } from '../store/link/linkEffect.js';
import { Confirm } from './Confirm.jsx';
import { Favicon } from './Favicon.jsx';
import { GroupSelectorForMove } from './GroupSelectorForMove.jsx';
import { getSpaceId } from './InboxNoteItem.jsx';

export const InboxLinkItem = fastMemo(({ link }) => {
  const spaceId = getSpaceId(link);

  const isMoving = useCat(isMovingLinkCat);
  const isDeletingLink = useCat(isDeletingLinkCat);

  const [activeLink, setActiveLink] = useState(null);
  const [showDeleteLinkConfirm, setShowDeleteLinkConfirm] = useState(false);

  const [newSpaceId, setNewSpaceId] = useState(null);
  const [newSpaceGroupId, setNewSpaceGroupId] = useState(null);
  const [showMoveLinkModal, setShowMoveLinkModal] = useState(false);

  if (!link) {
    return null;
  }

  return (
    <>
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
              spaceId
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
                navigateTo(`/links/details?linkId=${link.sortKey}&spaceId=${spaceId}`);
              }}
            >
              Edit link
            </Dropdown.Item>

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

            {canShare() && (
              <Dropdown.Item
                icon={<RiShare2Line />}
                onClick={() => {
                  share({
                    title: link.title,
                    url: link.link,
                  });
                }}
              >
                Share
              </Dropdown.Item>
            )}

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
        <Button theme="borderless" icon={<RiMore2Line width="20" height="20" />} size="small" />
      </Dropdown>

      <GroupSelectorForMove
        excludeSpaceId={spaceId}
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

          await moveLinkEffect(activeLink, spaceId, newSpaceId, newSpaceGroupId);

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

          await deleteLinkEffect(activeLink?.sortKey, { showMessage: true }, spaceId);
          setShowDeleteLinkConfirm(false);
          setActiveLink(null);
        }}
        isSaving={isDeletingLink}
      />
    </>
  );
});
