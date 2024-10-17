import { generateSpaceSortKey } from '../../lib/generateSortKey';
import { LocalStorage } from '../../lib/LocalStorage';
import { HTTP } from '../../shared/browser/HTTP';
import { appName } from '../../shared/browser/initShared';
import { sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import { encryptMessageAsymmetric, encryptMessageSymmetric } from '../../shared/js/encryption';
import { generatePassword } from '../../shared/js/generatePassword';
import { orderByPosition } from '../../shared/js/position';
import { encryptMessageWithEncryptedPassword } from '../note/noteNetwork';
import { decryptSpace } from '../worker/workerHelpers';

export async function fetchSpaces() {
  try {
    const spaces = await HTTP.get(appName, `/v1/spaces`);
    const sorted = orderByPosition(spaces, true);

    return {
      data: sorted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchSpace(spaceId) {
  try {
    const space = await HTTP.get(appName, `/v1/spaces/${spaceId}`);
    return await decryptSpace(space, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function createSpace({ title, color }) {
  try {
    const password = generatePassword(20);
    const encryptedPassword = await encryptMessageAsymmetric(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const encryptedTitle = title ? await encryptMessageSymmetric(password, title) : title;

    const timestamp = Date.now();

    const data = await HTTP.post(appName, `/v1/spaces`, {
      sortKey: generateSpaceSortKey(timestamp),
      timestamp,
      encryptedPassword,
      title: encryptedTitle,
      color,
    });

    return await decryptSpace(data, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateSpace(
  spaceId,
  { encryptedPassword, title, position, color, archived }
) {
  try {
    const encryptedTitle = await encryptMessageWithEncryptedPassword(encryptedPassword, title);

    const data = await HTTP.put(appName, `/v1/spaces/${spaceId}`, {
      title: encryptedTitle,
      position,
      color,
      archived,
    });

    return await decryptSpace(data, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteSpace(spaceId) {
  try {
    const data = await HTTP.delete(appName, `/v1/spaces/${spaceId}`);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
