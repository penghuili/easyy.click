import { generateGroupSortKey } from '../../lib/generateSortKey';
import { HTTP } from '../../shared/browser/HTTP';
import { appName } from '../../shared/browser/initShared';
import { LocalStorage, sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import {
  decryptMessageAsymmetric,
  encryptMessageAsymmetric,
  encryptMessageSymmetric,
} from '../../shared/js/encryption';
import { generatePassword } from '../../shared/js/generatePassword';
import { encryptMessageWithEncryptedPassword } from '../note/noteNetwork';
import { getSpace } from '../space/spaceCats';
import { decryptGroup } from '../worker/workerHelpers';

export async function fetchGroups(spaceId) {
  try {
    const space = getSpace(spaceId);

    const groups = await HTTP.get(
      appName,
      space ? `/v1/link-groups?spaceId=${space.sortKey}` : `/v1/link-groups`
    );

    return {
      data: space
        ? groups.map(item => ({ ...item, encryptedPassword: space.encryptedPassword }))
        : groups,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchGroup(groupId, spaceId) {
  try {
    const space = getSpace(spaceId);

    const group = await HTTP.get(
      appName,
      space ? `/v1/link-groups/${groupId}?spaceId=${space.sortKey}` : `/v1/link-groups/${groupId}`
    );
    const uppdated = space ? { ...group, encryptedPassword: space.encryptedPassword } : group;

    return await decryptGroup(uppdated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function createGroup({ title }, spaceId) {
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
    const timestamp = Date.now();

    const data = await HTTP.post(
      appName,
      space ? `/v1/link-groups?spaceId=${space.sortKey}` : `/v1/link-groups`,
      {
        sortKey: generateGroupSortKey(timestamp),
        timestamp,
        encryptedPassword,
        title: encryptedTitle,
      }
    );

    const updated = space ? { ...data, encryptedPassword: space.encryptedPassword } : data;

    return await decryptGroup(updated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateGroup(groupId, { encryptedPassword, title, position }, spaceId) {
  try {
    const space = getSpace(spaceId);

    const updatedEncryptedPassword = space?.encryptedPassword || encryptedPassword;

    const encryptedTitle = await encryptMessageWithEncryptedPassword(
      updatedEncryptedPassword,
      title
    );

    const data = await HTTP.put(
      appName,
      space ? `/v1/link-groups/${groupId}?spaceId=${space.sortKey}` : `/v1/link-groups/${groupId}`,
      {
        title: encryptedTitle,
        position,
      }
    );

    const updated = space ? { ...data, encryptedPassword: space.encryptedPassword } : data;

    return await decryptGroup(updated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function shareGroupLinks(groupId, data, spaceId) {
  try {
    const space = getSpace(spaceId);

    const result = await HTTP.post(
      appName,
      space
        ? `/v1/link-groups/${groupId}/share-links?spaceId=${space.sortKey}`
        : `/v1/link-groups/${groupId}/share-links`,
      {
        data,
      }
    );

    const updated = space ? { ...result, encryptedPassword: space.encryptedPassword } : result;

    return await decryptGroup(updated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function unshareGroupLinks(groupId, spaceId) {
  try {
    const space = getSpace(spaceId);

    const result = await HTTP.post(
      appName,
      space
        ? `/v1/link-groups/${groupId}/unshare-links?spaceId=${space.sortKey}`
        : `/v1/link-groups/${groupId}/unshare-links`,
      {}
    );

    const updated = space ? { ...result, encryptedPassword: space.encryptedPassword } : result;

    return await decryptGroup(updated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteGroup(groupId, spaceId) {
  try {
    const space = getSpace(spaceId);

    const data = await HTTP.delete(
      appName,
      space ? `/v1/link-groups/${groupId}?spaceId=${spaceId}` : `/v1/link-groups/${groupId}`
    );

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
