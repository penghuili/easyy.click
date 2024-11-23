import React from 'react';

import { fastMemo } from '../browser/fastMemo';
import { PageContent } from '../browser/PageContent.jsx';
import { DarkMode } from './DarkMode.jsx';
import { PageHeader } from './PageHeader.jsx';

export const Settings = fastMemo(() => {
  return (
    <PageContent>
      <PageHeader title="Settings" hasBack />

      <DarkMode />
    </PageContent>
  );
});
