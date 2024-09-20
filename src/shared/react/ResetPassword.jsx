import { Button, Flex } from '@radix-ui/themes';
import React, { useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';

import { FormButton } from './FormButton.jsx';
import { InputField } from './InputField.jsx';
import { ItemsWrapper } from './ItemsWrapper.jsx';
import { PageHeader } from './PageHeader.jsx';
import { PasswordInput } from './PasswordInput.jsx';
import { RouteLink } from './RouteLink.jsx';
import { setToastEffect } from './store/sharedEffects';
import { resetPasswordSave, resetPasswordTrigger } from './store/sharedNetwork';
import { toastTypes } from './Toast.jsx';

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
        <InputField
          type="email"
          label="Email"
          placeholder="Your email"
          value={email}
          onChange={setEmail}
        />

        <FormButton
          onClick={handleTrigger}
          disabled={!email.trim() || isTriggering}
          isLoading={isTriggering}
        >
          Reset password
        </FormButton>
      </>
    );
  }

  function renderSaveForm() {
    if (!isTriggered) {
      return null;
    }

    return (
      <>
        <InputField
          type="email"
          label="Email"
          placeholder="Your email"
          value={email}
          onChange={setEmail}
          disabled
        />

        <InputField label="Code in your email" placeholder="Code" value={code} onChange={setCode} />

        <PasswordInput label="New password" value={password} onChange={setPassword} />

        <FormButton
          onClick={async () => {
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
          disabled={!email.trim() || !code.trim() || !password.trim() || isSaving}
          isLoading={isSaving}
        >
          Save
        </FormButton>

        <Flex>
          <Button variant="ghost" onClick={handleTrigger}>
            Resend code
          </Button>
        </Flex>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Reset password" isLoading={isTriggering || isSaving} hasBack />

      <ItemsWrapper>
        {renderTriggerForm()}

        {renderSaveForm()}

        <Flex>
          <RouteLink to="/sign-up">No account? Sign up</RouteLink>
        </Flex>
      </ItemsWrapper>
    </>
  );
});
