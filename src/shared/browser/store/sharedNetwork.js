import { jwtDecode } from 'jwt-decode';

import { accessTokenThreshold } from '../../js/constants';
import {
  decryptMessageAsymmetric,
  decryptMessageSymmetric,
  encryptMessageSymmetric,
  generateKeypair,
} from '../../js/encryption';
import { lowercaseAndTrim } from '../../js/lowercaseAndTrim';
import { HTTP } from '../HTTP';
import { appName } from '../initShared';
import { LocalStorage, sharedLocalStorageKeys } from '../LocalStorage';

export function checkRefreshToken() {
  const expiresAt = LocalStorage.get(sharedLocalStorageKeys.accessTokenExpiresAt);
  const refreshTokenInStore = LocalStorage.get(sharedLocalStorageKeys.refreshToken);
  const accessTokenInStore = LocalStorage.get(sharedLocalStorageKeys.accessToken);

  if (!refreshTokenInStore || !accessTokenInStore || !expiresAt) {
    return { isValid: false };
  }

  try {
    const decoded = jwtDecode(refreshTokenInStore);

    return { isValid: decoded.exp * 1000 - accessTokenThreshold * 1000 > Date.now() };
  } catch (error) {
    return { isValid: false };
  }
}

export async function signUp(email, password) {
  try {
    const updatedEmail = lowercaseAndTrim(email);

    const { publicKey, privateKey } = await generateKeypair(updatedEmail);
    const encryptedPrivateKey = await encryptMessageSymmetric(password, privateKey);

    const tokens = await HTTP.publicPost(appName, `/v1/user/sign-up`, {
      email: updatedEmail,
      publicKey,
      encryptedPrivateKey,
      app: appName,
    });

    LocalStorage.saveTokens({ ...tokens, publicKey, privateKey });

    return { data: { id: tokens.id, tempToken: tokens.tempToken }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function resendVerificationCode() {
  try {
    const user = await HTTP.post(appName, `/v1/user/me/resend-verification`, {});

    LocalStorage.set(`${appName}-account`, user);

    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function verifyEmail(code) {
  try {
    const user = await HTTP.post(appName, `/v1/user/me/verify-email`, { code });

    LocalStorage.set(`${appName}-account`, user);

    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function signIn(email, password) {
  try {
    const updatedEmail = lowercaseAndTrim(email);

    const { publicKey, encryptedPrivateKey, encryptedChallenge } = await HTTP.publicPost(
      appName,
      `/v1/user/me-public`,
      { email: updatedEmail }
    );
    const privateKey = await decryptMessageSymmetric(password, encryptedPrivateKey);
    const challenge = await decryptMessageAsymmetric(privateKey, encryptedChallenge);
    const tokens = await HTTP.publicPost(appName, `/v1/user/sign-in`, {
      email: updatedEmail,
      signinChallenge: challenge,
    });

    LocalStorage.saveTokens({ ...tokens, publicKey, privateKey });

    return { data: { id: tokens.id, tempToken: tokens.tempToken }, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export async function verify2FA(code) {
  try {
    const tempToken = LocalStorage.get(sharedLocalStorageKeys.tempToken);

    const { id, accessToken, refreshToken, expiresIn } = await HTTP.publicPost(
      appName,
      `/v1/user/sign-in/2fa`,
      {
        tempToken,
        code,
      }
    );

    LocalStorage.saveTokens({ accessToken, refreshToken, expiresIn });
    LocalStorage.remove(sharedLocalStorageKeys.tempToken);

    return { data: { id }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function logoutFromAllDevices() {
  try {
    await HTTP.post(appName, `/v1/user/log-out-all`);

    LocalStorage.resetTokens();

    return { data: { success: true }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchAccount() {
  try {
    const {
      id,
      email,
      backendPublicKey,
      twoFactorEnabled,
      twoFactorChecked,
      twoFactorUri,
      verified,
      createdAt,
      updatedAt,
    } = await HTTP.get(appName, `/v1/user/me`);

    const decryptedTwoFactorUri = twoFactorUri
      ? await decryptMessageAsymmetric(
          LocalStorage.get(sharedLocalStorageKeys.privateKey),
          twoFactorUri
        )
      : twoFactorUri;

    const data = {
      id,
      email,
      twoFactorChecked,
      twoFactorEnabled,
      twoFactorUri: decryptedTwoFactorUri,
      verified,
      createdAt,
      updatedAt,
      botPublicKey: JSON.parse(`"${backendPublicKey}"`),
    };

    LocalStorage.set(`${appName}-account`, data);

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function skip2FA() {
  try {
    const user = await HTTP.post(appName, `/v1/user/2fa/skip`, {});

    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function generate2FASecret() {
  try {
    const { uri } = await HTTP.post(appName, `/v1/user/2fa/secret`, {});

    return { data: { uri }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function enable2FA(code) {
  try {
    const user = await HTTP.post(appName, `/v1/user/2fa/enable`, { code });

    LocalStorage.set(`${appName}-account`, user);

    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function disable2FA(code) {
  try {
    const user = await HTTP.post(appName, `/v1/user/2fa/disable`, { code });

    LocalStorage.set(`${appName}-account`, user);

    return { data: user, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function deleteAccount() {
  try {
    await HTTP.delete(appName, `/v1/user/me`);

    return { data: { success: true }, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export async function changeEmailTrigger(email) {
  try {
    const updatedEmail = lowercaseAndTrim(email);
    const result = await HTTP.post(appName, `/v1/user/me/email/trigger`, {
      email: updatedEmail,
    });

    return { data: result, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export async function changeEmail(email, code) {
  try {
    const updatedEmail = lowercaseAndTrim(email);
    const updatedUser = await HTTP.post(appName, `/v1/user/me/email`, {
      email: updatedEmail,
      code: (code || '').trim(),
    });

    LocalStorage.set(`${appName}-account`, updatedUser);

    return { data: updatedUser, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export async function changePassword(email, currentPassword, newPassword) {
  try {
    const updatedEmail = lowercaseAndTrim(email);
    const { encryptedPrivateKey, encryptedChallenge } = await HTTP.publicPost(
      appName,
      `/v1/user/me-public`,
      {
        email: updatedEmail,
      }
    );
    const privateKey = await decryptMessageSymmetric(currentPassword, encryptedPrivateKey);
    const challenge = await decryptMessageAsymmetric(privateKey, encryptedChallenge);
    const updatedEncryptedPrivateKey = await encryptMessageSymmetric(newPassword, privateKey);
    const updatedUser = await HTTP.post(appName, `/v1/user/me/password`, {
      encryptedPrivateKey: updatedEncryptedPrivateKey,
      signinChallenge: challenge,
    });

    LocalStorage.set(`${appName}-account`, updatedUser);

    return { data: updatedUser, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export async function resetPasswordTrigger(email) {
  try {
    const updatedEmail = lowercaseAndTrim(email);
    const result = await HTTP.publicPost(appName, `/v1/user/password-reset/trigger`, {
      email: updatedEmail,
    });

    return { data: result, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error };
  }
}

export async function resetPasswordSave(email, password, code) {
  try {
    const updatedEmail = lowercaseAndTrim(email);

    const { publicKey, privateKey } = await generateKeypair(updatedEmail);
    const encryptedPrivateKey = await encryptMessageSymmetric(password, privateKey);

    const result = await HTTP.publicPost(appName, `/v1/user/password-reset/save`, {
      email: updatedEmail,
      code,
      publicKey,
      encryptedPrivateKey,
    });

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchSettings() {
  try {
    const settings = await HTTP.get(appName, `/v1/settings`);

    return { data: settings, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function fetchChangeLog() {
  try {
    const versions = await HTTP.publicGet(appName, `/v1/changelog`);

    return { data: versions, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function usedPasswordManager() {
  try {
    const data = await HTTP.put(appName, `/v1/settings/password-manager`, {});

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
