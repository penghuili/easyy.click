export function classNames(classes) {
  return Object.entries(classes)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(' ');
}
