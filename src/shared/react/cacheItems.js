import { idbStorage } from './indexDB';

export function createItemsCache(prefix) {
  const value = {
    getCacheItemsKey: () => {
      return `${prefix}-items-cache`;
    },
    getCachedItems: async () => {
      const key = value.getCacheItemsKey();
      const items = await idbStorage.getItem(key);
      return items;
    },
    cacheItems: async items => {
      const key = value.getCacheItemsKey();
      await idbStorage.setItem(key, items);
    },
    deleteCachedItems: async () => {
      const key = value.getCacheItemsKey();
      await idbStorage.removeItem(key);
    },

    getCacheItemKey: itemId => {
      return `${prefix}-item-cache-${itemId}`;
    },
    cacheItem: async (itemId, item) => {
      const key = value.getCacheItemKey(itemId);
      await idbStorage.setItem(key, item);
    },
    getCachedItem: async itemId => {
      const key = value.getCacheItemKey(itemId);
      const item = await idbStorage.getItem(key);
      return item;
    },
    deleteCachedItem: async itemId => {
      const key = value.getCacheItemKey(itemId);
      await idbStorage.removeItem(key);
    },
  };

  return value;
}
