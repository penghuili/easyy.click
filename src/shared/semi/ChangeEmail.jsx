import { Button, Form, Typography } from '@douyinfe/semi-ui';
import React, { useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageContent } from '../browser/PageContent.jsx';
import { isChangingEmailCat, userCat } from '../browser/store/sharedCats.js';
import { changeEmailEffect, setToastEffect } from '../browser/store/sharedEffects.js';
import { changeEmailTrigger } from '../browser/store/sharedNetwork.js';
import { toastTypes } from '../browser/Toast.jsx';
import { Flex } from './Flex.jsx';
import { PageHeader } from './PageHeader.jsx';

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
        <Form onSubmit={handleTrigger}>
          <Form.Input
            type="email"
            field="newEmail"
            label="New email"
            placeholder="New email"
            value={newEmail}
            onChange={setNewEmail}
          />

          <Flex m="1rem 0 0">
            <Button htmlType="submit" theme="solid" disabled={!newEmail.trim() || isTriggering}>
              Change email
            </Button>
          </Flex>
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
            await changeEmailEffect(newEmail, code, () => {
              setIsTriggered(false);
              setCode('');
              setNewEmail('');
            });
          }}
        >
          <Form.Input
            type="email"
            field="newEmail"
            label="New email"
            placeholder="New email"
            value={newEmail}
            onChange={setNewEmail}
            disabled
          />

          <Form.Input
            field="code"
            label="Code in your email"
            placeholder="Code"
            value={code}
            onChange={setCode}
          />

          <Button
            htmlType="submit"
            theme="solid"
            disabled={
              !code.trim() || !newEmail.trim() || newEmail.trim() === user?.email || isChanging
            }
          >
            Change
          </Button>

          <Flex m="1rem 0 0">
            <Button theme="borderless" onClick={handleTrigger}>
              Resend code
            </Button>
          </Flex>
        </Form>
      </>
    );
  }

  return (
    <PageContent>
      <PageHeader title="Change email" isLoading={isChanging} hasBack />

      <Typography.Text>Current email: {user?.email}</Typography.Text>

      {renderTriggerForm()}

      {renderSaveForm()}
    </PageContent>
  );
});
