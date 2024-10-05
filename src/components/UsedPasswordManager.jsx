import { Banner, Button, Typography } from '@douyinfe/semi-ui';
import React from 'react';
import { useCat } from 'usecat';

import { settingsCat } from '../shared/browser/store/sharedCats';
import { isUsingPasswordManagerCat } from '../store/settings/settingsCats';
import { usedPasswordManagerEffect } from '../store/settings/settingsEffect';
import { Flex } from './Flex';
import { PasswordManager } from './PasswordManager';

export function UsedPasswordManager() {
  const settings = useCat(settingsCat);
  const isConfirming = useCat(isUsingPasswordManagerCat);

  if (settings?.passwordManager) {
    return null;
  }

  return (
    <Banner
      fullMode={false}
      type="warning"
      bordered
      icon={null}
      closeIcon={null}
      description={
        <Flex gap="1rem" align="start">
          <PasswordManager />
          <Typography.Paragraph>Click the button below to hide this message.</Typography.Paragraph>
          <Button theme="solid" onClick={usedPasswordManagerEffect} disabled={isConfirming}>
            My password is safe
          </Button>
        </Flex>
      }
      style={{ marginBottom: '2rem' }}
    />
  );
}
