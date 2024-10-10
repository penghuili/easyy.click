import { isLoadingGroupsCat } from '../group/groupCats';
import { updateGroupsState } from '../group/groupEffect';
import { isLoadingLinksCat } from '../link/linkCats';
import { updateLinksState } from '../link/linkEffect';
import { isLoadingNotesCat } from '../note/noteCats';
import { updateNotesState } from '../note/noteEffect';
import { isLoadingSpacesCat } from '../space/spaceCats';
import { updateSpacesState } from '../space/spaceEffect';
import { workerActionTypes } from './workerHelpers';

export const myWorker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
});

myWorker.onmessage = event => {
  const { type } = event.data;
  if (type === workerActionTypes.DECRYPT_LINKS) {
    const { decryptedItems, spaceId } = event.data;

    updateLinksState(decryptedItems, 'fetch', spaceId);

    isLoadingLinksCat.set(false);
  } else if (type === workerActionTypes.DECRYPT_NOTES) {
    const { decryptedItems, spaceId } = event.data;

    updateNotesState(decryptedItems, 'fetch', spaceId);

    isLoadingNotesCat.set(false);
  } else if (type === workerActionTypes.DECRYPT_GROUPS) {
    const { decryptedItems, spaceId } = event.data;

    updateGroupsState(decryptedItems, 'fetch', spaceId);

    isLoadingGroupsCat.set(false);
  } else if (type === workerActionTypes.DECRYPT_SPACES) {
    const { decryptedItems } = event.data;

    updateSpacesState(decryptedItems, 'fetch');

    isLoadingSpacesCat.set(false);
  }
};
