import browser from 'webextension-polyfill';

import { accessTokenThreshold } from '../../src/shared/js/constants';

export const storageKeys = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  accessTokenExpiresAt: 'accessTokenExpiresAt',
  publicKey: 'publicKey',
  privateKey: 'privateKey',
  loggedIn: 'loggedIn',
};

export const extStorage = {
  get: async key => {
    try {
      const result = await browser.storage.local.get(key);
      return result[key];
    } catch (error) {
      return null;
    }
  },
  set: async (key, value) => {
    try {
      return await browser.storage.local.set({ [key]: value });
    } catch (error) {
      return null;
    }
  },
  remove: async key => {
    try {
      return await browser.storage.local.remove(key);
    } catch (error) {
      return null;
    }
  },

  saveTokens: async ({ accessToken, refreshToken, expiresIn, publicKey, privateKey }) => {
    await extStorage.set(storageKeys.accessToken, accessToken);
    await extStorage.set(storageKeys.refreshToken, refreshToken);
    await extStorage.set(
      storageKeys.accessTokenExpiresAt,
      Date.now() + (expiresIn - accessTokenThreshold) * 1000
    );
    if (publicKey && privateKey) {
      await extStorage.set(storageKeys.publicKey, publicKey);
      await extStorage.set(storageKeys.privateKey, privateKey);
    }
  },
  resetTokens: async () => {
    await extStorage.remove(storageKeys.accessToken);
    await extStorage.remove(storageKeys.refreshToken);
    await extStorage.remove(storageKeys.accessTokenExpiresAt);
    await extStorage.remove(storageKeys.publicKey);
    await extStorage.remove(storageKeys.privateKey);
    await extStorage.remove(storageKeys.loggedIn);
  },
};
