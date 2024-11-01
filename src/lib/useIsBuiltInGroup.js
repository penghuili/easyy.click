import { useMemo } from 'react';

import { importedGroupSortKey, noGroupSortKey } from '../store/group/groupCats';

export function useIsBuiltInGroup(groupId) {
  return useMemo(() => [noGroupSortKey, importedGroupSortKey].includes(groupId), [groupId]);
}
