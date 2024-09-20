import lodashUniqBy from 'lodash.uniqby';

export function uniqBy(items, field) {
  return lodashUniqBy(items, item => item[field]);
}

export function uniq(items) {
  return lodashUniqBy(items, item => item);
}
