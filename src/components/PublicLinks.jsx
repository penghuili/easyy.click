import { Button } from '@douyinfe/semi-ui';
import {
  RiCodeLine,
  RiHeartLine,
  RiHomeLine,
  RiLockLine,
  RiMailLine,
  RiServiceLine,
  RiTelegramLine,
  RiTwitterXLine,
} from '@remixicon/react';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { contactEmail } from '../shared/js/constants.js';
import { copyContactEmailEffect } from '../store/settings/settingsEffect.js';
import { ItemsWrapper } from './ItemsWrapper.jsx';

export const PublicLinks = fastMemo(() => {
  return (
    <ItemsWrapper align="start">
      <a href="https://easyy.click" target="_blank" rel="noreferrer">
        <Button theme="borderless" icon={<RiHomeLine />}>
          Learn more
        </Button>
      </a>

      <a href="https://easyy.click/encryption/" target="_blank" rel="noreferrer">
        <Button theme="borderless" icon={<RiLockLine />}>
          Encryption
        </Button>
      </a>

      <a href="https://github.com/penghuili/easyy.click" target="_blank" rel="noreferrer">
        <Button theme="borderless" icon={<RiCodeLine />}>
          Source code
        </Button>
      </a>

      <a href="https://easyy.click/privacy" target="_blank" rel="noreferrer">
        <Button theme="borderless" icon={<RiHeartLine />}>
          Privacy
        </Button>
      </a>

      <a href="https://easyy.click/terms" target="_blank" rel="noreferrer">
        <Button theme="borderless" icon={<RiServiceLine />}>
          Terms
        </Button>
      </a>

      <a href="https://t.me/easyyclick" target="_blank" rel="noreferrer">
        <Button theme="borderless" icon={<RiTelegramLine />}>
          Telegram channel
        </Button>
      </a>

      <a href="https://x.com/easyydotclick" target="_blank" rel="noreferrer">
        <Button theme="borderless" icon={<RiTwitterXLine />}>
          x.com
        </Button>
      </a>

      <Button theme="borderless" icon={<RiMailLine />} onClick={copyContactEmailEffect}>
        Contact: {contactEmail}
      </Button>
    </ItemsWrapper>
  );
});
