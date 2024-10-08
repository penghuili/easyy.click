import { Button, TabPane, Tabs } from '@douyinfe/semi-ui';
import { RiRefreshLine } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { AccountIcon } from '../components/AccountIcon.jsx';
import { FreeTrialEnding } from '../components/FreeTrialEnding.jsx';
import { GroupItems } from '../components/GroupItems.jsx';
import { LinkItems } from '../components/LinkItems.jsx';
import { NoteItems } from '../components/NoteItems.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { localStorageKeys } from '../lib/constants.js';
import { LocalStorage } from '../shared/browser/LocalStorage.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { Shine } from '../shared/browser/Shine.jsx';
import { useExpiresAt } from '../shared/browser/store/sharedCats.js';
import { fetchGroupsEffect } from '../store/group/groupEffect.js';
import { isLoadingLinksCat } from '../store/link/linkCats.js';
import { fetchLinksEffect } from '../store/link/linkEffect.js';
import { isLoadingNotesCat } from '../store/note/noteCats.js';
import { fetchNotesEffect } from '../store/note/noteEffect.js';

async function load(force) {
  fetchLinksEffect(force);
  fetchNotesEffect(force);
  fetchGroupsEffect(force);
}

const savedTab = LocalStorage.get(localStorageKeys.activeTab);

export const Home = fastMemo(() => {
  const [tab, setTab] = useState(savedTab || 'links');

  const handleChangeTab = useCallback(
    newTab => {
      setTab(newTab);
      LocalStorage.set(localStorageKeys.activeTab, newTab);
    },
    [setTab]
  );

  return (
    <PrepareData load={load}>
      <PageContent>
        <Header tab={tab} onTabChange={handleChangeTab} />

        <FreeTrialEnding />

        <Tabs
          type="line"
          activeKey={tab}
          onChange={handleChangeTab}
          size="small"
          style={{ marginLeft: '0.5rem' }}
        >
          <TabPane tab="Links" itemKey="links" />
          <TabPane tab="Notes" itemKey="notes" />
          <TabPane tab="Tags" itemKey="tags" />
        </Tabs>

        {tab === 'links' && <LinkItems />}
        {tab === 'notes' && <NoteItems />}
        {tab === 'tags' && <GroupItems />}
      </PageContent>
    </PrepareData>
  );
});

const Header = fastMemo(() => {
  const isLoadingNotes = useCat(isLoadingNotesCat);
  const isLoadingLinks = useCat(isLoadingLinksCat);

  const isLoading = isLoadingNotes || isLoadingLinks;

  const handleRefresh = useCallback(() => {
    load(true);
  }, []);

  return (
    <PageHeader
      title={
        <>
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
      isLoading={isLoadingNotes || isLoadingLinks}
      right={
        <>
          <UpgradeButton />

          <Button
            type="primary"
            theme="borderless"
            icon={<AccountIcon />}
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
      Upgrade
      <Shine />
    </Button>
  );
});
