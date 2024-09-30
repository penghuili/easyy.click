import { Button } from '@nutui/nutui-react';
import {
  RiCodeLine,
  RiHeartLine,
  RiHomeLine,
  RiLockLine,
  RiMailLine,
  RiServiceLine,
  RiTwitterXLine,
} from '@remixicon/react';
import React, { useCallback } from 'react';
import fastMemo from 'react-fast-memo';

import { copyToClipboard } from '../shared/browser/copyToClipboard.js';
import { setToastEffect } from '../shared/browser/store/sharedEffects.js';
import { ItemsWrapper } from './ItemsWrapper.jsx';

export const PublicLinks = fastMemo(() => {
  const handleCopyEmail = useCallback(async () => {
    await copyToClipboard('peng@tuta.com');
    setToastEffect('Contact email is copied!');
  }, []);

  return (
    <ItemsWrapper align="start">
      <a href="https://easyy.click" target="_blank" rel="noreferrer">
        <Button fill="none" icon={<RiHomeLine />}>
          Learn more
        </Button>
      </a>

      <a href="https://easyy.click/encryption/" target="_blank" rel="noreferrer">
        <Button fill="none" icon={<RiLockLine />}>
          Encryption
        </Button>
      </a>

      <a href="https://github.com/penghuili/easyy.click" target="_blank" rel="noreferrer">
        <Button fill="none" icon={<RiCodeLine />}>
          Source code
        </Button>
      </a>

      <a href="https://easyy.click/privacy" target="_blank" rel="noreferrer">
        <Button fill="none" icon={<RiHeartLine />}>
          Privacy
        </Button>
      </a>

      <a href="https://easyy.click/terms" target="_blank" rel="noreferrer">
        <Button fill="none" icon={<RiServiceLine />}>
          Terms
        </Button>
      </a>

      <a href="https://x.com/easyydotclick" target="_blank" rel="noreferrer">
        <Button fill="none" icon={<RiTwitterXLine />}>
          x.com
        </Button>
      </a>

      <Button fill="none" icon={<RiMailLine />} onClick={handleCopyEmail}>
        Contact: peng@tuta.com
      </Button>
    </ItemsWrapper>
  );
});
