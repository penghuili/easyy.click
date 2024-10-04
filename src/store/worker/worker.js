import { decryptGroup, decryptLink, decryptNote, workerActionTypes } from './workerHelpers';

self.onmessage = async function (event) {
  const { type } = event.data;

  try {
    if (type === workerActionTypes.DECRYPT_LINKS) {
      const { links, privateKey, rest } = event.data;
      const decrypted = await decryptLinks(links, privateKey);
      self.postMessage({ type, decryptedItems: decrypted, rest });
    } else if (type === workerActionTypes.DECRYPT_NOTES) {
      const { notes, privateKey, rest } = event.data;
      const decrypted = await decryptNotes(notes, privateKey);
      self.postMessage({ type, decryptedItems: decrypted, rest });
    } else if (
      type === workerActionTypes.DECRYPT_LINK_GROUPS ||
      type === workerActionTypes.DECRYPT_NOTE_GROUPS
    ) {
      const { groups, privateKey } = event.data;
      const decrypted = await decryptGroups(groups, privateKey);
      self.postMessage({ type, decryptedItems: decrypted });
    }
  } catch (error) {
    console.log(error);
  }
};

async function decryptLinks(links, privateKey) {
  return await Promise.all(links.map(link => decryptLink(link, privateKey)));
}

async function decryptNotes(notes, privateKey) {
  return await Promise.all(notes.map(note => decryptNote(note, privateKey)));
}

async function decryptGroups(groups, privateKey) {
  return await Promise.all(groups.map(group => decryptGroup(group, privateKey)));
}
