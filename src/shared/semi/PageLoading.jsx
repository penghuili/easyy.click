import { Spin } from '@douyinfe/semi-ui';
import React from 'react';

import { fastMemo } from '../browser/fastMemo';
import { Flex } from './Flex.jsx';

export const PageLoading = fastMemo(() => {
  return (
    <Flex direction="column" align="center" p="3rem 0">
      <Spin size="large" />
    </Flex>
  );
});
