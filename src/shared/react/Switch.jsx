import React from 'react';
import { Flex, Switch as RadixSwitch, Text } from '@radix-ui/themes';

export function Switch({ label, value, onChange, disabled }) {
  return (
    <Text as="label" size="3">
      <Flex gap="2">
        <RadixSwitch size="2" checked={value} onCheckedChange={onChange} disabled={disabled} />{' '}
        {label}
      </Flex>
    </Text>
  );
}
