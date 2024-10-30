import React from 'react';

import { Flex } from './Flex.jsx';

export function ItemsWrapper({ children, align, gap = '1rem' }) {
  return (
    <Flex direction="column" gap={gap} align={align} m="0 0 2rem">
      {children}
    </Flex>
  );
}
