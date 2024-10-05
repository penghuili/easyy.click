import { generateNoteSortKey } from '../../lib/generateSortKey';
import { LocalStorage } from '../../lib/LocalStorage';
import { HTTP } from '../../shared/browser/HTTP';
import { appName } from '../../shared/browser/initShared';
import { sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import {
  decryptMessageAsymmetric,
  encryptMessageAsymmetric,
  encryptMessageSymmetric,
} from '../../shared/js/encryption';
import { generatePassword } from '../../shared/js/generatePassword';
import { orderByPosition } from '../../shared/js/position';
import { decryptNote } from '../worker/workerHelpers';

export async function fetchNotes() {
  try {
    const notes = await HTTP.get(appName, `/v1/notes`);
    const sorted = orderByPosition(notes, true);

    return {
      data: sorted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchNote(noteId) {
  try {
    const note = await HTTP.get(appName, `/v1/notes/${noteId}`);
    return await decryptNote(note, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function createNote({ title, text, groupId }) {
  try {
    const password = generatePassword(20);
    const encryptedPassword = await encryptMessageAsymmetric(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const encryptedTitle = title ? await encryptMessageSymmetric(password, title) : title;
    const encryptedText = text ? await encryptMessageSymmetric(password, text) : text;

    const timestamp = Date.now();

    const data = await HTTP.post(appName, `/v1/notes`, {
      sortKey: generateNoteSortKey(timestamp),
      timestamp,
      encryptedPassword,
      title: encryptedTitle,
      text: encryptedText,
      groupId,
    });

    return await decryptNote(data, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateNote(noteId, { encryptedPassword, title, text, groupId, position }) {
  try {
    const encryptedTitle = await encryptMessageWithEncryptedPassword(encryptedPassword, title);
    const encryptedText = await encryptMessageWithEncryptedPassword(encryptedPassword, text);

    const data = await HTTP.put(appName, `/v1/notes/${noteId}`, {
      title: encryptedTitle,
      text: encryptedText,
      position,
      groupId,
    });

    return await decryptNote(data, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteNote(noteId) {
  try {
    const data = await HTTP.delete(appName, `/v1/notes/${noteId}`);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function decryptPassword(encryptedPassword) {
  return await decryptMessageAsymmetric(
    LocalStorage.get(sharedLocalStorageKeys.privateKey),
    encryptedPassword
  );
}

export async function encryptMessageWithEncryptedPassword(encryptedPassword, message) {
  if (!message) {
    return message;
  }

  const password = await decryptPassword(encryptedPassword);
  return await encryptMessageSymmetric(password, message);
}
