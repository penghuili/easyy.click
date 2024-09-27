import { localStorageKeys } from '../../lib/constants';
import { LocalStorage } from '../../lib/LocalStorage';
import { settingsCat } from '../../shared/browser/store/sharedCats';
import { setToastEffect } from '../../shared/browser/store/sharedEffects';
import { fetchSettings } from '../../shared/browser/store/sharedNetwork';
import { orderByPosition } from '../../shared/js/position';
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

  if (force) {
    forceFetchNotesEffect();
  } else {
    const { data: settings } = await fetchSettings();
    const savedChangedAt = LocalStorage.get(localStorageKeys.notesChangedAt);
    if (settings?.notesChangedAt > savedChangedAt) {
      forceFetchNotesEffect();
      LocalStorage.set(localStorageKeys.notesChangedAt, settings.notesChangedAt);
      settingsCat.set(settings);
    }
  }
}

async function forceFetchNotesEffect() {
  isLoadingNotesCat.set(true);

  const { data } = await fetchNotes();
  if (data) {
    updateNotesState(data, 'fetch');
  }

  isLoadingNotesCat.set(false);
}

export async function fetchNoteEffect(noteId) {
  isLoadingNoteCat.set(true);

  const { data } = await fetchNote(noteId);
  if (data) {
    noteCat.set(data);
  }

  isLoadingNoteCat.set(false);
}

export async function createNoteEffect(title, text) {
  isCreatingNoteCat.set(true);

  const { data } = await createNote({ title, text });
  if (data) {
    updateNotesState(data, 'create');
    setToastEffect('Created!');
  }

  isCreatingNoteCat.set(false);
}

export async function updateNoteEffect(noteId, { encryptedPassword, title, text, position }) {
  isUpdatingNoteCat.set(true);

  const { data } = await updateNote(noteId, { encryptedPassword, title, text, position });
  if (data) {
    updateNotesState(data, 'update');
    setToastEffect('Updated!');
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
