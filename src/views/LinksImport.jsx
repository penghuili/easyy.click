import { Button, Progress, Typography } from '@douyinfe/semi-ui';
import React, { useCallback, useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { FilePicker } from '../components/FilePicker.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { setToastEffect } from '../shared/browser/store/sharedEffects.js';
import { asyncForEach } from '../shared/js/asyncForEach.js';
import { Link } from '../shared/semi/Link.jsx';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { isCreatingGroupCat } from '../store/group/groupCats.js';
import { createGroupEffect } from '../store/group/groupEffect.js';
import { isCreatingLinksCat } from '../store/link/linkCats.js';
import { createLinksEffect } from '../store/link/linkEffect.js';
import { isCreatingSpaceCat } from '../store/space/spaceCats.js';
import { createSpaceEffect } from '../store/space/spaceEffect.js';

export const LinksImport = fastMemo(() => {
  const isCreatingSpace = useCat(isCreatingSpaceCat);
  const isCreatingGroup = useCat(isCreatingGroupCat);
  const isCreatingLinks = useCat(isCreatingLinksCat);

  const [importedCount, setImportedCount] = useState(0);

  const [groups, setGroups] = useState([]);
  const stats = useMemo(() => {
    const groupsCount = groups.length;
    const linksCount = groups.reduce((acc, group) => acc + group.items.length, 0);
    return { groupsCount, linksCount };
  }, [groups]);

  const spaces = useMemo(() => {
    const arr = [];
    let currentSpace = null;
    let currentSpaceIndex = 1;
    let currentSpaceCount = 0;

    groups.forEach(group => {
      if (!currentSpace) {
        currentSpace = { title: `Imported links ${currentSpaceIndex}`, count: 0, groups: [] };
        arr.push(currentSpace);
      }
      currentSpaceCount += group.items.length;
      if (currentSpaceCount <= 100) {
        currentSpace.groups.push(group);
        currentSpace.count += group.items.length;
      } else {
        currentSpace = {
          title: `Imported links ${++currentSpaceIndex}`,
          count: group.items.length,
          groups: [group],
        };
        arr.push(currentSpace);
        currentSpaceCount = group.items.length;
      }
    });

    return arr;
  }, [groups]);

  const handleImport = useCallback(async () => {
    await asyncForEach(spaces, async space => {
      const newSpace = await createSpaceEffect(space.title, 'rgb(0, 100, 250)', {
        showMessage: false,
      });
      if (newSpace) {
        await asyncForEach(space.groups, async group => {
          const newGroup = await createGroupEffect(group.title, newSpace.sortKey, {
            showMessage: false,
          });
          const newLinks = await createLinksEffect(
            {
              links: group.items.map(item => ({
                title: item.title,
                link: item.link,
                groupId: newGroup.sortKey,
              })),
              imported: true,
              showMessage: true,
              message: `Imported ${group.items.length} links, continue ...`,
            },
            newSpace.sortKey
          );

          if (newLinks) {
            setImportedCount(prev => prev + group.items.length);
          }
        });
      }
    });

    setToastEffect('All links are imported!');
  }, [spaces]);

  function renderStats() {
    if (spaces.length === 1) {
      return (
        <>
          <Typography.Paragraph style={{ marginBottom: '1rem' }}>
            You have {stats.linksCount} links, and your links will be imported into space{' '}
            <Typography.Text strong>{spaces[0].title}</Typography.Text>.
          </Typography.Paragraph>
        </>
      );
    }

    return (
      <>
        <Typography.Paragraph style={{ marginBottom: '1rem' }}>
          You have {stats.linksCount} links, and your links will be imported into these spaces:
        </Typography.Paragraph>

        {spaces.map(space => (
          <Typography.Paragraph key={space.title}>
            <Typography.Text strong>{space.title}</Typography.Text> ({space.count} links)
          </Typography.Paragraph>
        ))}
      </>
    );
  }

  const isCreating = isCreatingSpace || isCreatingGroup || isCreatingLinks;

  return (
    <PageContent>
      <PageHeader title="Import browser bookmarks" isLoading={isCreating} hasBack />

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
        Select the bookmarks file that you get in step 1.
      </Typography.Paragraph>

      <FilePicker
        accept="text/html"
        onSelect={files => {
          const file = files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
              const reuslt = parseBookmarksHTML(e.target.result);
              setGroups(reuslt);
            };
            reader.readAsText(file);
          }
        }}
      >
        <Button theme={stats.linksCount ? 'light' : 'solid'}>Pick the exported .html file</Button>
      </FilePicker>

      {!!groups?.length && (
        <div style={{ marginTop: '2rem' }}>
          <Typography.Title heading={3} style={{ marginBottom: '1rem' }}>
            3. Update your links
          </Typography.Title>

          {renderStats()}

          <Button
            theme="solid"
            disabled={!stats.linksCount || isCreating}
            onClick={handleImport}
            style={{
              margin: '1rem 0',
            }}
          >
            Import them now
          </Button>

          <Progress percent={Math.round((importedCount / stats.linksCount) * 100)} />

          {isCreating && (
            <Typography.Paragraph type="warning" style={{ marginTop: '1rem' }}>
              This will take a while. Please keep the tab active.
            </Typography.Paragraph>
          )}
        </div>
      )}
    </PageContent>
  );
});

function parseBookmarksHTML(htmlContent) {
  const h3s = findH3Positions(htmlContent);
  const groups = [];

  for (let i = 0; i < h3s.length; i++) {
    const h3 = h3s[i];
    const nextH3 = h3s[i + 1];
    const subString = htmlContent.slice(h3.index, nextH3?.index);
    const links = parseLinks(subString);
    if (links.length) {
      groups.push({
        title: h3.title,
        items: links,
      });
    }
  }

  return groups;
}

function parseLinks(htmlContent) {
  const aPattern = /<A HREF="(.*?)".*?>(.*?)<\/A>/gi;
  let match;
  const links = [];

  while ((match = aPattern.exec(htmlContent)) !== null) {
    links.push({
      link: match[1],
      title: match[2],
    });
  }

  return links;
}

function findH3Positions(htmlContent) {
  const h3Pattern = /<H3.*?>(.*?)<\/H3>/gi;
  let match;
  const h3Positions = [];

  while ((match = h3Pattern.exec(htmlContent)) !== null) {
    h3Positions.push({
      index: match.index,
      title: match[1],
    });
  }

  return h3Positions;
}
