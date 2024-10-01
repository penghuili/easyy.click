import { LocalStorage } from '../../lib/LocalStorage';
import { appName } from '../../shared/browser/initShared';
import { isLoggedInCat, settingsCat } from '../../shared/browser/store/sharedCats';
import { setToastEffect } from '../../shared/browser/store/sharedEffects';
import { isFreeTryingCat } from './payCats';
import { freeTrial } from './payNetwork';

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
