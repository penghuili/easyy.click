import { Button } from '@douyinfe/semi-ui';
import {
  RiChromeLine,
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
import { BabyLink } from 'react-baby-router';
import fastMemo from 'react-fast-memo';

import { copyContactEmailEffect } from '../shared/browser/store/sharedEffects.js';
import { contactEmail } from '../shared/js/constants.js';
import { ItemsWrapper } from '../shared/semi/ItemsWrapper.jsx';

export const PublicLinks = fastMemo(() => {
  return (
    <ItemsWrapper align="start">
      <a href="https://t.me/easyyclick" target="_blank">
        <Button theme="outline" icon={<RiTelegram2Line />}>
          Changelog
        </Button>
      </a>

      <BabyLink to="/extension">
        <Button theme="outline" icon={<RiChromeLine />}>
          Browser extension
        </Button>
      </BabyLink>

      <a href="https://x.com/easyydotclick" target="_blank">
        <Button theme="outline" icon={<RiTwitterXLine />}>
          x.com
        </Button>
      </a>

      <Button theme="outline" icon={<RiMailLine />} onClick={copyContactEmailEffect}>
        Contact: {contactEmail}
      </Button>

      <a href="https://easyy.click" target="_blank">
        <Button theme="outline" icon={<RiHomeLine />}>
          Home page
        </Button>
      </a>

      <a href="https://easyy.click/encryption/" target="_blank">
        <Button theme="outline" icon={<RiLockLine />}>
          Encryption
        </Button>
      </a>

      <a href="https://github.com/penghuili/easyy.click" target="_blank">
        <Button theme="outline" icon={<RiCodeLine />}>
          Source code
        </Button>
      </a>

      <a href="https://easyy.click/privacy" target="_blank">
        <Button theme="outline" icon={<RiHeartLine />}>
          Privacy
        </Button>
      </a>

      <a href="https://easyy.click/terms" target="_blank">
        <Button theme="outline" icon={<RiServiceLine />}>
          Terms
        </Button>
      </a>
    </ItemsWrapper>
  );
});
