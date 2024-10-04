import { Button } from '@douyinfe/semi-ui';
import { RiAddLine } from '@remixicon/react';
import React, { useCallback, useEffect } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { ReorderItems } from '../shared/browser/ReorderItems.jsx';
import {
  isLoadingNoteGroupsCat,
  isUpdatingNoteGroupCat,
  noteGroupsCat,
} from '../store/noteGroup/noteGroupCats.js';
import {
  fetchNoteGroupsEffect,
  updateNoteGroupEffect,
} from '../store/noteGroup/noteGroupEffect.js';

const activeGroupCat = createCat(null);
const showActionSheetCat = createCat(false);

export const NoteGroupsReorder = fastMemo(() => {
  const isLoadingGroups = useCat(isLoadingNoteGroupsCat);
  const groups = useCat(noteGroupsCat);
  const isUpdating = useCat(isUpdatingNoteGroupCat);

  const handleReorder = useCallback(({ item }) => {
    if (item) {
      updateNoteGroupEffect(item.sortKey, {
        encryptedPassword: item.encryptedPassword,
        position: item.position,
      });
    }
  }, []);

  useEffect(() => {
    fetchNoteGroupsEffect();
  }, []);

  return (
    <PageContent paddingBottom="0">
      <PageHeader
        title="Edit note tags"
        isLoading={isLoadingGroups || isUpdating}
        hasBack
        right={
          <Button
            theme="borderless"
            icon={<RiAddLine />}
            onClick={() => navigateTo('/note-groups/add')}
          />
        }
      />

      <ReorderItems
        items={groups}
        onReorder={handleReorder}
        reverse
        renderItem={item => item.title}
        onClickItem={item => {
          activeGroupCat.set(item);
          showActionSheetCat.set(true);
        }}
        height={`calc(100vh - 70px - 1rem)`}
      />
    </PageContent>
  );
});
