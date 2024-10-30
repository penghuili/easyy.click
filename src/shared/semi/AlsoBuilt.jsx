import { Button, Image, Typography } from '@douyinfe/semi-ui';
import React from 'react';

import { appName } from '../browser/initShared';
import { apps } from '../js/apps';
import { ItemsWrapper } from './ItemsWrapper.jsx';

export function AlsoBuilt() {
  return (
    <ItemsWrapper align="start">
      <Typography.Title heading={5}>I also built:</Typography.Title>

      {appName !== apps['easyy.click'].name && (
        <a href="https://easyy.click" target="_blank">
          <Button
            icon={
              <Image
                src="https://app.easyy.click/icons/icon-192.png"
                width={24}
                height={24}
                preview={false}
              />
            }
            theme="outline"
          >
            easyy.click
          </Button>
        </a>
      )}

      {appName !== apps['notenote.cc'].name && (
        <a href="https://notenote.cc" target="_blank">
          <Button
            icon={
              <Image
                src="https://app.notenote.cc/icons2/t/icon-192.png"
                width={24}
                height={24}
                preview={false}
              />
            }
            theme="outline"
          >
            notenote.cc
          </Button>
        </a>
      )}

      {appName !== apps['remiind.cc'].name && (
        <a href="https://remiind.cc" target="_blank">
          <Button
            icon={
              <Image
                src="https://app.remiind.cc/icons/icon-192.png"
                width={24}
                height={24}
                preview={false}
              />
            }
            theme="outline"
          >
            remiind.cc
          </Button>
        </a>
      )}
    </ItemsWrapper>
  );
}
