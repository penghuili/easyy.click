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
import { copyToClipboard } from '../shared/browser/copyToClipboard.js';
import { setToastEffect } from '../shared/browser/store/sharedEffects.js';
import { Link } from '../shared/semi/Link.jsx';
import { isDeletingNoteCat, isMovingNoteCat } from '../store/note/noteCats.js';
import { deleteNoteEffect, moveNoteEffect } from '../store/note/noteEffect.js';
import { inboxSpaceId } from '../store/space/spaceCats.js';
import { Confirm } from './Confirm.jsx';
import { GroupSelectorForMove } from './GroupSelectorForMove.jsx';

export const InboxNoteItem = fastMemo(({ note }) => {
  const isDeletingNote = useCat(isDeletingNoteCat);
  const isMoving = useCat(isMovingNoteCat);

  const [activeNote, setActiveNote] = useState(null);
  const [showDeleteNoteConfirm, setShowDeleteNoteConfirm] = useState(false);

  const [newSpaceId, setNewSpaceId] = useState(null);
  const [newSpaceGroupId, setNewSpaceGroupId] = useState(null);
  const [showMoveNoteModal, setShowMoveNoteModal] = useState(false);

  return (
    <>
      <Typography.Text
        onClick={() => {
          copyToClipboard(note.text);
          setToastEffect(`Copied "${note.title}"!`);
        }}
        direction="end"
        style={{
          flex: 1,
          cursor: 'pointer',
          paddingRight: '1rem',
        }}
      >
        {note.title}
      </Typography.Text>

      <Dropdown
        trigger="click"
        position={'bottomLeft'}
        clickToHide
        render={
          <Dropdown.Menu>
            <Dropdown.Item
              icon={<RiEdit2Line />}
              onClick={() => {
                navigateTo(`/notes/details?noteId=${note.sortKey}&spaceId=${inboxSpaceId}`);
              }}
            >
              Edit note
            </Dropdown.Item>

            <Dropdown.Item
              icon={<RiCornerUpRightLine />}
              onClick={() => {
                setActiveNote(note);
                setShowMoveNoteModal(true);
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
                    title: note.title,
                    text: note.text,
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
                setActiveNote(note);
                setShowDeleteNoteConfirm(true);
              }}
            >
              Delete note
            </Dropdown.Item>

            {note.fromUrl && (
              <>
                <Dropdown.Divider />
                <Dropdown.Item icon={<RiExternalLinkLine />}>
                  <Link href={note.fromUrl} target="_blank">
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
        excludeSpaceId={inboxSpaceId}
        open={showMoveNoteModal}
        onOpenChange={setShowMoveNoteModal}
        groupId={newSpaceGroupId}
        onSelectGroup={setNewSpaceGroupId}
        spaceId={newSpaceId}
        onSelectSpace={setNewSpaceId}
        onConfirm={async () => {
          if (!activeNote || !newSpaceId) {
            return;
          }

          await moveNoteEffect(activeNote, inboxSpaceId, newSpaceId, newSpaceGroupId);

          setShowMoveNoteModal(false);
          setActiveNote(null);
          setNewSpaceId(null);
        }}
        isSaving={isMoving}
      />

      <Confirm
        message="Are you sure to delete this note?"
        open={showDeleteNoteConfirm}
        onOpenChange={setShowDeleteNoteConfirm}
        onConfirm={async () => {
          if (!activeNote) {
            return;
          }

          await deleteNoteEffect(activeNote?.sortKey, { showMessage: true }, inboxSpaceId);
          setShowDeleteNoteConfirm(false);
          setActiveNote(null);
        }}
        isSaving={isDeletingNote}
      />
    </>
  );
});
