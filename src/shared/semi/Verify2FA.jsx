import { Button, Form, Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import { useCat } from 'usecat';

import { fastMemo } from '../browser/fastMemo';
import { PageContent } from '../browser/PageContent.jsx';
import { authErrorCat, isVerifying2FACat } from '../browser/store/sharedCats';
import { clearAuthErrorEffect, verify2FAEffect } from '../browser/store/sharedEffects';
import { Flex } from './Flex.jsx';
import { PageHeader } from './PageHeader.jsx';
import { RouteLink } from './RouteLink.jsx';

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

      <Typography.Paragraph>Enter the code from your authenticator app</Typography.Paragraph>

      <Form onSubmit={handleSubmit}>
        <Form.Input field="code" label="Code" placeholder="Code" value={code} onChange={setCode} />

        <Flex m="1rem 0 0">
          <Button htmlType="submit" theme="solid" disabled={isDisabled}>
            Verify
          </Button>

          {!!errorMessage && <Typography.Text type="danger">{errorMessage}</Typography.Text>}

          <RouteLink to="/sign-in">Cancel</RouteLink>
        </Flex>
      </Form>
    </PageContent>
  );
});
