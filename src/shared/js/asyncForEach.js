import { waitForSeconds } from './waitForSeconds';

export async function asyncForEach(arr, asyncFunc, waitEvery = 0) {
  if (!arr?.length) {
    return;
  }

  for (let index = 0; index < arr.length; index += 1) {
    await asyncFunc(arr[index], index, arr);
    if (waitEvery && (index + 1) % waitEvery === 0) {
      await waitForSeconds(1);
      console.log(`asyncForEach: ${index + 1} of ${arr.length}`);
    }
  }
}
