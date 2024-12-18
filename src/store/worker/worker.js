import { asyncMap } from '../../shared/js/asyncMap';
import { decryptGroup, decryptLink, decryptNote, workerActionTypes } from './workerHelpers';

self.onmessage = async function (event) {
  const { type } = event.data;

  try {
    if (type === workerActionTypes.DECRYPT_LINKS) {
      const { links, spaceId, privateKey, rest } = event.data;

      const decrypted = await decryptLinks(links, privateKey);

      self.postMessage({ type, decryptedItems: decrypted, spaceId, rest });
    } else if (type === workerActionTypes.DECRYPT_INBOX_LINKS) {
      const { links, startKey, newStartKey, privateKey, rest } = event.data;

      const decrypted = await decryptLinks(links, privateKey);

      self.postMessage({ type, decryptedItems: decrypted, startKey, newStartKey, rest });
    } else if (type === workerActionTypes.DECRYPT_NOTES) {
      const { notes, spaceId, privateKey, rest } = event.data;

      const decrypted = await decryptNotes(notes, privateKey);

      self.postMessage({ type, decryptedItems: decrypted, spaceId, rest });
    } else if (type === workerActionTypes.DECRYPT_INBOX_NOTES) {
      const { notes, startKey, newStartKey, privateKey, rest } = event.data;

      const decrypted = await decryptNotes(notes, privateKey);

      self.postMessage({ type, decryptedItems: decrypted, startKey, newStartKey, rest });
    } else if (type === workerActionTypes.DECRYPT_GROUPS) {
      const { groups, spaceId, privateKey } = event.data;

      const decrypted = await decryptGroups(groups, privateKey);

      self.postMessage({ type, decryptedItems: decrypted, spaceId });
    } else if (type === workerActionTypes.DECRYPT_SPACES) {
      const { spaces, privateKey } = event.data;

      const decrypted = await decryptSpaces(spaces, privateKey);

      self.postMessage({ type, decryptedItems: decrypted });
    }
  } catch (error) {
    console.log(error);
  }
};

async function decryptLinks(links, privateKey) {
  const results = await asyncMap(links, async link => {
    const { data } = await decryptLink(link, privateKey);
    return data;
  });
  return results.filter(Boolean);
}

async function decryptNotes(notes, privateKey) {
  const results = await asyncMap(notes, async note => {
    const { data } = await decryptNote(note, privateKey);
    return data;
  });

  return results.filter(Boolean);
}

async function decryptGroups(groups, privateKey) {
  const results = await asyncMap(groups, async group => {
    const { data } = await decryptGroup(group, privateKey);
    return data;
  });
  return results.filter(Boolean);
}

async function decryptSpaces(spaces, privateKey) {
  const results = await asyncMap(spaces, async space => {
    const { data } = await decryptGroup(space, privateKey);
    return data;
  });

  return results.filter(Boolean);
}
