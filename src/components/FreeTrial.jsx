import { Avatar, Button } from '@nutui/nutui-react';
import React from 'react';
import { useCat } from 'usecat';

import { logo } from '../shared/browser/initShared.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { useFreeTrialsUntil } from '../shared/browser/store/sharedCats.js';
import { isFreeTryingCat } from '../store/pay/payCats.js';
import { freeTrialEffect } from '../store/pay/payEffects.js';
import { Flex } from './Flex.jsx';
import { Link } from './Link.jsx';
import { Text } from './Text.jsx';

export function FreeTrial() {
  const freeTrialUntil = useFreeTrialsUntil();
  const isTrying = useCat(isFreeTryingCat);

  return freeTrialUntil ? null : (
    <PageContent>
      <Flex direction="row" align="center" p="2rem 0" m="0" gap="0.5rem">
        <Avatar src={logo} shape="square" background="transparent" />{' '}
        <Text as="h2" size="5">
          Try easyy.click 14 days for free
        </Text>
      </Flex>

      <Text m="0 0 1rem">Open frequently used links, copy frequently used notes.</Text>
      <Text m="0">
        <Link href="https://easyy.click" target="_blank">
          Learn more
        </Link>
      </Text>

      <Flex justify="center" m="2rem 0">
        <Button type="primary" onClick={freeTrialEffect} disabled={isTrying}>
          Try 14 days for free
        </Button>
      </Flex>
    </PageContent>
  );
}
