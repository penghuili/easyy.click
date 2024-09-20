export function getUTCTimeNumber(date = new Date()) {
  const dateObj = new Date(date);

  return dateObj
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14);
}
