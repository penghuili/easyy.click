import { Button, Typography } from '@douyinfe/semi-ui';
import React from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { themeCssColor } from '../components/AppWrapper.jsx';
import { Flex } from '../components/Flex.jsx';
import { Link } from '../components/Link.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { Prices } from '../components/Prices.jsx';
import { hasValidFreeTrial } from '../lib/hasValidFreeTrial.js';
import { useEarlyUser } from '../lib/useEarlyUser.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { Shine } from '../shared/browser/Shine.jsx';
import { useExpiresAt, useFreeTrialsUntil, userCat } from '../shared/browser/store/sharedCats.js';
import { formatDate } from '../shared/js/date.js';
import { isFreeTryingCat } from '../store/pay/payCats.js';
import { freeTrialEffect } from '../store/pay/payEffects.js';

export const Upgrade = fastMemo(() => {
  return (
    <PrepareData>
      <PageContent>
        <Header />

        <Intro />

        <FreeTrialStatus />

        <Prices />

        <UpgradeAction />
      </PageContent>
    </PrepareData>
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
        Open frequently used links, copy frequently used notes.
      </Typography.Paragraph>
      <Typography.Paragraph>
        <Link href="https://easyy.click" target="_blank">
          See how it works here &gt;&gt;
        </Link>
      </Typography.Paragraph>
    </>
  );
});

const FreeTrialStatus = fastMemo(() => {
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
  const user = useCat(userCat);
  const isEarlyUser = useEarlyUser();

  const hasFreeTrial = !!freeTrialUntil;

  return (
    <>
      {!hasFreeTrial && (
        <Flex align="center" m="3rem 0 0">
          <Button theme="solid" size="large" onClick={freeTrialEffect} disabled={isTrying}>
            Try 14 days for free
          </Button>

          <Typography.Paragraph style={{ marginTop: '1rem', textAlign: 'center' }}>
            or
          </Typography.Paragraph>
        </Flex>
      )}

      <Flex m="2rem 0" align="center">
        <a
          href={isEarlyUser ? import.meta.env.VITE_PAY_LINK1 : import.meta.env.VITE_PAY_LINK2}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            position: 'relative',
            overflow: 'hidden',
            textDecoration: 'none',
            color: hasFreeTrial ? 'white' : undefined,
            backgroundColor: hasFreeTrial ? themeCssColor : undefined,
            padding: '0.5rem 2rem',
            fontSize: '1.5rem',
            borderRadius: '4rem',
          }}
        >
          Pay now
          <Shine />
        </a>
        <Typography.Paragraph style={{ marginTop: '0rem', textAlign: 'center' }}>
          Remember to use the same email (<Typography.Text copyable>{user?.email}</Typography.Text>)
          on the payment page.
        </Typography.Paragraph>
      </Flex>
    </>
  );
});
