import { useMemo } from 'react';
import { createCat, useCat } from 'usecat';

import { noGroupSortKey, useGroups } from '../group/groupCats';

export const notesCat = createCat({});
export const noteCat = createCat(null);
export const isLoadingNotesCat = createCat(false);
export const isLoadingNoteCat = createCat(false);
export const isCreatingNoteCat = createCat(false);
export const isMovingNoteCat = createCat(false);
export const isUpdatingNoteCat = createCat(false);
export const isDeletingNoteCat = createCat(false);

export function useNotes(spaceId) {
  const notes = useCat(notesCat);

  return useMemo(() => notes[spaceId] || [], [notes, spaceId]);
}

export function useNoteGroups(spaceId) {
  const notes = useNotes(spaceId);
  const groups = useGroups(spaceId);

  const groupsWithLinks = useMemo(() => {
    const obj = {};
    groups.forEach(group => {
      obj[group.sortKey] = { ...group, items: [] };
    });

    const noGroupLinks = [];

    notes.forEach(link => {
      if (obj[link.groupId]) {
        obj[link.groupId].items.push(link);
      } else {
        noGroupLinks.push(link);
      }
    });

    return [
      ...groups.map(group => obj[group.sortKey]),
      { sortKey: noGroupSortKey, title: 'Notes without tag', items: noGroupLinks },
    ].filter(group => group.sortKey === noGroupSortKey || group.items.length > 0);
  }, [groups, notes]);

  return {
    groups: groupsWithLinks,
    notes,
  };
}
