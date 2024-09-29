import { ActionSheet, Button } from '@nutui/nutui-react';
import { RiAddLine } from '@remixicon/react';
import React, { useCallback, useEffect, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { Confirm } from '../components/Confirm.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Text } from '../components/Text.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { ReorderItems } from '../shared/browser/ReorderItems.jsx';
import {
  isDeletingNoteGroupCat,
  isLoadingNoteGroupsCat,
  isUpdatingNoteGroupCat,
  noteGroupsCat,
} from '../store/noteGroup/noteGroupCats.js';
import {
  deleteNoteGroupEffect,
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
            type="primary"
            fill="none"
            icon={<RiAddLine />}
            onClick={() => navigateTo('/note-groups/add')}
          />
        }
      />

      <Text m="0 0 1rem">Drag to reorder, click to edit.</Text>

      <ReorderItems
        items={groups}
        onReorder={handleReorder}
        reverse
        renderItem={item => item.title}
        onClickItem={item => {
          activeGroupCat.set(item);
          showActionSheetCat.set(true);
        }}
        height={`calc(100vh - 70px - 2.5rem)`}
      />

      <Actions />
    </PageContent>
  );
});

const Actions = fastMemo(() => {
  const showActionSheet = useCat(showActionSheetCat);
  const activeGroup = useCat(activeGroupCat);
  const isDeleting = useCat(isDeletingNoteGroupCat);

  const [showConfirm, setShowConfirm] = useState(false);

  const options = [
    {
      name: 'Edit',
      onClick: () => {
        navigateTo(`/note-groups/details?groupId=${activeGroup?.sortKey}`);
      },
    },
    {
      name: 'Delete',
      danger: true,
      onClick: () => {
        setShowConfirm(true);
      },
    },
  ];

  const handleSelectAction = option => {
    option.onClick();
    showActionSheetCat.set(false);
  };

  return (
    <>
      <ActionSheet
        visible={showActionSheet}
        options={options}
        onSelect={handleSelectAction}
        onCancel={() => showActionSheetCat.set(false)}
      />

      <Confirm
        message={`Only this tag will be deleted, your notes with this tag will be moved to "Notes without tag".`}
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={async () => {
          await deleteNoteGroupEffect(activeGroup?.sortKey);
          setShowConfirm(false);
          activeGroupCat.set(null);
        }}
        isSaving={isDeleting}
      />
    </>
  );
});
