import { useCat } from 'usecat';

import { localStorageKeys } from '../../lib/constants';
import { LocalStorage } from '../../shared/browser/LocalStorage';
import { arrayToObject } from '../../shared/js/object';
import { linksCat } from '../link/linkCats';
import { fetchInboxLinksEffect, forceFetchLinksEffect } from '../link/linkEffect';
import { notesCat } from '../note/noteCats';
import { fetchInboxNotesEffect, forceFetchNotesEffect } from '../note/noteEffect';
import { defaultSpaceId, inboxSpaceId, spacesCat } from '../space/spaceCats';
import { fetchSpacesEffect } from '../space/spaceEffect';

export async function fetchForSearchEffect() {
  await fetchSpacesEffect(true, false);

  const spaceIds = [defaultSpaceId, ...(spacesCat.get() || []).map(space => space.sortKey)];
  spaceIds.forEach(spaceId => fetchOneSpace(spaceId));

  if (linksCat.get()[inboxSpaceId]?.length === undefined) {
    fetchInboxLinksEffect();
  }
  if (notesCat.get()[inboxSpaceId]?.length === undefined) {
    fetchInboxNotesEffect();
  }
}

export function useSearchContent() {
  const spaces = useCat(spacesCat);
  const links = useCat(linksCat);
  const notes = useCat(notesCat);

  const allSpaces = [
    { sortKey: defaultSpaceId, title: 'Personal' },
    ...(spaces || []),
    { sortKey: inboxSpaceId, title: 'Inbox' },
  ];
  const spaceIds = allSpaces.map(space => space.sortKey);
  const allLinks = spaceIds.reduce((acc, spaceId) => [...acc, ...(links[spaceId] || [])], []);
  const allNotes = spaceIds.reduce((acc, spaceId) => [...acc, ...(notes[spaceId] || [])], []);

  return {
    links: allLinks,
    notes: allNotes,
    spacesObj: arrayToObject(allSpaces, 'sortKey'),
  };
}

function fetchOneSpace(spaceId) {
  if (linksCat.get()[spaceId]?.length === undefined) {
    const cachedLinks = LocalStorage.get(`${localStorageKeys.links}-${spaceId}`);
    if (cachedLinks?.length) {
      linksCat.set({ ...linksCat.get(), [spaceId]: cachedLinks });
    }

    forceFetchLinksEffect(spaceId);
  }

  if (notesCat.get()[spaceId]?.length === undefined) {
    const cachedNotes = LocalStorage.get(`${localStorageKeys.notes}-${spaceId}`);
    if (cachedNotes?.length) {
      notesCat.set({ ...notesCat.get(), [spaceId]: cachedNotes });
    }

    forceFetchNotesEffect(spaceId);
  }
}
