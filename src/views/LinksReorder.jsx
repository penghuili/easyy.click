import React, { useCallback, useEffect } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { noGroupSortKey } from '../lib/constants.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { ReorderGroupItems } from '../shared/browser/ReorderGroupItems.jsx';
import { isLoadingLinksCat, isUpdatingLinkCat, useLinkGroups } from '../store/link/linkCats.js';
import { fetchLinksEffect, updateLinkEffect } from '../store/link/linkEffect.js';
import { isLoadingLinkGroupsCat } from '../store/linkGroup/linkGroupCats.js';
import { fetchLinkGroupsEffect } from '../store/linkGroup/linkGroupEffect.js';

export const LinksReorder = fastMemo(() => {
  const isLoadingLinks = useCat(isLoadingLinksCat);
  const isLoadingGroups = useCat(isLoadingLinkGroupsCat);
  const { groups: linkGroups } = useLinkGroups();
  const isUpdating = useCat(isUpdatingLinkCat);

  const handleReorder = useCallback(({ item }) => {
    if (item) {
      updateLinkEffect(item.sortKey, {
        encryptedPassword: item.encryptedPassword,
        position: item.position,
        groupId: item.groupId === noGroupSortKey ? null : item.groupId,
      });
    }
  }, []);

  useEffect(() => {
    fetchLinksEffect();
    fetchLinkGroupsEffect();
  }, []);

  return (
    <PageContent paddingBottom="0">
      <PageHeader
        title="Reorder links"
        isLoading={isLoadingLinks || isLoadingGroups || isUpdating}
        hasBack
      />

      <ReorderGroupItems
        groupItems={linkGroups}
        onReorder={handleReorder}
        reverse
        renderItem={item => item.title}
        height={`calc(100vh - 70px)`}
      />
    </PageContent>
  );
});
