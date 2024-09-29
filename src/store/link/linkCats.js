import { useMemo } from 'react';
import { createCat, useCat } from 'usecat';

import { noGroupSortKey } from '../../lib/constants';
import { linkGroupsCat } from '../linkGroup/linkGroupCats';

export const linksCat = createCat([]);
export const linkCat = createCat(null);
export const isLoadingLinksCat = createCat(false);
export const isLoadingLinkCat = createCat(false);
export const isCreatingLinkCat = createCat(false);
export const isUpdatingLinkCat = createCat(false);
export const isDeletingLinkCat = createCat(false);

export function useLinkGroups() {
  const links = useCat(linksCat);
  const groups = useCat(linkGroupsCat);

  const groupsWithLinks = useMemo(() => {
    const obj = {};
    groups.forEach(group => {
      obj[group.sortKey] = { ...group, items: [] };
    });

    const noGroupLinks = [];

    links.forEach(link => {
      if (obj[link.groupId]) {
        obj[link.groupId].items.push(link);
      } else {
        noGroupLinks.push(link);
      }
    });

    return [
      ...groups.map(group => obj[group.sortKey]),
      { sortKey: noGroupSortKey, title: 'Links without tag', items: noGroupLinks },
    ];
  }, [groups, links]);

  return {
    groups: groupsWithLinks,
    links,
  };
}
