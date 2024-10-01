import { LocalStorage } from '../../lib/LocalStorage';
import { appName } from '../../shared/browser/initShared';
import { isLoggedInCat, settingsCat } from '../../shared/browser/store/sharedCats';
import { setToastEffect } from '../../shared/browser/store/sharedEffects';
import { toastTypes } from '../../shared/browser/Toast';
import { isFreeTryingCat, isVerifyingAppsumoCat } from './payCats';
import { freeTrial, verifyAppsumoCode } from './payNetwork';

export async function freeTrialEffect() {
  if (!isLoggedInCat.get()) {
    return;
  }

  isFreeTryingCat.set(true);

  const { data } = await freeTrial();
  if (data) {
    settingsCat.set(data);
    LocalStorage.set(`${appName}-settings`, data);
    setToastEffect('Now you have full access for 14 days! Enjoy!');
  }

  isFreeTryingCat.set(false);
}

export async function verifyAppsumoEffect(code) {
  if (!isLoggedInCat.get()) {
    return;
  }

  isVerifyingAppsumoCat.set(true);

  const { data } = await verifyAppsumoCode(code);
  if (data) {
    settingsCat.set(data);
    setToastEffect('Your code is valid! Now you have lifetime access!');
  } else {
    setToastEffect('Your code is invalid.', toastTypes.error);
  }

  isVerifyingAppsumoCat.set(false);
}
