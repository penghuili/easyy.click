import { Button, Form, Input } from '@nutui/nutui-react';
import React, { useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Flex } from '../components/Flex.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { Text } from '../components/Text.jsx';
import { isChangingEmailCat, userCat } from '../shared/browser/store/sharedCats';
import { changeEmailEffect, setToastEffect } from '../shared/browser/store/sharedEffects';
import { changeEmailTrigger } from '../shared/browser/store/sharedNetwork';
import { toastTypes } from '../shared/browser/Toast.jsx';

export const ChangeEmail = fastMemo(() => {
  const user = useCat(userCat);
  const isChanging = useCat(isChangingEmailCat);

  const [newEmail, setNewEmail] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [code, setCode] = useState('');

  async function handleTrigger() {
    setIsTriggering(true);
    const { data } = await changeEmailTrigger(newEmail);
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
            <Button nativeType="submit" type="primary" disabled={!newEmail.trim() || isTriggering}>
              Change email
            </Button>
          }
          onFinish={handleTrigger}
        >
          <Form.Item
            label="New email"
            name="newEmail"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input type="email" placeholder="New email" value={newEmail} onChange={setNewEmail} />
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
                disabled={
                  !code.trim() || !newEmail.trim() || newEmail.trim() === user?.email || isChanging
                }
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
            await changeEmailEffect(newEmail, code, () => {
              setIsTriggered(false);
              setCode('');
              setNewEmail('');
            });
          }}
        >
          <Form.Item
            label="New email"
            name="newEmail"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input
              type="email"
              placeholder="New email"
              value={newEmail}
              onChange={setNewEmail}
              disabled
            />
          </Form.Item>

          <Form.Item
            label="Code in your email"
            name="code"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input placeholder="Code" value={code} onChange={setCode} />
          </Form.Item>
        </Form>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Change email" isLoading={isChanging} hasBack />

      <Text>Current email: {user?.email}</Text>

      {renderTriggerForm()}

      {renderSaveForm()}
    </>
  );
});
