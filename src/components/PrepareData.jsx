import React, { useEffect, useState } from 'react';
import fastMemo from 'react-fast-memo';

import { PageEmpty } from './PageEmpty';
import { PageLoading } from './PageLoading';
import { Text } from './Text';

const PrepareDataStatus = {
  pending: 'pending',
  error: 'error',
  ready: 'ready',
};

export const PrepareData = fastMemo(({ load, children }) => {
  const [status, setStatus] = useState(PrepareDataStatus.pending);

  useEffect(() => {
    if (!load) {
      setStatus(PrepareDataStatus.ready);
      return;
    }

    load()
      .then(() => setStatus(PrepareDataStatus.ready))
      .catch(e => {
        console.log(e);
        setStatus(PrepareDataStatus.error);
      });
  }, [load]);

  if (status === PrepareDataStatus.pending) {
    return <PageLoading />;
  }

  if (status === PrepareDataStatus.error) {
    console.log('error');
    return (
      <PageEmpty>
        <Text>Something went wrong.</Text>
      </PageEmpty>
    );
  }

  return children;
});
