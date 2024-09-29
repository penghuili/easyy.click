import { localStorageKeys } from '../../lib/constants';
import { LocalStorage } from '../../lib/LocalStorage';
import { setToastEffect } from '../../shared/browser/store/sharedEffects';
import { orderByPosition } from '../../shared/js/position';
import {
  isCreatingLinkGroupCat,
  isDeletingLinkGroupCat,
  isLoadingLinkGroupCat,
  isLoadingLinkGroupsCat,
  isUpdatingLinkGroupCat,
  linkGroupCat,
  linkGroupsCat,
} from './linkGroupCats';
import {
  createLinkGroup,
  deleteLinkGroup,
  fetchLinkGroup,
  fetchLinkGroups,
  updateLinkGroup,
} from './linkGroupNetwork';

export async function fetchLinkGroupsEffect(force) {
  if (!linkGroupsCat.get()?.length) {
    const cachedGroups = LocalStorage.get(localStorageKeys.linkGroups);
    if (cachedGroups?.length) {
      linkGroupsCat.set(cachedGroups);
    }
  }

  if (force || !linkGroupsCat.get()?.length) {
    await forceFetchLinkGroupsEffect();
  } else {
    forceFetchLinkGroupsEffect();
  }
}

async function forceFetchLinkGroupsEffect() {
  isLoadingLinkGroupsCat.set(true);

  const { data } = await fetchLinkGroups();
  if (data) {
    updateGroupsState(data, 'fetch');
  }

  isLoadingLinkGroupsCat.set(false);
}

export async function fetchLinkGroupEffect(linkGroupId) {
  isLoadingLinkGroupCat.set(true);

  const { data } = await fetchLinkGroup(linkGroupId);
  if (data) {
    linkGroupCat.set(data);
  }

  isLoadingLinkGroupCat.set(false);
}

export async function createLinkGroupEffect(title) {
  isCreatingLinkGroupCat.set(true);

  const { data } = await createLinkGroup({ title });
  if (data) {
    updateGroupsState(data, 'create');
    setToastEffect('Created!');
  }

  isCreatingLinkGroupCat.set(false);

  return data;
}

export async function updateLinkGroupEffect(linkGroupId, { encryptedPassword, title, position }) {
  isUpdatingLinkGroupCat.set(true);

  const { data } = await updateLinkGroup(linkGroupId, { encryptedPassword, title, position });
  if (data) {
    updateGroupsState(data, 'update');
    setToastEffect('Updated!');
  }

  isUpdatingLinkGroupCat.set(false);
}

export async function deleteLinkGroupEffect(linkGroupId) {
  isDeletingLinkGroupCat.set(true);

  const { data } = await deleteLinkGroup(linkGroupId);

  if (data) {
    updateGroupsState(data, 'delete');
    setToastEffect('Deleted!');
  }

  isDeletingLinkGroupCat.set(false);
}

function updateGroupsState(data, type) {
  const groupsInState = linkGroupsCat.get() || [];

  let newItems = groupsInState;
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

  linkGroupsCat.set(newItems);
  LocalStorage.set(localStorageKeys.linkGroups, newItems);
}
