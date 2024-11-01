import { localStorageKeys } from '../../lib/constants';
import { LocalStorage, sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import { fetchSettingsEffect, setToastEffect } from '../../shared/browser/store/sharedEffects';
import { orderByPosition } from '../../shared/js/position';
import { workerActionTypes } from '../worker/workerHelpers';
import { myWorker } from '../worker/workerListeners';
import {
  isCreatingNoteCat,
  isCreatingNotesCat,
  isDeletingNoteCat,
  isDeletingNotesCat,
  isLoadingNoteCat,
  isLoadingNotesCat,
  isMovingNoteCat,
  isUpdatingNoteCat,
  noteCat,
  notesCat,
} from './noteCats';
import {
  createNote,
  createNotes,
  deleteNote,
  deleteNotes,
  fetchNote,
  fetchNotes,
  updateNote,
} from './noteNetwork';

export async function fetchNotesEffect(force, alwaysFetchRemote = true, spaceId) {
  if (!notesCat.get()[spaceId]?.length) {
    const cachedNotes = LocalStorage.get(`${localStorageKeys.notes}-${spaceId}`);
    if (cachedNotes?.length) {
      notesCat.set({ ...notesCat.get(), [spaceId]: cachedNotes });
    }
  }

  if (force || !notesCat.get()[spaceId]?.length) {
    await forceFetchNotesEffect(spaceId);
  } else {
    if (alwaysFetchRemote || !notesCat.get()[spaceId]?.length) {
      forceFetchNotesEffect(spaceId);
    }
  }
}

async function forceFetchNotesEffect(spaceId) {
  isLoadingNotesCat.set(true);

  const { data } = await fetchNotes(spaceId);
  if (data) {
    myWorker.postMessage({
      type: workerActionTypes.DECRYPT_NOTES,
      notes: data,
      spaceId,
      privateKey: LocalStorage.get(sharedLocalStorageKeys.privateKey),
    });
  } else {
    isLoadingNotesCat.set(false);
  }
}

export async function fetchNoteEffect(noteId, spaceId) {
  isLoadingNoteCat.set(true);

  const { data } = await fetchNote(noteId, spaceId);
  if (data) {
    noteCat.set(data);
  }

  isLoadingNoteCat.set(false);
}

export async function createNoteEffect({ title, text, groupId, moved, showMessage }, spaceId) {
  isCreatingNoteCat.set(true);

  const { data } = await createNote({ title, text, groupId, moved }, spaceId);
  if (data) {
    updateNotesState(data, 'create', spaceId);
    if (showMessage) {
      setToastEffect('Encrypted and saved safely in Frankfurt!');
    }

    fetchSettingsEffect(false);
  }

  isCreatingNoteCat.set(false);
}

export async function createNotesEffect({ notes, moved, showMessage }, spaceId) {
  isCreatingNotesCat.set(true);

  const { data } = await createNotes({ notes, moved }, spaceId);
  if (data) {
    updateNotesState(data, 'create-bulk', spaceId);
    if (showMessage) {
      setToastEffect('Encrypted and saved safely in Frankfurt!');
    }

    fetchSettingsEffect(false);
  }

  isCreatingNotesCat.set(false);

  return data;
}

export async function moveNoteEffect(note, fromSpaceId, toSpaceId, toGroupId) {
  isMovingNoteCat.set(true);

  await createNoteEffect(
    { title: note.title, text: note.text, groupId: toGroupId, moved: true, showMessage: false },
    toSpaceId
  );
  await deleteNoteEffect(note.sortKey, { showMessage: false }, fromSpaceId);

  setToastEffect('Moved!');

  isMovingNoteCat.set(false);

  fetchSettingsEffect(false);
}

export async function moveNotesEffect(notes, fromSpaceId, toSpaceId, toGroupId) {
  isMovingNoteCat.set(true);

  const success = await createNotesEffect(
    {
      notes: notes.map(link => ({
        title: link.title,
        text: link.text,
        groupId: toGroupId,
      })),
      moved: true,
      showMessage: false,
    },
    toSpaceId
  );
  if (success) {
    const deleted = await deleteNotesEffect(
      notes.map(link => link.sortKey),
      {
        showMessage: false,
      },
      fromSpaceId
    );

    if (deleted) {
      setToastEffect(`Moved ${notes.length} notes!`);

      fetchSettingsEffect(false);
    }
  }

  isMovingNoteCat.set(false);
}

export async function updateNoteEffect(
  noteId,
  { encryptedPassword, title, text, groupId, position, successMessage },
  spaceId
) {
  isUpdatingNoteCat.set(true);

  const { data } = await updateNote(
    noteId,
    { encryptedPassword, title, text, groupId, position },
    spaceId
  );
  if (data) {
    updateNotesState(data, 'update', spaceId);
    if (successMessage) {
      setToastEffect(successMessage);
    }
  }

  isUpdatingNoteCat.set(false);
}

export async function deleteNoteEffect(noteId, { showMessage }, spaceId) {
  isDeletingNoteCat.set(true);

  const { data } = await deleteNote(noteId, spaceId);

  if (data) {
    updateNotesState(data, 'delete', spaceId);
    if (showMessage) {
      setToastEffect('Deleted!');
    }

    fetchSettingsEffect(false);
  }

  isDeletingNoteCat.set(false);
}

export async function deleteNotesEffect(noteIds, { showMessage }, spaceId) {
  isDeletingNotesCat.set(true);

  const { data } = await deleteNotes(noteIds, spaceId);

  if (data) {
    updateNotesState(noteIds, 'delete-bulk', spaceId);
    if (showMessage) {
      setToastEffect(`Deleted ${noteIds.length} links!`);
    }

    fetchSettingsEffect(false);
  }

  isDeletingNotesCat.set(false);

  return data;
}

export function updateNotesState(data, type, spaceId) {
  const notesInState = notesCat.get()[spaceId] || [];

  let newItems = notesInState;
  if (type === 'update') {
    newItems = orderByPosition(
      newItems.map(item => (item.sortKey === data.sortKey ? data : item)),
      true
    );
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
  }

  notesCat.set({ ...notesCat.get(), [spaceId]: newItems });
  LocalStorage.set(`${localStorageKeys.notes}-${spaceId}`, newItems);
}
