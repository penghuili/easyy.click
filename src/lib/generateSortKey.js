import { getUTCTimeNumber } from '../shared/js/getUTCTimeNumber';
import { randomBetween } from '../shared/js/utils';

export function generateNoteSortKey(timestamp) {
  return `note_${getUTCTimeNumber(timestamp)}_${randomBetween(1000, 9999)}`;
}

export function generateLinkSortKey(timestamp) {
  return `link_${getUTCTimeNumber(timestamp)}_${randomBetween(1000, 9999)}`;
}

export function generateGroupSortKey(timestamp) {
  return `linkgroup_${getUTCTimeNumber(timestamp)}_${randomBetween(1000, 9999)}`;
}

export function generateSpaceSortKey(timestamp) {
  return `space_${getUTCTimeNumber(timestamp)}_${randomBetween(1000, 9999)}`;
}
