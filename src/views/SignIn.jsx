import { Button, Form, Input } from '@nutui/nutui-react';
import React, { useEffect, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { errorCssColor } from '../components/AppWrapper';
import { Flex } from '../components/Flex';
import { PageHeader } from '../components/PageHeader';
import { RouteLink } from '../components/RouteLink';
import { Text } from '../components/Text';
import { authErrorCat, isSigningInCat } from '../shared/browser/store/sharedCats';
import { clearAuthErrorEffect, signInEffect } from '../shared/browser/store/sharedEffects';

export const SignIn = fastMemo(() => {
  const errorMessage = useCat(authErrorCat);
  const isSigningIn = useCat(isSigningInCat);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    return clearAuthErrorEffect;
  }, []);

  const isDisabled = !email || !password || isSigningIn;

  function handleSubmit() {
    if (isDisabled) {
      return;
    }

    signInEffect(email, password);
  }

  return (
    <>
      <PageHeader title="Sign in" isLoading={isSigningIn} hasBack />

      <Form
        labelPosition="top"
        footer={
          <Flex>
            <Button nativeType="submit" type="primary" disabled={isDisabled}>
              Sign in
            </Button>

            {!!errorMessage && <Text color={errorCssColor}>{errorMessage}</Text>}

            <RouteLink to="/sign-up" m="1rem 0 0">
              No account? Sign up
            </RouteLink>

            <RouteLink to="/reset-password" m="1rem 0 0">
              Forget password? Reset
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
        </Form.Item>
      </Form>
    </>
  );
});
