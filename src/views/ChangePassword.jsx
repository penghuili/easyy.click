import { Button, Form } from '@douyinfe/semi-ui';
import React, { useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isChangingPasswordCat } from '../shared/browser/store/sharedCats';
import { changePasswordEffect } from '../shared/browser/store/sharedEffects';

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
    <PageContent>
      <PageHeader title="Change password" isLoading={isChanging} hasBack />

      <Form onSubmit={handleSubmit}>
        <Form.Input
          type="password"
          field="currentPassword"
          label="Current password"
          placeholder="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
        />

        <Form.Input
          type="password"
          field="newPassword"
          label="New password"
          placeholder="New password"
          value={newPassword}
          onChange={setNewPassword}
        />

        <Button htmlType="submit" theme="solid" disabled={isDisabled}>
          Change
        </Button>
      </Form>
    </PageContent>
  );
});
