import { createCat, useCat } from 'usecat';

export const noGroupSortKey = 'no-group';
export const importedGroupSortKey = 'imported-group';

export const groupsCat = createCat({});
export const groupCat = createCat(null);
export const isLoadingGroupsCat = createCat(false);
export const isLoadingGroupCat = createCat(false);
export const isCreatingGroupCat = createCat(false);
export const isUpdatingGroupCat = createCat(false);
export const isDeletingGroupCat = createCat(false);

export const useGroups = spaceId => {
  const groups = useCat(groupsCat);

  return groups[spaceId] || [];
};
