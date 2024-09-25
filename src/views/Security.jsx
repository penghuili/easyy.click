import { Button } from '@nutui/nutui-react';
import { RiDeviceLine, RiLockPasswordLine, RiMailLine } from '@remixicon/react';
import React from 'react';
import { BabyLink } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { DeleteAccountLink } from '../components/DeleteAccountLink';
import { ItemsWrapper } from '../components/ItemsWrapper';
import { LogoutLink } from '../components/LogoutLink';
import { PageHeader } from '../components/PageHeader';
import { PageContent } from '../shared/browser/PageContent.jsx';
import {
  isDeletingAccountCat,
  isLoggingOutFromAllDevicesCat,
} from '../shared/browser/store/sharedCats';
import { logOutFromAllDevicesEffect } from '../shared/browser/store/sharedEffects';

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
          <Button fill="none" icon={<RiMailLine />}>
            Change email
          </Button>
        </BabyLink>

        <BabyLink to="/security/password">
          <Button fill="none" icon={<RiLockPasswordLine />}>
            Change password
          </Button>
        </BabyLink>

        <LogoutLink />

        <Button fill="none" onClick={logOutFromAllDevicesEffect} icon={<RiDeviceLine />}>
          Log out from all devices
        </Button>

        <DeleteAccountLink />
      </ItemsWrapper>
    </PageContent>
  );
});
