import { Button, Form, Input } from '@nutui/nutui-react';
import React, { useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader';
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
    <>
      <PageHeader title="Change password" isLoading={isChanging} hasBack />

      <Form
        labelPosition="top"
        footer={
          <>
            <Button nativeType="submit" type="primary" disabled={isDisabled}>
              Change
            </Button>
          </>
        }
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Current password"
          name="currentPassword"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
        </Form.Item>

        <Form.Item
          label="New password"
          name="newPassword"
          rules={[{ required: true, message: 'Required' }]}
        >
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={setNewPassword}
          />
        </Form.Item>
      </Form>
    </>
  );
});
