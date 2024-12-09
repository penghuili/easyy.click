import { apps } from '../js/apps';
import { eventEmitter, eventEmitterEvents } from './eventEmitter';
import { appName } from './initShared';
import { LocalStorage, sharedLocalStorageKeys } from './LocalStorage';
import { logOutEffect } from './store/logoutEffect.js';
import { setToastEffect, toastTypes } from './Toast.jsx';

const serverToUrl = {
  [apps['easyy.click'].name]: import.meta.env.VITE_EASYY_API_URL,
  [apps['mimiastudio.com'].name]: import.meta.env.VITE_MIMIASTUDIO_API_URL,
  [apps['notenote.cc'].name]: import.meta.env.VITE_SIMPLESTCAM_API_URL,
  [apps['remiind.cc'].name]: import.meta.env.VITE_REMIINDCC_API_URL,
};

function getFullUrl(server, path) {
  return `${serverToUrl[server]}${path}`;
}

let isRefreshing = false;

export const HTTP = {
  async publicGet(server, path) {
    try {
      const response = await fetch(getFullUrl(server, path));
      if (!response.ok) throw response;
      return await response.json();
    } catch (error) {
      throw await HTTP.handleError(error);
    }
  },
  async publicPost(server, path, body) {
    try {
      const response = await fetch(getFullUrl(server, path), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw response;
      return await response.json();
    } catch (error) {
      throw await HTTP.handleError(error);
    }
  },
  async publicPut(server, path, body) {
    try {
      const response = await fetch(getFullUrl(server, path), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw response;
      return await response.json();
    } catch (error) {
      throw await HTTP.handleError(error);
    }
  },

  async post(server, path, body, headers = {}) {
    try {
      await HTTP.refreshTokenIfNecessary(0);
      const accessToken = LocalStorage.get(sharedLocalStorageKeys.accessToken);
      const response = await fetch(getFullUrl(server, path), {
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
    } catch (error) {
      throw await HTTP.handleError(error);
    }
  },
  async get(server, path) {
    try {
      await HTTP.refreshTokenIfNecessary(0);
      const accessToken = LocalStorage.get(sharedLocalStorageKeys.accessToken);
      const response = await fetch(getFullUrl(server, path), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw response;
      return await response.json();
    } catch (error) {
      throw await HTTP.handleError(error);
    }
  },
  async put(server, path, body) {
    try {
      await HTTP.refreshTokenIfNecessary(0);
      const accessToken = LocalStorage.get(sharedLocalStorageKeys.accessToken);
      const response = await fetch(getFullUrl(server, path), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw response;
      return await response.json();
    } catch (error) {
      throw await HTTP.handleError(error);
    }
  },
  async delete(server, path) {
    try {
      await HTTP.refreshTokenIfNecessary(0);
      const accessToken = LocalStorage.get(sharedLocalStorageKeys.accessToken);
      const response = await fetch(getFullUrl(server, path), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw response;
      return await response.json();
    } catch (error) {
      throw await HTTP.handleError(error);
    }
  },

  async handleError(error) {
    const status = error?.status;
    const textErrorCode = await error?.text?.()?.catch(() => null);
    const jsonErrorCode = await error?.json?.()?.catch(() => null);
    const errorCode = textErrorCode || jsonErrorCode;
    if (status === 401) {
      LocalStorage.resetTokens();
      logOutEffect();
    }

    if (status === 403) {
      setToastEffect('You do not have access.', toastTypes.error);
    }

    return { status, errorCode };
  },

  async refreshTokenIfNecessary(validWindow = 0) {
    if (isRefreshing) {
      await HTTP.waitForRefresh();
      return;
    }

    const accessToken = LocalStorage.get(sharedLocalStorageKeys.accessToken);
    const refreshToken = LocalStorage.get(sharedLocalStorageKeys.refreshToken);
    const expiresAt = LocalStorage.get(sharedLocalStorageKeys.accessTokenExpiresAt);
    if (!refreshToken || !accessToken || !expiresAt) {
      throw { status: 401 };
    }

    if (expiresAt > Date.now() + validWindow) {
      return;
    }

    isRefreshing = true;
    const data = await HTTP.publicPost(appName, `/v1/user/sign-in/refresh`, {
      refreshToken,
    });
    LocalStorage.saveTokens(data);
    isRefreshing = false;
    eventEmitter.emit(eventEmitterEvents.refreshed);
  },

  async waitForRefresh() {
    await eventEmitter.once(eventEmitterEvents.refreshed);
  },
};
