import { Banner } from '@douyinfe/semi-ui';
import { RiRefreshLine } from '@remixicon/react';
import React, { useEffect, useState } from 'react';

import { themeCssColor } from './AppWrapper';

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

  if (!newVersion) {
    return null;
  }

  return (
    <Banner
      type="success"
      description={`New version: ${changes || 'Small changes.'}`}
      fullMode={false}
      closeIcon={<RiRefreshLine color={themeCssColor} />}
      onClose={() => {
        location.reload();
      }}
      style={{ marginBottom: '1rem' }}
    />
  );
}
