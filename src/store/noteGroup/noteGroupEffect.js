import { localStorageKeys } from '../../lib/constants';
import { LocalStorage } from '../../lib/LocalStorage';
import { setToastEffect } from '../../shared/browser/store/sharedEffects';
import { orderByPosition } from '../../shared/js/position';
import {
  isCreatingNoteGroupCat,
  isDeletingNoteGroupCat,
  isLoadingNoteGroupCat,
  isLoadingNoteGroupsCat,
  isUpdatingNoteGroupCat,
  noteGroupCat,
  noteGroupsCat,
} from './noteGroupCats';
import {
  createNoteGroup,
  deleteNoteGroup,
  fetchNoteGroup,
  fetchNoteGroups,
  updateNoteGroup,
} from './noteGroupNetwork';

export async function fetchNoteGroupsEffect(force) {
  if (!noteGroupsCat.get()?.length) {
    const cachedGroups = LocalStorage.get(localStorageKeys.noteGroups);
    if (cachedGroups?.length) {
      noteGroupsCat.set(cachedGroups);
    }
  }

  if (force || !noteGroupsCat.get()?.length) {
    await forceFetchNoteGroupsEffect();
  } else {
    forceFetchNoteGroupsEffect();
  }
}

async function forceFetchNoteGroupsEffect() {
  isLoadingNoteGroupsCat.set(true);

  const { data } = await fetchNoteGroups();
  if (data) {
    updateGroupsState(data, 'fetch');
  }

  isLoadingNoteGroupsCat.set(false);
}

export async function fetchNoteGroupEffect(noteGroupId) {
  isLoadingNoteGroupCat.set(true);

  const { data } = await fetchNoteGroup(noteGroupId);
  if (data) {
    noteGroupCat.set(data);
  }

  isLoadingNoteGroupCat.set(false);
}

export async function createNoteGroupEffect(title) {
  isCreatingNoteGroupCat.set(true);

  const { data } = await createNoteGroup({ title });
  if (data) {
    updateGroupsState(data, 'create');
    setToastEffect('Created!');
  }

  isCreatingNoteGroupCat.set(false);

  return data;
}

export async function updateNoteGroupEffect(noteGroupId, { encryptedPassword, title, position }) {
  isUpdatingNoteGroupCat.set(true);

  const { data } = await updateNoteGroup(noteGroupId, { encryptedPassword, title, position });
  if (data) {
    updateGroupsState(data, 'update');
    setToastEffect('Updated!');
  }

  isUpdatingNoteGroupCat.set(false);
}

export async function deleteNoteGroupEffect(noteGroupId) {
  isDeletingNoteGroupCat.set(true);

  const { data } = await deleteNoteGroup(noteGroupId);

  if (data) {
    updateGroupsState(data, 'delete');
    setToastEffect('Deleted!');
  }

  isDeletingNoteGroupCat.set(false);
}

function updateGroupsState(data, type) {
  const groupsInState = noteGroupsCat.get() || [];

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

  noteGroupsCat.set(newItems);
  LocalStorage.set(localStorageKeys.noteGroups, newItems);
}
