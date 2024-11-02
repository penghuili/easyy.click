import { HTTP } from '../../shared/browser/HTTP';
import { appName } from '../../shared/browser/initShared';

export async function updateSettings({ linksLayout }) {
  try {
    const data = await HTTP.put(appName, `/v1/settings`, { linksLayout });

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
