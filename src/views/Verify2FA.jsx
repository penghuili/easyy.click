import { Button, Form, Input } from '@nutui/nutui-react';
import React, { useEffect, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { errorCssColor } from '../components/AppWrapper';
import { Flex } from '../components/Flex';
import { PageContent } from '../components/PageContent';
import { PageHeader } from '../components/PageHeader';
import { RouteLink } from '../components/RouteLink';
import { Text } from '../components/Text';
import { authErrorCat, isVerifying2FACat } from '../shared/browser/store/sharedCats';
import { clearAuthErrorEffect, verify2FAEffect } from '../shared/browser/store/sharedEffects';

export const Verify2FA = fastMemo(() => {
  const errorMessage = useCat(authErrorCat);
  const isVerifying = useCat(isVerifying2FACat);

  const [code, setCode] = useState('');

  useEffect(() => {
    return clearAuthErrorEffect;
  }, []);

  const isDisabled = !code || isVerifying;
  function handleSubmit() {
    if (isDisabled) {
      return;
    }

    verify2FAEffect(code);
  }

  return (
    <PageContent>
      <PageHeader title="2-factor Authentication" isLoading={isVerifying} hasBack />

      <Text>Enter the code from your authenticator app</Text>

      <Form
        labelPosition="top"
        footer={
          <Flex>
            <Button nativeType="submit" type="primary" disabled={isDisabled}>
              Verify
            </Button>
            {!!errorMessage && <Text color={errorCssColor}>{errorMessage}</Text>}

            <RouteLink to="/sign-in">Cancel</RouteLink>
          </Flex>
        }
        onFinish={handleSubmit}
      >
        <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Required' }]}>
          <Input placeholder="Code" value={code} onChange={setCode} />
        </Form.Item>
      </Form>
    </PageContent>
  );
});
