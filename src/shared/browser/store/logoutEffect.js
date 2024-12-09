import { idbStorage } from '../indexDB';
import { LocalStorage } from '../LocalStorage';
import { isLoggingOutCat } from './sharedCats';

export async function logOutEffect() {
  isLoggingOutCat.set(true);
  await idbStorage.clear();
  LocalStorage.clear('settings-');

  location.reload();
}
