import { Badge, Button, TabPane, Tabs } from '@douyinfe/semi-ui';
import { RiRefreshLine } from '@remixicon/react';
import React, { useCallback, useEffect, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { InboxLinkItems } from '../components/InboxLinkItems.jsx';
import { InboxNoteItems } from '../components/InboxNoteItems.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { settingsCat } from '../shared/browser/store/sharedCats.js';
import { fetchSettingsEffect } from '../shared/browser/store/sharedEffects.js';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { isLoadingGroupsCat } from '../store/group/groupCats.js';
import { isLoadingInboxLinksCat, isMovingLinkCat } from '../store/link/linkCats.js';
import { fetchInboxLinksEffect } from '../store/link/linkEffect.js';
import { isLoadingInboxNotesCat, isMovingNoteCat } from '../store/note/noteCats.js';
import { fetchInboxNotesEffect } from '../store/note/noteEffect.js';

async function load() {
  fetchInboxLinksEffect();
  fetchInboxNotesEffect();
  fetchSettingsEffect(false);
}

export const Inbox = fastMemo(() => {
  const settings = useCat(settingsCat);

  const [tab, setTab] = useState('links');

  const handleChangeTab = useCallback(newTab => {
    setTab(newTab);
  }, []);

  useEffect(() => {
    load();
  }, []);

  return (
    <PageContent>
      <Header />

      <Tabs
        type="line"
        activeKey={tab}
        onChange={handleChangeTab}
        size="small"
        style={{ marginLeft: '0.5rem' }}
      >
        <TabPane
          tab={
            <Badge count={settings?.inboxLinksCount > 0 ? settings.inboxLinksCount : null}>
              Links
            </Badge>
          }
          itemKey="links"
        >
          <InboxLinkItems />
        </TabPane>
        <TabPane
          tab={
            <Badge count={settings?.inboxNotesCount > 0 ? settings.inboxNotesCount : null}>
              Notes
            </Badge>
          }
          itemKey="notes"
        >
          <InboxNoteItems />
        </TabPane>
      </Tabs>
    </PageContent>
  );
});

const Header = fastMemo(() => {
  const isLoadingNotes = useCat(isLoadingInboxNotesCat);
  const isLoadingLinks = useCat(isLoadingInboxLinksCat);
  const isLoadingGroups = useCat(isLoadingGroupsCat);
  const isMovingLink = useCat(isMovingLinkCat);
  const isMovingNote = useCat(isMovingNoteCat);

  const isLoading =
    isLoadingNotes || isLoadingLinks || isLoadingGroups || isMovingLink || isMovingNote;

  const handleRefresh = useCallback(() => {
    load();
  }, []);

  return (
    <PageHeader
      title={
        <>
          Inbox
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
      hasBack
    />
  );
});
