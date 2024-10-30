import { Button, TabPane, Tabs } from '@douyinfe/semi-ui';
import { RiRefreshLine } from '@remixicon/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { navigateTo, replaceTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { FreeTrialEnding } from '../components/FreeTrialEnding.jsx';
import { GroupItems } from '../components/GroupItems.jsx';
import { InboxIcon } from '../components/InboxIcon.jsx';
import { LinkItems } from '../components/LinkItems.jsx';
import { NoteItems } from '../components/NoteItems.jsx';
import { SpaceSelector } from '../components/SpaceSelector.jsx';
import { SpaceStats } from '../components/SpaceStats.jsx';
import { localStorageKeys } from '../lib/constants.js';
import { LocalStorage } from '../shared/browser/LocalStorage.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { Shine } from '../shared/browser/Shine.jsx';
import { useExpiresAt } from '../shared/browser/store/sharedCats.js';
import { fetchSettingsEffect } from '../shared/browser/store/sharedEffects.js';
import { AccountIcon } from '../shared/semi/AccountIcon.jsx';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { isLoadingGroupsCat } from '../store/group/groupCats.js';
import { fetchGroupsEffect } from '../store/group/groupEffect.js';
import { isLoadingLinksCat, isMovingLinkCat } from '../store/link/linkCats.js';
import { fetchLinksEffect } from '../store/link/linkEffect.js';
import { isLoadingNotesCat, isMovingNoteCat } from '../store/note/noteCats.js';
import { fetchNotesEffect } from '../store/note/noteEffect.js';
import { defaultSpaceId } from '../store/space/spaceCats.js';

async function load(force, spaceId) {
  fetchLinksEffect(force, true, spaceId);
  fetchNotesEffect(force, true, spaceId);
  fetchGroupsEffect(force, true, spaceId);
  fetchSettingsEffect(false);
}

export const Home = fastMemo(({ queryParams: { spaceId } }) => {
  const [tab, setTab] = useState(LocalStorage.get(localStorageKeys.activeTab) || 'links');

  const innerSpaceId = useMemo(() => spaceId || defaultSpaceId, [spaceId]);

  const handleSpaceChange = useCallback(newSpaceId => {
    replaceTo(newSpaceId && newSpaceId !== defaultSpaceId ? `/?spaceId=${newSpaceId}` : `/`);
  }, []);
  const handleChangeTab = useCallback(newTab => {
    setTab(newTab);
    LocalStorage.set(localStorageKeys.activeTab, newTab);
  }, []);

  useEffect(() => {
    load(false, innerSpaceId);
  }, [innerSpaceId]);

  return (
    <PageContent>
      <Header spaceId={innerSpaceId} onSpaceChange={handleSpaceChange} />

      <FreeTrialEnding />

      <Tabs
        type="line"
        activeKey={tab}
        onChange={handleChangeTab}
        size="small"
        style={{ marginLeft: '0.5rem' }}
      >
        <TabPane tab="Links" itemKey="links">
          <LinkItems spaceId={innerSpaceId} />
        </TabPane>
        <TabPane tab="Notes" itemKey="notes">
          <NoteItems spaceId={innerSpaceId} />
        </TabPane>
        <TabPane tab="Tags" itemKey="tags">
          <GroupItems spaceId={innerSpaceId} />
        </TabPane>
        <TabPane tab="Stats" itemKey="stats">
          <SpaceStats spaceId={innerSpaceId} />
        </TabPane>
      </Tabs>
    </PageContent>
  );
});

const Header = fastMemo(({ spaceId, onSpaceChange }) => {
  const isLoadingNotes = useCat(isLoadingNotesCat);
  const isLoadingLinks = useCat(isLoadingLinksCat);
  const isLoadingGroups = useCat(isLoadingGroupsCat);
  const isMovingLink = useCat(isMovingLinkCat);
  const isMovingNote = useCat(isMovingNoteCat);

  const isLoading =
    isLoadingNotes || isLoadingLinks || isLoadingGroups || isMovingLink || isMovingNote;

  const handleRefresh = useCallback(() => {
    load(true, spaceId);
  }, [spaceId]);

  return (
    <PageHeader
      title={
        <>
          <SpaceSelector value={spaceId} onChange={onSpaceChange} />

          {!isLoading && (
            <Button
              type="primary"
              theme="borderless"
              icon={<RiRefreshLine />}
              onClick={handleRefresh}
              style={{ marginLeft: '0.5rem' }}
            />
          )}
        </>
      }
      isLoading={isLoading}
      right={
        <>
          <UpgradeButton />

          <InboxIcon />

          <AccountIcon
            onClick={() => {
              navigateTo('/account');
            }}
          />
        </>
      }
    />
  );
});

const UpgradeButton = fastMemo(() => {
  const expiresAt = useExpiresAt();

  if (expiresAt === 'forever') {
    return null;
  }

  return (
    <Button
      theme="solid"
      onClick={() => {
        navigateTo('/upgrade');
      }}
      size="small"
      style={{ marginRight: '0.5rem', position: 'relative', overflow: 'hidden' }}
    >
      Pro
      <Shine />
    </Button>
  );
});
