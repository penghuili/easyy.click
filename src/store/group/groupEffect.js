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

export async function fetchGroupsEffect(force, alwaysFetchRemote = true, spaceId) {
  if (!groupsCat.get()?.length) {
    const cachedGroups = LocalStorage.get(`${localStorageKeys.groups}-${spaceId}`);
    if (cachedGroups?.length) {
      groupsCat.set({ ...groupsCat.get(), [spaceId]: cachedGroups });
    }
  }

  if (force || !groupsCat.get()?.length) {
    await forceFetchGroupsEffect(spaceId);
  } else {
    if (alwaysFetchRemote || !groupsCat.get()?.length) {
      forceFetchGroupsEffect(spaceId);
    }
  }
}

async function forceFetchGroupsEffect(spaceId) {
  isLoadingGroupsCat.set(true);

  const { data } = await fetchGroups(spaceId);
  if (data) {
    myWorker.postMessage({
      type: workerActionTypes.DECRYPT_GROUPS,
      groups: data,
      spaceId,
      privateKey: LocalStorage.get(sharedLocalStorageKeys.privateKey),
    });
  } else {
    isLoadingGroupsCat.set(false);
  }
}

export async function fetchGroupEffect(groupId, spaceId) {
  isLoadingGroupCat.set(true);

  const { data } = await fetchGroup(groupId, spaceId);
  if (data) {
    groupCat.set(data);
  }

  isLoadingGroupCat.set(false);
}

export async function createGroupEffect(title, spaceId) {
  isCreatingGroupCat.set(true);

  const { data } = await createGroup({ title }, spaceId);
  if (data) {
    updateGroupsState(data, 'create', spaceId);
    setToastEffect('Created!');
  }

  isCreatingGroupCat.set(false);

  return data;
}

export async function updateGroupEffect(groupId, { encryptedPassword, title, position }, spaceId) {
  isUpdatingGroupCat.set(true);

  const { data } = await updateGroup(groupId, { encryptedPassword, title, position }, spaceId);
  if (data) {
    updateGroupsState(data, 'update', spaceId);
    setToastEffect('Updated!');
  }

  isUpdatingGroupCat.set(false);
}

export async function deleteGroupEffect(groupId, spaceId) {
  isDeletingGroupCat.set(true);

  const { data } = await deleteGroup(groupId, spaceId);

  if (data) {
    updateGroupsState(data, 'delete', spaceId);
    setToastEffect('Deleted!');
  }

  isDeletingGroupCat.set(false);
}

export function updateGroupsState(data, type, spaceId) {
  const groupsInState = groupsCat.get()[spaceId] || [];

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

  groupsCat.set({ ...groupsCat.get(), [spaceId]: newItems });
  LocalStorage.set(`${localStorageKeys.groups}-${spaceId}`, newItems);
}
