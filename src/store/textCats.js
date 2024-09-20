import { createCat, useCat } from 'usecat';

export const textsCat = createCat([]);

export function useText(textId) {
  const texts = useCat(textsCat);
  return texts?.find(i => i.sortKey === textId);
}
