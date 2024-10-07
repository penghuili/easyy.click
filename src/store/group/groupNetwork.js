import { generateGroupSortKey } from '../../lib/generateSortKey';
import { LocalStorage } from '../../lib/LocalStorage';
import { HTTP } from '../../shared/browser/HTTP';
import { appName } from '../../shared/browser/initShared';
import { sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import { encryptMessageAsymmetric, encryptMessageSymmetric } from '../../shared/js/encryption';
import { generatePassword } from '../../shared/js/generatePassword';
import { orderByPosition } from '../../shared/js/position';
import { encryptMessageWithEncryptedPassword } from '../note/noteNetwork';
import { decryptGroup } from '../worker/workerHelpers';

export async function fetchGroups() {
  try {
    const groups = await HTTP.get(appName, `/v1/link-groups`);
    const sorted = orderByPosition(groups, true);

    return {
      data: sorted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchGroup(groupId) {
  try {
    const group = await HTTP.get(appName, `/v1/link-groups/${groupId}`);
    return await decryptGroup(group, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function createGroup({ title }) {
  try {
    const password = generatePassword(20);
    const encryptedPassword = await encryptMessageAsymmetric(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const encryptedTitle = title ? await encryptMessageSymmetric(password, title) : title;

    const timestamp = Date.now();

    const data = await HTTP.post(appName, `/v1/link-groups`, {
      sortKey: generateGroupSortKey(timestamp),
      timestamp,
      encryptedPassword,
      title: encryptedTitle,
    });

    return await decryptGroup(data, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateGroup(groupId, { encryptedPassword, title, position }) {
  try {
    const encryptedTitle = await encryptMessageWithEncryptedPassword(encryptedPassword, title);

    const data = await HTTP.put(appName, `/v1/link-groups/${groupId}`, {
      title: encryptedTitle,
      position,
    });

    return await decryptGroup(data, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteGroup(groupId) {
  try {
    const data = await HTTP.delete(appName, `/v1/link-groups/${groupId}`);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
