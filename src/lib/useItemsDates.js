import { useMemo } from 'react';

import { formatDate } from '../shared/js/date';

export function useItemsDates(items) {
  return useMemo(() => {
    const obj = {};
    let currentSortKey = null;
    let currentDay = null;
    items.forEach(link => {
      const day = formatDate(link.createdAt);
      if (day !== currentDay) {
        currentDay = day;
        currentSortKey = link.sortKey;
        obj[currentSortKey] = { day, count: 1 };
      } else {
        obj[currentSortKey].count++;
      }
    });
    return obj;
  }, [items]);
}
