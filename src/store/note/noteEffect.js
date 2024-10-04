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
  isUpdatingNoteCat,
  noteCat,
  notesCat,
} from './noteCats';
import { createNote, deleteNote, fetchNote, fetchNotes, updateNote } from './noteNetwork';

export async function fetchNotesEffect(force) {
  if (!notesCat.get()?.length) {
    const cachedNotes = LocalStorage.get(localStorageKeys.notes);
    if (cachedNotes?.length) {
      notesCat.set(cachedNotes);
    }
  }

  if (force || !notesCat.get()?.length) {
    await forceFetchNotesEffect();
  } else {
    forceFetchNotesEffect();
  }
}

async function forceFetchNotesEffect() {
  isLoadingNotesCat.set(true);

  const { data } = await fetchNotes();
  if (data) {
    myWorker.postMessage({
      type: workerActionTypes.DECRYPT_NOTES,
      notes: data,
      privateKey: LocalStorage.get(sharedLocalStorageKeys.privateKey),
    });
  } else {
    isLoadingNotesCat.set(false);
  }
}

export async function fetchNoteEffect(noteId) {
  isLoadingNoteCat.set(true);

  const { data } = await fetchNote(noteId);
  if (data) {
    noteCat.set(data);
  }

  isLoadingNoteCat.set(false);
}

export async function createNoteEffect(title, text, groupId) {
  isCreatingNoteCat.set(true);

  const { data } = await createNote({ title, text, groupId });
  if (data) {
    updateNotesState(data, 'create');
    setToastEffect('Encrypted and saved safely in Frankfurt!');
  }

  isCreatingNoteCat.set(false);
}

export async function updateNoteEffect(
  noteId,
  { encryptedPassword, title, text, groupId, position, successMessage }
) {
  isUpdatingNoteCat.set(true);

  const { data } = await updateNote(noteId, { encryptedPassword, title, text, groupId, position });
  if (data) {
    updateNotesState(data, 'update');
    if (successMessage) {
      setToastEffect(successMessage);
    }
  }

  isUpdatingNoteCat.set(false);
}

export async function deleteNoteEffect(noteId) {
  isDeletingNoteCat.set(true);

  const { data } = await deleteNote(noteId);

  if (data) {
    updateNotesState(data, 'delete');
    setToastEffect('Deleted!');
  }

  isDeletingNoteCat.set(false);
}

function updateNotesState(data, type) {
  const notesInState = notesCat.get() || [];

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

  notesCat.set(newItems);
  LocalStorage.set(localStorageKeys.notes, newItems);
}
