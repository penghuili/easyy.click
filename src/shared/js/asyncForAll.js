import { waitForSeconds } from './waitForSeconds';

export async function asyncForAll(arr, asyncFunc, batchSize = 50, waitBetweenBatches = 1000) {
  if (!arr?.length) {
    return [];
  }

  if (batchSize) {
    const batchCount = Math.ceil(arr.length / batchSize);
    let results = [];
    for (let index = 0; index < batchCount; index++) {
      const chunk = arr.slice(index * batchSize, (index + 1) * batchSize);
      const requests = chunk.map((item, i) => asyncFunc(item, i + index * batchSize));
      const responses = await Promise.all(requests);
      results = results.concat(responses);

      if (waitBetweenBatches) {
        await waitForSeconds(waitBetweenBatches / 1000);
      }
    }

    return results;
  }

  const requests = arr.map((item, index) => asyncFunc(item, index));
  const results = await Promise.all(requests);
  return results;
}
