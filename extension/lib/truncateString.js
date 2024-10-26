export function truncateString(str, length) {
  if (str.length <= length) {
    return str;
  }
  return str.slice(0, length) + '...';
}
