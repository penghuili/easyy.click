import { useMemo } from 'react';
import { createCat, useCat } from 'usecat';

export const spacesCat = createCat([]);
export const spaceCat = createCat(null);
export const isLoadingSpacesCat = createCat(false);
export const isLoadingSpaceCat = createCat(false);
export const isCreatingSpaceCat = createCat(false);
export const isUpdatingSpaceCat = createCat(false);
export const isDeletingSpaceCat = createCat(false);
export const activeSpaceCat = createCat(null);
export const defaultSpaceId = 'personal';

export function useSpaces() {
  const spaces = useCat(spacesCat);

  return useMemo(
    () => [
      { sortKey: defaultSpaceId, title: 'Personal', color: 'var(--semi-color-primary)' },
      ...(spaces || []),
    ],
    [spaces]
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

  const spaces = spacesCat.get();
  const found = spaces?.find(item => item.sortKey === spaceId);
  if (!found) {
    throw new Error(`Space ${spaceId} not found`);
  }

  return found;
}
