import React from 'react';
import fastMemo from 'react-fast-memo';

import { FontSize } from '../components/FontSize.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';

export const Settings = fastMemo(() => {
  return (
    <PrepareData>
      <PageContent>
        <PageHeader title="Settings" hasBack />

        <FontSize />
      </PageContent>
    </PrepareData>
  );
});
