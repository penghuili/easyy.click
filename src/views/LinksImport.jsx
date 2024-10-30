import { Button, Typography } from '@douyinfe/semi-ui';
import React, { useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { CreateLinksForm } from '../components/CreateLinksForm.jsx';
import { FilePicker } from '../components/FilePicker.jsx';
import { SpaceHint } from '../components/SpaceHint.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { setToastEffect } from '../shared/browser/store/sharedEffects.js';
import { Link } from '../shared/semi/Link.jsx';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { importedGroupSortKey } from '../store/group/groupCats.js';
import { isCreatingLinksCat, isLoadingPageInfoCat } from '../store/link/linkCats.js';

export const LinksImport = fastMemo(({ queryParams: { spaceId } }) => {
  const isCreating = useCat(isCreatingLinksCat);
  const isLoadingPageInfo = useCat(isLoadingPageInfoCat);

  const [links, setLinks] = useState([]);

  return (
    <PageContent>
      <PageHeader
        title="Import browser bookmarks"
        isLoading={isCreating || isLoadingPageInfo}
        hasBack
      />

      <SpaceHint spaceId={spaceId} />

      <Typography.Title heading={3} style={{ marginBottom: '1rem' }}>
        1. Export your bookmarks
      </Typography.Title>

      <Typography.Paragraph style={{ marginBottom: '1rem' }}>
        easyy.click doesn't have access to your browser bookmarks. So you need to firstly export
        your bookmarks.
      </Typography.Paragraph>

      <Typography.Paragraph>
        Open your browser's bookmark manager and export your bookmarks as a{' '}
        <Typography.Text strong>.html</Typography.Text> file. If you're not sure how to do this,
        click the appropriate link to learn more:
      </Typography.Paragraph>

      <ul>
        <li>
          <Link href="https://support.google.com/chrome/answer/96816?hl=en" target="_blank">
            Export your bookmarks from Google Chrome
          </Link>
        </li>
        <li>
          <Link
            href="https://support.mozilla.org/en-US/kb/export-firefox-bookmarks-to-backup-or-transfer"
            target="_blank"
          >
            Export your bookmarks from Firefox
          </Link>
        </li>
        <li>
          <Link
            href="https://support.apple.com/guide/safari/import-bookmarks-and-passwords-ibrw1015/mac"
            target="_blank"
          >
            Export your bookmarks from Safari
          </Link>
        </li>
      </ul>

      <Typography.Title heading={3} style={{ marginBottom: '1rem' }}>
        2. Import your bookmarks
      </Typography.Title>

      <Typography.Paragraph style={{ marginBottom: '1rem' }}>
        Select the bookmarks file that you exported to upload:
      </Typography.Paragraph>

      <FilePicker
        accept="text/html"
        onSelect={files => {
          const file = files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
              const content = e.target.result;
              const parser = new DOMParser();
              const doc = parser.parseFromString(content, 'text/html');
              const links = doc.querySelectorAll('a');
              const bookmarks = Array.from(links).map(link => ({
                link: link.href,
                title: link.textContent,
                groupId: importedGroupSortKey,
              }));
              if (bookmarks.length) {
                setLinks(bookmarks);
              } else {
                setToastEffect('No bookmarks found.');
              }
            };
            reader.readAsText(file);
          }
        }}
      >
        <Button theme="solid">Pick the exported .html file</Button>
      </FilePicker>

      {!!links?.length && (
        <div style={{ marginTop: '2rem' }}>
          <Typography.Title heading={3} style={{ marginBottom: '1rem' }}>
            3. Update your links
          </Typography.Title>

          <Typography.Paragraph style={{ marginBottom: '1rem' }}>
            Delete links you don't need, or give it a new name, or tag it.
          </Typography.Paragraph>

          <CreateLinksForm
            initLinks={links}
            spaceId={spaceId}
            firstOneDeletable
            showImportedGroup
            createLabel="Import bookmarks"
          />
        </div>
      )}
    </PageContent>
  );
});
