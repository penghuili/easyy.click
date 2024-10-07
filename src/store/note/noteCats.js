import { useMemo } from 'react';
import { createCat, useCat } from 'usecat';

import { noGroupSortKey } from '../../lib/constants';
import { groupsCat } from '../group/groupCats';

export const notesCat = createCat([]);
export const noteCat = createCat(null);
export const isLoadingNotesCat = createCat(false);
export const isLoadingNoteCat = createCat(false);
export const isCreatingNoteCat = createCat(false);
export const isUpdatingNoteCat = createCat(false);
export const isDeletingNoteCat = createCat(false);

export function useNoteGroups() {
  const notes = useCat(notesCat);
  const groups = useCat(groupsCat);

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
