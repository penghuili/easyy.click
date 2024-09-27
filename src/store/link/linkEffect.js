import { localStorageKeys } from '../../lib/constants';
import { LocalStorage } from '../../lib/LocalStorage';
import { settingsCat } from '../../shared/browser/store/sharedCats';
import { setToastEffect } from '../../shared/browser/store/sharedEffects';
import { fetchSettings } from '../../shared/browser/store/sharedNetwork';
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

  if (force) {
    forceFetchLinksEffect();
  } else {
    const { data: settings } = await fetchSettings();
    const savedChangedAt = LocalStorage.get(localStorageKeys.linksChangedAt);
    if (settings?.linksChangedAt > savedChangedAt) {
      forceFetchLinksEffect();
      LocalStorage.set(localStorageKeys.linksChangedAt, settings.linksChangedAt);
      settingsCat.set(settings);
    }
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

export async function createLinkEffect(title, link) {
  isCreatingLinkCat.set(true);

  const { data } = await createLink({ title, link });
  if (data) {
    updateLinksState(data, 'create');
    setToastEffect('Created!');
  }

  isCreatingLinkCat.set(false);
}

export async function updateLinkEffect(linkId, { encryptedPassword, title, link, position }) {
  isUpdatingLinkCat.set(true);

  const { data } = await updateLink(linkId, { encryptedPassword, title, link, position });
  if (data) {
    updateLinksState(data, 'update');
    setToastEffect('Updated!');
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
