import { localStorageKeys } from '../../lib/constants';
import { LocalStorage, sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import { fetchSettingsEffect, setToastEffect } from '../../shared/browser/store/sharedEffects';
import { orderByPosition } from '../../shared/js/position';
import { inboxSpaceId } from '../space/spaceCats';
import { workerActionTypes } from '../worker/workerHelpers';
import { myWorker } from '../worker/workerListeners';
import {
  inboxLinksStartKeyCat,
  isCreatingLinkCat,
  isCreatingLinksCat,
  isDeletingLinkCat,
  isDeletingLinksCat,
  isLoadingInboxLinksCat,
  isLoadingLinkCat,
  isLoadingLinksCat,
  isLoadingPageInfoCat,
  isMovingLinkCat,
  isUpdatingLinkCat,
  linkCat,
  linksCat,
} from './linkCats';
import {
  createLink,
  createLinks,
  deleteLink,
  deleteLinks,
  fetchInboxLinks,
  fetchLink,
  fetchLinks,
  getPageInfo,
  updateLink,
} from './linkNetwork';

export async function fetchLinksEffect(force, alwaysFetchRemote = true, spaceId) {
  if (!linksCat.get()[spaceId]?.length) {
    const cachedLinks = LocalStorage.get(`${localStorageKeys.links}-${spaceId}`);
    if (cachedLinks?.length) {
      linksCat.set({ ...linksCat.get(), [spaceId]: cachedLinks });
    }
  }

  if (force || !linksCat.get()[spaceId]?.length) {
    await forceFetchLinksEffect(spaceId);
  } else {
    if (alwaysFetchRemote || !linksCat.get()[spaceId]?.length) {
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

export async function fetchInboxLinksEffect(startKey) {
  if (!startKey && !linksCat.get()[inboxSpaceId]?.length) {
    const cachedLinks = LocalStorage.get(`${localStorageKeys.links}-${inboxSpaceId}`);
    if (cachedLinks?.length) {
      linksCat.set({ ...linksCat.get(), [inboxSpaceId]: cachedLinks });
    }
  }

  isLoadingInboxLinksCat.set(true);

  const { data } = await fetchInboxLinks(startKey);
  if (data) {
    myWorker.postMessage({
      type: workerActionTypes.DECRYPT_INBOX_LINKS,
      links: data?.items,
      startKey,
      newStartKey: data?.startKey,
      privateKey: LocalStorage.get(sharedLocalStorageKeys.privateKey),
    });
  } else {
    isLoadingInboxLinksCat.set(false);
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

export async function createLinkEffect(
  { title, link, fromUrl, count, groupId, moved, showMessage },
  spaceId
) {
  isCreatingLinkCat.set(true);

  const { data } = await createLink({ title, link, fromUrl, count, groupId, moved }, spaceId);
  if (data) {
    updateLinksState(data, 'create', spaceId);
    if (showMessage) {
      setToastEffect('Encrypted and saved safely in Frankfurt!');
    }

    fetchSettingsEffect(false);
  }

  isCreatingLinkCat.set(false);
}

export async function createLinksEffect({ links, moved, imported, showMessage, message }, spaceId) {
  isCreatingLinksCat.set(true);

  const { data } = await createLinks({ links, moved, imported }, spaceId);
  if (data) {
    updateLinksState(data, 'create-bulk', spaceId);
    if (showMessage) {
      setToastEffect(message || 'Encrypted and saved safely in Frankfurt!');
    }

    fetchSettingsEffect(false);
  }

  isCreatingLinksCat.set(false);

  return data;
}

export async function moveLinkEffect(link, fromSpaceId, toSpaceId, toGroupId) {
  isMovingLinkCat.set(true);

  await createLinkEffect(
    {
      title: link.title,
      link: link.link,
      fromUrl: link.fromUrl,
      groupId: toGroupId,
      count: link.count,
      moved: true,
      showMessage: false,
    },
    toSpaceId
  );
  await deleteLinkEffect(link.sortKey, { showMessage: false }, fromSpaceId);

  setToastEffect('Moved!');

  fetchSettingsEffect(false);

  isMovingLinkCat.set(false);
}

export async function moveLinksEffect(links, fromSpaceId, toSpaceId, toGroupId) {
  isMovingLinkCat.set(true);

  const success = await createLinksEffect(
    {
      links: links.map(link => ({
        title: link.title,
        link: link.link,
        fromUrl: link.fromUrl,
        groupId: toGroupId,
        count: link.count,
        moved: true,
      })),
      moved: true,
      showMessage: false,
    },
    toSpaceId
  );
  if (success) {
    const deleted = await deleteLinksEffect(
      links.map(link => link.sortKey),
      {
        showMessage: false,
      },
      fromSpaceId
    );

    if (deleted) {
      setToastEffect(`Moved ${links.length} links!`);

      fetchSettingsEffect(false);
    }
  }

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

    fetchSettingsEffect(false);
  }

  isDeletingLinkCat.set(false);
}

export async function deleteLinksEffect(linkIds, { showMessage }, spaceId) {
  isDeletingLinksCat.set(true);

  const { data } = await deleteLinks(linkIds, spaceId);

  if (data) {
    updateLinksState(linkIds, 'delete-bulk', spaceId);
    if (showMessage) {
      setToastEffect(`Deleted ${linkIds.length} links!`);
    }

    fetchSettingsEffect(false);
  }

  isDeletingLinksCat.set(false);

  return data;
}

export async function fetchPageInfoEffect(link) {
  isLoadingPageInfoCat.set(true);

  const { data } = await getPageInfo(link);

  isLoadingPageInfoCat.set(false);

  return data;
}

export function updateLinksState(data, type, spaceId) {
  const linksInState = linksCat.get()[spaceId] || [];

  let newItems = linksInState;
  if (type === 'update') {
    const updated = newItems.map(item => (item.sortKey === data.sortKey ? data : item));
    newItems = spaceId === inboxSpaceId ? updated : orderByPosition(updated, true);
  } else if (type === 'delete') {
    newItems = newItems.filter(item => item.sortKey !== data.sortKey);
  } else if (type === 'delete-bulk') {
    const obj = {};
    data?.forEach(id => {
      obj[id] = true;
    });
    newItems = newItems.filter(item => !obj[item.sortKey]);
  } else if (type === 'create') {
    newItems = [...newItems, data];
  } else if (type === 'create-bulk') {
    newItems = [...newItems, ...data];
  } else if (type === 'fetch') {
    newItems = data;
  } else if (type === 'fetch-inbox') {
    newItems = data.startKey ? [...linksInState, ...data.items] : data.items;
    inboxLinksStartKeyCat.set(data.newStartKey);
  }

  linksCat.set({ ...linksCat.get(), [spaceId]: newItems });
  if (spaceId !== inboxSpaceId || !data?.startKey) {
    LocalStorage.set(`${localStorageKeys.links}-${spaceId}`, newItems);
  }
}
