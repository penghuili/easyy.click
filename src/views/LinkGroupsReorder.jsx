import { ActionSheet, Button } from '@nutui/nutui-react';
import { RiAddLine } from '@remixicon/react';
import React, { useCallback, useEffect, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { Confirm } from '../components/Confirm.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Text } from '../components/Text.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { ReorderItems } from '../shared/browser/ReorderItems.jsx';
import {
  isDeletingLinkGroupCat,
  isLoadingLinkGroupsCat,
  isUpdatingLinkGroupCat,
  linkGroupsCat,
} from '../store/linkGroup/linkGroupCats.js';
import {
  deleteLinkGroupEffect,
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
    fetchLinkGroupsEffect();
  }, []);

  return (
    <PageContent paddingBottom="0">
      <PageHeader
        title="Edit link tags"
        isLoading={isLoadingGroups || isUpdating}
        hasBack
        right={
          <Button
            type="primary"
            fill="none"
            icon={<RiAddLine />}
            onClick={() => navigateTo('/link-groups/add')}
          />
        }
      />

      <Text m="0 0 1rem">Drag to reorder, click to edit.</Text>

      <ReorderItems
        items={groups}
        onReorder={handleReorder}
        reverse
        renderItem={item => item.title}
        onClickItem={item => {
          activeGroupCat.set(item);
          showActionSheetCat.set(true);
        }}
        height={`calc(100vh - 70px - 2.5rem)`}
      />

      <Actions />
    </PageContent>
  );
});

const Actions = fastMemo(() => {
  const showActionSheet = useCat(showActionSheetCat);
  const activeGroup = useCat(activeGroupCat);
  const isDeleting = useCat(isDeletingLinkGroupCat);

  const [showConfirm, setShowConfirm] = useState(false);

  const options = [
    {
      name: 'Edit',
      onClick: () => {
        navigateTo(`/link-groups/details?groupId=${activeGroup?.sortKey}`);
      },
    },
    {
      name: 'Delete',
      danger: true,
      onClick: () => {
        setShowConfirm(true);
      },
    },
  ];

  const handleSelectAction = option => {
    option.onClick();
    showActionSheetCat.set(false);
  };

  return (
    <>
      <ActionSheet
        visible={showActionSheet}
        options={options}
        onSelect={handleSelectAction}
        onCancel={() => showActionSheetCat.set(false)}
      />

      <Confirm
        message={`Only this tag will be deleted, your links with this tag will be moved to "Links without tag".`}
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={async () => {
          await deleteLinkGroupEffect(activeGroup?.sortKey);
          setShowConfirm(false);
          activeGroupCat.set(null);
        }}
        isSaving={isDeleting}
      />
    </>
  );
});
