import { Button, Typography } from '@douyinfe/semi-ui';
import React from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Prices } from '../components/Prices.jsx';
import { hasValidFreeTrial } from '../lib/hasValidFreeTrial.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { useExpiresAt, useFreeTrialsUntil } from '../shared/browser/store/sharedCats.js';
import { formatDate } from '../shared/js/date.js';
import { Flex } from '../shared/semi/Flex.jsx';
import { Link } from '../shared/semi/Link.jsx';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { isFreeTryingCat } from '../store/pay/payCats.js';
import { freeTrialEffect } from '../store/pay/payEffects.js';

export const Upgrade = fastMemo(() => {
  return (
    <PageContent>
      <Header />

      <Intro />

      <FreeTrialStatus />

      <Prices />

      <UpgradeAction />
    </PageContent>
  );
});

const Header = fastMemo(() => {
  const freeTrialUntil = useFreeTrialsUntil();
  const isTrying = useCat(isFreeTryingCat);

  return (
    <PageHeader
      title="Upgrade easyy.click"
      isLoading={isTrying}
      hasBack={hasValidFreeTrial(freeTrialUntil)}
    />
  );
});

const Intro = fastMemo(() => {
  const freeTrialUntil = useFreeTrialsUntil();

  if (freeTrialUntil) {
    return null;
  }

  return (
    <>
      <Typography.Paragraph style={{ marginBottom: '1rem' }}>
        Manage frequently used links and notes.
      </Typography.Paragraph>
      <Typography.Paragraph>
        <Link href="https://easyy.click" target="_blank">
          See how it works here &gt;&gt;
        </Link>
      </Typography.Paragraph>
    </>
  );
});

export const FreeTrialStatus = fastMemo(() => {
  const expiresAt = useExpiresAt();
  const freeTrialUntil = useFreeTrialsUntil();

  if (expiresAt === 'forever') {
    return <Typography.Paragraph>You have lifetime access!</Typography.Paragraph>;
  }

  if (freeTrialUntil) {
    return freeTrialUntil >= formatDate(new Date()) ? (
      <Typography.Paragraph>
        You have a free trial until {formatDate(freeTrialUntil)}.
      </Typography.Paragraph>
    ) : (
      <Typography.Paragraph>
        Your free trial expired ({formatDate(freeTrialUntil)}).
      </Typography.Paragraph>
    );
  }

  return null;
});

const UpgradeAction = fastMemo(() => {
  const isTrying = useCat(isFreeTryingCat);
  const freeTrialUntil = useFreeTrialsUntil();

  const hasFreeTrial = !!freeTrialUntil;

  return (
    <>
      {!hasFreeTrial && (
        <Flex align="center" m="3rem 0 0">
          <Button theme="solid" size="large" onClick={freeTrialEffect} disabled={isTrying}>
            Try 14 days for free
          </Button>
        </Flex>
      )}

      {hasFreeTrial && (
        <Typography.Paragraph style={{ marginTop: '1rem', textAlign: 'center' }} strong>
          Refresh the page after payment.
        </Typography.Paragraph>
      )}
    </>
  );
});
