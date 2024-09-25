import React from 'react';
import fastMemo from 'react-fast-memo';

import { PageHeader } from '../components/PageHeader.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';

export const Demo = fastMemo(() => {
  return (
    <PageContent>
      <PageHeader title="Demo" hasBack />
    </PageContent>
  );
});
