import React from 'react';

import { fastMemo } from '../browser/fastMemo';
import { Flex } from './Flex.jsx';

export const PageEmpty = fastMemo(({ children }) => {
  return (
    <Flex direction="column" align="center" p="3rem 0">
      {children}
    </Flex>
  );
});
