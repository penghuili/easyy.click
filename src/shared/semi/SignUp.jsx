import { Button, Form, Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { useCat } from 'usecat';

import { fastMemo } from '../browser/fastMemo';
import { privacyUrl, termsUrl } from '../browser/initShared.js';
import { PageContent } from '../browser/PageContent.jsx';
import { authErrorCat, isSigningUpCat } from '../browser/store/sharedCats';
import { clearAuthErrorEffect, signUpEffect } from '../browser/store/sharedEffects';
import { Flex } from './Flex.jsx';
import { Link } from './Link.jsx';
import { PageHeader } from './PageHeader.jsx';
import { PasswordManager } from './PasswordManager.jsx';
import { RouteLink } from './RouteLink.jsx';

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
    <PageContent>
      <PageHeader title="Sign up" isLoading={isSigningUp} hasBack />

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
            Sign up
          </Button>
          {!!errorMessage && <Typography.Text type="danger">{errorMessage}</Typography.Text>}

          <Typography.Paragraph style={{ marginTop: '0.5rem' }}>
            * By clicking Sign up, you have read and agreed to the{' '}
            <Link href={privacyUrl} target="_blank">
              privacy policy
            </Link>{' '}
            and{' '}
            <Link href={termsUrl} target="_blank">
              terms
            </Link>
            .
          </Typography.Paragraph>

          <RouteLink to="/sign-in" m="1rem 0 0">
            Already have account? Sign in
          </RouteLink>
        </Flex>
      </Form>
    </PageContent>
  );
});
