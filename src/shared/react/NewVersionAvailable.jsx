import { Button, Text } from '@radix-ui/themes';
import React, { useEffect, useMemo, useState } from 'react';

import { Banner } from './Banner.jsx';

export function NewVersionAvailable() {
  const [newVersion, setNewVersion] = useState('');
  const [changes, setChanges] = useState('');

  useEffect(() => {
    async function fetchNewVersion() {
      try {
        const response = await fetch(`${location.origin}/version.json`);
        const json = await response.json();
        if (json?.version && json.version > import.meta.env.VITE_VERSION) {
          setNewVersion(json.version);
          setChanges(json.changes);
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }

    window.addEventListener('focus', fetchNewVersion);

    fetchNewVersion();

    return () => window.removeEventListener('focus', fetchNewVersion);
  }, []);

  const rightElement = useMemo(
    () => (
      <Button
        variant="soft"
        onClick={() => {
          location.reload();
        }}
      >
        Update
      </Button>
    ),
    []
  );

  if (!newVersion) {
    return null;
  }

  return (
    <Banner open right={rightElement}>
      <Text weight="bold" as="p">
        New version: {newVersion}
      </Text>
      <Text as="p">{changes || 'Small changes.'}</Text>
    </Banner>
  );
}
