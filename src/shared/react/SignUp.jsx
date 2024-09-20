import { Box, Flex, Link, Text } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { errorColor } from './AppWrapper.jsx';
import { FormButton } from './FormButton.jsx';
import { privacyUrl, termsUrl } from './initShared';
import { InputField } from './InputField.jsx';
import { ItemsWrapper } from './ItemsWrapper.jsx';
import { PageHeader } from './PageHeader.jsx';
import { PasswordInput } from './PasswordInput.jsx';
import { RouteLink } from './RouteLink.jsx';
import { authErrorCat, isSigningUpCat } from './store/sharedCats.js';
import { clearAuthErrorEffect, signUpEffect } from './store/sharedEffects';

export const SignUp = fastMemo(() => {
  const errorMessage = useCat(authErrorCat);
  const isSigningUp = useCat(isSigningUpCat);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    return clearAuthErrorEffect;
  }, []);

  const isDisabled = !email || !password || isSigningUp;
  function handleSubmit() {
    if (isDisabled) {
      return;
    }

    signUpEffect(email, password);
  }

  return (
    <>
      <PageHeader title="Sign up" isLoading={isSigningUp} hasBack />

      <ItemsWrapper>
        <InputField
          type="email"
          label="Email"
          placeholder="Your email"
          value={email}
          onChange={setEmail}
        />

        <Box>
          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            onSubmit={handleSubmit}
          />
          <Text size="2">Save your password in a password manager.</Text>
        </Box>

        {!!errorMessage && <Text color={errorColor}>{errorMessage}</Text>}

        <Text margin="0.5rem 0 0" size="small">
          * By clicking Sign up, you have read and agreed to the{' '}
          <Link label="privacy policy" href={privacyUrl} target="_blank">
            privacy policy
          </Link>{' '}
          and{' '}
          <Link label="terms" href={termsUrl} target="_blank">
            terms
          </Link>
          .
        </Text>

        <FormButton onClick={handleSubmit} disabled={isDisabled} isLoading={isSigningUp}>
          Sign up
        </FormButton>

        <Flex>
          <RouteLink to="/sign-in">Already have account? Sign in</RouteLink>
        </Flex>
      </ItemsWrapper>
    </>
  );
});
