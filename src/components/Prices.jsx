import { Card, Typography } from '@douyinfe/semi-ui';
import { RiCheckLine } from '@remixicon/react';
import React from 'react';
import { useCat } from 'usecat';

import { classNames } from '../shared/browser/classNames.js';
import { useIsMobileSize } from '../shared/browser/hooks/useIsMobileSize.js';
import { Shine } from '../shared/browser/Shine.jsx';
import { userCat } from '../shared/browser/store/sharedCats.js';
import { themeCssColor } from '../shared/semi/AppWrapper.jsx';
import { Flex } from '../shared/semi/Flex.jsx';
import styles from './Prices.module.css';

export const Prices = React.memo(() => {
  const isMobile = useIsMobileSize();
  const user = useCat(userCat);

  return (
    <>
      <Flex
        direction={isMobile ? 'column' : 'row'}
        justify="between"
        gap="0.5rem"
        m="2rem 0"
        style={{ width: '100%' }}
      >
        <Card
          title="Monthly"
          headerLine
          style={{ width: isMobile ? '100%' : '30%', alignSelf: 'stretch', textAlign: 'center' }}
        >
          <Flex gap="1rem">
            <Typography.Paragraph>☕ $1 / month</Typography.Paragraph>

            <PayNowLink
              link={
                user?.email
                  ? `${import.meta.env.VITE_PAY_MONTHLY}?prefilled_email=${user.email}`
                  : import.meta.env.VITE_PAY_MONTHLY
              }
            />
          </Flex>
        </Card>
        <Card
          title="Yearly"
          headerLine
          style={{ width: isMobile ? '100%' : '30%', alignSelf: 'stretch', textAlign: 'center' }}
        >
          <Flex gap="1rem">
            <Typography.Paragraph>🍔 $10 / year</Typography.Paragraph>

            <PayNowLink
              link={
                user?.email
                  ? `${import.meta.env.VITE_PAY_YEARLY}?prefilled_email=${user.email}`
                  : import.meta.env.VITE_PAY_YEARLY
              }
            />
          </Flex>
        </Card>
        <Card
          title="Lifetime"
          headerLine
          style={{ width: isMobile ? '100%' : '30%', alignSelf: 'stretch', textAlign: 'center' }}
        >
          <Flex gap="1rem">
            <Typography.Paragraph>🍱 $15, once</Typography.Paragraph>

            <PayNowLink
              link={
                user?.email
                  ? `${import.meta.env.VITE_PAY_LIFETIME}?prefilled_email=${user.email}`
                  : import.meta.env.VITE_PAY_LIFETIME
              }
              shine
            />

            <Typography.Paragraph type="warning">$25 after 2025-01-01</Typography.Paragraph>
          </Flex>
        </Card>
      </Flex>

      <div
        className={classNames({
          [styles.priceCard]: true,
        })}
      >
        <Flex direction="column" align="start" m="0">
          {[
            { text: 'Unlimited links' },
            { text: 'Unlimited notes' },
            { text: 'Unlimited tags' },
            { text: 'Unlimited spaces' },
            {
              text: 'All links, notes, tags, spaces are encrypted',
            },
            { text: 'Import your browser bookmarks' },
            { text: 'Export your links and notes' },
            { text: 'Bulk add links' },
            { text: 'Bulk delete links' },
            { text: 'Share your links' },
            { text: 'Browser extension' },
          ].map(benifit => (
            <Flex
              key={benifit.text}
              direction="row"
              justify="start"
              align="start"
              gap="0.5rem"
              m="0"
            >
              <RiCheckLine /> <Typography.Text>{benifit.text}</Typography.Text>
            </Flex>
          ))}
        </Flex>
      </div>

      <Competitors />
    </>
  );
});

function PayNowLink({ link, shine, white }) {
  return (
    <a
      href={link}
      target="_blank"
      style={{
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        color: white ? themeCssColor : 'white',
        backgroundColor: white ? 'white' : themeCssColor,
        padding: '0.5rem 1rem',
        borderRadius: '2rem',
        textAlign: 'center',
      }}
    >
      Pay now
      {shine && <Shine />}
    </a>
  );
}

function Competitors() {
  return (
    <Card style={{ margin: '2rem 0' }}>
      You need to pay{' '}
      <CompetitorItem name="start.me" link="https://about.start.me/pricing" price="$24 / year" />,{' '}
      <CompetitorItem name="raindrop.io" link="https://raindrop.io/pro/buy" price="$28 / year" />,{' '}
      <CompetitorItem name="Toby" link="https://www.gettoby.com/pricing" price="$54 / year" />.
    </Card>
  );
}

function CompetitorItem({ name, price, link }) {
  return (
    <>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'var(--semi-color-warning)',
        }}
      >
        {price}
      </a>{' '}
      for {name}
    </>
  );
}
