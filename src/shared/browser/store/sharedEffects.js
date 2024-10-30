import { goBack, navigateTo } from 'react-baby-router';

import { contactEmail } from '../../js/constants.js';
import { isNewer } from '../../js/date';
import { httpErrorCodes } from '../../js/httpErrorCodes';
import { isValidEmail } from '../../js/regex';
import { copyToClipboard } from '../copyToClipboard.js';
import { eventEmitter, eventEmitterEvents } from '../eventEmitter';
import { HTTP } from '../HTTP';
import { idbStorage } from '../indexDB';
import { appName } from '../initShared';
import { LocalStorage } from '../LocalStorage';
import { toastCat, toastTypes } from '../Toast.jsx';
import {
  authErrorCat,
  isChangingEmailCat,
  isChangingPasswordCat,
  isDeletingAccountCat,
  isDisabling2FACat,
  isEnabling2FACat,
  isGenerating2FACat,
  isLoadingAccountCat,
  isLoadingSettingsCat,
  isLoggedInCat,
  isLoggingOutCat,
  isLoggingOutFromAllDevicesCat,
  isResendingVerificationCodeCat,
  isSigningInCat,
  isSigningUpCat,
  isSkipping2FACat,
  isUsingPasswordManagerCat,
  isVerifying2FACat,
  isVerifyingEmailCat,
  settingsCat,
  userCat,
} from './sharedCats';
import {
  changeEmail,
  changePassword,
  checkRefreshToken,
  deleteAccount,
  disable2FA,
  enable2FA,
  fetchAccount,
  fetchSettings,
  generate2FASecret,
  logoutFromAllDevices,
  resendVerificationCode,
  signIn,
  signUp,
  skip2FA,
  usedPasswordManager,
  verify2FA,
  verifyEmail,
} from './sharedNetwork';

export function goBackEffect() {
  goBack();
}

export function setToastEffect(message, type) {
  toastCat.set({
    ...toastCat.get(),
    message,
    type: type || toastTypes.success,
  });
}

export function clearAuthErrorEffect() {
  authErrorCat.set(null);
}

