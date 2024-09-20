import { Button } from '@radix-ui/themes';
import { RiDeviceLine, RiLockPasswordLine, RiLockStarLine, RiMailLine } from '@remixicon/react';
import React from 'react';
import { BabyLink } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { DeleteAccountLink } from './DeleteAccountLink.jsx';
import { ItemsWrapper } from './ItemsWrapper.jsx';
import { LogoutLink } from './LogoutLink.jsx';
import { PageHeader } from './PageHeader.jsx';
import { isDeletingAccountCat, isLoggingOutFromAllDevicesCat } from './store/sharedCats.js';
import { logOutFromAllDevicesEffect } from './store/sharedEffects';

export const Security = fastMemo(() => {
  const isLoggingOutFromAllDevices = useCat(isLoggingOutFromAllDevicesCat);
  const isDeletingAccount = useCat(isDeletingAccountCat);

  return (
    <>
      <PageHeader
        title="Security"
        hasBack
        isLoading={isLoggingOutFromAllDevices || isDeletingAccount}
      />

      <ItemsWrapper align="start">
        <BabyLink to="/security/2fa">
          <Button variant="ghost">
            <RiLockStarLine /> 2-Factor Authentication
          </Button>
        </BabyLink>

        <BabyLink to="/security/email">
          <Button variant="ghost">
            <RiMailLine /> Change email
          </Button>
        </BabyLink>

        <BabyLink to="/security/password">
          <Button variant="ghost">
            <RiLockPasswordLine /> Change password
          </Button>
        </BabyLink>

        <LogoutLink />

        <Button variant="ghost" onClick={logOutFromAllDevicesEffect}>
          <RiDeviceLine />
          Log out from all devices
        </Button>

        <DeleteAccountLink />
      </ItemsWrapper>
    </>
  );
});
