import { localStorageKeys } from '../../lib/constants';
import { eventEmitter, eventEmitterEvents } from '../../shared/browser/eventEmitter';
import { LocalStorage, sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import { setToastEffect } from '../../shared/browser/store/sharedEffects';
import { orderByPosition } from '../../shared/js/position';
import { groupsCat } from '../group/groupCats';
import { linksCat } from '../link/linkCats';
import { notesCat } from '../note/noteCats';
import { workerActionTypes } from '../worker/workerHelpers';
import { myWorker } from '../worker/workerListeners';
import {
  isCreatingSpaceCat,
  isDeletingSpaceCat,
  isLoadingSpaceCat,
  isLoadingSpacesCat,
  isUpdatingSpaceCat,
  spaceCat,
  spacesCat,
} from './spaceCats';
import {
  createSpace,
  deleteSpace,
  fetchSpace,
  fetchSpaces,
  shareSpaceLinks,
  unshareSpaceLinks,
  updateSpace,
} from './spaceNetwork';

export async function fetchSpacesEffect(force, alwaysFetchRemote = true) {
  if (!spacesCat.get()?.length) {
    const cachedSpaces = LocalStorage.get(localStorageKeys.spaces);
    if (cachedSpaces?.length) {
      spacesCat.set(cachedSpaces);
    }
  }

  if (force || !spacesCat.get()?.length) {
    await forceFetchSpacesEffect();
  } else {
    if (alwaysFetchRemote || !spacesCat.get()?.length) {
      forceFetchSpacesEffect();
    }
  }
}

async function forceFetchSpacesEffect() {
  isLoadingSpacesCat.set(true);

  const { data } = await fetchSpaces();
  if (data) {
    myWorker.postMessage({
      type: workerActionTypes.DECRYPT_SPACES,
      spaces: data,
      privateKey: LocalStorage.get(sharedLocalStorageKeys.privateKey),
    });
  } else {
    isLoadingSpacesCat.set(false);
  }
}

export async function fetchSpaceEffect(spaceId) {
  isLoadingSpaceCat.set(true);

  const { data } = await fetchSpace(spaceId);
  if (data) {
    spaceCat.set(data);
  }

  isLoadingSpaceCat.set(false);
}

export async function createSpaceEffect(title, color, { showMessage }) {
  isCreatingSpaceCat.set(true);

  const { data } = await createSpace({ title, color });
  if (data) {
    updateSpacesState(data, 'create');
    if (showMessage) {
      setToastEffect('Created!');
    }
  }

  isCreatingSpaceCat.set(false);

  return data;
}

export async function updateSpaceEffect(
  spaceId,
  { encryptedPassword, title, position, color, archived, linksLayout, successMessage }
) {
  isUpdatingSpaceCat.set(true);

  const { data } = await updateSpace(spaceId, {
    encryptedPassword,
    title,
    position,
    color,
    archived,
    linksLayout,
  });
  if (data) {
    updateSpacesState(data, 'update');
    setToastEffect(successMessage || 'Updated!');
  }

  isUpdatingSpaceCat.set(false);
}

export async function shareSpaceLinksEffect(spaceId, payload) {
  isUpdatingSpaceCat.set(true);

  const { data } = await shareSpaceLinks(spaceId, payload);
  if (data) {
    updateSpacesState(data, 'update');
    setToastEffect('Links in this space is now public!');
  }

  isUpdatingSpaceCat.set(false);
}

export async function unshareSpaceLinksEffect(spaceId) {
  isUpdatingSpaceCat.set(true);

  const { data } = await unshareSpaceLinks(spaceId);
  if (data) {
    updateSpacesState(data, 'update');
    setToastEffect('Links in this space is no longer public.');
  }

  isUpdatingSpaceCat.set(false);
}

export async function deleteSpaceEffect(spaceId) {
  isDeletingSpaceCat.set(true);

  const { data } = await deleteSpace(spaceId);

  if (data) {
    updateSpacesState(data, 'delete');
    setToastEffect('Deleted!');
  }

  isDeletingSpaceCat.set(false);
}

export function updateSpacesState(data, type) {
  const spacesInState = spacesCat.get() || [];

  let newItems = spacesInState;
  if (type === 'update') {
    newItems = orderByPosition(
      newItems.map(item => (item.sortKey === data.sortKey ? data : item)),
      true
    );
  } else if (type === 'delete') {
    newItems = newItems.filter(item => item.sortKey !== data.sortKey);

    linksCat.set({ ...linksCat.get(), [data.sortKey]: [] });
    LocalStorage.remove(`${localStorageKeys.links}-${data.sortKey}`);

    notesCat.set({ ...notesCat.get(), [data.sortKey]: [] });
    LocalStorage.remove(`${localStorageKeys.notes}-${data.sortKey}`);

    groupsCat.set({ ...groupsCat.get(), [data.sortKey]: [] });
    LocalStorage.remove(`${localStorageKeys.groups}-${data.sortKey}`);
  } else if (type === 'create') {
    newItems = [...newItems, data];
  } else if (type === 'fetch') {
    newItems = data;
  }

  spacesCat.set(newItems);
  LocalStorage.set(localStorageKeys.spaces, newItems);
}

eventEmitter.on(eventEmitterEvents.loggedIn, () => {
  fetchSpacesEffect(false, true);
});
