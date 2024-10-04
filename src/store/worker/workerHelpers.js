import { decryptMessageAsymmetric, decryptMessageSymmetric } from '../../shared/js/encryption';

export const workerActionTypes = {
  DECRYPT_LINKS: 'DECRYPT_LINKS',
  DECRYPT_LINK_GROUPS: 'DECRYPT_LINK_GROUPS',
  DECRYPT_NOTES: 'DECRYPT_NOTES',
  DECRYPT_NOTE_GROUPS: 'DECRYPT_NOTE_GROUPS',
};

export async function decryptLink(link, privateKey) {
  const decryptedPassword = await decryptMessageAsymmetric(privateKey, link.encryptedPassword);

  const decryptedTitle = link.title
    ? await decryptMessageSymmetric(decryptedPassword, link.title)
    : link.title;
  const decryptedLink = link.link
    ? await decryptMessageSymmetric(decryptedPassword, link.link)
    : link.link;

  return { ...link, title: decryptedTitle, link: decryptedLink };
}

export async function decryptGroup(group, privateKey) {
  const decryptedPassword = await decryptMessageAsymmetric(privateKey, group.encryptedPassword);

  const decryptedTitle = group.title
    ? await decryptMessageSymmetric(decryptedPassword, group.title)
    : group.title;

  return { ...group, title: decryptedTitle };
}

export async function decryptNote(note, privateKey) {
  const decryptedPassword = await decryptMessageAsymmetric(privateKey, note.encryptedPassword);

  const decryptedTitle = note.title
    ? await decryptMessageSymmetric(decryptedPassword, note.title)
    : note.title;
  const decryptedText = note.text
    ? await decryptMessageSymmetric(decryptedPassword, note.text)
    : note.text;

  return { ...note, title: decryptedTitle, text: decryptedText };
}
