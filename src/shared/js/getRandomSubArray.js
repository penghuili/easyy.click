export function getRandomSubArray(arr, m) {
  let n = arr.length;

  // Clone the array to avoid modifying the original array
  const tempArray = arr.slice();

  // Fisher-Yates shuffle algorithm
  for (let i = n - 1; i > 0; i--) {
    // Pick a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at indices i and j
    const temp = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = temp;

    // Stop early once we've shuffled the first n - m elements
    if (i === n - m) break;
  }

  // Return the first m elements of the shuffled array
  return tempArray.slice(n - m);
}
