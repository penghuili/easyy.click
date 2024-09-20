import { Flex, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { errorColor } from './AppWrapper.jsx';
import { FormButton } from './FormButton.jsx';
import { InputField } from './InputField.jsx';
import { ItemsWrapper } from './ItemsWrapper.jsx';
import { PageHeader } from './PageHeader.jsx';
import { RouteLink } from './RouteLink.jsx';
import { authErrorCat, isVerifying2FACat } from './store/sharedCats.js';
import { clearAuthErrorEffect, verify2FAEffect } from './store/sharedEffects';

export const Verify2FA = fastMemo(() => {
  const errorMessage = useCat(authErrorCat);
  const isVerifying = useCat(isVerifying2FACat);

  const [code, setCode] = useState('');

  useEffect(() => {
    return clearAuthErrorEffect;
  }, []);

  const isDisabled = !code || isVerifying;
  function handleSubmit() {
    if (isDisabled) {
      return;
    }

    verify2FAEffect(code);
  }

  return (
    <>
      <PageHeader title="2-factor Authentication" isLoading={isVerifying} hasBack />

      <ItemsWrapper>
        <Text>Enter the code from your authenticator app</Text>

        <InputField
          title="Code"
          value={code}
          autoFocus
          onChange={setCode}
          onSubmit={handleSubmit}
        />
        {!!errorMessage && <Text color={errorColor}>{errorMessage}</Text>}

        <FormButton onClick={handleSubmit} disabled={isDisabled}>
          Verify
        </FormButton>

        <Flex>
          <RouteLink to="/sign-in">Cancel</RouteLink>
        </Flex>
      </ItemsWrapper>
    </>
  );
});
