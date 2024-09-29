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

export function moveItem(items, fromIndex, toIndex) {
  const innerToIndex = toIndex > items.length - 1 ? items.length - 1 : toIndex;

  const newItems = [];
  items.forEach((i, iIndex) => {
    if (iIndex === innerToIndex) {
      if (innerToIndex > fromIndex) {
        newItems.push(i);
        newItems.push(items[fromIndex]);
      } else {
        newItems.push(items[fromIndex]);
        newItems.push(i);
      }
    } else if (iIndex !== fromIndex) {
      newItems.push(i);
    }
  });
  return newItems;
}

export function addItem(items, index, item) {
  const newItems = [];
  items.forEach((i, iIndex) => {
    if (iIndex === index) {
      newItems.push(item);
    }
    newItems.push(i);
  });
  if (index > items.length - 1) {
    newItems.push(item);
  }
  return newItems;
}
