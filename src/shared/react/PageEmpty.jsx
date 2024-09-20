import { Flex } from '@radix-ui/themes';
import React from 'react';
import fastMemo from 'react-fast-memo';

export const PageEmpty = fastMemo(({ children }) => {
  return (
    <Flex align="center" py="8" direction="column">
      {children}
    </Flex>
  );
});
