import { useMemo } from 'react';
import { createCat, useCat } from 'usecat';

import { linksLayout } from '../../lib/constants';
import { settingsCat } from '../../shared/browser/store/sharedCats';

export const spacesCat = createCat([]);
export const spaceCat = createCat(null);
export const isLoadingSpacesCat = createCat(false);
export const isLoadingSpaceCat = createCat(false);
export const isCreatingSpaceCat = createCat(false);
export const isUpdatingSpaceCat = createCat(false);
export const isDeletingSpaceCat = createCat(false);
export const activeSpaceCat = createCat(null);
export const defaultSpaceId = 'personal';
export const inboxSpaceId = 'inbox';

const personalSpace = {
  sortKey: defaultSpaceId,
  title: 'Personal',
  color: 'var(--semi-color-primary)',
};

export function useSpaces() {
  const spaces = useCat(spacesCat);

  return useMemo(() => [personalSpace, ...(spaces || [])].filter(s => !s.archived), [spaces]);
}

export function useArchivedSpaces() {
  const spaces = useCat(spacesCat);

  return useMemo(() => (spaces || []).filter(s => s.archived), [spaces]);
}

export function useSpace(spaceId) {
  const spaces = useSpaces();

  return useMemo(
    () => spaces?.find(space => space.sortKey === spaceId) || personalSpace,
    [spaceId, spaces]
  );
}

export function useCreatedSpaces() {
  const spaces = useSpaces();

  return useMemo(() => spaces.filter(space => space.sortKey !== defaultSpaceId), [spaces]);
}

export function getSpace(spaceId) {
  if (!spaceId || spaceId === defaultSpaceId) {
    return null;
  }

  if (spaceId === inboxSpaceId) {
    return { sortKey: inboxSpaceId, title: 'Inbox', color: 'var(--semi-color-primary)' };
  }

  const spaces = spacesCat.get();
  const found = spaces?.find(item => item.sortKey === spaceId);
  if (!found) {
    throw new Error(`Space ${spaceId} not found`);
  }

  return found;
}

export function hasSpacePassword(space) {
  return space && space.encryptedPassword;
}

export function useLinksLayout(spaceId) {
  const settings = useCat(settingsCat);
  const space = useSpace(spaceId);

  return useMemo(() => {
    if (spaceId === defaultSpaceId) {
      return settings?.linksLayout || linksLayout.GRID;
    }

    return space?.linksLayout || linksLayout.GRID;
  }, [settings?.linksLayout, space?.linksLayout, spaceId]);
}
