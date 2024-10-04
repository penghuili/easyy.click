import { Button } from '@douyinfe/semi-ui';
import { RiAddLine } from '@remixicon/react';
import React, { useCallback, useEffect } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { ReorderItems } from '../shared/browser/ReorderItems.jsx';
import {
  isLoadingLinkGroupsCat,
  isUpdatingLinkGroupCat,
  linkGroupsCat,
} from '../store/linkGroup/linkGroupCats.js';
import {
  fetchLinkGroupsEffect,
  updateLinkGroupEffect,
} from '../store/linkGroup/linkGroupEffect.js';

const activeGroupCat = createCat(null);
const showActionSheetCat = createCat(false);

export const LinkGroupsReorder = fastMemo(() => {
  const isLoadingGroups = useCat(isLoadingLinkGroupsCat);
  const groups = useCat(linkGroupsCat);
  const isUpdating = useCat(isUpdatingLinkGroupCat);

  const handleReorder = useCallback(({ item }) => {
    if (item) {
      updateLinkGroupEffect(item.sortKey, {
        encryptedPassword: item.encryptedPassword,
        position: item.position,
      });
    }
  }, []);

  useEffect(() => {
    fetchLinkGroupsEffect(false, false);
  }, []);

  return (
    <PageContent paddingBottom="0">
      <PageHeader
        title="Edit link tags"
        isLoading={isLoadingGroups || isUpdating}
        hasBack
        right={
          <Button
            theme="borderless"
            icon={<RiAddLine />}
            onClick={() => navigateTo('/link-groups/add')}
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
