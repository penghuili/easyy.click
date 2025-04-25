import { Input, Typography } from '@douyinfe/semi-ui';
import { RiSearch2Line } from '@remixicon/react';
import Fuse from 'fuse.js';
import React, { useEffect, useState } from 'react';

import { useDebounce } from '../lib/useDebounce';
import { Flex } from '../shared/semi/Flex';
import { useLinks } from '../store/link/linkCats';
import { useNotes } from '../store/note/noteCats';
import { inboxSpaceId } from '../store/space/spaceCats';
import { InboxLinkItem } from './InboxLinkItem';
import { InboxNoteItem } from './InboxNoteItem';

export function SearchInbox() {
  const links = useLinks(inboxSpaceId);
  const notes = useNotes(inboxSpaceId);

  const [term, setTerm] = useState('');
  const debouncedTerm = useDebounce(term, 300);

  const [foundLinks, setFoundLinks] = useState([]);
  const [foundNotes, setFoundNotes] = useState([]);

  useEffect(() => {
    if (links?.length && debouncedTerm) {
      const linksFound = handleSearchLinks(links, debouncedTerm);
      setFoundLinks(linksFound);
    } else {
      setFoundLinks([]);
    }

    if (notes?.length && debouncedTerm) {
      const notesFound = handleSearchNotes(notes, debouncedTerm);
      setFoundNotes(notesFound);
    } else {
      setFoundNotes([]);
    }
  }, [debouncedTerm, links, notes]);

  return (
    <>
      <div>
        <Input
          placeholder="Search inbox ..."
          prefix={<RiSearch2Line style={{ marginRight: '0.5rem' }} />}
          value={term}
          onChange={setTerm}
          onClear={() => setTerm('')}
          showClear
        />

        <Flex m="0 0 1rem">
          {!!foundNotes?.length && (
            <>
              <Typography.Title heading={6} style={{ margin: '1rem 0 0' }}>
                Found notes
              </Typography.Title>

              {foundNotes.map(note => (
                <Flex m="0.5rem 0" key={note.sortKey} align="center" direction="row">
                  <InboxNoteItem note={note} />
                </Flex>
              ))}
            </>
          )}

          {!!foundLinks?.length && (
            <>
              <Typography.Title heading={6} style={{ margin: '1rem 0 0' }}>
                Found links
              </Typography.Title>

              {foundLinks.map(link => (
                <Flex m="0.5rem 0" key={link.sortKey} align="center" direction="row">
                  <InboxLinkItem link={link} />
                </Flex>
              ))}
            </>
          )}

          {!foundNotes?.length && !foundLinks?.length && !!debouncedTerm && (
            <Typography.Title heading={6} style={{ margin: '1rem 0 0' }}>
              Nothing found.
            </Typography.Title>
          )}
        </Flex>
      </div>

      <hr />
    </>
  );
}

const searchOptions = {
  includeMatches: true, // Include match information
  threshold: 0.4, // Lower is more strict, higher is more fuzzy
  ignoreLocation: true, // Search in all parts of the string
  minMatchCharLength: 2, // Minimum characters to consider a match
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
