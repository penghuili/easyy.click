import { Avatar, Button, PinCode, Typography } from '@douyinfe/semi-ui';
import React from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Flex } from '../components/Flex.jsx';
import { LogoutLink } from '../components/LogoutLink.jsx';
import { RouteLink } from '../components/RouteLink.jsx';
import { appName, logo } from '../shared/browser/initShared.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
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

  function handleVerify(code) {
    verifyEmailEffect(code);
  }

  return (
    <PageContent>
      <Flex direction="row" align="center" p="2rem 0 0" gap="2">
        <Avatar src={logo} /> <Typography.Title heading={3}>{appName}</Typography.Title>
      </Flex>

      <Typography.Title heading={4} style={{ margin: '1rem 0' }}>
        Verify your email
      </Typography.Title>

      {!!user?.email && <Typography.Paragraph>Your email: {user.email}</Typography.Paragraph>}

      <Typography.Text style={{ margin: '2rem 0 0.5rem', display: 'block', fontWeight: 'bold' }}>
        Verification code
      </Typography.Text>
      <PinCode
        format={'number'}
        autoFocus
        onComplete={value => handleVerify(value)}
        disabled={isVerifying}
      />

      <Flex gap="1rem" align="start" m="2rem 0 0">
        <Button
          theme="borderless"
          onClick={resendVerificationCodeEffect}
          disabled={isResending || isVerifying}
        >
          Resend code
        </Button>

        <LogoutLink />

        <Typography.Paragraph>
          Used the wrong email? <RouteLink to="/security/email">Change email</RouteLink>
        </Typography.Paragraph>
      </Flex>
    </PageContent>
  );
});
