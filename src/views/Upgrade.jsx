import { Button } from '@nutui/nutui-react';
import React from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Flex } from '../components/Flex.jsx';
import { Link } from '../components/Link.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { Prices } from '../components/Prices.jsx';
import { Text } from '../components/Text.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { Shine } from '../shared/browser/Shine.jsx';
import { useExpiresAt, useFreeTrialsUntil } from '../shared/browser/store/sharedCats.js';
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

  return <PageHeader title="Upgrade easyy.click" isLoading={isTrying} hasBack={!!freeTrialUntil} />;
});

const Intro = fastMemo(() => {
  const freeTrialUntil = useFreeTrialsUntil();

  if (freeTrialUntil) {
    return null;
  }

  return (
    <>
      <Text m="0 0 1rem">Open frequently used links, copy frequently used notes.</Text>
      <Text m="0">
        <Link href="https://easyy.click" target="_blank">
          See how it works here &gt;&gt;
        </Link>
      </Text>
    </>
  );
});

const FreeTrialStatus = fastMemo(() => {
  const expiresAt = useExpiresAt();
  const freeTrialUntil = useFreeTrialsUntil();

  if (expiresAt === 'forever') {
    return <Text>You have lifetime access!</Text>;
  }

  if (freeTrialUntil) {
    return freeTrialUntil >= formatDate(new Date()) ? (
      <Text>You have a free trial until {formatDate(freeTrialUntil)}.</Text>
    ) : (
      <Text>Your free trial expired ({formatDate(freeTrialUntil)}).</Text>
    );
  }

  return null;
});

const UpgradeAction = fastMemo(() => {
  const isTrying = useCat(isFreeTryingCat);
  const freeTrialUntil = useFreeTrialsUntil();

  return (
    <>
      <Flex m="2rem 0" align="center">
        <a
          href={import.meta.env.VITE_PAY_LINK}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            position: 'relative',
            overflow: 'hidden',
            textDecoration: 'none',
            color: 'white',
            backgroundColor: 'var(--nutui-brand-6)',
            padding: '0.5rem 2rem',
            fontSize: 'var(--nutui-font-size-7)',
            borderRadius: '4rem',
          }}
        >
          Pay now
          <Shine />
        </a>
      </Flex>

      {!freeTrialUntil && (
        <Flex align="center" m="2rem 0">
          <Button fill="none" size="xlarge" onClick={freeTrialEffect} disabled={isTrying}>
            or try 14 days for free
          </Button>
        </Flex>
      )}
    </>
  );
});
