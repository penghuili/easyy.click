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
  const results = await Promise.all(links.map(link => decryptLink(link, privateKey)));
  return results.map(r => r.data).filter(Boolean);
}

async function decryptNotes(notes, privateKey) {
  const results = await Promise.all(notes.map(note => decryptNote(note, privateKey)));
  return results.map(r => r.data).filter(Boolean);
}

async function decryptGroups(groups, privateKey) {
  const results = await Promise.all(groups.map(group => decryptGroup(group, privateKey)));
  return results.map(r => r.data).filter(Boolean);
}

async function decryptSpaces(spaces, privateKey) {
  const results = await Promise.all(spaces.map(space => decryptGroup(space, privateKey)));
  return results.map(r => r.data).filter(Boolean);
}
