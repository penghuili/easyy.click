import { localStorageKeys } from '../../lib/constants';
import { LocalStorage } from '../../lib/LocalStorage';
import { sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import { setToastEffect } from '../../shared/browser/store/sharedEffects';
import { orderByPosition } from '../../shared/js/position';
import { workerActionTypes } from '../worker/workerHelpers';
import { myWorker } from '../worker/workerListeners';
import {
  isCreatingNoteCat,
  isDeletingNoteCat,
  isLoadingNoteCat,
  isLoadingNotesCat,
  isMovingNoteCat,
  isUpdatingNoteCat,
  noteCat,
  notesCat,
} from './noteCats';
import { createNote, deleteNote, fetchNote, fetchNotes, updateNote } from './noteNetwork';

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
  }

  isCreatingNoteCat.set(false);
}

export async function moveNoteEffect(note, fromSpaceId, toSpaceId) {
  isMovingNoteCat.set(true);

  await createNoteEffect(
    { title: note.title, text: note.text, moved: true, showMessage: false },
    toSpaceId
  );
  await deleteNoteEffect(note.sortKey, { showMessage: false }, fromSpaceId);

  setToastEffect('Moved!');

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
  }

  isDeletingNoteCat.set(false);
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
  } else if (type === 'create') {
    newItems = [...newItems, data];
  } else if (type === 'fetch') {
    newItems = data;
  }

  notesCat.set({ ...notesCat.get(), [spaceId]: newItems });
  LocalStorage.set(`${localStorageKeys.notes}-${spaceId}`, newItems);
}
