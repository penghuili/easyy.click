import React from 'react';
import fastMemo from 'react-fast-memo';

import { FontSize } from '../components/FontSize.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';

export const Settings = fastMemo(() => {
  return (
    <PrepareData>
      <PageHeader title="Settings" hasBack />

      <FontSize />
    </PrepareData>
  );
});
