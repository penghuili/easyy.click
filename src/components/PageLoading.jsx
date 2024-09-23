import { Loading } from '@nutui/nutui-react';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { Flex } from './Flex.jsx';

export const PageLoading = fastMemo(() => {
  return (
    <Flex direction="column" align="center" p="3rem 0">
      <Loading type="spinner" />
    </Flex>
  );
});
