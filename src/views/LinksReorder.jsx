import React, { useCallback, useEffect } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { SpaceHint } from '../components/SpaceHint.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { ReorderGroupItems } from '../shared/browser/ReorderGroupItems.jsx';
import { isLoadingGroupsCat, noGroupSortKey } from '../store/group/groupCats.js';
import { fetchGroupsEffect } from '../store/group/groupEffect.js';
import { isLoadingLinksCat, isUpdatingLinkCat, useLinkGroups } from '../store/link/linkCats.js';
import { fetchLinksEffect, updateLinkEffect } from '../store/link/linkEffect.js';

export const LinksReorder = fastMemo(({ queryParams: { spaceId } }) => {
  const isLoadingLinks = useCat(isLoadingLinksCat);
  const isLoadingGroups = useCat(isLoadingGroupsCat);
  const { groups: linkGroups } = useLinkGroups(false, spaceId);
  const isUpdating = useCat(isUpdatingLinkCat);

  const handleReorder = useCallback(
    ({ item }) => {
      if (item) {
        updateLinkEffect(
          item.sortKey,
          {
            encryptedPassword: item.encryptedPassword,
            position: item.position,
            groupId: item.groupId === noGroupSortKey ? null : item.groupId,
            successMessage: 'Updated!',
          },
          spaceId
        );
      }
    },
    [spaceId]
  );

  useEffect(() => {
    fetchLinksEffect(false, false, spaceId);
    fetchGroupsEffect(false, false, spaceId);
  }, [spaceId]);

  return (
    <PageContent paddingBottom="0">
      <PageHeader
        title="Reorder links"
        isLoading={isLoadingLinks || isLoadingGroups || isUpdating}
        hasBack
      />

      <SpaceHint spaceId={spaceId} />

      <ReorderGroupItems
        groupItems={linkGroups}
        onReorder={handleReorder}
        reverse
        renderItem={item => item.title}
        height={`calc(100vh - 70px - 2rem)`}
      />
    </PageContent>
  );
});
