import React, { useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { FormButton } from './FormButton.jsx';
import { ItemsWrapper } from './ItemsWrapper.jsx';
import { PageHeader } from './PageHeader.jsx';
import { PasswordInput } from './PasswordInput.jsx';
import { isChangingPasswordCat } from './store/sharedCats.js';
import { changePasswordEffect } from './store/sharedEffects';

export const ChangePassword = fastMemo(() => {
  const isChanging = useCat(isChangingPasswordCat);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const isDisabled = !currentPassword || !newPassword || isChanging;
  function handleSubmit() {
    if (isDisabled) {
      return;
    }

    changePasswordEffect(currentPassword, newPassword);
  }

  return (
    <>
      <PageHeader title="Change password" isLoading={isChanging} hasBack />

      <ItemsWrapper>
        <PasswordInput
          label="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
        />

        <PasswordInput
          label="New password"
          value={newPassword}
          onChange={setNewPassword}
          onSubmit={handleSubmit}
        />

        <FormButton onClick={handleSubmit} disabled={isDisabled}>
          Change
        </FormButton>
      </ItemsWrapper>
    </>
  );
});
