import { isLoggedInCat } from '../../shared/browser/store/sharedCats';
import { setSettingsEffect } from '../../shared/browser/store/sharedEffects';
import { isUpdatingSettingsCat } from './settingsCats';
import { updateSettings } from './settingsNetwork';

export async function updateSettingsEffect({ linksLayout }) {
  if (!isLoggedInCat.get()) {
    return;
  }

  isUpdatingSettingsCat.set(true);

  const { data } = await updateSettings({ linksLayout });
  if (data) {
    setSettingsEffect(data);
  }

  isUpdatingSettingsCat.set(false);
}
