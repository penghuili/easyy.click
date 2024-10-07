import { localStorageKeys } from '../../lib/constants';
import { LocalStorage } from '../../lib/LocalStorage';
import { groupsCat, isLoadingGroupsCat } from '../group/groupCats';
import { isLoadingLinksCat, linksCat } from '../link/linkCats';
import { isLoadingNotesCat, notesCat } from '../note/noteCats';
import { workerActionTypes } from './workerHelpers';

export const myWorker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
});

myWorker.onmessage = event => {
  const { type } = event.data;
  if (type === workerActionTypes.DECRYPT_LINKS) {
    const { decryptedItems } = event.data;

    linksCat.set(decryptedItems);
    LocalStorage.set(localStorageKeys.links, decryptedItems);
    isLoadingLinksCat.set(false);
  } else if (type === workerActionTypes.DECRYPT_LINK_GROUPS) {
    const { decryptedItems } = event.data;

    groupsCat.set(decryptedItems);
    LocalStorage.set(localStorageKeys.groups, decryptedItems);
    isLoadingGroupsCat.set(false);
  } else if (type === workerActionTypes.DECRYPT_NOTES) {
    const { decryptedItems } = event.data;

    notesCat.set(decryptedItems);
    LocalStorage.set(localStorageKeys.notes, decryptedItems);
    isLoadingNotesCat.set(false);
  }
};
