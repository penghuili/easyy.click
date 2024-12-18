import { generateNoteSortKey } from '../../lib/generateSortKey';
import { HTTP } from '../../shared/browser/HTTP';
import { appName } from '../../shared/browser/initShared';
import { LocalStorage, sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import { asyncMap } from '../../shared/js/asyncMap';
import {
  decryptMessageAsymmetric,
  encryptMessageAsymmetric,
  encryptMessageSymmetric,
} from '../../shared/js/encryption';
import { generatePassword } from '../../shared/js/generatePassword';
import { getSpace, hasSpacePassword } from '../space/spaceCats';
import { decryptNote } from '../worker/workerHelpers';

export async function fetchNotes(spaceId) {
  try {
    const space = getSpace(spaceId);

    const notes = await HTTP.get(
      appName,
      space ? `/v1/notes?spaceId=${space.sortKey}` : `/v1/notes`
    );

    return {
      data: hasSpacePassword(space)
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

    const updated = hasSpacePassword(space)
      ? { ...note, encryptedPassword: space.encryptedPassword }
      : note;

    return await decryptNote(updated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchInboxNotes(startKey) {
  try {
    const data = await HTTP.get(
      appName,
      startKey ? `/v1/notes-inbox?startKey=${startKey}` : `/v1/notes-inbox`
    );

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createNote({ title, text, fromUrl, groupId, moved }, spaceId) {
  try {
    const space = getSpace(spaceId);

    const timestamp = Date.now();

    const payload = await encryptNote({ title, text, fromUrl, groupId, moved, timestamp }, space);

    const data = await HTTP.post(
      appName,
      space ? `/v1/notes?spaceId=${space.sortKey}` : `/v1/notes`,
      payload
    );

    const updated = hasSpacePassword(space)
      ? { ...data, encryptedPassword: space.encryptedPassword }
      : data;

    return await decryptNote(updated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function createNotes({ notes, moved }, spaceId) {
  try {
    const space = getSpace(spaceId);

    const timestamp = Date.now();

    const encryptedNotes = await asyncMap(
      notes,
      async ({ title, text, fromUrl, groupId }, index) => {
        return await encryptNote(
          { title, text, fromUrl, groupId, timestamp: timestamp + index },
          space
        );
      }
    );

    let created = [];
    for (let i = 0; i < encryptedNotes.length; i += 50) {
      const data = await HTTP.post(
        appName,
        space ? `/v1/notes-bulk?spaceId=${space.sortKey}` : `/v1/notes-bulk`,
        { notes: encryptedNotes.slice(i, i + 50), moved }
      );
      created = created.concat(data);
    }

    const updated = hasSpacePassword(space)
      ? created.map(item => ({
          ...item,
          encryptedPassword: space.encryptedPassword,
        }))
      : created;

    const decrypted = await asyncMap(updated, async item => {
      const { data } = await decryptNote(item, LocalStorage.get(sharedLocalStorageKeys.privateKey));
      return data;
    });

    return { data: decrypted.filter(Boolean), error: null };
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

    const updated = hasSpacePassword(space)
      ? { ...data, encryptedPassword: space.encryptedPassword }
      : data;

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

export async function deleteNotes(noteIds, spaceId) {
  try {
    const space = getSpace(spaceId);

    for (let i = 0; i < noteIds.length; i += 50) {
      await HTTP.post(
        appName,
        space ? `/v1/notes-delete-bulk?spaceId=${spaceId}` : `/v1/notes-delete-bulk`,
        { noteIds: noteIds.slice(i, i + 50) }
      );
    }

    return { data: noteIds, error: null };
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

async function encryptNote({ title, text, fromUrl, groupId, moved, timestamp }, space) {
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
  const encryptedFromUrl = fromUrl ? await encryptMessageSymmetric(password, fromUrl) : fromUrl;

  return {
    sortKey: generateNoteSortKey(timestamp),
    timestamp,
    encryptedPassword,
    title: encryptedTitle,
    text: encryptedText,
    fromUrl: encryptedFromUrl,
    groupId,
    moved,
  };
}
