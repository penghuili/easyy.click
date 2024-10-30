import { generateLinkSortKey } from '../../../src/lib/generateSortKey';
import {
  decryptMessageAsymmetric,
  decryptMessageSymmetric,
  encryptMessageAsymmetric,
  encryptMessageSymmetric,
} from '../../../src/shared/js/encryption';
import { generatePassword } from '../../../src/shared/js/generatePassword';
import { HTTP } from '../../lib/HTTP';
import { extStorage, storageKeys } from '../../lib/storage';

export async function createLink({ title, link, fromUrl }) {
  try {
    const timestamp = Date.now();
    const payload = await encryptLink({ link, title, fromUrl, timestamp });

    const data = await HTTP.post(`/v1/links?spaceId=inbox`, payload);

    const privateKey = await extStorage.get(storageKeys.privateKey);
    return await decryptLink(data, privateKey);
  } catch (error) {
    return { data: null, error };
  }
}

export async function getPageInfo(link) {
  try {
    const data = await HTTP.post(`/v1/link-info`, { link });

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function encryptLink({ link, title, fromUrl, timestamp }) {
  const password = generatePassword(20);
  const publicKey = await extStorage.get(storageKeys.publicKey);
  const encryptedPassword = await encryptMessageAsymmetric(publicKey, password);

  const encryptedTitle = title ? await encryptMessageSymmetric(password, title) : title;
  const encryptedLink = link ? await encryptMessageSymmetric(password, link) : link;
  const encryptedFromUrl = fromUrl ? await encryptMessageSymmetric(password, fromUrl) : fromUrl;

  return {
    sortKey: generateLinkSortKey(timestamp),
    timestamp,
    encryptedPassword,
    title: encryptedTitle,
    link: encryptedLink,
    fromUrl: encryptedFromUrl,
    extension: true,
  };
}

async function decryptLink(link, privateKey) {
  try {
    const decryptedPassword = await decryptMessageAsymmetric(privateKey, link.encryptedPassword);

    const decryptedTitle = link.title
      ? await decryptMessageSymmetric(decryptedPassword, link.title)
      : link.title;
    const decryptedLink = link.link
      ? await decryptMessageSymmetric(decryptedPassword, link.link)
      : link.link;
    const decryptedFromUrl = link.fromUrl
      ? await decryptMessageSymmetric(decryptedPassword, link.fromUrl)
      : link.fromUrl;

    return {
      data: { ...link, title: decryptedTitle, link: decryptedLink, fromUrl: decryptedFromUrl },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}
