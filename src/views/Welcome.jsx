import { Avatar, Button } from '@nutui/nutui-react';
import React, { useCallback } from 'react';
import { BabyLink } from 'react-baby-router';

import { Flex } from '../components/Flex';
import { ItemsWrapper } from '../components/ItemsWrapper';
import { Link } from '../components/Link.jsx';
import { Text } from '../components/Text';
import { copyToClipboard } from '../lib/copyToClipboard.js';
import { logo } from '../shared/browser/initShared';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { setToastEffect } from '../shared/browser/store/sharedEffects.js';

export function Welcome() {
  const handleCopyEmail = useCallback(async () => {
    await copyToClipboard('peng@tuta.com');
    setToastEffect('Contact email is copied!');
  }, []);

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
        <BabyLink to="/sign-up">
          <Button fill="solid">Sign up</Button>
        </BabyLink>
        <BabyLink to="/sign-in">
          <Button fill="outline">Sign in</Button>
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

        <Link onClick={handleCopyEmail} style={{ cursor: 'pointer' }}>
          Contact: peng@tuta.com
        </Link>
      </ItemsWrapper>
    </PageContent>
  );
}
