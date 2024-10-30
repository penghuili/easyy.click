import React from 'react';
import fastMemo from 'react-fast-memo';

import { ExtensionIntro } from '../components/ExtensionIntro.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { PageHeader } from '../shared/semi/PageHeader.jsx';

export const BrowserExtension = fastMemo(() => {
  return (
    <PageContent>
      <PageHeader title="Browser extension" hasBack />

      <ExtensionIntro />
    </PageContent>
  );
});
