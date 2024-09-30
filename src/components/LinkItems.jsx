import { ActionSheet, Button, Ellipsis, Grid } from '@nutui/nutui-react';
import { RiAddLine, RiMore2Line } from '@remixicon/react';
import React, { useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { noGroupSortKey } from '../lib/constants.js';
import { isMobileBrowser } from '../shared/browser/device.js';
import { isDeletingLinkCat, useLinkGroups } from '../store/link/linkCats.js';
import { deleteLinkEffect, updateLinkEffect } from '../store/link/linkEffect.js';
import { Confirm } from './Confirm.jsx';
import { Favicon } from './Favicon.jsx';
import { Flex } from './Flex.jsx';
import { Link } from './Link.jsx';
import { PageEmpty } from './PageEmpty.jsx';
import { Text } from './Text.jsx';
import { Top10Links } from './Top10Links.jsx';

const activeLinkCat = createCat(null);
const showActionSheetCat = createCat(false);

export const LinkItems = fastMemo(() => {
  const { groups: linkGroups, links } = useLinkGroups();

  if (!links.length) {
    return <PageEmpty>Which webites do you revisit regularly?</PageEmpty>;
  }

  return (
    <>
      <Flex direction="row" wrap="wrap" gap="1rem" m="0 0 1.5rem">
        <Button onClick={() => navigateTo('/links/reorder')} size="mini">
          Reorder links
        </Button>
        <Button onClick={() => navigateTo('/link-groups/add')} size="mini">
          Add tag
        </Button>
        <Button onClick={() => navigateTo('/link-groups/reorder')} size="mini">
          Update tags
        </Button>
      </Flex>

      <Top10Links />

      {linkGroups.map(group => (
        <div key={group.sortKey} style={{ marginBottom: '2rem' }}>
          <Flex direction="row" gap="1rem" align="center">
            <Text bold m="0 0 0.25rem">
              {group.title}
            </Text>

            <Button
              fill="none"
              icon={<RiAddLine />}
              onClick={() =>
                navigateTo(
                  group.sortKey === noGroupSortKey
                    ? '/links/add'
                    : `/links/add?groupId=${group.sortKey}`
                )
              }
            />
          </Flex>
          {group.items?.length ? (
            <Grid columns={isMobileBrowser() ? 2 : 3}>
              {group.items.map(link => (
                <Grid.Item key={link.sortKey} style={{ overflow: 'hidden', position: 'relative' }}>
                  <Link
                    href={link.link}
                    target="_blank"
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                    onClick={() => {
                      updateLinkEffect(link.sortKey, {
                        count: (link.count || 0) + 1,
                        showSuccess: false,
                      });
                    }}
                  >
                    <Favicon url={link.link} />
                    <Ellipsis
                      content={link.title}
                      direction="end"
                      rows="2"
                      style={{ textAlign: 'center' }}
                    />
                  </Link>

                  <Button
                    fill="none"
                    icon={<RiMore2Line width="20" height="20" />}
                    onClick={() => {
                      activeLinkCat.set(link);
                      showActionSheetCat.set(true);
                    }}
                    size="mini"
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: 0,
                    }}
                  />
                </Grid.Item>
              ))}
            </Grid>
          ) : (
            <Text>No links here.</Text>
          )}
        </div>
      ))}

      <LinkActions />
    </>
  );
});

const LinkActions = fastMemo(() => {
  const showActionSheet = useCat(showActionSheetCat);
  const activeLink = useCat(activeLinkCat);
  const isDeleting = useCat(isDeletingLinkCat);

  const [showConfirm, setShowConfirm] = useState(false);

  const options = [
    {
      name: 'Edit',
      onClick: () => {
        navigateTo(`/links/details?linkId=${activeLink?.sortKey}`);
      },
    },
    {
      name: 'Delete',
      danger: true,
      onClick: () => {
        setShowConfirm(true);
      },
    },
  ];

  const handleSelectAction = option => {
    option.onClick();
    showActionSheetCat.set(false);
  };

  return (
    <>
      <ActionSheet
        visible={showActionSheet}
        options={options}
        onSelect={handleSelectAction}
        onCancel={() => showActionSheetCat.set(false)}
      />

      <Confirm
        message="Are you sure to delete this link?"
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={async () => {
          await deleteLinkEffect(activeLink?.sortKey);
          setShowConfirm(false);
          activeLinkCat.set(null);
        }}
        isSaving={isDeleting}
      />
    </>
  );
});
