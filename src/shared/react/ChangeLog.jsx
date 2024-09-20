import { Box, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';

import { ItemsWrapper } from './ItemsWrapper.jsx';
import { PageHeader } from './PageHeader.jsx';
import { fetchChangeLog } from './store/sharedNetwork';

export function ChangeLog() {
  const [isFetching, setIsFetching] = useState(false);
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    setIsFetching(true);
    fetchChangeLog()
      .then(({ data }) => {
        if (data) {
          setVersions(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  return (
    <>
      <PageHeader title="Change log" isLoading={isFetching} hasBack />

      <ItemsWrapper>
        {!!versions?.length &&
          versions.map(version => (
            <Box key={version.version} pb="6">
              <Text weight="bold" as="p">
                {version.version}
              </Text>
              <Text as="p">{version.changes}</Text>
            </Box>
          ))}
      </ItemsWrapper>
    </>
  );
}
