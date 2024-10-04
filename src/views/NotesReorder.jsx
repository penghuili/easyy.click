import React, { useCallback, useEffect } from 'react';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { noGroupSortKey } from '../lib/constants.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { ReorderGroupItems } from '../shared/browser/ReorderGroupItems.jsx';
import { isLoadingNotesCat, isUpdatingNoteCat, useNoteGroups } from '../store/note/noteCats.js';
import { fetchNotesEffect, updateNoteEffect } from '../store/note/noteEffect.js';
import { isLoadingNoteGroupsCat } from '../store/noteGroup/noteGroupCats.js';
import { fetchNoteGroupsEffect } from '../store/noteGroup/noteGroupEffect.js';

const activeNoteCat = createCat(null);

export const NotesReorder = fastMemo(() => {
  const isLoading = useCat(isLoadingNotesCat);
  const isLoadingGroups = useCat(isLoadingNoteGroupsCat);
  const { groups: noteGroups } = useNoteGroups();
  const isUpdating = useCat(isUpdatingNoteCat);

  const handleReorder = useCallback(({ item }) => {
    if (item) {
      updateNoteEffect(item.sortKey, {
        encryptedPassword: item.encryptedPassword,
        position: item.position,
        groupId: item.groupId === noGroupSortKey ? null : item.groupId,
        successMessage: 'Updated!',
      });
    }
  }, []);

  useEffect(() => {
    fetchNotesEffect(false, false);
    fetchNoteGroupsEffect(false, false);
  }, []);

  return (
    <PageContent paddingBottom="0">
      <PageHeader
        title="Reorder notes"
        isLoading={isLoading || isLoadingGroups || isUpdating}
        hasBack
      />

      <ReorderGroupItems
        groupItems={noteGroups}
        onReorder={handleReorder}
        reverse
        renderItem={item => item.title}
        onClickItem={item => {
          activeNoteCat.set(item);
        }}
        height={`calc(100vh - 70px)`}
      />
    </PageContent>
  );
});
