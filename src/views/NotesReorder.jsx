import React, { useCallback, useEffect } from 'react';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { SpaceHint } from '../components/SpaceHint.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { ReorderGroupItems } from '../shared/browser/ReorderGroupItems.jsx';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { isLoadingGroupsCat, noGroupSortKey } from '../store/group/groupCats.js';
import { fetchGroupsEffect } from '../store/group/groupEffect.js';
import { isLoadingNotesCat, isUpdatingNoteCat, useNoteGroups } from '../store/note/noteCats.js';
import { fetchNotesEffect, updateNoteEffect } from '../store/note/noteEffect.js';

const activeNoteCat = createCat(null);

export const NotesReorder = fastMemo(({ queryParams: { spaceId } }) => {
  const isLoading = useCat(isLoadingNotesCat);
  const isLoadingGroups = useCat(isLoadingGroupsCat);
  const { groups: noteGroups } = useNoteGroups(spaceId);
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
    fetchGroupsEffect(false, false);
  }, []);

  return (
    <PageContent paddingBottom="0">
      <PageHeader
        title="Reorder notes"
        isLoading={isLoading || isLoadingGroups || isUpdating}
        hasBack
      />

      <SpaceHint spaceId={spaceId} />

      <ReorderGroupItems
        groupItems={noteGroups}
        onReorder={handleReorder}
        reverse
        renderItem={item => item.title}
        onClickItem={item => {
          activeNoteCat.set(item);
        }}
        height={`calc(100vh - 70px - 2rem)`}
      />
    </PageContent>
  );
});
