import { Button, Checkbox, Dropdown, Typography } from '@douyinfe/semi-ui';
import { RiCornerUpRightLine, RiDeleteBinLine, RiEdit2Line, RiMore2Line } from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { copyToClipboard } from '../shared/browser/copyToClipboard.js';
import { setToastEffect } from '../shared/browser/store/sharedEffects.js';
import { Flex } from '../shared/semi/Flex.jsx';
import { PageLoading } from '../shared/semi/PageLoading.jsx';
import {
  isDeletingNoteCat,
  isDeletingNotesCat,
  isLoadingNotesCat,
  isMovingNoteCat,
  useNoteGroups,
} from '../store/note/noteCats.js';
import {
  deleteNoteEffect,
  deleteNotesEffect,
  moveNoteEffect,
  moveNotesEffect,
} from '../store/note/noteEffect.js';
import { inboxSpaceId } from '../store/space/spaceCats.js';
import { Confirm } from './Confirm.jsx';
import { ExtensionIntro } from './ExtensionIntro.jsx';
import { GroupSelectorForMove } from './GroupSelectorForMove.jsx';

export const InboxNoteItems = fastMemo(() => {
  const { notes } = useNoteGroups(inboxSpaceId);
  const isDeletingNote = useCat(isDeletingNoteCat);
  const isDeletingNotes = useCat(isDeletingNotesCat);
  const isMoving = useCat(isMovingNoteCat);
  const isLoading = useCat(isLoadingNotesCat);

  const [activeNote, setActiveNote] = useState(null);
  const [showDeleteNoteConfirm, setShowDeleteNoteConfirm] = useState(false);

  const [newSpaceId, setNewSpaceId] = useState(null);
  const [newSpaceGroupId, setNewSpaceGroupId] = useState(null);
  const [showMoveNoteModal, setShowMoveNoteModal] = useState(false);

  const [notesToUpdateObj, setNotesToUpdateObj] = useState({});

  const notesToMove = useMemo(() => {
    return Object.keys(notesToUpdateObj)
      .filter(key => notesToUpdateObj[key])
      .map(key => notesToUpdateObj[key]);
  }, [notesToUpdateObj]);
  const [showSelectGroupForMoveMultiple, setShowSelectGroupForMoveMultiple] = useState(false);

  const [showDeleteMultipleConfirm, setShowDeleteMultipleConfirm] = useState(false);

  const notesToDeleteSortKeys = useMemo(() => {
    return Object.keys(notesToUpdateObj).filter(key => notesToUpdateObj[key]);
  }, [notesToUpdateObj]);

  if (!notes.length) {
    return <>{isLoading ? <PageLoading /> : <ExtensionIntro />}</>;
  }

  return (
    <>
      <Flex direction="row" wrap="wrap" gap="1rem" m="0.5rem 0 1.5rem">
        <Button
          onClick={() => setShowSelectGroupForMoveMultiple(true)}
          icon={<RiCornerUpRightLine />}
          disabled={!notesToMove?.length}
        >
          Move notes
        </Button>

        <Button
          type="danger"
          onClick={() => setShowDeleteMultipleConfirm(true)}
          icon={<RiDeleteBinLine />}
          disabled={!notesToDeleteSortKeys?.length}
        >
          Delete notes
        </Button>
      </Flex>

      {notes.map(note => (
        <Flex key={note.sortKey} direction="row" m="0 0 0.5rem">
          <Checkbox
            checked={!!notesToUpdateObj[note.sortKey]}
            onChange={e => {
              setNotesToUpdateObj({
                ...notesToUpdateObj,
                [note.sortKey]: e.target.checked ? note : null,
              });
            }}
            style={{ marginRight: '0.5rem' }}
          />

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

                <Dropdown.Divider />

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
              </Dropdown.Menu>
            }
          >
            <Button theme="borderless" icon={<RiMore2Line width="20" height="20" />} size="small" />
          </Dropdown>
        </Flex>
      ))}

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

      <GroupSelectorForMove
        excludeSpaceId={inboxSpaceId}
        open={showSelectGroupForMoveMultiple}
        onOpenChange={setShowSelectGroupForMoveMultiple}
        groupId={newSpaceGroupId}
        onSelectGroup={setNewSpaceGroupId}
        spaceId={newSpaceId}
        onSelectSpace={setNewSpaceId}
        onConfirm={async () => {
          if (!notesToMove?.length || !newSpaceId) {
            return;
          }

          await moveNotesEffect(notesToMove, inboxSpaceId, newSpaceId, newSpaceGroupId);

          setShowSelectGroupForMoveMultiple(false);
          setNotesToUpdateObj({});
          setNewSpaceId(null);
        }}
        isSaving={isMoving}
      />

      <Confirm
        message={'Are you sure to delete selected notes?'}
        open={showDeleteMultipleConfirm}
        onOpenChange={setShowDeleteMultipleConfirm}
        onConfirm={async () => {
          if (!notesToDeleteSortKeys?.length) {
            return;
          }

          await deleteNotesEffect(notesToDeleteSortKeys, { showMessage: true }, inboxSpaceId);
          setShowDeleteMultipleConfirm(false);
          setNotesToUpdateObj({});
        }}
        isSaving={isDeletingNotes}
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
