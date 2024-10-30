import { Button, Input, Typography } from '@douyinfe/semi-ui';
import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import {
  isDisabling2FACat,
  isEnabling2FACat,
  isGenerating2FACat,
  userCat,
} from '../browser/store/sharedCats.js';
import {
  disable2FAEffect,
  enable2FAEffect,
  generate2FASecretEffect,
} from '../browser/store/sharedEffects';
import { ItemsWrapper } from './ItemsWrapper.jsx';
import { PageHeader } from './PageHeader.jsx';

export const Setup2FA = fastMemo(() => {
  const user = useCat(userCat);
  const isGenerating = useCat(isGenerating2FACat);
  const isEnabling = useCat(isEnabling2FACat);
  const isDisabling = useCat(isDisabling2FACat);

  const [codeForEnable, setCodeForEnable] = useState('');
  const [codeForDisable, setCodeForDisable] = useState('');

  const isLoading = isGenerating || isEnabling || isDisabling;

  const isDisableValid = !!codeForDisable && !isLoading;
  function handleDisable() {
    if (!isDisableValid) {
      return;
    }

    disable2FAEffect(codeForDisable);
  }

  const isEnableValid = !!codeForEnable && !isLoading;
  function handleEnable() {
    if (!isEnableValid) {
      return;
    }

    enable2FAEffect(codeForEnable);
  }

  return (
    <>
      <PageHeader title="2-Factor Authentication" isLoading={isLoading} hasBack />

      <ItemsWrapper>
        {!!user?.twoFactorEnabled && !!user?.twoFactorUri && (
          <>
            <Typography.Paragraph>2-Factor Authentication is enabled.</Typography.Paragraph>

            <Input
              label="Enter the code from your authenticator app:"
              placeholder="Code"
              value={codeForDisable}
              onChange={setCodeForDisable}
              onSubmit={handleDisable}
            />

            <Button theme="solid" onClick={handleDisable} type="danger" disabled={!isDisableValid}>
              Disable 2-Factor Authentication
            </Button>
          </>
        )}

        {!user?.twoFactorEnabled && !user?.twoFactorUri && (
          <>
            <Typography.Paragraph>Setup 2-Factor authentication:</Typography.Paragraph>

            <Button theme="solid" onClick={generate2FASecretEffect} disabled={isLoading}>
              Generate your secret
            </Button>
          </>
        )}

        {!user?.twoFactorEnabled && !!user?.twoFactorUri && (
          <>
            <Typography.Paragraph>
              Scan the QR code with your authenticator app:
            </Typography.Paragraph>
            <div style={{ backgroundColor: 'var(--semi-color-fill-2)', padding: '0.5rem' }}>
              <QRCodeSVG value={user?.twoFactorUri} />
            </div>
            <Input
              label="Then enter the code from your authenticator app:"
              placeholder="Code"
              value={codeForEnable}
              onChange={setCodeForEnable}
              onSubmit={handleEnable}
            />
            <Button theme="solid" onClick={handleEnable} disabled={!isEnableValid}>
              Enable 2-Factor Authentication
            </Button>
          </>
        )}
      </ItemsWrapper>
    </>
  );
});
