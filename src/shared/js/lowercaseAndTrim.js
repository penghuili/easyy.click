export function lowercaseAndTrim(value) {
  if (!value) {
    return value;
  }

  return value.toLowerCase().trim();
}
