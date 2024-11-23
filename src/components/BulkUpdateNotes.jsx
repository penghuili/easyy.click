import { Button } from '@douyinfe/semi-ui';
import { RiCornerUpRightLine, RiDeleteBinLine, RiFileCopyLine } from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { copyToClipboard } from '../shared/browser/copyToClipboard.js';
import { setToastEffect } from '../shared/browser/Toast.jsx';
import { Flex } from '../shared/semi/Flex.jsx';
import { isDeletingNotesCat, isMovingNoteCat } from '../store/note/noteCats.js';
import { deleteNotesEffect, moveNotesEffect } from '../store/note/noteEffect.js';
import { Confirm } from './Confirm.jsx';
import { GroupSelectorForMove } from './GroupSelectorForMove.jsx';

export const BulkUpdateNotes = fastMemo(({ spaceId, notesObj, onReset, showCancel = true }) => {
  const isDeletingNotes = useCat(isDeletingNotesCat);
  const isMoving = useCat(isMovingNoteCat);

  const [newSpaceId, setNewSpaceId] = useState(null);
  const [newSpaceGroupId, setNewSpaceGroupId] = useState(null);

  const notesToMove = useMemo(() => {
    return Object.keys(notesObj)
      .filter(key => notesObj[key])
      .map(key => notesObj[key]);
  }, [notesObj]);
  const [showSelectGroupForMoveMultiple, setShowSelectGroupForMoveMultiple] = useState(false);

  const [showDeleteMultipleConfirm, setShowDeleteMultipleConfirm] = useState(false);

  const notesToDeleteSortKeys = useMemo(() => {
    return Object.keys(notesObj).filter(key => notesObj[key]);
  }, [notesObj]);

  const selectedCount = notesToDeleteSortKeys.length;

  return (
    <>
      <Flex direction="row" wrap="wrap" gap="1rem" m="0.5rem 0 1.5rem">
        <Button
          onClick={() => setShowSelectGroupForMoveMultiple(true)}
          icon={<RiCornerUpRightLine />}
          disabled={!selectedCount}
        >
          Move
        </Button>

        <Button
          onClick={async () => {
            const text = notesToMove.map(note => `${note.title}\n${note.text}`).join('\n\n');
            await copyToClipboard(text);
            setToastEffect('Copied!');
            onReset();
          }}
          icon={<RiFileCopyLine />}
          disabled={!selectedCount}
        >
          Copy
        </Button>

        <Button
          type="danger"
          onClick={() => setShowDeleteMultipleConfirm(true)}
          icon={<RiDeleteBinLine />}
          disabled={!selectedCount}
        >
          Delete
        </Button>

        {showCancel && (
          <Button theme="borderless" onClick={onReset}>
            Cancel
          </Button>
        )}
      </Flex>

      <GroupSelectorForMove
        excludeSpaceId={spaceId}
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

          await moveNotesEffect(notesToMove, spaceId, newSpaceId, newSpaceGroupId);

          setShowSelectGroupForMoveMultiple(false);
          setNewSpaceId(null);
          onReset();
        }}
        isSaving={isMoving}
      />

      <Confirm
        message={
          selectedCount > 1
            ? `Are you sure to delete the selected ${selectedCount} notes?`
            : `Are you sure to delete the selected note?`
        }
        open={showDeleteMultipleConfirm}
        onOpenChange={setShowDeleteMultipleConfirm}
        onConfirm={async () => {
          if (!notesToDeleteSortKeys?.length) {
            return;
          }

          await deleteNotesEffect(notesToDeleteSortKeys, { showMessage: true }, spaceId);
          setShowDeleteMultipleConfirm(false);
          onReset();
        }}
        isSaving={isDeletingNotes}
      />
    </>
  );
});
