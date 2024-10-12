import { Button, Form } from '@douyinfe/semi-ui';
import { RiArrowLeftLine } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { replaceTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { useExpiresAt } from '../shared/browser/store/sharedCats.js';
import { isVerifyingGumroadCat } from '../store/pay/payCats.js';
import { verifyGumroadLicenseKeyEffect } from '../store/pay/payEffects.js';
import { FreeTrialStatus } from './Upgrade.jsx';

export const Gumroad = fastMemo(() => {
  const isVerifying = useCat(isVerifyingGumroadCat);
  const expiresAt = useExpiresAt();

  const [code, setCode] = useState('');

  const handleVerify = useCallback(async () => {
    await verifyGumroadLicenseKeyEffect(code);
  }, [code]);

  return (
    <PageContent>
      <PageHeader title="Gumroad license key" isLoading={isVerifying} />

      <FreeTrialStatus />

      {!expiresAt && (
        <Form onSubmit={handleVerify}>
          <Form.Input
            field="code"
            label="License key you purchased from Gumroad"
            placeholder="A key like 6F0E4C97-B72A4E69-A11BF6C4-AF6517E7"
            value={code}
            onChange={setCode}
            autoFocus
          />

          <Button htmlType="submit" theme="solid" disabled={!code || isVerifying}>
            Verify
          </Button>
        </Form>
      )}

      <Button
        icon={<RiArrowLeftLine />}
        onClick={() => replaceTo('/')}
        style={{ marginTop: '2rem' }}
      >
        Back to home
      </Button>
    </PageContent>
  );
});
