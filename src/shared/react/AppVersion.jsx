import { Text } from '@radix-ui/themes';
import React from 'react';

export function AppVersion() {
  return <Text size="2">Version: {import.meta.env.VITE_VERSION}</Text>;
}
