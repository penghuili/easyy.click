import React, { useCallback, useEffect, useState } from 'react';
import { useCat } from 'usecat';

import { isCreatingLinkGroupCat, linkGroupsCat } from '../store/linkGroup/linkGroupCats';
import { createLinkGroupEffect, fetchLinkGroupsEffect } from '../store/linkGroup/linkGroupEffect';
import { GroupsSelector } from './GroupsSelector';

export function LinkGroupSelector({ groupId, onSelect }) {
  const groups = useCat(linkGroupsCat);
  const isCreating = useCat(isCreatingLinkGroupCat);

  const [title, setTitle] = useState('');

  const handleCreate = useCallback(async () => {
    const newGroup = await createLinkGroupEffect(title);
    if (newGroup) {
      onSelect(newGroup.sortKey);
      setTitle('');
    }
  }, [onSelect, title]);

  useEffect(() => {
    fetchLinkGroupsEffect();
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
