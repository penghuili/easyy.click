import { HTTP } from '../../shared/browser/HTTP';
import { appName } from '../../shared/browser/initShared';

export async function freeTrial() {
  try {
    const data = await HTTP.post(appName, `/v1/user/free-trial`, {});

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export async function verifyGumroadLicenseKey(licenseKey) {
  try {
    const data = await HTTP.post(appName, `/v1/gumroad`, { licenseKey });

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
