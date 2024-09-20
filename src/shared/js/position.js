function generatePosition(timestamp = Date.now()) {
  return `${timestamp}3`;
}

function getItemPosition(item) {
  if (!item) {
    return null;
  }
  if (item.position) {
    return item.position;
  }
  if (item.createdAt) {
    return generatePosition(item.createdAt);
  }
  return generatePosition();
}

export function calculateItemPosition(items, preIndex, afterIndex, reverse) {
  const prePosition = getItemPosition(items[preIndex]);
  const afterPosition = getItemPosition(items[afterIndex]);

  const bigger = reverse ? afterPosition : prePosition;
  const smaller = reverse ? prePosition : afterPosition;

  if (bigger) {
    let newPosition = `${bigger.slice(0, bigger.length - 1)}23`;

    while (newPosition <= smaller) {
      newPosition = `${newPosition}3`;
    }

    return newPosition;
  }

  return generatePosition();
}

export function orderByPosition(items, reverse) {
  const reordered = (items || []).sort((a, b) =>
    getItemPosition(b) > getItemPosition(a) ? 1 : -1
  );
  if (reverse) {
    return reordered.reverse();
  }
  return reordered;
}
