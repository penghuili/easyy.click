import { Spinner } from '@radix-ui/themes';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { PageEmpty } from './PageEmpty.jsx';

export const PageLoading = fastMemo(() => {
  return (
    <PageEmpty>
      <Spinner size="3" />
    </PageEmpty>
  );
});
