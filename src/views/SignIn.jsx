import { Button, Form, Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { useCat } from 'usecat';

import { fastMemo } from '../shared/browser/fastMemo';
import { resetPassword } from '../shared/browser/initShared.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { authErrorCat, isSigningInCat } from '../shared/browser/store/sharedCats';
import { clearAuthErrorEffect, signInEffect } from '../shared/browser/store/sharedEffects';
import { Flex } from '../shared/semi/Flex.jsx';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { PasswordManager } from '../shared/semi/PasswordManager.jsx';
import { RouteLink } from '../shared/semi/RouteLink.jsx';

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
