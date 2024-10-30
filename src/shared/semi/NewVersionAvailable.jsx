import { Banner, Typography } from '@douyinfe/semi-ui';
import { RiRefreshLine } from '@remixicon/react';
import React, { useEffect, useState } from 'react';

import { themeCssColor } from './AppWrapper.jsx';
import { Link } from './Link.jsx';

export function NewVersionAvailable() {
  const [newVersion, setNewVersion] = useState('');
  const [changes, setChanges] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    async function fetchNewVersion() {
      try {
        const response = await fetch(`${location.origin}/version.json`);
        const json = await response.json();
        if (json?.version && +json.version - +import.meta.env.VITE_VERSION > 500) {
          setNewVersion(json.version);
          setChanges(json.changes);
          setLink(json.link);
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
      description={
        <Typography.Text>
          New version: {changes || 'Small changes.'}
          {link ? (
            <Link href={link} target="_blank" m="0 0 0 0.5rem">
              Learn more
            </Link>
          ) : (
            ''
          )}
        </Typography.Text>
      }
      fullMode={false}
      closeIcon={<RiRefreshLine color={themeCssColor} />}
      onClose={() => {
        location.reload();
      }}
      style={{ marginBottom: '1rem' }}
    />
  );
}
