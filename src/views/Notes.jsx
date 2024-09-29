import { Button, TabPane, Tabs } from '@nutui/nutui-react';
import { RiRefreshLine, RiUser3Line } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { FloatAction } from '../components/FloatAction.jsx';
import { LinkItems } from '../components/LinkItems.jsx';
import { NoteItems } from '../components/NoteItems.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { localStorageKeys } from '../lib/constants.js';
import { LocalStorage } from '../shared/browser/LocalStorage.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { Shine } from '../shared/browser/Shine.jsx';
import { useExpiresAt } from '../shared/browser/store/sharedCats.js';
import { isLoadingLinksCat } from '../store/link/linkCats.js';
import { fetchLinksEffect } from '../store/link/linkEffect.js';
import { fetchLinkGroupsEffect } from '../store/linkGroup/linkGroupEffect.js';
import { isLoadingNotesCat } from '../store/note/noteCats.js';
import { fetchNotesEffect } from '../store/note/noteEffect.js';
import { fetchNoteGroupsEffect } from '../store/noteGroup/noteGroupEffect.js';

async function load(force) {
  fetchLinkGroupsEffect(force);
  fetchNoteGroupsEffect(force);
  fetchNotesEffect(force);
  fetchLinksEffect(force);
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
      <FloatAction onClick={handleAdd} />

      <PageContent>
        <Header tab={tab} onTabChange={handleChangeTab} />

        {isNotes ? <NoteItems /> : <LinkItems />}
      </PageContent>
    </PrepareData>
  );
});

const Header = fastMemo(({ tab, onTabChange }) => {
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
          <Tabs value={tab} onChange={onTabChange}>
            <TabPane key="links" value="links" title="Links"></TabPane>
            <TabPane key="notes" value="notes" title="Notes"></TabPane>
          </Tabs>
          {!isLoading && (
            <Button type="primary" fill="none" icon={<RiRefreshLine />} onClick={handleRefresh} />
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
            icon={<RiUser3Line />}
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

// const NoteItems = fastMemo(() => {
//   const notes = useCat(notesCat);

//   const handleCopy = useCallback(note => {
//     copyToClipboard(note.text);
//     setToastEffect(`Copied "${note.title}"!`);
//   }, []);

//   if (!notes.length) {
//     return <PageEmpty>Which notes do you copy paste regularly?</PageEmpty>;
//   }

//   return (
//     <>
//       <Grid columns={isMobileBrowser() ? 2 : 3}>
//         {notes.map(item => (
//           <Grid.Item key={item.sortKey} style={{ overflow: 'hidden' }}>
//             <Ellipsis
//               onClick={() => handleCopy(item)}
//               content={item.title}
//               direction="end"
//               rows="2"
//               style={{
//                 cursor: 'pointer',
//               }}
//             />
//           </Grid.Item>
//         ))}
//       </Grid>
//       <Flex m="2rem 0 0" align="start">
//         <Button onClick={() => navigateTo('/notes/reorder')}>Edit notes</Button>
//       </Flex>
//     </>
//   );
// });

// const activeLinkCat = createCat(null);
// const LinkItems = fastMemo(() => {
//   const { groups: linkGroups, links } = useLinkGroups();

//   if (!links.length) {
//     return <PageEmpty>Which webites do you revisit regularly?</PageEmpty>;
//   }

//   return (
//     <>
//       <Flex direction="row" wrap="wrap" gap="1rem" m="0 0 1.5rem">
//         <Button onClick={() => navigateTo('/links/reorder')} size="mini">
//           Reorder links
//         </Button>
//         <Button onClick={() => navigateTo('/link-groups/add')} size="mini">
//           Add tag
//         </Button>
//         <Button onClick={() => navigateTo('/link-groups/reorder')} size="mini">
//           Reorder tags
//         </Button>
//       </Flex>

//       {linkGroups.map(group => (
//         <div key={group.sortKey} style={{ marginBottom: '2rem' }}>
//           <Text bold m="0 0 0.25rem">
//             {group.title}
//           </Text>
//           {group.items?.length ? (
//             <Grid columns={isMobileBrowser() ? 2 : 3}>
//               {group.items.map(link => (
//                 <Grid.Item key={link.sortKey} style={{ overflow: 'hidden', position: 'relative' }}>
//                   <Link
//                     href={link.link}
//                     target="_blank"
//                     style={{
//                       display: 'inline-flex',
//                       flexDirection: 'column',
//                       alignItems: 'center',
//                     }}
//                   >
//                     <Favicon url={link.link} />
//                     <Ellipsis
//                       content={link.title}
//                       direction="end"
//                       rows="2"
//                       style={{ textAlign: 'center' }}
//                     />
//                   </Link>

//                   <Button
//                     fill="none"
//                     icon={<RiMore2Line width="20" height="20" />}
//                     onClick={() => activeLinkCat.set(link)}
//                     size="mini"
//                     style={{
//                       position: 'absolute',
//                       top: '0.5rem',
//                       right: 0,
//                     }}
//                   />
//                 </Grid.Item>
//               ))}
//             </Grid>
//           ) : (
//             <Text>No links here.</Text>
//           )}
//         </div>
//       ))}

//       <LinkActions />
//     </>
//   );
// });

// const LinkActions = fastMemo(() => {
//   const activeLink = useCat(activeLinkCat);

//   const options = [
//     {
//       name: 'Edit',
//       onClick: () => {
//         navigateTo(`/links/details?linkId=${activeLink?.sortKey}`);
//       },
//     },
//     {
//       name: 'Delete',
//       danger: true,
//       onClick: () => {
//         deleteLinkEffect(activeLink?.sortKey);
//       },
//     },
//   ];

//   const handleSelectAction = option => {
//     option.onClick();
//     activeLinkCat.set(null);
//   };

//   return (
//     <ActionSheet
//       visible={!!activeLink}
//       title={activeLink?.title}
//       options={options}
//       onSelect={handleSelectAction}
//       onCancel={() => activeLinkCat.set(null)}
//     />
//   );
// });
