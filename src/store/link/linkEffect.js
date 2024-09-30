import { localStorageKeys } from '../../lib/constants';
import { LocalStorage } from '../../lib/LocalStorage';
import { setToastEffect } from '../../shared/browser/store/sharedEffects';
import { orderByPosition } from '../../shared/js/position';
import {
  isCreatingLinkCat,
  isDeletingLinkCat,
  isLoadingLinkCat,
  isLoadingLinksCat,
  isUpdatingLinkCat,
  linkCat,
  linksCat,
} from './linkCats';
import { createLink, deleteLink, fetchLink, fetchLinks, updateLink } from './linkNetwork';

export async function fetchLinksEffect(force) {
  if (!linksCat.get()?.length) {
    const cachedLinks = LocalStorage.get(localStorageKeys.links);
    if (cachedLinks?.length) {
      linksCat.set(cachedLinks);
    }
  }

  if (force || !linksCat.get()?.length) {
    await forceFetchLinksEffect();
  } else {
    forceFetchLinksEffect();
  }
}

async function forceFetchLinksEffect() {
  isLoadingLinksCat.set(true);

  const { data } = await fetchLinks();
  if (data) {
    updateLinksState(data, 'fetch');
  }

  isLoadingLinksCat.set(false);
}

export async function fetchLinkEffect(linkId) {
  isLoadingLinkCat.set(true);

  const { data } = await fetchLink(linkId);
  if (data) {
    linkCat.set(data);
  }

  isLoadingLinkCat.set(false);
}

export async function createLinkEffect(title, link, groupId) {
  isCreatingLinkCat.set(true);

  const { data } = await createLink({ title, link, groupId });
  if (data) {
    updateLinksState(data, 'create');
    setToastEffect('Encrypted and saved safely in Franfurt!');
  }

  isCreatingLinkCat.set(false);
}

export async function updateLinkEffect(
  linkId,
  { encryptedPassword, title, link, groupId, position, count, successMessage }
) {
  isUpdatingLinkCat.set(true);

  const { data } = await updateLink(linkId, {
    encryptedPassword,
    title,
    link,
    groupId,
    position,
    count,
  });
  if (data) {
    updateLinksState(data, 'update');
    if (successMessage) {
      setToastEffect(successMessage);
    }
  }

  isUpdatingLinkCat.set(false);
}

export async function deleteLinkEffect(linkId) {
  isDeletingLinkCat.set(true);

  const { data } = await deleteLink(linkId);

  if (data) {
    updateLinksState(data, 'delete');
    setToastEffect('Deleted!');
  }

  isDeletingLinkCat.set(false);
}

function updateLinksState(data, type) {
  const linksInState = linksCat.get() || [];

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

  linksCat.set(newItems);
  LocalStorage.set(localStorageKeys.links, newItems);
}
