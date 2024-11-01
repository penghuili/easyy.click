import { Row, Typography } from '@douyinfe/semi-ui';
import React, { useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageEmpty } from '../shared/semi/PageEmpty.jsx';
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
import { useSpaces } from '../store/space/spaceCats.js';
import { BulkUpdateNotes } from './BulkUpdateNotes.jsx';
import { Confirm } from './Confirm.jsx';
import { GroupSelectorForMove } from './GroupSelectorForMove.jsx';
import { NoteItemsActions } from './NoteItemsActions.jsx';
import { NoteItemsGroupTitle } from './NoteItemsGroupTitle.jsx';
import { NoteItemsItem } from './NoteItemsItem.jsx';

export const NoteItems = fastMemo(({ spaceId }) => {
  const { groups: noteGroups, notes } = useNoteGroups(spaceId);
  const isDeletingNote = useCat(isDeletingNoteCat);
  const isDeletingNotes = useCat(isDeletingNotesCat);
  const isLoading = useCat(isLoadingNotesCat);
  const isMoving = useCat(isMovingNoteCat);
  const spaces = useSpaces();

  const otherSpaces = useMemo(
    () => spaces.filter(space => space.sortKey !== spaceId),
    [spaceId, spaces]
  );

  const [activeNote, setActiveNote] = useState(null);
  const [showDeleteNoteConfirm, setShowDeleteNoteConfirm] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);

  const [newSpaceId, setNewSpaceId] = useState(null);
  const [newSpaceGroupId, setNewSpaceGroupId] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);

  const [showBulkActions, setShowBulkActions] = useState(false);
  const [notesToUpdateObj, setNotesToUpdateObj] = useState({});
  const [showDeleteGroupNotesConfirm, setShowDeleteGroupNotesConfirm] = useState(false);
  const [showMoveNotesModal, setShowMoveNotesModal] = useState(false);

  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  if (!notes.length) {
    return (
      <>
        <NoteItemsActions
          spaceId={spaceId}
          onBulk={() => {
            setShowBulkActions(true);
          }}
          onDeleteAll={() => setShowDeleteAllConfirm(true)}
        />

        {isLoading ? (
          <PageLoading />
        ) : (
          <PageEmpty>Which notes do you copy paste regularly?</PageEmpty>
        )}
      </>
    );
  }

  return (
    <>
      <NoteItemsActions
        spaceId={spaceId}
        onBulk={() => {
          setShowBulkActions(true);
        }}
        onDeleteAll={() => setShowDeleteAllConfirm(true)}
      />

      {showBulkActions && (
        <BulkUpdateNotes
          spaceId={spaceId}
          notesObj={notesToUpdateObj}
          onReset={() => {
            setShowBulkActions(false);
            setNotesToUpdateObj({});
          }}
        />
      )}

      {noteGroups.map(group => (
        <div key={group.sortKey} style={{ marginBottom: '2rem' }}>
          <NoteItemsGroupTitle
            spaceId={spaceId}
            group={group}
            hasOtherSpaces={!!otherSpaces.length}
            showCheckbox={showBulkActions}
            selectedNotes={notesToUpdateObj}
            onCheckboxChange={checked => {
              if (checked) {
                const obj = {};
                group.items.forEach(item => {
                  obj[item.sortKey] = item;
                });
                setNotesToUpdateObj({
                  ...notesToUpdateObj,
                  ...obj,
                });
              } else {
                const obj = {};
                group.items.forEach(item => {
                  obj[item.sortKey] = null;
                });
                setNotesToUpdateObj({
                  ...notesToUpdateObj,
                  ...obj,
                });
              }
            }}
            onDelete={() => {
              setActiveGroup(group);
              setShowDeleteGroupNotesConfirm(true);
            }}
            onMove={() => {
              setActiveGroup(group);
              setShowMoveNotesModal(true);
            }}
          />

          {group.items?.length ? (
            <>
              <Row type="flex">
                {group.items.map(item => (
                  <NoteItemsItem
                    key={item.sortKey}
                    spaceId={spaceId}
                    note={item}
                    selectedNotes={notesToUpdateObj}
                    showCheckbox={showBulkActions}
                    onCheckboxChange={checked => {
                      setNotesToUpdateObj({
                        ...notesToUpdateObj,
                        [item.sortKey]: checked ? item : null,
                      });
                    }}
                    hasOtherSpaces={!!otherSpaces.length}
                    onMove={() => {
                      setActiveNote(item);
                      setShowMoveModal(true);
                    }}
                    onDelete={() => {
                      setActiveNote(item);
                      setShowDeleteNoteConfirm(true);
                    }}
                  />
                ))}
              </Row>
            </>
          ) : (
            <Typography.Text type="secondary">No notes here.</Typography.Text>
          )}
        </div>
      ))}

      <GroupSelectorForMove
        excludeSpaceId={spaceId}
        open={showMoveModal}
        onOpenChange={setShowMoveModal}
        groupId={newSpaceGroupId}
        onSelectGroup={setNewSpaceGroupId}
        spaceId={newSpaceId}
        onSelectSpace={setNewSpaceId}
        onConfirm={async () => {
          if (!activeNote || !newSpaceId) {
            return;
          }

          await moveNoteEffect(activeNote, spaceId, newSpaceId, newSpaceGroupId);

          setShowMoveModal(false);
          setActiveNote(null);
          setNewSpaceId(null);
          setNewSpaceGroupId(null);
        }}
        isSaving={isMoving}
      />

      <GroupSelectorForMove
        excludeSpaceId={spaceId}
        open={showMoveNotesModal}
        onOpenChange={setShowMoveNotesModal}
        groupId={newSpaceGroupId}
        onSelectGroup={setNewSpaceGroupId}
        spaceId={newSpaceId}
        onSelectSpace={setNewSpaceId}
        onConfirm={async () => {
          if (!activeGroup || !newSpaceId) {
            return;
          }

          await moveNotesEffect(activeGroup.items, spaceId, newSpaceId, newSpaceGroupId);

          setShowMoveNotesModal(false);
          setActiveGroup(null);
          setNewSpaceId(null);
          setNewSpaceGroupId(null);
        }}
        isSaving={isMoving}
      />

      <Confirm
        message="Are you sure to delete this note?"
        open={showDeleteNoteConfirm}
        onOpenChange={setShowDeleteNoteConfirm}
        onConfirm={async () => {
          if (!activeNote) return;

          await deleteNoteEffect(activeNote?.sortKey, { showMessage: true }, spaceId);
          setShowDeleteNoteConfirm(false);
          setActiveNote(null);
        }}
        isSaving={isDeletingNote}
      />

      <Confirm
        message="All notes with this tag will be deleted. Are you sure?"
        open={showDeleteGroupNotesConfirm}
        onOpenChange={setShowDeleteGroupNotesConfirm}
        onConfirm={async () => {
          if (!activeGroup?.items?.length) {
            return;
          }

          await deleteNotesEffect(
            activeGroup.items.map(note => note.sortKey),
            { showMessage: true },
            spaceId
          );
          setShowDeleteGroupNotesConfirm(false);
          setActiveGroup(null);
        }}
        isSaving={isDeletingNotes}
      />

      <Confirm
        message="All notes in this space will be deleted. Are you sure?"
        open={showDeleteAllConfirm}
        onOpenChange={setShowDeleteAllConfirm}
        onConfirm={async () => {
          if (!notes?.length) {
            return;
          }

          await deleteNotesEffect(
            notes.map(item => item.sortKey),
            { showMessage: true },
            spaceId
          );
          setShowDeleteAllConfirm(false);
        }}
        isSaving={isDeletingNotes}
      />
    </>
  );
});
