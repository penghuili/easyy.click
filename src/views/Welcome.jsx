import { Avatar } from '@nutui/nutui-react';
import React from 'react';

import { Flex } from '../components/Flex';
import { ItemsWrapper } from '../components/ItemsWrapper';
import { RouteLink } from '../components/RouteLink';
import { Text } from '../components/Text';
import { logo } from '../shared/browser/initShared';

export function Welcome() {
  return (
    <>
      <ItemsWrapper>
        <Flex direction="row" align="center" p="2rem 0 1rem" gap="0.5rem">
          <Avatar src={logo} shape="square" background="transparent" />{' '}
          <Text as="h2" size="5">
            easyy.click
          </Text>
        </Flex>

        <Text>Open frequently used links, copy frequently used notes.</Text>
      </ItemsWrapper>

      <ItemsWrapper align="start">
        <RouteLink to="/sign-up">Sign up</RouteLink>
        <RouteLink to="/sign-in">Sign in</RouteLink>
      </ItemsWrapper>
    </>
  );
}
