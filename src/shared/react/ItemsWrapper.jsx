import React from 'react';
import { Flex } from '@radix-ui/themes';

export function ItemsWrapper({ children, align, gap = '3' }) {
  return (
    <Flex direction="column" gap={gap} align={align} mb="6">
      {children}
    </Flex>
  );
}
