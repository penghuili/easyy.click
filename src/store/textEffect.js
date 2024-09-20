import { localStorageKeys } from '../lib/constants';
import { LocalStorage } from '../lib/LocalStorage';
import { textsCat } from './textCats';

textsCat.set(LocalStorage.get(localStorageKeys.texts) || []);

export function createTextEffect(title, text) {
  const data = {
    sortKey: Date.now().toString(),
    title,
    text,
  };
  const newTexts = [...textsCat.get(), data];
  LocalStorage.set(localStorageKeys.texts, newTexts);

  textsCat.set(newTexts);
}

export function updateTextEffect(textId, title, text) {
  const data = {
    sortKey: textId,
    title,
    text,
  };
  const newTexts = textsCat.get().map(i => (i.sortKey === textId ? data : i));
  LocalStorage.set(localStorageKeys.texts, newTexts);

  textsCat.set(newTexts);
}
