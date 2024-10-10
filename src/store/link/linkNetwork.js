import { generateLinkSortKey } from '../../lib/generateSortKey';
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
import { encryptMessageWithEncryptedPassword } from '../note/noteNetwork';
import { getSpace } from '../space/spaceCats';
import { decryptLink } from '../worker/workerHelpers';

export async function fetchLinks(spaceId) {
  try {
    const space = getSpace(spaceId);

    const links = await HTTP.get(
      appName,
      space ? `/v1/links?spaceId=${space.sortKey}` : `/v1/links`
    );

    return {
      data: space
        ? links.map(item => ({ ...item, encryptedPassword: space.encryptedPassword }))
        : links,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchLink(linkId, spaceId) {
  try {
    const space = getSpace(spaceId);

    const link = await HTTP.get(
      appName,
      space ? `/v1/links/${linkId}?spaceId=${space.sortKey}` : `/v1/links/${linkId}`
    );

    const uppdated = space ? { ...link, encryptedPassword: space.encryptedPassword } : link;

    return await decryptLink(uppdated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function createLink({ title, link, groupId }, spaceId) {
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
    const encryptedLink = link ? await encryptMessageSymmetric(password, link) : link;

    const timestamp = Date.now();

    const data = await HTTP.post(
      appName,
      space ? `/v1/links?spaceId=${space.sortKey}` : `/v1/links`,
      {
        sortKey: generateLinkSortKey(timestamp),
        timestamp,
        encryptedPassword,
        title: encryptedTitle,
        link: encryptedLink,
        groupId,
      }
    );

    const updated = space ? { ...data, encryptedPassword: space.encryptedPassword } : data;

    return await decryptLink(updated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function updateLink(
  linkId,
  { encryptedPassword, title, link, groupId, position, count },
  spaceId
) {
  try {
    const space = getSpace(spaceId);

    const updatedEncryptedPassword = space?.encryptedPassword || encryptedPassword;

    const encryptedTitle = await encryptMessageWithEncryptedPassword(
      updatedEncryptedPassword,
      title
    );
    const encryptedLink = await encryptMessageWithEncryptedPassword(updatedEncryptedPassword, link);

    const data = await HTTP.put(
      appName,
      space ? `/v1/links/${linkId}?spaceId=${space.sortKey}` : `/v1/links/${linkId}`,
      {
        title: encryptedTitle,
        link: encryptedLink,
        position,
        groupId,
        count,
      }
    );

    const updated = space ? { ...data, encryptedPassword: space.encryptedPassword } : data;

    return await decryptLink(updated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteLink(linkId, spaceId) {
  try {
    const space = getSpace(spaceId);

    const data = await HTTP.delete(
      appName,
      space ? `/v1/links/${linkId}?spaceId=${spaceId}` : `/v1/links/${linkId}`
    );

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function getPageInfo(link) {
  try {
    const data = await HTTP.post(appName, `/v1/link-info`, { link });

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
