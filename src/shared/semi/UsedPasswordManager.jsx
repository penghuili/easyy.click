import { Banner, Button, Typography } from '@douyinfe/semi-ui';
import React from 'react';
import { useCat } from 'usecat';

import { resetPassword } from '../browser/initShared.js';
import { isUsingPasswordManagerCat, settingsCat } from '../browser/store/sharedCats';
import { usedPasswordManagerEffect } from '../browser/store/sharedEffects.js';
import { Flex } from './Flex.jsx';
import { PasswordManager } from './PasswordManager.jsx';

export function UsedPasswordManager() {
  const settings = useCat(settingsCat);
  const isConfirming = useCat(isUsingPasswordManagerCat);

  if (resetPassword || settings?.passwordManager) {
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
