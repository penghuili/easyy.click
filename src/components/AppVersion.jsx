import { Typography } from '@douyinfe/semi-ui';
import React from 'react';

export function AppVersion() {
  return <Typography.Text size="small">Version: {import.meta.env.VITE_VERSION}</Typography.Text>;
}
