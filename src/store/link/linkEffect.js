import { localStorageKeys } from '../../lib/constants';
import { LocalStorage } from '../../lib/LocalStorage';
import { sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import { setToastEffect } from '../../shared/browser/store/sharedEffects';
import { orderByPosition } from '../../shared/js/position';
import { workerActionTypes } from '../worker/workerHelpers';
import { myWorker } from '../worker/workerListeners';
import {
  isCreatingLinkCat,
  isDeletingLinkCat,
  isLoadingLinkCat,
  isLoadingLinksCat,
  isMovingLinkCat,
  isUpdatingLinkCat,
  linkCat,
  linksCat,
} from './linkCats';
import { createLink, deleteLink, fetchLink, fetchLinks, updateLink } from './linkNetwork';

export async function fetchLinksEffect(force, alwaysFetchRemote = true, spaceId) {
  if (!linksCat.get()?.length) {
    const cachedLinks = LocalStorage.get(`${localStorageKeys.links}-${spaceId}`);
    if (cachedLinks?.length) {
      linksCat.set({ ...linksCat.get(), [spaceId]: cachedLinks });
    }
  }

  if (force || !linksCat.get()?.length) {
    await forceFetchLinksEffect(spaceId);
  } else {
    if (alwaysFetchRemote || !linksCat.get()?.length) {
      forceFetchLinksEffect(spaceId);
    }
  }
}

async function forceFetchLinksEffect(spaceId) {
  isLoadingLinksCat.set(true);

  const { data } = await fetchLinks(spaceId);
  if (data) {
    myWorker.postMessage({
      type: workerActionTypes.DECRYPT_LINKS,
      links: data,
      spaceId,
      privateKey: LocalStorage.get(sharedLocalStorageKeys.privateKey),
    });
  } else {
    isLoadingLinksCat.set(false);
  }
}

export async function fetchLinkEffect(linkId, spaceId) {
  isLoadingLinkCat.set(true);

  const { data } = await fetchLink(linkId, spaceId);
  if (data) {
    linkCat.set(data);
  }

  isLoadingLinkCat.set(false);
}

export async function createLinkEffect({ title, link, groupId, showMessage }, spaceId) {
  isCreatingLinkCat.set(true);

  const { data } = await createLink({ title, link, groupId }, spaceId);
  if (data) {
    updateLinksState(data, 'create', spaceId);
    if (showMessage) {
      setToastEffect('Encrypted and saved safely in Frankfurt!');
    }
  }

  isCreatingLinkCat.set(false);
}

export async function moveLinkEffect(link, fromSpaceId, toSpaceId) {
  isMovingLinkCat.set(true);

  await createLinkEffect({ title: link.title, link: link.link, showMessage: false }, toSpaceId);
  await deleteLinkEffect(link.sortKey, { showMessage: false }, fromSpaceId);

  setToastEffect('Moved!');

  isMovingLinkCat.set(false);
}

export async function updateLinkEffect(
  linkId,
  { encryptedPassword, title, link, groupId, position, count, successMessage },
  spaceId
) {
  isUpdatingLinkCat.set(true);

  const { data } = await updateLink(
    linkId,
    {
      encryptedPassword,
      title,
      link,
      groupId,
      position,
      count,
    },
    spaceId
  );
  if (data) {
    updateLinksState(data, 'update', spaceId);
    if (successMessage) {
      setToastEffect(successMessage);
    }
  }

  isUpdatingLinkCat.set(false);
}

export async function deleteLinkEffect(linkId, { showMessage }, spaceId) {
  isDeletingLinkCat.set(true);

  const { data } = await deleteLink(linkId, spaceId);

  if (data) {
    updateLinksState(data, 'delete', spaceId);
    if (showMessage) {
      setToastEffect('Deleted!');
    }
  }

  isDeletingLinkCat.set(false);
}

export function updateLinksState(data, type, spaceId) {
  const linksInState = linksCat.get()[spaceId] || [];

  let newItems = linksInState;
  if (type === 'update') {
    newItems = orderByPosition(
      newItems.map(item => (item.sortKey === data.sortKey ? data : item)),
      true
    );
  } else if (type === 'delete') {
    newItems = newItems.filter(item => item.sortKey !== data.sortKey);
  } else if (type === 'create') {
    newItems = [...newItems, data];
  } else if (type === 'fetch') {
    newItems = data;
  }

  linksCat.set({ ...linksCat.get(), [spaceId]: newItems });
  LocalStorage.set(`${localStorageKeys.links}-${spaceId}`, newItems);
}
