import { Button, Checkbox, Typography } from '@douyinfe/semi-ui';
import React, { useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { useItemsDates } from '../lib/useItemsDates.js';
import { formatDateTime } from '../shared/js/date.js';
import { Flex } from '../shared/semi/Flex.jsx';
import { PageLoading } from '../shared/semi/PageLoading.jsx';
import {
  inboxNotesStartKeyCat,
  isDeletingNoteCat,
  isLoadingInboxNotesCat,
  isMovingNoteCat,
  useNotes,
} from '../store/note/noteCats.js';
import {
  deleteNoteEffect,
  fetchInboxNotesEffect,
  moveNoteEffect,
} from '../store/note/noteEffect.js';
import { inboxSpaceId } from '../store/space/spaceCats.js';
import { BulkUpdateNotes } from './BulkUpdateNotes.jsx';
import { Confirm } from './Confirm.jsx';
import { ExtensionIntro } from './ExtensionIntro.jsx';
import { GroupSelectorForMove } from './GroupSelectorForMove.jsx';
import { InboxNoteItem } from './InboxNoteItem.jsx';

export const InboxNoteItems = fastMemo(() => {
  const notes = useNotes(inboxSpaceId);
  const startKey = useCat(inboxNotesStartKeyCat);
  const isDeletingNote = useCat(isDeletingNoteCat);
  const isMoving = useCat(isMovingNoteCat);
  const isLoading = useCat(isLoadingInboxNotesCat);

  const [activeNote, setActiveNote] = useState(null);
  const [showDeleteNoteConfirm, setShowDeleteNoteConfirm] = useState(false);

  const [newSpaceId, setNewSpaceId] = useState(null);
  const [newSpaceGroupId, setNewSpaceGroupId] = useState(null);
  const [showMoveNoteModal, setShowMoveNoteModal] = useState(false);

  const [notesToUpdateObj, setNotesToUpdateObj] = useState({});

  const dates = useItemsDates(notes);

  const allCheckboxValue = useMemo(() => {
    const selectedCount = Object.values(notesToUpdateObj).filter(Boolean).length;
    const allCount = notes?.length;
    return {
      all: !!allCount && selectedCount === allCount,
      some: selectedCount > 0 && selectedCount < allCount,
    };
  }, [notes?.length, notesToUpdateObj]);

  if (!notes.length) {
    return <>{isLoading ? <PageLoading /> : <ExtensionIntro />}</>;
  }

  return (
    <>
      <BulkUpdateNotes
        spaceId={inboxSpaceId}
        notesObj={notesToUpdateObj}
        onReset={() => setNotesToUpdateObj({})}
        showCancel={false}
      />

      {!!notes.length && (
        <Checkbox
          checked={allCheckboxValue.all}
          onChange={e => {
            if (e.target.checked) {
              setNotesToUpdateObj(Object.fromEntries(notes.map(note => [note.sortKey, note])));
            } else {
              setNotesToUpdateObj({});
            }
          }}
          style={{ marginBottom: '1rem' }}
        >
          <Typography.Text strong>Select all</Typography.Text>
        </Checkbox>
      )}

      {notes.map(note => (
        <div key={note.sortKey}>
          {!!dates[note.sortKey] && (
            <Typography.Title heading={4} style={{ margin: '1rem 0 0.5rem' }}>
              {dates[note.sortKey].day} ({dates[note.sortKey].count})
            </Typography.Title>
          )}
          <Typography.Paragraph size="small" style={{ marginLeft: '1.5rem' }}>
            {formatDateTime(note.createdAt)}
          </Typography.Paragraph>

          <Flex direction="row" m="0 0 0.5rem">
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

            <InboxNoteItem note={note} />
          </Flex>
        </div>
      ))}

      {!!startKey && (
        <Button
          theme="solid"
          onClick={() => {
            fetchInboxNotesEffect(startKey);
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
