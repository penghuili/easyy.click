import { Button } from '@douyinfe/semi-ui';
import { RiAddLine } from '@remixicon/react';
import React, { useCallback, useEffect } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { SpaceHint } from '../components/SpaceHint.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { ReorderItems } from '../shared/browser/ReorderItems.jsx';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { isLoadingGroupsCat, isUpdatingGroupCat, useGroups } from '../store/group/groupCats.js';
import { fetchGroupsEffect, updateGroupEffect } from '../store/group/groupEffect.js';

export const GroupsReorder = fastMemo(({ queryParams: { spaceId } }) => {
  const isLoadingGroups = useCat(isLoadingGroupsCat);
  const groups = useGroups(spaceId);
  const isUpdating = useCat(isUpdatingGroupCat);

  const handleReorder = useCallback(
    ({ item }) => {
      if (item) {
        updateGroupEffect(
          item.sortKey,
          {
            encryptedPassword: item.encryptedPassword,
            position: item.position,
          },
          spaceId
        );
      }
    },
    [spaceId]
  );

  useEffect(() => {
    fetchGroupsEffect(false, false, spaceId);
  }, [spaceId]);

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
            onClick={() => navigateTo(`/groups/add?spaceId=${spaceId}`)}
          />
        }
      />

      <SpaceHint spaceId={spaceId} />

      <ReorderItems
        items={groups}
        onReorder={handleReorder}
        reverse
        renderItem={item => item.title}
        height={`calc(100vh - 70px - 2rem)`}
      />
    </PageContent>
  );
});
