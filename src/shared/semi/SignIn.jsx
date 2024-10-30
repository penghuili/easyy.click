import { Button, Form, Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { resetPassword } from '../browser/initShared.js';
import { PageContent } from '../browser/PageContent.jsx';
import { authErrorCat, isSigningInCat } from '../browser/store/sharedCats';
import { clearAuthErrorEffect, signInEffect } from '../browser/store/sharedEffects';
import { Flex } from './Flex.jsx';
import { PageHeader } from './PageHeader.jsx';
import { PasswordManager } from './PasswordManager.jsx';
import { RouteLink } from './RouteLink.jsx';

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
    <PageContent>
      <PageHeader title="Sign in" isLoading={isSigningIn} hasBack />

      <Form onSubmit={handleSubmit}>
        <Form.Input
          type="email"
          field="email"
          label="Email"
          placeholder="Email"
          value={email}
          onChange={setEmail}
        />

        <Form.Input
          type="password"
          field="password"
          label="Password"
          placeholder="Password"
          value={password}
          onChange={setPassword}
          extraText={<PasswordManager />}
        />

        <Flex m="1rem 0 0">
          <Button htmlType="submit" theme="solid" disabled={isDisabled}>
            Sign in
          </Button>

          {!!errorMessage && <Typography.Text type="danger">{errorMessage}</Typography.Text>}

          <RouteLink to="/sign-up" m="1rem 0 0">
            No account? Sign up
          </RouteLink>

          {resetPassword && (
            <RouteLink to="/reset-password" m="1rem 0 0">
              Forget password? Reset
            </RouteLink>
          )}
        </Flex>
      </Form>
    </PageContent>
  );
});
