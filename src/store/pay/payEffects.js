import { isLoggedInCat } from '../../shared/browser/store/sharedCats';
import { setSettingsEffect, setToastEffect } from '../../shared/browser/store/sharedEffects';
import { isFreeTryingCat } from './payCats';
import { freeTrial } from './payNetwork';

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
