import { Avatar, Button, Typography } from '@douyinfe/semi-ui';
import React from 'react';
import { BabyLink } from 'react-baby-router';

import { DarkMode } from '../components/DarkMode.jsx';
import { Flex } from '../components/Flex';
import { ItemsWrapper } from '../components/ItemsWrapper';
import { Link } from '../components/Link.jsx';
import { PublicLinks } from '../components/PublicLinks.jsx';
import { logo } from '../shared/browser/initShared';
import { PageContent } from '../shared/browser/PageContent.jsx';

export function Welcome() {
  return (
    <PageContent>
      <ItemsWrapper>
        <Flex direction="row" align="center" p="2rem 0 1rem" m="0" gap="0.5rem">
          <Avatar src={logo} /> <Typography.Title heading={2}>easyy.click</Typography.Title>
        </Flex>

        <Typography.Paragraph>Manage frequently used links and notes.</Typography.Paragraph>
        <Typography.Paragraph>
          <Link href="https://easyy.click" target="_blank">
            See how it works &gt;&gt;
          </Link>
        </Typography.Paragraph>
      </ItemsWrapper>

      <ItemsWrapper align="start">
        <BabyLink to="/sign-up">
          <Button theme="solid">Sign up</Button>
        </BabyLink>
        <BabyLink to="/sign-in">
          <Button>Sign in</Button>
        </BabyLink>
      </ItemsWrapper>

      <PublicLinks />

      <ItemsWrapper align="start">
        <DarkMode />
      </ItemsWrapper>
    </PageContent>
  );
}
