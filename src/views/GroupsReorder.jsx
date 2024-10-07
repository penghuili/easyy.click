import { Button } from '@douyinfe/semi-ui';
import { RiAddLine } from '@remixicon/react';
import React, { useCallback, useEffect } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { ReorderItems } from '../shared/browser/ReorderItems.jsx';
import { groupsCat, isLoadingGroupsCat, isUpdatingGroupCat } from '../store/group/groupCats.js';
import { fetchGroupsEffect, updateGroupEffect } from '../store/group/groupEffect.js';

const activeGroupCat = createCat(null);
const showActionSheetCat = createCat(false);

export const GroupsReorder = fastMemo(() => {
  const isLoadingGroups = useCat(isLoadingGroupsCat);
  const groups = useCat(groupsCat);
  const isUpdating = useCat(isUpdatingGroupCat);

  const handleReorder = useCallback(({ item }) => {
    if (item) {
      updateGroupEffect(item.sortKey, {
        encryptedPassword: item.encryptedPassword,
        position: item.position,
      });
    }
  }, []);

  useEffect(() => {
    fetchGroupsEffect(false, false);
  }, []);

  return (
    <PageContent paddingBottom="0">
      <PageHeader
        title="Reorder tags"
        isLoading={isLoadingGroups || isUpdating}
        hasBack
        right={
          <Button
            theme="borderless"
            icon={<RiAddLine />}
            onClick={() => navigateTo('/groups/add')}
          />
        }
      />

      <ReorderItems
        items={groups}
        onReorder={handleReorder}
        reverse
        renderItem={item => item.title}
        onClickItem={item => {
          activeGroupCat.set(item);
          showActionSheetCat.set(true);
        }}
        height={`calc(100vh - 70px - 1rem)`}
      />
    </PageContent>
  );
});
