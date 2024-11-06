import { Avatar, Button, Typography } from '@douyinfe/semi-ui';
import { RiCheckLine, RiHomeLine, RiInbox2Line } from '@remixicon/react';
import React from 'react';
import { BabyLink } from 'react-baby-router';

import { logo } from '../shared/browser/initShared';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { Flex } from '../shared/semi/Flex';
import { ItemsWrapper } from '../shared/semi/ItemsWrapper.jsx';

export function Shared({ queryParams: { shared } }) {
  return (
    <PageContent>
      <ItemsWrapper>
        <Flex direction="row" align="center" p="2rem 0 1rem" m="0" gap="0.5rem">
          <Avatar src={logo} /> <Typography.Title heading={2}>easyy.click</Typography.Title>
        </Flex>

        <Flex gap="1rem" align="center">
          {shared ? (
            <>
              <RiCheckLine size={48} color="var(--semi-color-success)" />

              <Typography.Paragraph>
                {shared === 'link'
                  ? 'Link has been saved to your inbox.'
                  : 'Note has been saved to your inbox.'}
              </Typography.Paragraph>
            </>
          ) : (
            <Typography.Paragraph>Please share a link or note.</Typography.Paragraph>
          )}

          <BabyLink to="/inbox">
            <Button theme="solid" icon={<RiInbox2Line />}>
              Check inbox
            </Button>
          </BabyLink>

          <BabyLink to="/">
            <Button icon={<RiHomeLine />}>Back to home</Button>
          </BabyLink>
        </Flex>
      </ItemsWrapper>
    </PageContent>
  );
}
