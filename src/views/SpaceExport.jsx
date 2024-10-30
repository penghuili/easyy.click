import { Button, Typography } from '@douyinfe/semi-ui';
import { saveAs } from 'file-saver';
import React, { useCallback, useEffect } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { SpaceHint } from '../components/SpaceHint.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { Link } from '../shared/semi/Link.jsx';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { fetchGroupsEffect } from '../store/group/groupEffect.js';
import { isCreatingLinksCat, isLoadingPageInfoCat, useLinkGroups } from '../store/link/linkCats.js';
import { fetchLinksEffect } from '../store/link/linkEffect.js';
import { useNoteGroups } from '../store/note/noteCats.js';
import { fetchNotesEffect } from '../store/note/noteEffect.js';
import { useSpace } from '../store/space/spaceCats.js';

export const SpaceExport = fastMemo(({ queryParams: { spaceId } }) => {
  const isCreating = useCat(isCreatingLinksCat);
  const isLoadingPageInfo = useCat(isLoadingPageInfoCat);

  const space = useSpace(spaceId);
  const { groups: linkGroups, links } = useLinkGroups(false, spaceId);
  const { groups: noteGroups, notes } = useNoteGroups(spaceId);

  const handleExportLinks = useCallback(() => {
    const file = createLinksFile(linkGroups);

    const blob = new Blob([file], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `easyyclick-${space?.title || 'space'}-links.html`);
  }, [linkGroups, space?.title]);

  const handleExportNotes = useCallback(() => {
    const file = createNotesFile(noteGroups);

    const blob = new Blob([file], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `easyyclick-${space?.title || 'space'}-notes.txt`);
  }, [noteGroups, space?.title]);

  useEffect(() => {
    fetchLinksEffect(false, true, spaceId);
    fetchNotesEffect(false, true, spaceId);
    fetchGroupsEffect(false, true, spaceId);
  }, [spaceId]);

  return (
    <PageContent>
      <PageHeader
        title="Export your links and notes"
        isLoading={isCreating || isLoadingPageInfo}
        hasBack
      />

      <SpaceHint spaceId={spaceId} />

      <Typography.Title heading={3} style={{ marginBottom: '1rem' }}>
        Export your links
      </Typography.Title>

      <Typography.Paragraph style={{ marginBottom: '1rem' }}>
        You will get a html file for all your links in this space, you can then import this file in
        your browser, they will become browser bookmarks.
      </Typography.Paragraph>

      <Typography.Paragraph>
        If you're not sure how to do this, click the appropriate link to learn more:
      </Typography.Paragraph>

      <ul>
        <li>
          <Link href="https://support.google.com/chrome/answer/96816?hl=en" target="_blank">
            Import bookmarks to your Google Chrome
          </Link>
        </li>
        <li>
          <Link
            href="https://support.mozilla.org/en-US/kb/export-firefox-bookmarks-to-backup-or-transfer"
            target="_blank"
          >
            Import bookmarks to your Firefox
          </Link>
        </li>
        <li>
          <Link
            href="https://support.apple.com/guide/safari/import-bookmarks-and-passwords-ibrw1015/mac"
            target="_blank"
          >
            Import bookmarks to your Safari
          </Link>
        </li>
      </ul>

      <Typography.Title heading={5} style={{ marginBottom: '1rem' }}>
        You have {links.length} links in this space.
      </Typography.Title>
      <Button theme="solid" onClick={handleExportLinks}>
        Export them
      </Button>

      <Typography.Title heading={3} style={{ margin: '2rem 0 1rem' }}>
        Export your notes
      </Typography.Title>

      <Typography.Paragraph style={{ marginBottom: '1rem' }}>
        You will get a txt file for all your notes in this space.
      </Typography.Paragraph>

      <Typography.Title heading={5} style={{ marginBottom: '1rem' }}>
        You have {notes.length} notes in this space.
      </Typography.Title>
      <Button theme="solid" onClick={handleExportNotes}>
        Export them
      </Button>
    </PageContent>
  );
});

function createLinksFile(linkGroups) {
  let htmlContent = `
  <!DOCTYPE NETSCAPE-Bookmark-file-1>
  <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
  <TITLE>Bookmarks</TITLE>
  <H1>Bookmarks</H1>
  <DL><p>`;

  linkGroups.forEach(group => {
    htmlContent += `
    <DT><H3>${group.title}</H3>
    <DL><p>`;

    group.items.forEach(bookmark => {
      htmlContent += `
      <DT><A HREF="${bookmark.link}">${bookmark.title}</A>`;
    });

    htmlContent += `
    </DL><p>`;
  });

  htmlContent += `
  </DL><p>`;

  return htmlContent;
}

function createNotesFile(noteGroups) {
  let content = '';

  noteGroups.forEach(group => {
    content += `${group.title}
`;

    group.items.forEach(note => {
      content += `
${note.title}
${note.text}
`;
    });

    content += `

`;
  });

  return content;
}
