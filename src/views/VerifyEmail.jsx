import { Avatar, Button, Form, Typography } from '@douyinfe/semi-ui';
import { RiMailLine, RiRestartLine } from '@remixicon/react';
import React, { useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { DeleteAccountLink } from '../components/DeleteAccountLink.jsx';
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
import { contactEmail } from '../shared/js/constants.js';
import { copyContactEmailEffect } from '../store/settings/settingsEffect.js';

export const VerifyEmail = fastMemo(() => {
  const user = useCat(userCat);
  const isVerifying = useCat(isVerifyingEmailCat);
  const isResending = useCat(isResendingVerificationCodeCat);

  const [code, setCode] = useState('');

  function handleVerify() {
    verifyEmailEffect(code.trim());
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

      <Form onSubmit={handleVerify}>
        <Form.Input
          field="code"
          label="Code in your email"
          placeholder="Code"
          value={code}
          onChange={setCode}
          autoFocus
        />

        <Button
          htmlType="submit"
          theme="solid"
          block
          disabled={!code || isResending || isVerifying}
        >
          Verify
        </Button>
      </Form>

      <Flex gap="1rem" align="start" m="2rem 0 0">
        <Button
          theme="borderless"
          icon={<RiRestartLine />}
          onClick={resendVerificationCodeEffect}
          disabled={isResending || isVerifying}
        >
          Resend code
        </Button>

        <LogoutLink />

        <Button theme="borderless" icon={<RiMailLine />} onClick={copyContactEmailEffect}>
          Contact: {contactEmail}
        </Button>

        <DeleteAccountLink />

        <Typography.Paragraph>
          Used the wrong email? <RouteLink to="/security/email">Change email</RouteLink>
        </Typography.Paragraph>
      </Flex>
    </PageContent>
  );
});
