import { isLoggedInCat } from '../../shared/browser/store/sharedCats';
import { setSettingsEffect, setToastEffect } from '../../shared/browser/store/sharedEffects';
import { toastTypes } from '../../shared/browser/Toast';
import { isFreeTryingCat, isVerifyingGumroadCat } from './payCats';
import { freeTrial, verifyGumroadLicenseKey } from './payNetwork';

export async function freeTrialEffect() {
  if (!isLoggedInCat.get()) {
    return;
  }

  isFreeTryingCat.set(true);

  const { data } = await freeTrial();
  if (data) {
    setSettingsEffect(data);
    setToastEffect('Now you have full access for 14 days! Enjoy!');
  }

  isFreeTryingCat.set(false);
}

export async function verifyGumroadLicenseKeyEffect(licenseKey) {
  if (!isLoggedInCat.get()) {
    return;
  }

  isVerifyingGumroadCat.set(true);

  const { data } = await verifyGumroadLicenseKey(licenseKey);
  if (data) {
    setSettingsEffect(data);
    setToastEffect('Success! Now you have full access to easyy.click! Enjoy!');
  } else {
    setToastEffect('Your license key is invalid. Please try again.', toastTypes.error);
  }

  isVerifyingGumroadCat.set(false);
}
