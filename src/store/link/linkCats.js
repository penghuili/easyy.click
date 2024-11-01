import { useMemo } from 'react';
import { createCat, useCat } from 'usecat';

import { importedGroupSortKey, noGroupSortKey, useGroups } from '../group/groupCats';

export const linksCat = createCat({});
export const linkCat = createCat(null);
export const inboxLinksStartKeyCat = createCat(null);
export const isLoadingLinksCat = createCat(false);
export const isLoadingInboxLinksCat = createCat(false);
export const isLoadingLinkCat = createCat(false);
export const isCreatingLinkCat = createCat(false);
export const isCreatingLinksCat = createCat(false);
export const isMovingLinkCat = createCat(false);
export const isUpdatingLinkCat = createCat(false);
export const isDeletingLinkCat = createCat(false);
export const isDeletingLinksCat = createCat(false);
export const isLoadingPageInfoCat = createCat(false);

export function useLinks(spaceId) {
  return useCat(linksCat, data => data[spaceId] || []);
}

export function useLinkGroups(showEmptyGroups = false, spaceId) {
  const links = useLinks(spaceId);
  const groups = useGroups(spaceId);

  const groupsWithLinks = useMemo(() => {
    const obj = {};
    groups.forEach(group => {
      obj[group.sortKey] = { ...group, items: [] };
    });

    const noGroupLinks = [];
    const importedLinks = [];

    links.forEach(link => {
      if (obj[link.groupId]) {
        obj[link.groupId].items.push(link);
      } else if (link.groupId === importedGroupSortKey) {
        importedLinks.push(link);
      } else {
        noGroupLinks.push(link);
      }
    });

    return [
      ...groups.map(group => obj[group.sortKey]),
      { sortKey: noGroupSortKey, title: 'Links without tag', items: noGroupLinks },
      { sortKey: importedGroupSortKey, title: 'Imported links', items: importedLinks },
    ].filter(
      group => group.sortKey === noGroupSortKey || showEmptyGroups || group.items.length > 0
    );
  }, [groups, links, showEmptyGroups]);

  return {
    groups: groupsWithLinks,
    links,
  };
}

export function useTop10Links(spaceId) {
  const links = useLinks(spaceId);

  return useMemo(() => {
    return links
      .filter(link => link.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [links]);
}
