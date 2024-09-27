import { formatDate } from '../shared/js/date';

export function hasValidFreeTrial(freeTrialUntil) {
  return freeTrialUntil >= formatDate(new Date());
}
