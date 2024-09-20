import React from 'react';
import { Flex } from '@radix-ui/themes';

export function HorizontalCenter({ children, gap, p }) {
  return (
    <Flex direction="row" align="center" gap={gap} p={p}>
      {children}
    </Flex>
  );
}
