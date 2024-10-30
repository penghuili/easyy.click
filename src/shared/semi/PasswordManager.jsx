import { Typography } from '@douyinfe/semi-ui';
import React from 'react';

import { resetPassword } from '../browser/initShared.js';
import { Link } from './Link.jsx';

export function PasswordManager() {
  if (resetPassword) {
    return null;
  }
  return (
    <Typography.Paragraph>
      Use a password manager for your password. Because of end-to-end encryption, if you forget your
      password, there is no way to decrypt your data. Learn more about{' '}
      <Link href="https://easyy.click/encryption/" target="_blank" rel="noreferrer">
        encryption
      </Link>
      .
    </Typography.Paragraph>
  );
}
