import { HTTP } from '../../shared/browser/HTTP';
import { appName } from '../../shared/browser/initShared';
import { paymentStatsCat } from './settingsCats';

export async function updateSettings({ linksLayout }) {
  try {
    const data = await HTTP.put(appName, `/v1/settings`, { linksLayout });

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

export function fetchPaymentStats() {
  if (paymentStatsCat.get()) {
    return;
  }

  fetch('https://api.peng37.com/easyy/v1/public/stats')
    .then(res => res.json().then(json => paymentStatsCat.set(json)))
    .catch(err => console.log(err));
}
