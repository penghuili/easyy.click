import { localStorageKeys } from '../../lib/constants';
import { LocalStorage } from '../../lib/LocalStorage';
import { setSettingsEffect, setToastEffect } from '../../shared/browser/store/sharedEffects';
import {
  changelogCat,
  isCreatingChangelogCat,
  isLoadingChangelogCat,
  isUsingPasswordManagerCat,
} from './settingsCats';
import { createChangelog, fetchChangelog, usedPasswordManager } from './settingsNetwork';

export async function fetchChangelogEffect() {
  const cached = LocalStorage.get(localStorageKeys.changelog);
  if (cached?.length) {
    changelogCat.set(cached);
  }

  isLoadingChangelogCat.set(true);

  const { data } = await fetchChangelog();
  if (data) {
    changelogCat.set(data);
    LocalStorage.set(localStorageKeys.changelog, data);
  }

  isLoadingChangelogCat.set(false);
}

export async function createChangelogEffect({ timestamp, title, message, imageUrl, postUrl }) {
  isCreatingChangelogCat.set(true);

  const { data } = await createChangelog({ timestamp, title, message, imageUrl, postUrl });
  if (data) {
    changelogCat.set([data, ...changelogCat.get()]);
    setToastEffect('Created!');
  }

  isCreatingChangelogCat.set(false);

  return data;
}

export async function usedPasswordManagerEffect() {
  isUsingPasswordManagerCat.set(true);

  const { data } = await usedPasswordManager();
  if (data) {
    setSettingsEffect(data);
  }

  isUsingPasswordManagerCat.set(false);
}
