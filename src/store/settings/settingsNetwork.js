import { HTTP } from '../../shared/browser/HTTP';
import { appName } from '../../shared/browser/initShared';

export async function fetchChangelog() {
  try {
    const items = await HTTP.publicGet(appName, `/v1/changelog`);

    return {
      data: items,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
}

export async function createChangelog({ timestamp, title, message, imageUrl, postUrl }) {
  try {
    const data = await HTTP.post(appName, `/v1/changelog`, {
      timestamp,
      title,
      message,
      imageUrl,
      postUrl,
    });

    return { data, error: null };
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
