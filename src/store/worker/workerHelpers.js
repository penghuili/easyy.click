import { decryptMessageAsymmetric, decryptMessageSymmetric } from '../../shared/js/encryption';
import { sendError } from '../error/errorNetwork';

export const workerActionTypes = {
  DECRYPT_LINKS: 'DECRYPT_LINKS',
  DECRYPT_GROUPS: 'DECRYPT_GROUPS',
  DECRYPT_NOTES: 'DECRYPT_NOTES',
  DECRYPT_SPACES: 'DECRYPT_SPACES',
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
    const decryptedFromUrl = link.fromUrl
      ? await decryptMessageSymmetric(decryptedPassword, link.fromUrl)
      : link.fromUrl;

    return {
      data: { ...link, title: decryptedTitle, link: decryptedLink, fromUrl: decryptedFromUrl },
      error: null,
    };
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
    const decryptedFromUrl = note.fromUrl
      ? await decryptMessageSymmetric(decryptedPassword, note.fromUrl)
      : note.fromUrl;

    return {
      data: { ...note, title: decryptedTitle, text: decryptedText, fromUrl: decryptedFromUrl },
      error: null,
    };
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

export async function decryptSpace(space, privateKey) {
  try {
    const decryptedPassword = await decryptMessageAsymmetric(privateKey, space.encryptedPassword);

    const decryptedTitle = space.title
      ? await decryptMessageSymmetric(decryptedPassword, space.title)
      : space.title;

    return { data: { ...space, title: decryptedTitle }, error: null };
  } catch (error) {
    sendError({ userId: space?.id, spaceId: space?.sortKey, error });

    return { data: null, error };
  }
}
