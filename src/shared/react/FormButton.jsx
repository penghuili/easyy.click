import { Button, Flex } from '@radix-ui/themes';
import React from 'react';
import fastMemo from 'react-fast-memo';

export const FormButton = fastMemo(({ disabled, isLoading, onClick, children, p }) => {
  return (
    <Flex p={p}>
      <Button onClick={onClick} disabled={disabled} loading={isLoading}>
        {children}
      </Button>
    </Flex>
  );
});
