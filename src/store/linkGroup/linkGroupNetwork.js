import { generateLinkGroupSortKey } from '../../lib/generateSortKey';
import { LocalStorage } from '../../lib/LocalStorage';
import { HTTP } from '../../shared/browser/HTTP';
import { appName } from '../../shared/browser/initShared';
import { sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import {
  decryptMessageAsymmetric,
  decryptMessageSymmetric,
  encryptMessageAsymmetric,
  encryptMessageSymmetric,
} from '../../shared/js/encryption';
import { generatePassword } from '../../shared/js/generatePassword';
import { orderByPosition } from '../../shared/js/position';
import { encryptMessageWithEncryptedPassword } from '../note/noteNetwork';

export async function fetchLinkGroups() {
  try {
    const groups = await HTTP.get(appName, `/v1/link-groups`);
    const decrypted = await Promise.all(
      groups.map(async item => {
        return await decryptLinkGroup(item);
      })
    );
    const sorted = orderByPosition(decrypted, true);

    return {
      data: sorted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchLinkGroup(linkGroupId) {
  try {
    const group = await HTTP.get(appName, `/v1/link-groups/${linkGroupId}`);
    const decrypted = await decryptLinkGroup(group);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createLinkGroup({ title }) {
  try {
    const password = generatePassword(20, true);
    const encryptedPassword = await encryptMessageAsymmetric(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const encryptedTitle = title ? await encryptMessageSymmetric(password, title) : title;

    const timestamp = Date.now();

    const data = await HTTP.post(appName, `/v1/link-groups`, {
      sortKey: generateLinkGroupSortKey(timestamp),
      timestamp,
      encryptedPassword,
      title: encryptedTitle,
    });

    const decrypted = await decryptLinkGroup(data);

    return { data: decrypted, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateLinkGroup(linkGroupId, { encryptedPassword, title, position }) {
  try {
    const encryptedTitle = await encryptMessageWithEncryptedPassword(encryptedPassword, title);

    const data = await HTTP.put(appName, `/v1/link-groups/${linkGroupId}`, {
      title: encryptedTitle,
      position,
    });

    const decrypted = await decryptLinkGroup(data);

    return { data: decrypted, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteLinkGroup(linkGroupId) {
  try {
    const data = await HTTP.delete(appName, `/v1/link-groups/${linkGroupId}`);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function decryptLinkGroup(group) {
  const decryptedPassword = await decryptMessageAsymmetric(
    LocalStorage.get(sharedLocalStorageKeys.privateKey),
    group.encryptedPassword
  );

  const decryptedTitle = group.title
    ? await decryptMessageSymmetric(decryptedPassword, group.title)
    : group.title;

  return { ...group, title: decryptedTitle };
}
