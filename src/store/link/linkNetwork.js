import { generateLinkSortKey } from '../../lib/generateSortKey';
import { LocalStorage } from '../../lib/LocalStorage';
import { HTTP } from '../../shared/browser/HTTP';
import { appName } from '../../shared/browser/initShared';
import { sharedLocalStorageKeys } from '../../shared/browser/LocalStorage';
import { encryptMessageAsymmetric, encryptMessageSymmetric } from '../../shared/js/encryption';
import { generatePassword } from '../../shared/js/generatePassword';
import { orderByPosition } from '../../shared/js/position';
import { encryptMessageWithEncryptedPassword } from '../note/noteNetwork';
import { decryptLink } from '../worker/workerHelpers';

export async function fetchLinks() {
  try {
    const links = await HTTP.get(appName, `/v1/links`);
    const sorted = orderByPosition(links, true);

    return {
      data: sorted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchLink(linkId) {
  try {
    const link = await HTTP.get(appName, `/v1/links/${linkId}`);
    return await decryptLink(link, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function createLink({ title, link, groupId }) {
  try {
    const password = generatePassword(20);
    const encryptedPassword = await encryptMessageAsymmetric(
      LocalStorage.get(sharedLocalStorageKeys.publicKey),
      password
    );
    const encryptedTitle = title ? await encryptMessageSymmetric(password, title) : title;
    const encryptedLink = link ? await encryptMessageSymmetric(password, link) : link;

    const timestamp = Date.now();

    const data = await HTTP.post(appName, `/v1/links`, {
      sortKey: generateLinkSortKey(timestamp),
      timestamp,
      encryptedPassword,
      title: encryptedTitle,
      link: encryptedLink,
      groupId,
    });

    return await decryptLink(data, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateLink(
  linkId,
  { encryptedPassword, title, link, groupId, position, count }
) {
  try {
    const encryptedTitle = await encryptMessageWithEncryptedPassword(encryptedPassword, title);
    const encryptedLink = await encryptMessageWithEncryptedPassword(encryptedPassword, link);

    const data = await HTTP.put(appName, `/v1/links/${linkId}`, {
      title: encryptedTitle,
      link: encryptedLink,
      position,
      groupId,
      count,
    });

    return await decryptLink(data, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteLink(linkId) {
  try {
    const data = await HTTP.delete(appName, `/v1/links/${linkId}`);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
