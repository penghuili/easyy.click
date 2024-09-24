import { Avatar, Button, Form, Input } from '@nutui/nutui-react';
import React, { useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Flex } from '../components/Flex.jsx';
import { LogoutLink } from '../components/LogoutLink.jsx';
import { PageContent } from '../components/PageContent.jsx';
import { RouteLink } from '../components/RouteLink.jsx';
import { Text } from '../components/Text.jsx';
import { appName, logo } from '../shared/browser/initShared.js';
import {
  isResendingVerificationCodeCat,
  isVerifyingEmailCat,
  userCat,
} from '../shared/browser/store/sharedCats';
import {
  resendVerificationCodeEffect,
  verifyEmailEffect,
} from '../shared/browser/store/sharedEffects';

export const VerifyEmail = fastMemo(() => {
  const user = useCat(userCat);
  const isVerifying = useCat(isVerifyingEmailCat);
  const isResending = useCat(isResendingVerificationCodeCat);

  const [code, setCode] = useState('');

  function handleVerify() {
    verifyEmailEffect(code);
  }

  return (
    <PageContent>
      <Flex direction="row" align="center" p="2rem 0 0" gap="2">
        <Avatar src={logo} shape="square" background="transparent" />{' '}
        <Text as="h2" size="6" m="0 0 0 1rem">
          {appName}
        </Text>
      </Flex>

      <Text as="h3" size="5" m="1rem 0">
        Verify your email
      </Text>

      {!!user?.email && <Text>Current email: {user.email}</Text>}

      <Form
        labelPosition="top"
        footer={
          <Flex gap="1rem" align="start">
            <Button nativeType="submit" type="primary" disabled={!code || isVerifying}>
              Verify
            </Button>

            <Button
              fill="outline"
              onClick={resendVerificationCodeEffect}
              disabled={isResending}
              style={{ marginTop: '2rem' }}
            >
              Resend code
            </Button>

            <LogoutLink />

            <Text>
              Used the wrong email? <RouteLink to="/security/email">Change email</RouteLink>
            </Text>
          </Flex>
        }
        onFinish={handleVerify}
      >
        <Form.Item
          label="Verification code"
          name="code"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input placeholder="Code" value={code} onChange={setCode} />
        </Form.Item>
      </Form>
    </PageContent>
  );
});
