import { Button } from '@douyinfe/semi-ui';
import { RiLogoutBoxLine } from '@remixicon/react';
import React from 'react';
import { useCat } from 'usecat';

import { isLoggingOutCat } from '../shared/browser/store/sharedCats.js';
import { logOutEffect } from '../shared/browser/store/sharedEffects';

export function LogoutLink() {
  const isLoggingOut = useCat(isLoggingOutCat);
  return (
    <Button
      theme="borderless"
      icon={<RiLogoutBoxLine />}
      onClick={logOutEffect}
      disabled={isLoggingOut}
    >
      Log out
    </Button>
  );
}
