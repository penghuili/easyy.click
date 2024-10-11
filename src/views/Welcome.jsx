import { Avatar, Button, Typography } from '@douyinfe/semi-ui';
import React from 'react';
import { BabyLink } from 'react-baby-router';

import { DarkMode } from '../components/DarkMode.jsx';
import { Flex } from '../components/Flex';
import { ItemsWrapper } from '../components/ItemsWrapper';
import { Link } from '../components/Link.jsx';
import { logo } from '../shared/browser/initShared';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { contactEmail } from '../shared/js/constants.js';
import { copyContactEmailEffect } from '../store/settings/settingsEffect.js';

export function Welcome() {
  return (
    <PageContent>
      <ItemsWrapper>
        <Flex direction="row" align="center" p="2rem 0 1rem" m="0" gap="0.5rem">
          <Avatar src={logo} /> <Typography.Title heading={2}>easyy.click</Typography.Title>
        </Flex>

        <Typography.Paragraph>
          Open frequently used links, copy frequently used notes.
        </Typography.Paragraph>
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
          <Button theme="outline">Sign in</Button>
        </BabyLink>
      </ItemsWrapper>

      <ItemsWrapper align="start">
        <Link href="https://easyy.click/encryption/" target="_blank" rel="noreferrer">
          Encryption
        </Link>

        <Link href="https://github.com/penghuili/easyy.click" target="_blank" rel="noreferrer">
          Source code
        </Link>

        <Link href="https://easyy.click/privacy" target="_blank" rel="noreferrer">
          Privacy
        </Link>

        <Link href="https://easyy.click/terms" target="_blank" rel="noreferrer">
          Terms
        </Link>

        {/* <Link href="/changelog">Changelog</Link> */}

        <Link href="https://x.com/easyydotclick" target="_blank" rel="noreferrer">
          x.com
        </Link>

        <Link onClick={copyContactEmailEffect} style={{ cursor: 'pointer' }}>
          Contact: {contactEmail}
        </Link>

        <DarkMode />
      </ItemsWrapper>
    </PageContent>
  );
}
