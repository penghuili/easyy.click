import { ActionSheet } from '@nutui/nutui-react';
import React, { useCallback } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { PageContent } from '../components/PageContent.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { Text } from '../components/Text.jsx';
import { ReorderItems } from '../shared/browser/ReorderItems.jsx';
import { isLoadingLinksCat, isUpdatingLinkCat, linksCat } from '../store/link/linkCats.js';
import { deleteLinkEffect, fetchLinksEffect, updateLinkEffect } from '../store/link/linkEffect.js';

async function load() {
  await fetchLinksEffect();
}

const activeLinkCat = createCat(null);

export const LinksReorder = fastMemo(() => {
  const isLoading = useCat(isLoadingLinksCat);
  const links = useCat(linksCat);
  const isUpdating = useCat(isUpdatingLinkCat);

  const handleReorder = useCallback(({ item }) => {
    if (item) {
      updateLinkEffect(item.sortKey, {
        encryptedPassword: item.encryptedPassword,
        position: item.position,
      });
    }
  }, []);

  return (
    <PrepareData load={load}>
      <PageContent>
        <PageHeader title="Reorder links" isLoading={isLoading || isUpdating} hasBack />

        <Text m="0 0 1rem">Drag to reorder, click to edit.</Text>

        <ReorderItems
          items={links}
          onReorder={handleReorder}
          reverse
          renderItem={item => item.title}
          onClickItem={item => {
            activeLinkCat.set(item);
          }}
        />

        <Actions />
      </PageContent>
    </PrepareData>
  );
});

const Actions = fastMemo(() => {
  const activeLink = useCat(activeLinkCat);

  const options = [
    {
      name: 'Edit',
      onClick: () => {
        navigateTo(`/links/details?linkId=${activeLink?.sortKey}`);
      },
    },
    {
      name: 'Delete',
      danger: true,
      onClick: () => {
        deleteLinkEffect(activeLink?.sortKey);
      },
    },
  ];

  const handleSelectAction = option => {
    option.onClick();
    activeLinkCat.set(null);
  };

  return (
    <ActionSheet
      visible={!!activeLink}
      options={options}
      onSelect={handleSelectAction}
      onCancel={() => activeLinkCat.set(null)}
    />
  );
});
