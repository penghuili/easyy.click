import { Button } from '@radix-ui/themes';
import { RiLogoutBoxLine } from '@remixicon/react';
import React from 'react';
import { useCat } from 'usecat';

import { isLoggingOutCat } from './store/sharedCats.js';
import { logOutEffect } from './store/sharedEffects';

export function LogoutLink() {
  const isLoggingOut = useCat(isLoggingOutCat);
  return (
    <Button variant="ghost" onClick={logOutEffect} disabled={isLoggingOut}>
      <RiLogoutBoxLine />
      Log out
    </Button>
  );
}
