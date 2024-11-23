import { memo } from 'react';

const is = Object.is;

export function fastMemo(component) {
  return memo(component, fastCompare);
}

export function fastMemoUnsafe(component) {
  return memo(component, fastCompareUnsafe);
}

export function fastCompare(a, b) {
  if (a === b) {
    return true;
  }
  if (!(a instanceof Object) || !(b instanceof Object)) {
    return false;
  }

  let aLength = 0;
  let bLength = 0;

  for (const key in a) {
    aLength += 1;

    if (!is(a[key], b[key])) {
      return false;
    }
    if (!(key in b)) {
      return false;
    }
  }

  // eslint-disable-next-line no-unused-vars
  for (const _ in b) {
    bLength += 1;
  }

  return aLength === bLength;
}

export function fastCompareUnsafe(a, b) {
  let aLength = 0;
  let bLength = 0;

  for (const key in a) {
    aLength += 1;

    if (!is(a[key], b[key])) {
      return false;
    }
  }

  // eslint-disable-next-line no-unused-vars
  for (const _ in b) {
    bLength += 1;
  }

  return aLength === bLength;
}
