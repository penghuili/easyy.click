import { Button, Typography } from '@douyinfe/semi-ui';
import React from 'react';

import { browserExtensionLink } from '../lib/constants';
import { Flex } from '../shared/semi/Flex';

export function ExtensionIntro() {
  return (
    <Flex align="center" m="1rem 0 0">
      <Typography.Title
        heading={3}
        style={{ width: '100%', textAlign: 'center', marginBottom: '1rem' }}
      >
        Introduce Chrome Extension!
      </Typography.Title>

      <img
        src="https://easyy.click/files/extension.gif"
        style={{
          width: '100%',
          maxWidth: 400,
        }}
      />

      <Typography.Title heading={4} style={{ margin: '2rem 0 1rem' }}>
        You can:
      </Typography.Title>

      <Flex>
        <Typography.Paragraph style={{ marginBottom: '1rem' }}>
          1. Save the current tab by clicking the extension icon;
        </Typography.Paragraph>

        <Typography.Paragraph style={{ marginBottom: '1rem' }}>
          2. Save any link by right clicking it;
        </Typography.Paragraph>

        <Typography.Paragraph style={{ marginBottom: '2rem' }}>
          3. Save any selected text by right clicking it;
        </Typography.Paragraph>
      </Flex>

      <Typography.Paragraph style={{ marginBottom: '2rem' }}>
        Everything will be sent here to Inbox.
      </Typography.Paragraph>

      <a href={browserExtensionLink} target="_blank">
        <Button theme="solid" size="large">
          Install the extension now!
        </Button>
      </a>
    </Flex>
  );
}
