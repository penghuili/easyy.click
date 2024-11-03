import { generateLinkSortKey } from '../../lib/generateSortKey';
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
import { encryptMessageWithEncryptedPassword } from '../note/noteNetwork';
import { getSpace, hasSpacePassword } from '../space/spaceCats';
import { decryptLink } from '../worker/workerHelpers';

export async function fetchLinks(spaceId) {
  try {
    const space = getSpace(spaceId);

    const links = await HTTP.get(
      appName,
      space ? `/v1/links?spaceId=${space.sortKey}` : `/v1/links`
    );

    return {
      data: hasSpacePassword(space)
        ? links.map(item => ({ ...item, encryptedPassword: space.encryptedPassword }))
        : links,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchInboxLinks(startKey) {
  try {
    const data = await HTTP.get(
      appName,
      startKey ? `/v1/links-inbox?startKey=${startKey}` : `/v1/links-inbox`
    );

    return { data, error: null };
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

    const uppdated = hasSpacePassword(space)
      ? { ...link, encryptedPassword: space.encryptedPassword }
      : link;

    return await decryptLink(uppdated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

async function encryptLink({ link, title, fromUrl, groupId, count, timestamp }, space) {
  let password;
  let encryptedPassword;
  if (hasSpacePassword(space)) {
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
  const encryptedFromUrl = fromUrl ? await encryptMessageSymmetric(password, fromUrl) : fromUrl;

  return {
    sortKey: generateLinkSortKey(timestamp),
    timestamp,
    encryptedPassword,
    title: encryptedTitle,
    link: encryptedLink,
    fromUrl: encryptedFromUrl,
    count,
    groupId,
  };
}

export async function createLink({ title, link, fromUrl, count, groupId, moved }, spaceId) {
  try {
    const space = getSpace(spaceId);

    const timestamp = Date.now();
    const payload = await encryptLink({ link, title, fromUrl, groupId, count, timestamp }, space);

    const data = await HTTP.post(
      appName,
      space ? `/v1/links?spaceId=${space.sortKey}` : `/v1/links`,
      { ...payload, moved }
    );

    const updated = hasSpacePassword(space)
      ? { ...data, encryptedPassword: space.encryptedPassword }
      : data;

    return await decryptLink(updated, LocalStorage.get(sharedLocalStorageKeys.privateKey));
  } catch (error) {
    return { data: null, error };
  }
}

export async function createLinks({ links, moved, imported }, spaceId) {
  try {
    const space = getSpace(spaceId);

    const timestamp = Date.now();

    const encryptedLinks = await asyncMap(
      links,
      async ({ title, link, fromUrl, count, groupId }, index) => {
        return await encryptLink(
          { link, title, fromUrl, groupId, count, timestamp: timestamp + index },
          space
        );
      }
    );

    let created = [];
    for (let i = 0; i < encryptedLinks.length; i += 50) {
      const data = await HTTP.post(
        appName,
        space ? `/v1/links-bulk?spaceId=${space.sortKey}` : `/v1/links-bulk`,
        { links: encryptedLinks.slice(i, i + 50), moved, imported }
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
      const { data } = await decryptLink(item, LocalStorage.get(sharedLocalStorageKeys.privateKey));
      return data;
    });

    return { data: decrypted.filter(Boolean), error: null };
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

    const updated = hasSpacePassword(space)
      ? { ...data, encryptedPassword: space.encryptedPassword }
      : data;

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

export async function deleteLinks(linkIds, spaceId) {
  try {
    const space = getSpace(spaceId);

    for (let i = 0; i < linkIds.length; i += 50) {
      await HTTP.post(
        appName,
        space ? `/v1/links-delete-bulk?spaceId=${spaceId}` : `/v1/links-delete-bulk`,
        { linkIds: linkIds.slice(i, i + 50) }
      );
    }

    return { data: linkIds, error: null };
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
