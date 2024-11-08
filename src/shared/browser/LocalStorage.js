import { accessTokenThreshold } from '../js/constants';
import { idbStorage } from './indexDB';

export const sharedLocalStorageKeys = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  accessTokenExpiresAt: 'accessTokenExpiresAt',
  tempToken: 'tempToken',
  publicKey: 'publicKey',
  privateKey: 'privateKey',

  themeMode: 'settings-themeMode',
  fontScaling: 'settings-fontScaling',
  isTWA: 'settings-twa',
};

export const LocalStorage = {
  get(key) {
    return JSON.parse(localStorage.getItem(key));
  },
  set(key, value) {
    if (typeof value === 'undefined') {
      localStorage.setItem(key, JSON.stringify(null));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear(prefix) {
    if (!prefix) {
      localStorage.clear();
    } else {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    }
  },

  resetTokens() {
    LocalStorage.remove(sharedLocalStorageKeys.accessToken);
    LocalStorage.remove(sharedLocalStorageKeys.refreshToken);
    LocalStorage.remove(sharedLocalStorageKeys.accessTokenExpiresAt);
    LocalStorage.remove(sharedLocalStorageKeys.publicKey);
    LocalStorage.remove(sharedLocalStorageKeys.privateKey);

    idbStorage.removeItems([
      sharedLocalStorageKeys.accessToken,
      sharedLocalStorageKeys.refreshToken,
      sharedLocalStorageKeys.accessTokenExpiresAt,
      sharedLocalStorageKeys.publicKey,
      sharedLocalStorageKeys.privateKey,
    ]);
  },
  saveTokens({ accessToken, refreshToken, expiresIn, tempToken, publicKey, privateKey }) {
    LocalStorage.set(sharedLocalStorageKeys.accessToken, accessToken);
    LocalStorage.set(sharedLocalStorageKeys.refreshToken, refreshToken);
    const expiresAt = Date.now() + (expiresIn - accessTokenThreshold) * 1000;
    LocalStorage.set(sharedLocalStorageKeys.accessTokenExpiresAt, expiresAt);

    idbStorage.setItem(sharedLocalStorageKeys.accessToken, accessToken);
    idbStorage.setItem(sharedLocalStorageKeys.refreshToken, refreshToken);
    idbStorage.setItem(sharedLocalStorageKeys.accessTokenExpiresAt, expiresAt);

    LocalStorage.set(sharedLocalStorageKeys.tempToken, tempToken);

    if (publicKey && privateKey) {
      LocalStorage.set(sharedLocalStorageKeys.publicKey, publicKey);
      LocalStorage.set(sharedLocalStorageKeys.privateKey, privateKey);
    }

    const savedPublicKey = LocalStorage.get(sharedLocalStorageKeys.publicKey);
    const savedPrivateKey = LocalStorage.get(sharedLocalStorageKeys.privateKey);
    if (savedPublicKey && savedPrivateKey) {
      idbStorage.setItem(sharedLocalStorageKeys.publicKey, savedPublicKey);
      idbStorage.setItem(sharedLocalStorageKeys.privateKey, savedPrivateKey);
    }
  },
};
