export function add0(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

export function floorTo(value, multiple) {
  const floored = Math.floor(value / multiple) * multiple;
  // make sure there is no 66.600000000001 at the end
  const fixed = floored.toFixed(6);
  return +fixed;
}

export function toFixed(value, digits) {
  return +value.toFixed(digits);
}

export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
