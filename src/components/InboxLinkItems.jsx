import { Button, Checkbox, Typography } from '@douyinfe/semi-ui';
import React, { useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { useItemsDates } from '../lib/useItemsDates.js';
import { formatDateTime } from '../shared/js/date.js';
import { Flex } from '../shared/semi/Flex.jsx';
import { PageLoading } from '../shared/semi/PageLoading.jsx';
import { inboxLinksStartKeyCat, isLoadingInboxLinksCat, useLinks } from '../store/link/linkCats.js';
import { fetchInboxLinksEffect } from '../store/link/linkEffect.js';
import { inboxSpaceId } from '../store/space/spaceCats.js';
import { BulkUpdateLinks } from './BulkUpdateLinks.jsx';
import { ExtensionIntro } from './ExtensionIntro.jsx';
import { InboxLinkItem } from './InboxLinkItem.jsx';

export const InboxLinkItems = fastMemo(() => {
  const links = useLinks(inboxSpaceId);
  const startKey = useCat(inboxLinksStartKeyCat);

  const isLoading = useCat(isLoadingInboxLinksCat);

  const [linksToUpdateObj, setLinksToUpdateObj] = useState({});

  const dates = useItemsDates(links);

  const allCheckboxValue = useMemo(() => {
    const selectedCount = Object.values(linksToUpdateObj).filter(Boolean).length;
    const allCount = links?.length;
    return {
      all: !!allCount && selectedCount === allCount,
      some: selectedCount > 0 && selectedCount < allCount,
    };
  }, [links?.length, linksToUpdateObj]);

  if (!links.length) {
    return <>{isLoading ? <PageLoading /> : <ExtensionIntro />}</>;
  }

  return (
    <>
      <BulkUpdateLinks
        spaceId={inboxSpaceId}
        linksObj={linksToUpdateObj}
        onReset={() => setLinksToUpdateObj({})}
        showCancel={false}
      />

      {!!links.length && (
        <Checkbox
          checked={allCheckboxValue.all}
          onChange={e => {
            if (e.target.checked) {
              setLinksToUpdateObj(Object.fromEntries(links.map(link => [link.sortKey, link])));
            } else {
              setLinksToUpdateObj({});
            }
          }}
          style={{ marginBottom: '1rem' }}
        >
          <Typography.Text strong>Select all</Typography.Text>
        </Checkbox>
      )}

      {links.map(link => (
        <div key={link.sortKey}>
          {!!dates[link.sortKey] && (
            <Typography.Title heading={4} style={{ margin: '1rem 0 0.5rem' }}>
              {dates[link.sortKey].day} ({dates[link.sortKey].count})
            </Typography.Title>
          )}
          <Typography.Paragraph size="small" style={{ marginLeft: '1.5rem' }}>
            {formatDateTime(link.createdAt)}
          </Typography.Paragraph>
          <Flex direction="row" m="0 0 0.5rem">
            <Checkbox
              checked={!!linksToUpdateObj[link.sortKey]}
              onChange={e => {
                setLinksToUpdateObj({
                  ...linksToUpdateObj,
                  [link.sortKey]: e.target.checked ? link : null,
                });
              }}
              style={{ marginRight: '0.5rem' }}
            />

            <InboxLinkItem link={link} />
          </Flex>
        </div>
      ))}

      {!!startKey && (
        <Button
          theme="solid"
          onClick={() => {
            fetchInboxLinksEffect(startKey);
          }}
          disabled={isLoading}
          loading={isLoading}
          style={{
            marginTop: '1rem',
          }}
        >
          Load more
        </Button>
      )}
    </>
  );
});
