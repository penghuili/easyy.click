import {
  createMessage,
  decrypt,
  encrypt,
  generateKey,
  readKey,
  readMessage,
  readPrivateKey,
} from 'openpgp';

function unwrapPublicKey(publicKey) {
  return publicKey.split('PUBLIC KEY BLOCK-----')[1].split('-----END')[0].trim();
}

function wrapPublicKey(publicKey) {
  return `-----BEGIN PGP PUBLIC KEY BLOCK-----
  
${publicKey}
-----END PGP PUBLIC KEY BLOCK-----`;
}

function unwrapPrivateKey(privateKey) {
  return privateKey.split('PRIVATE KEY BLOCK-----')[1].split('-----END')[0].trim();
}

function wrapPrivateKey(privateKey) {
  return `-----BEGIN PGP PRIVATE KEY BLOCK-----

${privateKey}
-----END PGP PRIVATE KEY BLOCK-----`;
}

function unwrapEncryptedMessage(encryptedMessage) {
  return encryptedMessage.split('BEGIN PGP MESSAGE-----')[1].split('-----END')[0].trim();
}

function wrapEncryptedMessage(encryptedMessage) {
  return `-----BEGIN PGP MESSAGE-----

${encryptedMessage}
-----END PGP MESSAGE-----`;
}

export async function generateKeypair(username) {
  const { privateKey, publicKey } = await generateKey({
    type: 'ecc',
    curve: 'curve25519',
    format: 'armored',
    userIDs: [{ name: username }],
  });

  return { publicKey: unwrapPublicKey(publicKey), privateKey: unwrapPrivateKey(privateKey) };
}

export async function encryptMessageAsymmetric(publicKey, message) {
  const wrappedPublicKey = wrapPublicKey(publicKey);
  const publicKeyObj = await readKey({
    armoredKey: wrappedPublicKey,
  });

  const wrappedMessage = await createMessage({ text: message });
  const encryptedMessage = await encrypt({
    message: wrappedMessage,
    encryptionKeys: publicKeyObj,
  });

  return unwrapEncryptedMessage(encryptedMessage);
}

export async function decryptMessageAsymmetric(privateKey, encryptedMessage) {
  const wrappedMessage = wrapEncryptedMessage(encryptedMessage);
  const messageObj = await readMessage({ armoredMessage: wrappedMessage });
  const wrappedPrivateKey = wrapPrivateKey(privateKey);
  const privateKeyObj = await readPrivateKey({ armoredKey: wrappedPrivateKey });

  const decryptedMessage = await decrypt({
    message: messageObj,
    decryptionKeys: privateKeyObj,
  });

  return decryptedMessage.data;
}

export async function encryptMessageSymmetric(password, message) {
  const wrappedMessage = await createMessage({ text: message });
  const encryptedMessage = await encrypt({
    message: wrappedMessage,
    passwords: [password],
  });

  return unwrapEncryptedMessage(encryptedMessage);
}

export async function decryptMessageSymmetric(password, encryptedMessage) {
  const wrappedMessage = wrapEncryptedMessage(encryptedMessage);
  const messageObj = await readMessage({ armoredMessage: wrappedMessage });
  const decryptedMessage = await decrypt({
    message: messageObj,
    passwords: [password],
  });

  return decryptedMessage.data;
}

export const CHUNK_SIZE = 1024 * 1024 * 10;

export async function encryptFileSymmetric(password, unit8Array) {
  const message = await createMessage({ binary: unit8Array });
  const encryptedUnit8Array = await encrypt({
    message,
    passwords: [password],
    format: 'binary',
  });

  return encryptedUnit8Array;
}

export async function decryptFileSymmetric(password, unit8Array) {
  const message = await readMessage({ binaryMessage: unit8Array });
  const decrypted = await decrypt({
    message,
    passwords: [password],
    format: 'binary',
  });

  return decrypted.data;
}

export async function encryptFileAsymmetric(publicKey, unit8Array) {
  const wrappedPublicKey = wrapPublicKey(publicKey);
  const publicKeyObj = await readKey({
    armoredKey: wrappedPublicKey,
  });

  const message = await createMessage({ binary: unit8Array });
  const encryptedUnit8Array = await encrypt({
    message,
    encryptionKeys: publicKeyObj,
    format: 'binary',
  });

  return encryptedUnit8Array;
}

export async function decryptFileAsymmetric(privateKey, unit8Array) {
  const wrappedPrivateKey = wrapPrivateKey(privateKey);
  const privateKeyObj = await readPrivateKey({ armoredKey: wrappedPrivateKey });

  const message = await readMessage({ binaryMessage: unit8Array });
  const decrypted = await decrypt({
    message,
    decryptionKeys: privateKeyObj,
    format: 'binary',
  });

  return decrypted.data;
}
