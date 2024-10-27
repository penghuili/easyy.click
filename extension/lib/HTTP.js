import { EventEmitter, eventEmitterEvents } from './eventEmitter.js';
import { extStorage, storageKeys } from './storage.js';

const apiUrl = 'https://api.peng37.com/easyy';

const eventEmitter = new EventEmitter();

function getFullUrl(path) {
  return `${apiUrl}${path}`;
}

let isRefreshing = false;

export const HTTP = {
  async publicGet(path) {
    try {
      const response = await fetch(getFullUrl(path));
      if (!response.ok) throw response;
      return await response.json();
    } catch (error) {
      throw await HTTP.handleError(error);
    }
  },
  async publicPost(path, body) {
    try {
      const response = await fetch(getFullUrl(path), {
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
  async publicPut(path, body) {
    try {
      const response = await fetch(getFullUrl(path), {
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

  async post(path, body, headers = {}) {
    try {
      await HTTP.refreshTokenIfNecessary();
      const accessToken = await extStorage.get(storageKeys.accessToken);
      const response = await fetch(getFullUrl(path), {
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
  async get(path) {
    try {
      await HTTP.refreshTokenIfNecessary();
      const accessToken = await extStorage.get(storageKeys.accessToken);
      const response = await fetch(getFullUrl(path), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) throw response;
      return await response.json();
    } catch (error) {
      throw await HTTP.handleError(error);
    }
  },
  async put(path, body) {
    try {
      await HTTP.refreshTokenIfNecessary();
      const accessToken = await extStorage.get(storageKeys.accessToken);
      const response = await fetch(getFullUrl(path), {
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
  async delete(path) {
    try {
      await HTTP.refreshTokenIfNecessary();
      const accessToken = await extStorage.get(storageKeys.accessToken);
      const response = await fetch(getFullUrl(path), {
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
    const status = error.status;
    const errorCode = await error.json();
    if (status === 401) {
      await extStorage.resetTokens();
    }

    return { status, errorCode };
  },

  async refreshTokenIfNecessary(validWindow = 0) {
    if (isRefreshing) {
      await HTTP.waitForRefresh();
      return;
    }

    const expiresAt = await extStorage.get(storageKeys.accessTokenExpiresAt);
    const refreshToken = await extStorage.get(storageKeys.refreshToken);
    const accessToken = await extStorage.get(storageKeys.accessToken);
    if (!refreshToken || !accessToken || !expiresAt) {
      throw { response: { status: 401 } };
    }

    if (expiresAt > Date.now() + validWindow) {
      return;
    }

    isRefreshing = true;
    const data = await HTTP.publicPost(`/v1/user/sign-in/refresh`, {
      refreshToken,
    });
    extStorage.saveTokens(data);
    isRefreshing = false;
    eventEmitter.emit(eventEmitterEvents.refreshed);
  },

  async waitForRefresh() {
    await eventEmitter.once(eventEmitterEvents.refreshed);
  },
};
