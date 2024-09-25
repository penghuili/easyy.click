import { ActionSheet } from '@nutui/nutui-react';
import React, { useCallback } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { Text } from '../components/Text.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { ReorderItems } from '../shared/browser/ReorderItems.jsx';
import { isLoadingNotesCat, isUpdatingNoteCat, notesCat } from '../store/note/noteCats.js';
import { deleteNoteEffect, fetchNotesEffect, updateNoteEffect } from '../store/note/noteEffect.js';

async function load() {
  await fetchNotesEffect();
}

const activeNoteCat = createCat(null);

export const NotesReorder = fastMemo(() => {
  const isLoading = useCat(isLoadingNotesCat);
  const notes = useCat(notesCat);
  const isUpdating = useCat(isUpdatingNoteCat);

  const handleReorder = useCallback(({ item }) => {
    if (item) {
      updateNoteEffect(item.sortKey, {
        encryptedPassword: item.encryptedPassword,
        position: item.position,
      });
    }
  }, []);

  return (
    <PrepareData load={load}>
      <PageContent>
        <PageHeader title="Reorder notes" isLoading={isLoading || isUpdating} hasBack />

        <Text m="0 0 1rem">Drag to reorder, click to edit.</Text>

        <ReorderItems
          items={notes}
          onReorder={handleReorder}
          reverse
          renderItem={item => item.title}
          onClickItem={item => {
            activeNoteCat.set(item);
          }}
        />

        <Actions />
      </PageContent>
    </PrepareData>
  );
});

const Actions = fastMemo(() => {
  const activeNote = useCat(activeNoteCat);

  const options = [
    {
      name: 'Edit',
      onClick: () => {
        navigateTo(`/notes/details?noteId=${activeNote?.sortKey}`);
      },
    },
    {
      name: 'Delete',
      danger: true,
      onClick: () => {
        deleteNoteEffect(activeNote?.sortKey);
      },
    },
  ];

  const handleSelectAction = option => {
    option.onClick();
    activeNoteCat.set(null);
  };

  return (
    <ActionSheet
      visible={!!activeNote}
      options={options}
      onSelect={handleSelectAction}
      onCancel={() => activeNoteCat.set(null)}
    />
  );
});
