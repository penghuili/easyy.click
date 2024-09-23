import React from 'react';
import fastMemo from 'react-fast-memo';

import { PageHeader } from '../components/PageHeader.jsx';

export const Demo = fastMemo(() => {
  return (
    <>
      <PageHeader title="Demo" hasBack />
    </>
  );
});
