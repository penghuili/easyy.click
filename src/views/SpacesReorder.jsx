import React, { useCallback, useEffect } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { ReorderItems } from '../shared/browser/ReorderItems.jsx';
import {
  isLoadingSpacesCat,
  isUpdatingSpaceCat,
  useCreatedSpaces,
} from '../store/space/spaceCats.js';
import { fetchSpacesEffect, updateSpaceEffect } from '../store/space/spaceEffect.js';

export const SpacesReorder = fastMemo(() => {
  const isLoading = useCat(isLoadingSpacesCat);
  const spaces = useCreatedSpaces();
  const isUpdating = useCat(isUpdatingSpaceCat);

  const handleReorder = useCallback(({ item }) => {
    if (item) {
      updateSpaceEffect(item.sortKey, {
        position: item.position,
      });
    }
  }, []);

  useEffect(() => {
    fetchSpacesEffect(false, false);
  }, []);

  return (
    <PageContent paddingBottom="0">
      <PageHeader title="Reorder spaces" isLoading={isLoading || isUpdating} hasBack />

      <ReorderItems
        items={spaces}
        onReorder={handleReorder}
        reverse
        renderItem={item => item.title}
        height={`calc(100vh - 70px - 1rem)`}
      />
    </PageContent>
  );
});
