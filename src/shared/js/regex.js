export function onlyKeepNumbers(value) {
  return value.replace(/\D/g, '');
}

export function isValidUsername(value) {
  return !/[^a-z0-9]/.test(value);
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
