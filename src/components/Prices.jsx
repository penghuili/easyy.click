import { Typography } from '@douyinfe/semi-ui';
import { RiCheckLine } from '@remixicon/react';
import React from 'react';

import { useEarlyUser } from '../lib/useEarlyUser.js';
import { classNames } from '../shared/browser/classNames.js';
import { Countdown } from '../shared/browser/CountDown.jsx';
import { Flex } from './Flex.jsx';
import styles from './Prices.module.css';

export const Prices = React.memo(() => {
  const isEarlyUser = useEarlyUser();

  return (
    <div
      className={classNames({
        [styles.priceCard]: true,
        [styles.accent]: true,
        [styles.shine]: true,
      })}
    >
      <Typography.Title heading={4} style={{ color: 'white' }}>
        Lifetime deal
      </Typography.Title>
      <Typography.Text style={{ color: 'white' }}>Pay once, use forever</Typography.Text>

      {isEarlyUser ? (
        <>
          <Flex direction="row" align="center" m="1rem 0 0">
            <span
              style={{
                fontSize: '2rem',
                display: 'inline-block',
                marginRight: '0.5rem',
              }}
            >
              $9
            </span>
            <span
              style={{
                fontSize: '2rem',
                display: 'inline-block',
                marginRight: '0.5rem',
              }}
            >
              <del>$15</del> for early users
            </span>
          </Flex>

          <Flex m="1rem 0 1.5rem" align="center">
            Ends in:
            <Countdown targetDate="2024-10-13T00:00:00.000Z" />
          </Flex>
        </>
      ) : (
        <Flex direction="row" align="center" m="1rem 0">
          <span
            style={{
              fontSize: '2rem',
              display: 'inline-block',
              marginRight: '0.5rem',
            }}
          >
            $15
          </span>
        </Flex>
      )}

      <Flex direction="column" align="start" m="0">
        {[
          { text: 'Unlimited links', enabled: true },
          { text: 'Unlimited notes', enabled: true },
          { text: 'All links and notes are encrypted', enabled: true },
          { text: 'Group links / notes with tags', enabled: true },
          { text: 'Unlimited spaces', enabled: true },
        ].map(benifit => (
          <Flex key={benifit.text} direction="row" justify="start" align="start" gap="0.5rem" m="0">
            <RiCheckLine color="white" />{' '}
            <Typography.Text style={{ color: 'white' }}>
              {benifit.enabled ? benifit.text : <del>{benifit.text}</del>}
            </Typography.Text>
          </Flex>
        ))}
      </Flex>
    </div>
  );
});
