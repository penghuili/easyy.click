import { Button, NoticeBar } from '@nutui/nutui-react';
import React, { useEffect, useMemo, useState } from 'react';

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
        fill="outline"
        size="small"
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
    <NoticeBar
      content={`New version: ${changes || 'Small changes.'}`}
      scrollable
      closeable={false}
      right={rightElement}
      style={{ marginBottom: '1rem' }}
    />
  );
}
