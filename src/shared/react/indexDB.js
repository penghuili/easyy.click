import { clear, del, delMany, get, keys, set } from 'idb-keyval';

export const idbStorage = {
  getItem(key) {
    try {
      return get(key);
    } catch (error) {
      return null;
    }
  },
  setItem(key, value) {
    try {
      return set(key, value);
    } catch (error) {
      return null;
    }
  },
  removeItem(key) {
    try {
      return del(key);
    } catch (error) {
      return null;
    }
  },
  removeItems(keys) {
    try {
      return delMany(keys);
    } catch (error) {
      return null;
    }
  },
  getKeys() {
    try {
      return keys();
    } catch (error) {
      return null;
    }
  },
  clear() {
    try {
      return clear();
    } catch (error) {
      return null;
    }
  },
};
