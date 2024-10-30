import { asyncForEach } from './asyncForEach';

export async function asyncMap(arr, asyncFunc) {
  if (!arr?.length) {
    return arr;
  }

  const results = [];

  await asyncForEach(arr, async (item, index) => {
    const data = await asyncFunc(item, index);
    results.push(data);
  });

  return results;
}
