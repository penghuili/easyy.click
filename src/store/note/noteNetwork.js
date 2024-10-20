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
import { getSpace } from '../space/spaceCats';
import { decryptNote } from '../worker/workerHelpers';

export async function fetchNotes(spaceId) {
  try {
    const space = getSpace(spaceId);

    const notes = await HTTP.get(
      appName,
      space ? `/v1/notes?spaceId=${space.sortKey}` : `/v1/notes`
    );

    return {
      data: space
        ? notes.map(item => ({ ...item, encryptedPassword: space.encryptedPassword }))
        : notes,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchNote(noteId, spaceId) {
  try {
    const space = getSpace(spaceId);

    const note = await HTTP.get(
      appName,
      space ? `/v1/notes/${noteId}?spaceId=${spaceId}` : `/v1/notes/${noteId}`
    );

    const updated = space ? { ...note, encryptedPassword: space.encryptedPassword } : note;

    return await decryptNote(updated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function createNote({ title, text, groupId, moved }, spaceId) {
  try {
    const space = getSpace(spaceId);

    let password;
    let encryptedPassword;
    if (space) {
      password = await decryptMessageAsymmetric(
        LocalStorage.get(sharedLocalStorageKeys.privateKey),
        space.encryptedPassword
      );
    } else {
      password = generatePassword(20);
      encryptedPassword = await encryptMessageAsymmetric(
        LocalStorage.get(sharedLocalStorageKeys.publicKey),
        password
      );
    }

    const encryptedTitle = title ? await encryptMessageSymmetric(password, title) : title;
    const encryptedText = text ? await encryptMessageSymmetric(password, text) : text;

    const timestamp = Date.now();

    const data = await HTTP.post(
      appName,
      space ? `/v1/notes?spaceId=${space.sortKey}` : `/v1/notes`,
      {
        sortKey: generateNoteSortKey(timestamp),
        timestamp,
        encryptedPassword,
        title: encryptedTitle,
        text: encryptedText,
        groupId,
        moved,
      }
    );

    const updated = space ? { ...data, encryptedPassword: space.encryptedPassword } : data;

    return await decryptNote(updated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateNote(
  noteId,
  { encryptedPassword, title, text, groupId, position },
  spaceId
) {
  try {
    const space = getSpace(spaceId);

    const updatedEncryptedPassword = space?.encryptedPassword || encryptedPassword;

    const encryptedTitle = await encryptMessageWithEncryptedPassword(
      updatedEncryptedPassword,
      title
    );
    const encryptedText = await encryptMessageWithEncryptedPassword(updatedEncryptedPassword, text);

    const data = await HTTP.put(
      appName,
      space ? `/v1/notes/${noteId}?spaceId=${space.sortKey}` : `/v1/notes/${noteId}`,
      {
        title: encryptedTitle,
        text: encryptedText,
        position,
        groupId,
      }
    );

    const updated = space ? { ...data, encryptedPassword: space.encryptedPassword } : data;

    return await decryptNote(updated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteNote(noteId, spaceId) {
  try {
    const space = getSpace(spaceId);

    const data = await HTTP.delete(
      appName,
      space ? `/v1/notes/${noteId}?spaceId=${space.sortKey}` : `/v1/notes/${noteId}`
    );

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
