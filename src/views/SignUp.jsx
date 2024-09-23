import { Button, Form, Input } from '@nutui/nutui-react';
import React, { useEffect, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { errorCssColor } from '../components/AppWrapper.jsx';
import { Flex } from '../components/Flex.jsx';
import { Link } from '../components/Link.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { RouteLink } from '../components/RouteLink.jsx';
import { Text } from '../components/Text.jsx';
import { privacyUrl, termsUrl } from '../shared/browser/initShared.js';
import { authErrorCat, isSigningUpCat } from '../shared/browser/store/sharedCats';
import { clearAuthErrorEffect, signUpEffect } from '../shared/browser/store/sharedEffects';

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

      <Form
        labelPosition="top"
        footer={
          <Flex>
            <Button nativeType="submit" type="primary" disabled={isDisabled}>
              Sign up
            </Button>

            {!!errorMessage && <Text color={errorCssColor}>{errorMessage}</Text>}

            <RouteLink to="/sign-in" m="1rem 0 0">
              Already have account? Sign in
            </RouteLink>
          </Flex>
        }
        onFinish={handleSubmit}
      >
        <Form.Item label="Email" name="email">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            rules={[{ required: true, message: 'Please input your email.' }]}
          />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={setPassword}
            rules={[{ required: true, message: 'Please input your password.' }]}
          />

          <Text m="0.5rem 0 0" size="3">
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
        </Form.Item>
      </Form>
    </>
  );
});
