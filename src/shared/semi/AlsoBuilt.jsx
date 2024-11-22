import { Button, Image, Typography } from '@douyinfe/semi-ui';
import { RiBeerLine } from '@remixicon/react';
import React from 'react';

import { appName } from '../browser/initShared';
import { apps } from '../js/apps';
import { ItemsWrapper } from './ItemsWrapper.jsx';

export function AlsoBuilt({ showBeer }) {
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

      {appName !== apps.soundice.name && (
        <a href="https://soundice.net" target="_blank">
          <Button
            icon={
              <Image
                src="https://app.soundice.net/icons2/icon-192.png"
                width={24}
                height={24}
                preview={false}
              />
            }
            theme="outline"
          >
            Soundice
          </Button>
        </a>
      )}

      {appName !== apps.moon.name && (
        <a href="https://moonfinder.live" target="_blank">
          <Button
            icon={
              <Image
                src="https://moonfinder.live/icons/icon-192.png"
                width={24}
                height={24}
                preview={false}
              />
            }
            theme="outline"
          >
            moon finder
          </Button>
        </a>
      )}

      {showBeer && (
        <a href="https://buy.stripe.com/14k3fYcz633kb2oeV1" target="_blank">
          <Button theme="outline" icon={<RiBeerLine />}>
            Buy me a beer
          </Button>
        </a>
      )}
    </ItemsWrapper>
  );
}
