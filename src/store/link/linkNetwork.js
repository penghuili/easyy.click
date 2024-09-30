import { generateLinkSortKey } from '../../lib/generateSortKey';
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

export async function fetchLinks() {
  try {
    const links = await HTTP.get(appName, `/v1/links`);
    const decrypted = await Promise.all(
      links.map(async link => {
        return await decryptLink(link);
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

export async function fetchLink(linkId) {
  try {
    const link = await HTTP.get(appName, `/v1/links/${linkId}`);
    const decrypted = await decryptLink(link);

    return {
      data: decrypted,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createLink({ title, link, groupId }) {
  try {
    const password = generatePassword(20, true);
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

    const decrypted = await decryptLink(data);

    return { data: decrypted, error: null };
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

    const decrypted = await decryptLink(data);

    return { data: decrypted, error: null };
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

async function decryptLink(link) {
  const decryptedPassword = await decryptMessageAsymmetric(
    LocalStorage.get(sharedLocalStorageKeys.privateKey),
    link.encryptedPassword
  );

  const decryptedTitle = link.title
    ? await decryptMessageSymmetric(decryptedPassword, link.title)
    : link.title;
  const decryptedLink = link.link
    ? await decryptMessageSymmetric(decryptedPassword, link.link)
    : link.link;

  return { ...link, title: decryptedTitle, link: decryptedLink };
}
