import { Button, Ellipsis, Grid, TabPane, Tabs } from '@nutui/nutui-react';
import { RiRefreshLine, RiUser2Line } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Favicon } from '../components/Favicon.jsx';
import { Flex } from '../components/Flex.jsx';
import { FloatAction } from '../components/FloatAction.jsx';
import { Link } from '../components/Link.jsx';
import { PageEmpty } from '../components/PageEmpty.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { localStorageKeys } from '../lib/constants.js';
import { copyToClipboard } from '../lib/copyToClipboard';
import { isMobileBrowser } from '../shared/browser/device.js';
import { LocalStorage } from '../shared/browser/LocalStorage.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { Shine } from '../shared/browser/Shine.jsx';
import { useExpiresAt } from '../shared/browser/store/sharedCats.js';
import { setToastEffect } from '../shared/browser/store/sharedEffects.js';
import { isLoadingLinksCat, linksCat } from '../store/link/linkCats.js';
import { fetchLinksEffect } from '../store/link/linkEffect.js';
import { isLoadingNotesCat, notesCat } from '../store/note/noteCats.js';
import { fetchNotesEffect } from '../store/note/noteEffect.js';

async function load(force) {
  await fetchNotesEffect(force);
  await fetchLinksEffect(force);
}

const savedTab = LocalStorage.get(localStorageKeys.activeTab);

export const Notes = fastMemo(() => {
  const isLoadingNotes = useCat(isLoadingNotesCat);
  const isLoadingLinks = useCat(isLoadingLinksCat);

  const [tab, setTab] = useState(savedTab || 'links');
  const isNotes = tab === 'notes';

  const handleChangeTab = useCallback(
    newTab => {
      setTab(newTab);
      LocalStorage.set(localStorageKeys.activeTab, newTab);
    },
    [setTab]
  );

  const handleAdd = useCallback(() => {
    if (isNotes) {
      navigateTo(`/notes/add`);
    } else {
      navigateTo(`/links/add`);
    }
  }, [isNotes]);

  const handleRefresh = useCallback(() => {
    load(true);
  }, []);

  const isLoading = isLoadingNotes || isLoadingLinks;
  return (
    <PrepareData load={load}>
      <FloatAction onClick={handleAdd} />

      <PageContent>
        <PageHeader
          title={
            <>
              <Tabs value={tab} onChange={handleChangeTab}>
                <TabPane key="links" value="links" title="Links"></TabPane>
                <TabPane key="notes" value="notes" title="Notes"></TabPane>
              </Tabs>
              {!isLoading && (
                <Button
                  type="primary"
                  fill="none"
                  icon={<RiRefreshLine />}
                  onClick={handleRefresh}
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
                fill="none"
                icon={<RiUser2Line />}
                onClick={() => {
                  navigateTo(`/account`);
                }}
              />
            </>
          }
        />

        {isNotes ? <NoteItems /> : <LinkItems />}
      </PageContent>
    </PrepareData>
  );
});

const UpgradeButton = fastMemo(() => {
  const expiresAt = useExpiresAt();

  if (expiresAt === 'forever') {
    return null;
  }

  return (
    <Button
      type="primary"
      size="small"
      onClick={() => {
        navigateTo('/upgrade');
      }}
      style={{ marginRight: '0.5rem', position: 'relative', overflow: 'hidden' }}
    >
      Upgrade
      <Shine />
    </Button>
  );
});

const NoteItems = fastMemo(() => {
  const notes = useCat(notesCat);

  const handleCopy = useCallback(note => {
    copyToClipboard(note.text);
    setToastEffect(`Copied "${note.title}"!`);
  }, []);

  if (!notes.length) {
    return <PageEmpty>Which notes do you copy paste regularly?</PageEmpty>;
  }

  return (
    <>
      <Grid columns={isMobileBrowser() ? 2 : 3}>
        {notes.map(item => (
          <Grid.Item key={item.sortKey} style={{ overflow: 'hidden' }}>
            <Ellipsis
              onClick={() => handleCopy(item)}
              content={item.title}
              direction="end"
              rows="2"
              style={{
                cursor: 'pointer',
              }}
            />
          </Grid.Item>
        ))}
      </Grid>
      <Flex m="2rem 0 0" align="start">
        <Button onClick={() => navigateTo('/notes/reorder')}>Edit notes</Button>
      </Flex>
    </>
  );
});

const LinkItems = fastMemo(() => {
  const links = useCat(linksCat);

  if (!links.length) {
    return <PageEmpty>Which pages do you revisit regularly?</PageEmpty>;
  }

  return (
    <>
      <Grid columns={isMobileBrowser() ? 2 : 3}>
        {links.map(item => (
          <Grid.Item key={item.sortKey} style={{ overflow: 'hidden' }}>
            <Link
              href={item.link}
              target="_blank"
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Favicon url={item.link} />
              <Ellipsis
                content={item.title}
                direction="end"
                rows="2"
                style={{ textAlign: 'center' }}
              />
            </Link>
          </Grid.Item>
        ))}
      </Grid>

      <Flex m="2rem 0 0" align="start">
        <Button onClick={() => navigateTo('/links/reorder')}>Edit links</Button>
      </Flex>
    </>
  );
});
