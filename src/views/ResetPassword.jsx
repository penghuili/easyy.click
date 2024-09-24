import { Button, Form, Input } from '@nutui/nutui-react';
import React, { useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';

import { Flex } from '../components/Flex';
import { ItemsWrapper } from '../components/ItemsWrapper';
import { PageContent } from '../components/PageContent';
import { PageHeader } from '../components/PageHeader';
import { RouteLink } from '../components/RouteLink';
import { setToastEffect } from '../shared/browser/store/sharedEffects';
import { resetPasswordSave, resetPasswordTrigger } from '../shared/browser/store/sharedNetwork';
import { toastTypes } from '../shared/browser/Toast';

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
        <Form
          labelPosition="top"
          footer={
            <Button nativeType="submit" type="primary" disabled={!email.trim() || isTriggering}>
              Reset password
            </Button>
          }
          onFinish={handleTrigger}
        >
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Required' }]}>
            <Input type="email" placeholder="Email" value={email} onChange={setEmail} />
          </Form.Item>
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
          labelPosition="top"
          footer={
            <>
              <Button
                nativeType="submit"
                type="primary"
                disabled={!email.trim() || !code.trim() || !password.trim() || isSaving}
              >
                Change
              </Button>

              <Flex m="1rem 0 0">
                <Button fill="none" onClick={handleTrigger}>
                  Resend code
                </Button>
              </Flex>
            </>
          }
          onFinish={async () => {
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
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Required' }]}>
            <Input type="email" placeholder="Email" value={email} onChange={setEmail} disabled />
          </Form.Item>

          <Form.Item
            label="Code in your email"
            name="code"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input placeholder="Code" value={code} onChange={setCode} />
          </Form.Item>

          <Form.Item label="New password" name="password">
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={setPassword}
              rules={[{ required: true, message: 'Required' }]}
            />
          </Form.Item>
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
