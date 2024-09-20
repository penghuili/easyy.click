export function isTesting() {
  return import.meta.env.VITE_TESTING === 'true';
}
