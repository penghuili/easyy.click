import { getUTCTimeNumber } from '../shared/js/getUTCTimeNumber';

export function generateNoteSortKey(timestamp) {
  return `note_${getUTCTimeNumber(timestamp)}_${Math.floor(Math.random() * 10000)}`;
}

export function generateLinkSortKey(timestamp) {
  return `link_${getUTCTimeNumber(timestamp)}_${Math.floor(Math.random() * 10000)}`;
}