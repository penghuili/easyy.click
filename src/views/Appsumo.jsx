import { Button, Form, Input } from '@nutui/nutui-react';
import React, { useCallback, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isVerifyingAppsumoCat } from '../store/pay/payCats.js';
import { verifyAppsumoEffect } from '../store/pay/payEffects.js';

export const Appsumo = fastMemo(() => {
  const isVerifying = useCat(isVerifyingAppsumoCat);

  const [code, setCode] = useState('');

  const handleSave = useCallback(async () => {
    await verifyAppsumoEffect(code);
  }, [code]);

  return (
    <PageContent>
      <PageHeader title="Redeem AppSumo code" isLoading={isVerifying} hasBack />

      <Form
        labelPosition="top"
        divider
        footer={
          <Button nativeType="submit" type="primary" disabled={!code || isVerifying}>
            Redeem
          </Button>
        }
        onFinish={handleSave}
      >
        <Form.Item label="Code from AppSumo" name="code">
          <Input
            placeholder="Code you bought from AppSumo"
            value={code}
            onChange={setCode}
            autoFocus
          />
        </Form.Item>
      </Form>
    </PageContent>
  );
});
