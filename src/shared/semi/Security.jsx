import { Button } from '@douyinfe/semi-ui';
import { RiDeviceLine, RiLockPasswordLine, RiLockStarLine, RiMailLine } from '@remixicon/react';
import React from 'react';
import { BabyLink } from 'react-baby-router';
import { useCat } from 'usecat';

import { fastMemo } from '../browser/fastMemo';
import { PageContent } from '../browser/PageContent.jsx';
import { isDeletingAccountCat, isLoggingOutFromAllDevicesCat } from '../browser/store/sharedCats';
import { logOutFromAllDevicesEffect } from '../browser/store/sharedEffects.js';
import { DeleteAccountLink } from './DeleteAccountLink.jsx';
import { ItemsWrapper } from './ItemsWrapper.jsx';
import { LogoutLink } from './LogoutLink.jsx';
import { PageHeader } from './PageHeader.jsx';

export const Security = fastMemo(() => {
  const isLoggingOutFromAllDevices = useCat(isLoggingOutFromAllDevicesCat);
  const isDeletingAccount = useCat(isDeletingAccountCat);

  return (
    <PageContent>
      <PageHeader
        title="Security"
        hasBack
        isLoading={isLoggingOutFromAllDevices || isDeletingAccount}
      />

      <ItemsWrapper align="start">
        <BabyLink to="/security/email">
          <Button theme="outline" icon={<RiMailLine />}>
            Change email
          </Button>
        </BabyLink>

        <BabyLink to="/security/password">
          <Button theme="outline" icon={<RiLockPasswordLine />}>
            Change password
          </Button>
        </BabyLink>

        <BabyLink to="/security/2fa">
          <Button theme="outline" icon={<RiLockStarLine />}>
            2-Factor Authentication
          </Button>
        </BabyLink>

        <LogoutLink />

        <Button theme="outline" onClick={logOutFromAllDevicesEffect} icon={<RiDeviceLine />}>
          Log out from all devices
        </Button>

        <DeleteAccountLink />
      </ItemsWrapper>
    </PageContent>
  );
});
