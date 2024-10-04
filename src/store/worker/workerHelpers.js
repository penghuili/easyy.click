import { decryptMessageAsymmetric, decryptMessageSymmetric } from '../../shared/js/encryption';
import { sendError } from '../error/errorNetwork';

export const workerActionTypes = {
  DECRYPT_LINKS: 'DECRYPT_LINKS',
  DECRYPT_LINK_GROUPS: 'DECRYPT_LINK_GROUPS',
  DECRYPT_NOTES: 'DECRYPT_NOTES',
  DECRYPT_NOTE_GROUPS: 'DECRYPT_NOTE_GROUPS',
};

export async function decryptLink(link, privateKey) {
  try {
    const decryptedPassword = await decryptMessageAsymmetric(privateKey, link.encryptedPassword);

    const decryptedTitle = link.title
      ? await decryptMessageSymmetric(decryptedPassword, link.title)
      : link.title;
    const decryptedLink = link.link
      ? await decryptMessageSymmetric(decryptedPassword, link.link)
      : link.link;

    return { data: { ...link, title: decryptedTitle, link: decryptedLink }, error: null };
  } catch (error) {
    sendError({ userId: link?.id, linkId: link?.sortKey, error });

    return { data: null, error };
  }
}

export async function decryptNote(note, privateKey) {
  try {
    const decryptedPassword = await decryptMessageAsymmetric(privateKey, note.encryptedPassword);

    const decryptedTitle = note.title
      ? await decryptMessageSymmetric(decryptedPassword, note.title)
      : note.title;
    const decryptedText = note.text
      ? await decryptMessageSymmetric(decryptedPassword, note.text)
      : note.text;

    return { data: { ...note, title: decryptedTitle, text: decryptedText }, error: null };
  } catch (error) {
    sendError({ userId: note?.id, noteId: note?.sortKey, error });

    return { data: null, error };
  }
}

export async function decryptGroup(group, privateKey) {
  try {
    const decryptedPassword = await decryptMessageAsymmetric(privateKey, group.encryptedPassword);

    const decryptedTitle = group.title
      ? await decryptMessageSymmetric(decryptedPassword, group.title)
      : group.title;

    return { data: { ...group, title: decryptedTitle }, error: null };
  } catch (error) {
    sendError({ userId: group?.id, groupId: group?.sortKey, error });

    return { data: null, error };
  }
}
