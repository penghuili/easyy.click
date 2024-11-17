import { httpErrorCodes } from '../../../src/shared/js/httpErrorCodes';
import { extStorage, storageKeys } from '../../lib/storage';
import {
  authErrorCat,
  isInitingCat,
  isLoggedInCat,
  isLoggingOutCat,
  isSigningInCat,
  isVerifying2FACat,
  twoFATempCodeCat,
} from './authCats';
import { checkRefreshToken, logout, signIn, verify2FA } from './authNetwork';

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
      twoFATempCodeCat.set(data.tempToken);
    } else {
      isLoggedInCat.set(true);
      await extStorage.set(storageKeys.loggedIn, true);
    }
  }

  isSigningInCat.set(false);
}

export async function verify2FAEffect(code) {
  isVerifying2FACat.set(true);

  const { error } = await verify2FA(code, twoFATempCodeCat.get());
  if (error) {
    if (error.errorCode === httpErrorCodes.UNAUTHORIZED) {
      authErrorCat.set('Your session is expired, please go back to sign in again.');
    } else if (error.errorCode === httpErrorCodes.FORBIDDEN) {
      authErrorCat.set('Invalid code, please enter a new one.');
    } else {
      authErrorCat.set('Sign in failed.');
    }
  } else {
    isLoggedInCat.set(true);
    await extStorage.set(storageKeys.loggedIn, true);
    twoFATempCodeCat.set('');
  }

  isVerifying2FACat.set(false);
}

export async function initEffect() {
  isInitingCat.set(true);

  const { isValid } = await checkRefreshToken();

  isLoggedInCat.set(isValid);
  await extStorage.set(storageKeys.loggedIn, isValid);

  isInitingCat.set(false);

  return isValid;
}

export async function logoutEffect() {
  isLoggingOutCat.set(true);

  await logout();

  isLoggedInCat.set(false);

  isLoggingOutCat.set(false);
}
