import { RiCheckLine } from '@remixicon/react';
import React from 'react';

import { classNames } from '../shared/browser/classNames.js';
import { Countdown } from '../shared/browser/CountDown.jsx';
import { Flex } from './Flex.jsx';
import styles from './Prices.module.css';
import { Text } from './Text.jsx';

export const Prices = React.memo(() => {
  return (
    <div
      className={classNames({
        [styles.priceCard]: true,
        [styles.accent]: true,
        [styles.shine]: true,
      })}
    >
      <Text as="h3" size="5" color="white">
        Lifetime deal
      </Text>
      <Text m="0.5rem 0" size="7" color="white">
        Pay once, use forever
      </Text>
      <Flex direction="row" align="center" m="0">
        <span
          style={{
            fontSize: '2rem',
            display: 'inline-block',
            marginRight: '0.5rem',
          }}
        >
          $9
        </span>
        <Text size="7" color="white">
          <del>$19</del> for You
        </Text>
      </Flex>

      <Flex m="1rem 0 1.5rem" align="center">
        Ends in:
        <Countdown targetDate="2024-10-12" />
      </Flex>

      <Flex direction="column" align="start" m="0">
        {[
          { text: 'Unlimited links', enabled: true },
          { text: 'Unlimited notes', enabled: true },
          { text: 'All links and notes are encrypted', enabled: true },
          { text: 'Group links / notes', enabled: true },
        ].map(benifit => (
          <Flex key={benifit.text} direction="row" justify="start" align="start" gap="0.5rem" m="0">
            <RiCheckLine color="white" />{' '}
            <Text color="white">{benifit.enabled ? benifit.text : <del>{benifit.text}</del>}</Text>
          </Flex>
        ))}
      </Flex>
    </div>
  );
});
