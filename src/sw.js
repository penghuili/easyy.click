import { truncateString } from '../extension/lib/truncateString';
import { extractLinks } from './lib/extractLinks';
import { generateLinkSortKey, generateNoteSortKey } from './lib/generateSortKey';
import { eventEmitter, eventEmitterEvents } from './shared/browser/eventEmitter';
import { idbStorage } from './shared/browser/indexDB';
import { sharedLocalStorageKeys } from './shared/browser/LocalStorage';
import { accessTokenThreshold } from './shared/js/constants';
import { encryptMessageAsymmetric, encryptMessageSymmetric } from './shared/js/encryption';
import { generatePassword } from './shared/js/generatePassword';
import { inboxSpaceId } from './store/space/spaceCats';

const api = 'https://api.peng37.com/easyy';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {});

self.addEventListener('fetch', event => {
  if (event.request.method === 'POST' && event.request.url.includes('/easyy-share')) {
    event.respondWith(handleShare(event.request));
  }
});

async function handleShare(request) {
  const formData = await request.formData();
  const title = formData.get('title');
  const content = formData.get('url') || formData.get('text');

  if (!content) {
    return Response.redirect('/shared', 303);
  }

  saveContent(title, content);

  const link = extractLinks(content)[0];
  return Response.redirect(`/shared?shared=${link ? 'link' : 'text'}`, 303);
}

async function saveContent(title, content) {
  const link = extractLinks(content)[0];
  if (link) {
    let linkTitle = title;
    if (!linkTitle) {
      const { data: pageInfo } = await getPageInfo(link);
      linkTitle = pageInfo?.title || new URL(link).hostname;
    }
    await createLink({ title: linkTitle, link });
  } else {
    await createNote({ title: title || truncateString(content, 25), text: content });
  }
}

async function getPageInfo(link) {
  try {
    const data = await post(`/v1/link-info`, { link });

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function createLink({ title, link }) {
  try {
    const timestamp = Date.now();
    const payload = await encryptLink({ link, title, timestamp });

    const data = await post(`/v1/links?spaceId=${inboxSpaceId}`, payload);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function encryptLink({ link, title, timestamp }) {
  const password = generatePassword(20);
  const publicKey = await idbStorage.getItem(sharedLocalStorageKeys.publicKey);
  const encryptedPassword = await encryptMessageAsymmetric(publicKey, password);

  const encryptedTitle = title ? await encryptMessageSymmetric(password, title) : title;
  const encryptedLink = link ? await encryptMessageSymmetric(password, link) : link;

  return {
    sortKey: generateLinkSortKey(timestamp),
    timestamp,
    encryptedPassword,
    title: encryptedTitle,
    link: encryptedLink,
    shared: true,
  };
}

async function createNote({ title, text, fromUrl }) {
  try {
    const timestamp = Date.now();
    const payload = await encryptNote({ text, title, fromUrl, timestamp });

    const data = await post(`/v1/notes?spaceId=${inboxSpaceId}`, payload);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function encryptNote({ text, title, timestamp }) {
  const password = generatePassword(20);
  const publicKey = await idbStorage.getItem(sharedLocalStorageKeys.publicKey);
  const encryptedPassword = await encryptMessageAsymmetric(publicKey, password);

  const encryptedTitle = title ? await encryptMessageSymmetric(password, title) : title;
  const encryptedText = text ? await encryptMessageSymmetric(password, text) : text;

  return {
    sortKey: generateNoteSortKey(timestamp),
    timestamp,
    encryptedPassword,
    title: encryptedTitle,
    text: encryptedText,
    shared: true,
  };
}

async function post(path, body, headers = {}) {
  await refreshTokenIfNecessary();
  const accessToken = await idbStorage.getItem(sharedLocalStorageKeys.accessToken);
  const response = await fetch(getFullUrl(api, path), {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw response;
  return await response.json();
}

let isRefreshing = false;
async function refreshTokenIfNecessary() {
  if (isRefreshing) {
    await waitForRefresh();
    return;
  }

  const accessToken = await idbStorage.getItem(sharedLocalStorageKeys.accessToken);
  const refreshToken = await idbStorage.getItem(sharedLocalStorageKeys.refreshToken);
  const expiresAt = await idbStorage.getItem(sharedLocalStorageKeys.accessTokenExpiresAt);
  if (!refreshToken || !accessToken || !expiresAt) {
    throw { response: { status: 401 } };
  }

  if (expiresAt > Date.now()) {
    return;
  }

  isRefreshing = true;
  const data = await publicPost(`/v1/user/sign-in/refresh`, {
    refreshToken,
  });

  await idbStorage.setItem(sharedLocalStorageKeys.accessToken, data.accessToken);
  await idbStorage.setItem(sharedLocalStorageKeys.refreshToken, data.refreshToken);
  const newExpiresAt = Date.now() + (data.expiresIn - accessTokenThreshold) * 1000;
  await idbStorage.setItem(sharedLocalStorageKeys.accessTokenExpiresAt, newExpiresAt);

  isRefreshing = false;
  eventEmitter.emit(eventEmitterEvents.refreshed);
}

async function waitForRefresh() {
  await eventEmitter.once(eventEmitterEvents.refreshed);
}

async function publicPost(path, body) {
  const response = await fetch(getFullUrl(api, path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw response;
  return await response.json();
}

function getFullUrl(api, path) {
  return `${api}${path}`;
}
