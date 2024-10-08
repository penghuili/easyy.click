export function useEarlyUser() {
  return new Date().toISOString() < '2024-10-13T00:00:00.000Z';
}
