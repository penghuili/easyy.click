import React, { useCallback, useEffect, useState } from 'react';
import { useCat } from 'usecat';

import { isCreatingNoteGroupCat, noteGroupsCat } from '../store/noteGroup/noteGroupCats';
import { createNoteGroupEffect, fetchNoteGroupsEffect } from '../store/noteGroup/noteGroupEffect';
import { GroupsSelector } from './GroupsSelector';

export function NoteGroupSelector({ groupId, onSelect }) {
  const groups = useCat(noteGroupsCat);
  const isCreating = useCat(isCreatingNoteGroupCat);

  const [title, setTitle] = useState('');

  const handleCreate = useCallback(async () => {
    const newGroup = await createNoteGroupEffect(title);
    if (newGroup) {
      onSelect(newGroup.sortKey);
      setTitle('');
    }
  }, [onSelect, title]);

  useEffect(() => {
    fetchNoteGroupsEffect();
  }, []);

  return (
    <GroupsSelector
      groups={groups}
      groupId={groupId}
      onSelect={onSelect}
      title={title}
      onTitleChange={setTitle}
      isCreating={isCreating}
      onCreate={handleCreate}
    />
  );
}
