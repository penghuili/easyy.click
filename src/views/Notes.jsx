import { Button, Grid, TabPane, Tabs } from '@nutui/nutui-react';
import { RiAddLine, RiUser2Line } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Favicon } from '../components/Favicon.jsx';
import { Flex } from '../components/Flex.jsx';
import { Link } from '../components/Link.jsx';
import { PageContent } from '../components/PageContent.jsx';
import { PageEmpty } from '../components/PageEmpty.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { Text } from '../components/Text.jsx';
import { localStorageKeys } from '../lib/constants.js';
import { copyToClipboard } from '../lib/copyToClipboard';
import { ellipsisStyle } from '../lib/styles.js';
import { isMobileBrowser } from '../shared/browser/device.js';
import { LocalStorage } from '../shared/browser/LocalStorage.js';
import { setToastEffect } from '../shared/browser/store/sharedEffects.js';
import { linksCat } from '../store/link/linkCats.js';
import { fetchLinksEffect } from '../store/link/linkEffect.js';
import { notesCat } from '../store/note/noteCats.js';
import { fetchNotesEffect } from '../store/note/noteEffect.js';

async function load() {
  await fetchNotesEffect();
  await fetchLinksEffect();
}

const savedTab = LocalStorage.get(localStorageKeys.activeTab);

export const Notes = fastMemo(() => {
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

  return (
    <PrepareData load={load}>
      <PageContent>
        <PageHeader
          title={
            <Tabs value={tab} onChange={handleChangeTab}>
              <TabPane key="links" value="links" title="Links"></TabPane>
              <TabPane key="notes" value="notes" title="Notes"></TabPane>
            </Tabs>
          }
          right={
            <>
              <Button type="primary" fill="none" icon={<RiAddLine />} onClick={handleAdd} />

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

const NoteItems = fastMemo(() => {
  const notes = useCat(notesCat);

  const handleCopy = useCallback(note => {
    copyToClipboard(note.text);
    setToastEffect(`Copied "${note.title}"!`);
  }, []);

  if (!notes.length) {
    return <PageEmpty>No notes.</PageEmpty>;
  }

  return (
    <>
      <Grid columns={isMobileBrowser() ? 2 : 3}>
        {notes.map(item => (
          <Grid.Item key={item.sortKey} style={{ overflow: 'hidden' }}>
            <Text
              as="span"
              onClick={() => handleCopy(item)}
              style={{ ...ellipsisStyle, display: 'inline-block', cursor: 'pointer' }}
            >
              {item.title}
            </Text>
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
    return <PageEmpty>No links.</PageEmpty>;
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
                ...ellipsisStyle,
                display: 'inline-block',
              }}
            >
              <Favicon url={item.link} />
              {item.title}
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
