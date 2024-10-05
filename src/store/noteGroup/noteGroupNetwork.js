import { generateNoteGroupSortKey } from '../../lib/generateSortKey';
import { LocalStorage } from '../../lib/LocalStorage';
import { HTTP } from '../../shared/browser/HTTP';
import { appName } from '../../shared/browser/initShared';
import { sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import { encryptMessageAsymmetric, encryptMessageSymmetric } from '../../shared/js/encryption';
import { generatePassword } from '../../shared/js/generatePassword';
import { orderByPosition } from '../../shared/js/position';
import { encryptMessageWithEncryptedPassword } from '../note/noteNetwork';
import { decryptGroup } from '../worker/workerHelpers';

export async function fetchNoteGroups() {
  try {
    const groups = await HTTP.get(appName, `/v1/note-groups`);
    const sorted = orderByPosition(groups, true);

    return {
      data: sorted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchNoteGroup(noteGroupId) {
  try {
    const group = await HTTP.get(appName, `/v1/note-groups/${noteGroupId}`);
    return await decryptGroup(group, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function createNoteGroup({ title }) {
  try {
    const password = generatePassword(20);
    const encryptedPassword = await encryptMessageAsymmetric(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const encryptedTitle = title ? await encryptMessageSymmetric(password, title) : title;

    const timestamp = Date.now();

    const data = await HTTP.post(appName, `/v1/note-groups`, {
      sortKey: generateNoteGroupSortKey(timestamp),
      timestamp,
      encryptedPassword,
      title: encryptedTitle,
    });

    return await decryptGroup(data, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateNoteGroup(noteGroupId, { encryptedPassword, title, position }) {
  try {
    const encryptedTitle = await encryptMessageWithEncryptedPassword(encryptedPassword, title);

    const data = await HTTP.put(appName, `/v1/note-groups/${noteGroupId}`, {
      title: encryptedTitle,
      position,
    });

    return await decryptGroup(data, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteNoteGroup(noteGroupId) {
  try {
    const data = await HTTP.delete(appName, `/v1/note-groups/${noteGroupId}`);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
