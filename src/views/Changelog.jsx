import { Button } from '@nutui/nutui-react';
import { RiAddLine } from '@remixicon/react';
import React, { useEffect } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Flex } from '../components/Flex.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Text } from '../components/Text.jsx';
import { useAdmin } from '../lib/useAdmin.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { changelogCat, isLoadingChangelogCat } from '../store/changelog/changelogCats.js';
import { fetchChangelogEffect } from '../store/changelog/changelogEffect.js';

export const Changelog = fastMemo(() => {
  const isLoadingGroups = useCat(isLoadingChangelogCat);
  const changelog = useCat(changelogCat);
  const isAdmin = useAdmin();

  useEffect(() => {
    fetchChangelogEffect();
  }, []);

  return (
    <PageContent paddingBottom="0">
      <PageHeader
        title="Changelog"
        isLoading={isLoadingGroups}
        hasBack
        right={
          isAdmin && (
            <Button
              type="primary"
              fill="none"
              icon={<RiAddLine />}
              onClick={() => navigateTo('/changelog/add')}
            />
          )
        }
      />

      {changelog.map(item => (
        <Flex key={item.sortKey}>
          <Text>{item.title}</Text>
        </Flex>
      ))}
    </PageContent>
  );
});
