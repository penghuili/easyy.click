import React from 'react';
import fastMemo from 'react-fast-memo';

import { PageContent } from '../components/PageContent.jsx';
import { PageHeader } from '../components/PageHeader.jsx';

export const Demo = fastMemo(() => {
  return (
    <PageContent>
      <PageHeader title="Demo" hasBack />
    </PageContent>
  );
});
