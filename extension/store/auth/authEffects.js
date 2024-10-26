import { httpErrorCodes } from '../../../src/shared/js/httpErrorCodes';
import {
  authErrorCat,
  isInitingCat,
  isLoggedInCat,
  isLoggingOutCat,
  isSigningInCat,
} from './authCats';
import { checkRefreshToken, logout, signIn } from './authNetwork';

export async function signInEffect(email, password) {
  isSigningInCat.set(true);

  const { error } = await signIn(email, password);
  if (error) {
    if (error.errorCode === httpErrorCodes.NOT_FOUND) {
      authErrorCat.set('This user does not exist.');
    } else if (error.errorCode === httpErrorCodes.NO_PASSWORD) {
      authErrorCat.set('Please signup first.');
    } else {
      authErrorCat.set('Sign in failed.');
    }
  } else {
    isLoggedInCat.set(true);
  }

  isSigningInCat.set(false);
}

export async function initEffect() {
  isInitingCat.set(true);

  const { isValid } = await checkRefreshToken();

  isLoggedInCat.set(isValid);

  isInitingCat.set(false);

  return isValid;
}

export async function logoutEffect() {
  isLoggingOutCat.set(true);

  await logout();

  isLoggedInCat.set(false);

  isLoggingOutCat.set(false);
}
