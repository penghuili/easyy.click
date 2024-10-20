import { Button } from '@douyinfe/semi-ui';
import {
  RiCodeLine,
  RiHeartLine,
  RiHomeLine,
  RiLockLine,
  RiMailLine,
  RiServiceLine,
  RiTelegram2Line,
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
      <a href="https://t.me/easyyclick" target="_blank" rel="noreferrer">
        <Button theme="outline" icon={<RiTelegram2Line />}>
          Changelog
        </Button>
      </a>

      <a href="https://x.com/easyydotclick" target="_blank" rel="noreferrer">
        <Button theme="outline" icon={<RiTwitterXLine />}>
          x.com
        </Button>
      </a>

      <Button theme="outline" icon={<RiMailLine />} onClick={copyContactEmailEffect}>
        Contact: {contactEmail}
      </Button>

      <a href="https://easyy.click" target="_blank" rel="noreferrer">
        <Button theme="outline" icon={<RiHomeLine />}>
          Home page
        </Button>
      </a>

      <a href="https://easyy.click/encryption/" target="_blank" rel="noreferrer">
        <Button theme="outline" icon={<RiLockLine />}>
          Encryption
        </Button>
      </a>

      <a href="https://github.com/penghuili/easyy.click" target="_blank" rel="noreferrer">
        <Button theme="outline" icon={<RiCodeLine />}>
          Source code
        </Button>
      </a>

      <a href="https://easyy.click/privacy" target="_blank" rel="noreferrer">
        <Button theme="outline" icon={<RiHeartLine />}>
          Privacy
        </Button>
      </a>

      <a href="https://easyy.click/terms" target="_blank" rel="noreferrer">
        <Button theme="outline" icon={<RiServiceLine />}>
          Terms
        </Button>
      </a>
    </ItemsWrapper>
  );
});
