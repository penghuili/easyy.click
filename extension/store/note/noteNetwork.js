import { generateNoteSortKey } from '../../../src/lib/generateSortKey';
import {
  decryptMessageAsymmetric,
  decryptMessageSymmetric,
  encryptMessageAsymmetric,
  encryptMessageSymmetric,
} from '../../../src/shared/js/encryption';
import { generatePassword } from '../../../src/shared/js/generatePassword';
import { HTTP } from '../../lib/HTTP';
import { extStorage, storageKeys } from '../../lib/storage';

export async function createNote({ title, text, fromUrl }) {
  try {
    const timestamp = Date.now();
    const payload = await encryptNote({ text, title, fromUrl, timestamp });

    const data = await HTTP.post(`/v1/notes?spaceId=inbox`, payload);

    const privateKey = await extStorage.get(storageKeys.privateKey);
    return await decryptNote(data, privateKey);
  } catch (error) {
    return { data: null, error };
  }
}

async function encryptNote({ text, title, fromUrl, groupId, count, timestamp }) {
  const password = generatePassword(20);
  const publicKey = await extStorage.get(storageKeys.publicKey);
  const encryptedPassword = await encryptMessageAsymmetric(publicKey, password);

  const encryptedTitle = title ? await encryptMessageSymmetric(password, title) : title;
  const encryptedText = text ? await encryptMessageSymmetric(password, text) : text;
  const encryptedFromUrl = fromUrl ? await encryptMessageSymmetric(password, fromUrl) : fromUrl;

  return {
    sortKey: generateNoteSortKey(timestamp),
    timestamp,
    encryptedPassword,
    title: encryptedTitle,
    text: encryptedText,
    count,
    groupId,
    fromUrl: encryptedFromUrl,
    extension: true,
  };
}

async function decryptNote(note, privateKey) {
  try {
    const decryptedPassword = await decryptMessageAsymmetric(privateKey, note.encryptedPassword);

    const decryptedTitle = note.title
      ? await decryptMessageSymmetric(decryptedPassword, note.title)
      : note.title;
    const decryptedText = note.text
      ? await decryptMessageSymmetric(decryptedPassword, note.text)
      : note.text;
    const decryptedFromUrl = note.fromUrl
      ? await decryptMessageSymmetric(decryptedPassword, note.fromUrl)
      : note.fromUrl;

    return {
      data: { ...note, title: decryptedTitle, text: decryptedText, fromUrl: decryptedFromUrl },
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}
