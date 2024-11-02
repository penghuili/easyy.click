import { Button, Card, Typography } from '@douyinfe/semi-ui';
import React from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Prices } from '../components/Prices.jsx';
import { hasValidFreeTrial } from '../lib/hasValidFreeTrial.js';
import { useEarlyUser } from '../lib/useEarlyUser.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { Shine } from '../shared/browser/Shine.jsx';
import { useExpiresAt, useFreeTrialsUntil, userCat } from '../shared/browser/store/sharedCats.js';
import { formatDate } from '../shared/js/date.js';
import { themeCssColor } from '../shared/semi/AppWrapper.jsx';
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

      <Competitors />

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
        <Typography.Paragraph style={{ marginTop: '1rem', textAlign: 'center' }} strong>
          Refresh the page after payment.
        </Typography.Paragraph>
      </Flex>
    </>
  );
});

function Competitors() {
  return (
    <Card style={{ margin: '2rem 0', textAlign: 'center' }}>
      <Typography.Title heading={3} style={{ marginBottom: '2rem' }}>
        In comparison
      </Typography.Title>
      <CompetitorItem
        name="start.me"
        link="https://about.start.me/pricing"
        price="$24 / year"
        emoji="😨"
      />
      <CompetitorItem
        name="raindrop.io"
        link="https://raindrop.io/pro/buy"
        price="$28 / year"
        emoji="🙀"
      />
      <CompetitorItem
        name="Toby"
        link="https://www.gettoby.com/pricing"
        price="$54 / year"
        emoji="😱"
      />
    </Card>
  );
}

function CompetitorItem({ name, price, link, emoji }) {
  return (
    <Typography.Paragraph style={{ marginBottom: '1rem' }}>
      You need to pay{' '}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontSize: '1.5rem',
          color: 'var(--semi-color-warning)',
        }}
      >
        {price}
      </a>{' '}
      (!!) for {name} {emoji}
    </Typography.Paragraph>
  );
}
