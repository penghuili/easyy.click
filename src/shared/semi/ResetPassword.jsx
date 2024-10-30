import { Button, Form } from '@douyinfe/semi-ui';
import React, { useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';

import { PageContent } from '../browser/PageContent.jsx';
import { setToastEffect } from '../browser/store/sharedEffects.js';
import { resetPasswordSave, resetPasswordTrigger } from '../browser/store/sharedNetwork.js';
import { toastTypes } from '../browser/Toast.jsx';
import { Flex } from './Flex.jsx';
import { ItemsWrapper } from './ItemsWrapper.jsx';
import { PageHeader } from './PageHeader.jsx';
import { RouteLink } from './RouteLink.jsx';

export const ResetPassword = fastMemo(() => {
  const [email, setEmail] = useState('');
  const [isTriggered, setIsTriggered] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleTrigger() {
    setIsTriggering(true);
    const { data } = await resetPasswordTrigger(email);
    if (data) {
      setIsTriggered(true);
      setToastEffect('You should get a code in your email if your account exists.');
    } else {
      setToastEffect('Something went wrong, please try again.', toastTypes.error);
    }
    setIsTriggering(false);
  }

  function renderTriggerForm() {
    if (isTriggered) {
      return null;
    }

    return (
      <>
        <Form onSubmit={handleTrigger}>
          <Form.Input
            type="email"
            field="email"
            label="Email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
          />

          <Button htmlType="submit" theme="solid" disabled={!email.trim() || isTriggering}>
            Reset password
          </Button>
        </Form>
      </>
    );
  }

  function renderSaveForm() {
    if (!isTriggered) {
      return null;
    }

    return (
      <>
        <Form
          onSubmit={async () => {
            setIsSaving(true);
            const { data } = await resetPasswordSave(email, password, code);
            if (data) {
              navigateTo('/sign-in');
              setToastEffect(
                'Your password is reset successfully. Now you can login. You need to reenable 2FA if you want.'
              );
            } else {
              setToastEffect(
                'Something went wrong, your code may be invalid. Please try again.',
                toastTypes.error
              );
            }
            setIsSaving(false);
          }}
        >
          <Form.Input
            type="email"
            field="email"
            label="Email"
            placeholder="Email"
            value={email}
            onChange={setEmail}
            disabled
          />

          <Form.Input
            field="code"
            label="Code"
            placeholder="Code"
            value={code}
            onChange={setCode}
          />

          <Form.Input
            type="password"
            field="password"
            label="New password"
            placeholder="New password"
            value={password}
            onChange={setPassword}
          />

          <Button
            htmlType="submit"
            theme="solid"
            disabled={!email.trim() || !code.trim() || !password.trim() || isSaving}
          >
            Change
          </Button>

          <Flex m="1rem 0 0">
            <Button onClick={handleTrigger}>Resend code</Button>
          </Flex>
        </Form>
      </>
    );
  }

  return (
    <PageContent>
      <PageHeader title="Reset password" isLoading={isTriggering || isSaving} hasBack />

      <ItemsWrapper>
        {renderTriggerForm()}

        {renderSaveForm()}

        <Flex>
          <RouteLink to="/sign-up">No account? Sign up</RouteLink>
        </Flex>
      </ItemsWrapper>
    </PageContent>
  );
});
