import { Avatar } from '@nutui/nutui-react';
import React from 'react';

import { Flex } from '../components/Flex';
import { ItemsWrapper } from '../components/ItemsWrapper';
import { Link } from '../components/Link.jsx';
import { RouteLink } from '../components/RouteLink';
import { Text } from '../components/Text';
import { logo, privacyUrl, termsUrl } from '../shared/browser/initShared';
import { PageContent } from '../shared/browser/PageContent.jsx';

export function Welcome() {
  return (
    <PageContent>
      <ItemsWrapper>
        <Flex direction="row" align="center" p="2rem 0 1rem" m="0" gap="0.5rem">
          <Avatar src={logo} shape="square" background="transparent" />{' '}
          <Text as="h2" size="5">
            easyy.click
          </Text>
        </Flex>

        <Text m="0">Open frequently used links, copy frequently used notes.</Text>
        <Text m="0">
          <Link href="https://easyy.click" target="_blank">
            See how it works &gt;&gt;
          </Link>
        </Text>
      </ItemsWrapper>

      <ItemsWrapper align="start">
        <RouteLink to="/sign-up">Sign up</RouteLink>
        <RouteLink to="/sign-in">Sign in</RouteLink>
      </ItemsWrapper>

      <ItemsWrapper align="start">
        <Link href={privacyUrl} target="_blank">
          Privacy
        </Link>
        <Link href={termsUrl} target="_blank">
          Terms
        </Link>
        <Link href="https://easyy.click/contact/" target="_blank">
          Contact
        </Link>
      </ItemsWrapper>
    </PageContent>
  );
}
