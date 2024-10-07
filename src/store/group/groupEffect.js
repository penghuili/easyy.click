import { localStorageKeys } from '../../lib/constants';
import { LocalStorage } from '../../lib/LocalStorage';
import { sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import { setToastEffect } from '../../shared/browser/store/sharedEffects';
import { orderByPosition } from '../../shared/js/position';
import { workerActionTypes } from '../worker/workerHelpers';
import { myWorker } from '../worker/workerListeners';
import {
  groupCat,
  groupsCat,
  isCreatingGroupCat,
  isDeletingGroupCat,
  isLoadingGroupCat,
  isLoadingGroupsCat,
  isUpdatingGroupCat,
} from './groupCats';
import { createGroup, deleteGroup, fetchGroup, fetchGroups, updateGroup } from './groupNetwork';

export async function fetchGroupsEffect(force, alwaysFetchRemote = true) {
  if (!groupsCat.get()?.length) {
    const cachedGroups = LocalStorage.get(localStorageKeys.groups);
    if (cachedGroups?.length) {
      groupsCat.set(cachedGroups);
    }
  }

  if (force || !groupsCat.get()?.length) {
    await forceFetchGroupsEffect();
  } else {
    if (alwaysFetchRemote || !groupsCat.get()?.length) {
      forceFetchGroupsEffect();
    }
  }
}

async function forceFetchGroupsEffect() {
  isLoadingGroupsCat.set(true);

  const { data } = await fetchGroups();
  if (data) {
    myWorker.postMessage({
      type: workerActionTypes.DECRYPT_LINK_GROUPS,
      groups: data,
      privateKey: LocalStorage.get(sharedLocalStorageKeys.privateKey),
    });
  } else {
    isLoadingGroupsCat.set(false);
  }
}

export async function fetchGroupEffect(groupId) {
  isLoadingGroupCat.set(true);

  const { data } = await fetchGroup(groupId);
  if (data) {
    groupCat.set(data);
  }

  isLoadingGroupCat.set(false);
}

export async function createGroupEffect(title) {
  isCreatingGroupCat.set(true);

  const { data } = await createGroup({ title });
  if (data) {
    updateGroupsState(data, 'create');
    setToastEffect('Created!');
  }

  isCreatingGroupCat.set(false);

  return data;
}

export async function updateGroupEffect(groupId, { encryptedPassword, title, position }) {
  isUpdatingGroupCat.set(true);

  const { data } = await updateGroup(groupId, { encryptedPassword, title, position });
  if (data) {
    updateGroupsState(data, 'update');
    setToastEffect('Updated!');
  }

  isUpdatingGroupCat.set(false);
}

export async function deleteGroupEffect(groupId) {
  isDeletingGroupCat.set(true);

  const { data } = await deleteGroup(groupId);

  if (data) {
    updateGroupsState(data, 'delete');
    setToastEffect('Deleted!');
  }

  isDeletingGroupCat.set(false);
}

function updateGroupsState(data, type) {
  const groupsInState = groupsCat.get() || [];

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

  groupsCat.set(newItems);
  LocalStorage.set(localStorageKeys.groups, newItems);
}
