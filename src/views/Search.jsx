import { Input, Tag, Typography } from '@douyinfe/semi-ui';
import { RiSearch2Line } from '@remixicon/react';
import Fuse from 'fuse.js';
import React, { useEffect, useRef, useState } from 'react';
import { useCat } from 'usecat';

import { InboxLinkItem } from '../components/InboxLinkItem';
import { getSpaceId, InboxNoteItem } from '../components/InboxNoteItem';
import { PageContent } from '../shared/browser/PageContent';
import { Flex } from '../shared/semi/Flex';
import { PageHeader } from '../shared/semi/PageHeader';
import { isLoadingInboxLinksCat, isLoadingLinksCat } from '../store/link/linkCats';
import { isLoadingInboxNotesCat, isLoadingNotesCat } from '../store/note/noteCats';
import { fetchForSearchEffect, useSearchContent } from '../store/search/searchEffects';

export function Search() {
  const { links, notes, spacesObj } = useSearchContent();
  const isLoadingLinks = useCat(isLoadingLinksCat);
  const isLoadingNotes = useCat(isLoadingNotesCat);
  const isLoadingInboxLinks = useCat(isLoadingInboxLinksCat);
  const isLoadingInboxNotes = useCat(isLoadingInboxNotesCat);

  const timerRef = useRef(null);
  const [term, setTerm] = useState('');

  const [foundLinks, setFoundLinks] = useState([]);
  const [foundNotes, setFoundNotes] = useState([]);

  useEffect(() => {
    fetchForSearchEffect();
  }, []);

  const handleTermChange = newTerm => {
    setTerm(newTerm);

    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      if (links?.length && newTerm) {
        const linksFound = handleSearchLinks(links, newTerm);
        setFoundLinks(linksFound);
      } else {
        setFoundLinks([]);
      }

      if (notes?.length && newTerm) {
        const notesFound = handleSearchNotes(notes, newTerm);
        setFoundNotes(notesFound);
      } else {
        setFoundNotes([]);
      }
    }, 300);
  };

  const isLoading = isLoadingLinks || isLoadingNotes || isLoadingInboxLinks || isLoadingInboxNotes;

  return (
    <PageContent>
      <PageHeader title="Search" hasBack isLoading={isLoading} />

      <Input
        placeholder="Search ..."
        prefix={<RiSearch2Line style={{ margin: '0 0.5rem' }} />}
        value={term}
        onChange={handleTermChange}
        onClear={() => setTerm('')}
        showClear
        autoFocus={!isLoading}
        disabled={isLoadingLinks || isLoadingNotes || isLoadingInboxLinks || isLoadingInboxNotes}
      />

      <Flex m="0 0 1rem">
        {!!foundNotes?.length && (
          <>
            <Typography.Title heading={6} style={{ margin: '1rem 0 0' }}>
              Found notes:
            </Typography.Title>

            {foundNotes.map(note => {
              const spaceId = getSpaceId(note);
              const spaceTitle = spacesObj[spaceId]?.title;

              return (
                <Flex key={note.sortKey} m="0.5rem 0" align="center" direction="row">
                  {!!spaceTitle && <Tag color="light-blue">#{spaceTitle}</Tag>}{' '}
                  <InboxNoteItem note={note} />
                </Flex>
              );
            })}
          </>
        )}

        {!!foundLinks?.length && (
          <>
            <Typography.Title heading={6} style={{ margin: '1rem 0 0' }}>
              Found links:
            </Typography.Title>

            {foundLinks.map(link => {
              const spaceId = getSpaceId(link);
              const spaceTitle = spacesObj[spaceId]?.title;

              return (
                <Flex key={link.sortKey} m="0.5rem 0" align="center" direction="row">
                  {!!spaceTitle && <Tag color="light-blue">#{spaceTitle}</Tag>}{' '}
                  <InboxLinkItem link={link} />
                </Flex>
              );
            })}
          </>
        )}

        {!foundNotes?.length && !foundLinks?.length && !!term && (
          <Typography.Title heading={6} style={{ margin: '1rem 0 0' }}>
            Nothing found.
          </Typography.Title>
        )}

        {isLoading && (
          <Typography.Title heading={6} style={{ margin: '1rem 0 0' }}>
            Wait a moment, loading all your links and notes ...
          </Typography.Title>
        )}
      </Flex>
    </PageContent>
  );
}

const searchOptions = {
  includeMatches: true, // Include match information
  threshold: 0.4, // Lower is more strict, higher is more fuzzy
  ignoreLocation: true, // Search in all parts of the string
  minMatchCharLength: 4, // Minimum characters to consider a match
  tokenize: true, // Split Chinese characters into individual tokens
  distance: 100, // Increase allowed distance between matches
};
function handleSearchLinks(links, text) {
  const options = {
    keys: ['title', 'link'], // Fields to search in
    ...searchOptions,
  };
  const fuse = new Fuse(links, options);

  const results = fuse.search(text);

  return results.map(result => result.item);
}

function handleSearchNotes(notes, text) {
  const options = {
    keys: ['title', 'text'], // Fields to search in
    ...searchOptions,
  };
  const fuse = new Fuse(notes, options);

  const results = fuse.search(text);

  return results.map(result => result.item);
}
