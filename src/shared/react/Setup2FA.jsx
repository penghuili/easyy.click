import { Box, Text } from '@radix-ui/themes';
import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { errorColor } from './AppWrapper.jsx';
import { FormButton } from './FormButton.jsx';
import { InputField } from './InputField.jsx';
import { ItemsWrapper } from './ItemsWrapper.jsx';
import { PageHeader } from './PageHeader.jsx';
import {
  isDisabling2FACat,
  isEnabling2FACat,
  isGenerating2FACat,
  userCat,
} from './store/sharedCats.js';
import { disable2FAEffect, enable2FAEffect, generate2FASecretEffect } from './store/sharedEffects';

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
            <Text>2-Factor Authentication is enabled.</Text>

            <InputField
              label="Enter the code from your authenticator app:"
              placeholder="Code"
              value={codeForDisable}
              onChange={setCodeForDisable}
              onSubmit={handleDisable}
            />

            <FormButton onClick={handleDisable} color={errorColor} disabled={!isDisableValid}>
              Disable 2-Factor Authentication
            </FormButton>
          </>
        )}

        {!user?.twoFactorEnabled && !user?.twoFactorUri && (
          <>
            <Text>Setup 2-Factor authentication:</Text>

            <FormButton onClick={generate2FASecretEffect} disabled={isLoading}>
              Generate your secret
            </FormButton>
          </>
        )}

        {!user?.twoFactorEnabled && !!user?.twoFactorUri && (
          <>
            <Text>Scan the QR code with your authenticator app:</Text>
            <Box p="0.5rem" style={{ backgroundColor: 'var(--gray-3)' }}>
              <QRCodeSVG value={user?.twoFactorUri} />
            </Box>
            <InputField
              label="Then enter the code from your authenticator app:"
              placeholder="Code"
              value={codeForEnable}
              onChange={setCodeForEnable}
              onSubmit={handleEnable}
            />
            <FormButton onClick={handleEnable} disabled={!isEnableValid}>
              Enable 2-Factor Authentication
            </FormButton>
          </>
        )}
      </ItemsWrapper>
    </>
  );
});
