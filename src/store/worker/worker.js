import { asyncForEach } from '../../shared/js/asyncForEach';
import { decryptGroup, decryptLink, decryptNote, workerActionTypes } from './workerHelpers';

self.onmessage = async function (event) {
  const { type } = event.data;

  try {
    if (type === workerActionTypes.DECRYPT_LINKS) {
      const { links, spaceId, privateKey, rest } = event.data;
      const decrypted = await decryptLinks(links, privateKey);
      self.postMessage({ type, decryptedItems: decrypted, spaceId, rest });
    } else if (type === workerActionTypes.DECRYPT_NOTES) {
      const { notes, spaceId, privateKey, rest } = event.data;
      const decrypted = await decryptNotes(notes, privateKey);
      self.postMessage({ type, decryptedItems: decrypted, spaceId, rest });
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
  const results = [];
  await asyncForEach(links, async link => {
    const { data } = await decryptLink(link, privateKey);
    if (data) {
      results.push(data);
    }
  });
  return results;
}

async function decryptNotes(notes, privateKey) {
  const results = [];

  await asyncForEach(notes, async note => {
    const { data } = await decryptNote(note, privateKey);
    if (data) {
      results.push(data);
    }
  });

  return results;
}

async function decryptGroups(groups, privateKey) {
  const results = [];
  await asyncForEach(groups, async group => {
    const { data } = await decryptGroup(group, privateKey);
    if (data) {
      results.push(data);
    }
  });
  return results;
}

async function decryptSpaces(spaces, privateKey) {
  const results = [];
  await asyncForEach(spaces, async space => {
    const { data } = await decryptGroup(space, privateKey);
    if (data) {
      results.push(data);
    }
  });

  return results;
}