async function handleWindowFocus() {
  try {
    await HTTP.refreshTokenIfNecessary(2 * 60 * 1000);
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

export function initEffect() {
  const { isValid } = checkRefreshToken();
  isLoggedInEffect(isValid);

  window.addEventListener('focus', handleWindowFocus);
}

export async function signUpEffect(email, password) {
  if (email && !isValidEmail(email)) {
    authErrorCat.set('Please use a valid email.');
    return;
  }

  isSigningUpCat.set(true);
  const { error } = await signUp(email, password);

  if (error) {
    if (error.errorCode === httpErrorCodes.NO_USERNAME_OR_EMAIL) {
      authErrorCat.set('Please enter your email.');
    } else if (error.errorCode === httpErrorCodes.ALREADY_EXISTS) {
      authErrorCat.set('This email is used.');
    } else {
      authErrorCat.set('Sign up failed.');
    }
  } else {
    isLoggedInEffect(true);
  }

  isSigningUpCat.set(false);
}

export async function resendVerificationCodeEffect() {
  isResendingVerificationCodeCat.set(true);
  const { data } = await resendVerificationCode();

  if (data) {
    userCat.set(data);

    setToastEffect('Verification code is sent, you should get another email.');
  } else {
    setToastEffect('Something is wrong', toastTypes.error);
  }

  isResendingVerificationCodeCat.set(false);
}

export async function verifyEmailEffect(code) {
  isVerifyingEmailCat.set(true);
  const { data } = await verifyEmail(code);

  if (data) {
    userCat.set(data);
    setToastEffect('Your email is verified!');
    navigateTo('/');
  } else {
    setToastEffect('Something is wrong', toastTypes.error);
  }

  isVerifyingEmailCat.set(false);
}

export async function signInEffect(email, password) {
  isSigningInCat.set(true);

  const { data, error } = await signIn(email, password);
  if (error) {
    if (error.errorCode === httpErrorCodes.NOT_FOUND) {
      authErrorCat.set('This user does not exist.');
    } else if (error.errorCode === httpErrorCodes.NO_PASSWORD) {
      authErrorCat.set('Please signup first.');
    } else {
      authErrorCat.set('Sign in failed.');
    }
  } else {
    if (data.tempToken) {
      navigateTo('/sign-in/2fa');
    } else {
      isLoggedInEffect(true);
    }
  }

  isSigningInCat.set(false);
}

export async function skip2FAEffect() {
  isSkipping2FACat.set(true);

  const { data } = await skip2FA();
  if (data) {
    isLoggedInEffect(true);
    setToastEffect('2FA is skipped.');
  }

  isSkipping2FACat.set(false);
}

export async function verify2FAEffect(code) {
  isVerifying2FACat.set(true);

  const { error } = await verify2FA(code);
  if (error) {
    if (error.errorCode === httpErrorCodes.UNAUTHORIZED) {
      authErrorCat.set('Your session is expired, please go back to sign in again.');
    } else if (error.errorCode === httpErrorCodes.FORBIDDEN) {
      authErrorCat.set('Invalid code, please enter a new one.');
    } else {
      authErrorCat.set('Sign in failed.');
    }
  } else {
    isLoggedInEffect(true);
  }

  isVerifying2FACat.set(false);
}

export async function generate2FASecretEffect() {
  isGenerating2FACat.set(true);

  const { data } = await generate2FASecret();
  if (data) {
    userCat.set(prev => ({ ...prev, twoFactorUri: data.uri }));
  }

  isGenerating2FACat.set(false);
}

export async function enable2FAEffect(code) {
  isEnabling2FACat.set(true);

  const { data } = await enable2FA(code);
  if (data) {
    userCat.set(data);
    setToastEffect('2FA is enabled.');
  }

  isEnabling2FACat.set(false);
}

export async function disable2FAEffect(code) {
  isDisabling2FACat.set(true);

  const { data } = await disable2FA(code);
  if (data) {
    userCat.set(data);
    setToastEffect('2FA is disabled.');
  }

  isDisabling2FACat.set(false);
}

export async function logOutEffect() {
  isLoggingOutCat.set(true);
  await idbStorage.clear();
  LocalStorage.clear('settings-');

  location.reload();
}

export async function logOutFromAllDevicesEffect() {
  isLoggingOutFromAllDevicesCat.set(true);

  const { data } = await logoutFromAllDevices();
  if (data) {
    await logOutEffect();
  }

  isLoggingOutFromAllDevicesCat.set(false);
}

export function isLoggedInEffect(loggedIn) {
  isLoggedInCat.set(loggedIn);

  if (loggedIn) {
    eventEmitter.emit(eventEmitterEvents.loggedIn);
    authErrorCat.set('');
    fetchAccountEffect();
    fetchSettingsEffect();
  }
}

async function forceFetchAccountEffect() {
  if (isLoadingAccountCat.get()) {
    return;
  }

  isLoadingAccountCat.set(true);

  const { data } = await fetchAccount();

  if (data && isNewer(data.updatedAt, userCat.get()?.updatedAt)) {
    userCat.set(data);
  }

  isLoadingAccountCat.set(false);
}

export async function fetchAccountEffect() {
  if (!userCat.get()?.id) {
    const cachedAccount = LocalStorage.get(`${appName}-account`);
    if (cachedAccount) {
      userCat.set(cachedAccount);
    }
  }

  if (userCat.get()?.id) {
    forceFetchAccountEffect();
  } else {
    await forceFetchAccountEffect();
  }
}

export function setSettingsEffect(settings) {
  settingsCat.set(settings);
  LocalStorage.set(`${appName}-settings`, settings);
}

async function forceFetchSettingsEffect() {
  if (isLoadingSettingsCat.get()) {
    return;
  }

  isLoadingSettingsCat.set(true);

  const { data } = await fetchSettings();

  if (data) {
    setSettingsEffect(data);
    eventEmitter.emit(eventEmitterEvents.settingsFetched, data);
  }

  isLoadingSettingsCat.set(false);
}

export async function fetchSettingsEffect(force) {
  if (!settingsCat.get()) {
    const cachedSettings = LocalStorage.get(`${appName}-settings`);
    if (cachedSettings) {
      settingsCat.set(cachedSettings);
    }
  }

  if (!settingsCat.get() || force) {
    await forceFetchSettingsEffect();
  } else {
    forceFetchSettingsEffect();
  }
}

export async function deleteAccountEffect() {
  isDeletingAccountCat.set(true);

  const { data } = await deleteAccount();

  if (data) {
    logOutEffect();
    setToastEffect('Your account is deleted.');
  } else {
    setToastEffect('Something went wrong, please try again.', toastTypes.error);
  }

  isDeletingAccountCat.set(false);
}

export async function changeEmailEffect(newEmail, code, onSucceeded) {
  isChangingEmailCat.set(true);

  const { data, error } = await changeEmail(newEmail, code);

  if (data) {
    userCat.set(data);
    setToastEffect('Your email is changed!');
    if (onSucceeded) {
      onSucceeded();
    }
  } else {
    if (error.errorCode === httpErrorCodes.NO_USERNAME_OR_EMAIL) {
      authErrorCat.set('Please enter your email.');
    } else if (error.errorCode === httpErrorCodes.ALREADY_EXISTS) {
      authErrorCat.set('This email is used.');
    } else if (error.errorCode === httpErrorCodes.INVALID_CODE) {
      authErrorCat.set('Your code is invalid anymore, please trigger it again.');
    } else {
      authErrorCat.set('Something went wrong, please try again.');
    }
  }

  isChangingEmailCat.set(false);
}

export async function changePasswordEffect(currentPassword, newPassword) {
  isChangingPasswordCat.set(true);

  const { email } = userCat.get();
  const { data } = await changePassword(email, currentPassword, newPassword);

  if (data) {
    userCat.set(data);
    setToastEffect('Your password is changed! Please login again.');
    logOutEffect();
  } else {
    setToastEffect('Something went wrong, your current password may be wrong.', toastTypes.error);
  }

  isChangingPasswordCat.set(false);
}

export async function copyContactEmailEffect() {
  await copyToClipboard(contactEmail);
  setToastEffect('Copied!');
}

export async function usedPasswordManagerEffect() {
  isUsingPasswordManagerCat.set(true);

  const { data } = await usedPasswordManager();
  if (data) {
    setSettingsEffect(data);
  }

  isUsingPasswordManagerCat.set(false);
}
