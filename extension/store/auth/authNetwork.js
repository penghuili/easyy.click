import { jwtDecode } from 'jwt-decode';

import {
  decryptMessageAsymmetric,
  decryptMessageSymmetric,
} from '../../../src/shared/js/encryption';
import { lowercaseAndTrim } from '../../../src/shared/js/lowercaseAndTrim';
import { HTTP } from '../../lib/HTTP';
import { extStorage, storageKeys } from '../../lib/storage';

export async function checkRefreshToken() {
  const expiresAt = await extStorage.get(storageKeys.accessTokenExpiresAt);
  const refreshTokenInStore = await extStorage.get(storageKeys.refreshToken);
  const accessTokenInStore = await extStorage.get(storageKeys.accessToken);

  if (!refreshTokenInStore || !accessTokenInStore || !expiresAt) {
    return { isValid: false };
  }

  try {
    const decoded = jwtDecode(refreshTokenInStore);

    return { isValid: decoded.exp * 1000 - 5 * 60 * 1000 > Date.now() };
  } catch (error) {
    return { isValid: false };
  }
}

export async function signIn(email, password) {
  try {
    const updatedEmail = lowercaseAndTrim(email);

    const { publicKey, encryptedPrivateKey, encryptedChallenge } = await HTTP.publicPost(
      `/v1/user/me-public`,
      { email: updatedEmail }
    );
    const privateKey = await decryptMessageSymmetric(password, encryptedPrivateKey);
    const challenge = await decryptMessageAsymmetric(privateKey, encryptedChallenge);
    const tokens = await HTTP.publicPost(`/v1/user/sign-in`, {
      email: updatedEmail,
      signinChallenge: challenge,
    });

    extStorage.saveTokens({ ...tokens, publicKey, privateKey });

    return { data: { id: tokens.id, tempToken: tokens.tempToken }, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export async function logout() {
  await extStorage.resetTokens();
}
