import { Button } from '@douyinfe/semi-ui';
import { RiLogoutBoxLine } from '@remixicon/react';
import React from 'react';
import { useCat } from 'usecat';

import { logOutEffect } from '../browser/store/logoutEffect';
import { isLoggingOutCat } from '../browser/store/sharedCats';

export function LogoutLink() {
  const isLoggingOut = useCat(isLoggingOutCat);
  return (
    <Button
      theme="outline"
      icon={<RiLogoutBoxLine />}
      onClick={logOutEffect}
      disabled={isLoggingOut}
    >
      Log out
    </Button>
  );
}
