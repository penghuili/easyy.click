import { Button, Descriptions, Typography } from '@douyinfe/semi-ui';
import { RiMoneyDollarCircleLine, RiSettings3Line, RiShieldCheckLine } from '@remixicon/react';
import React, { useMemo } from 'react';
import { BabyLink } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { ItemsWrapper } from '../components/ItemsWrapper.jsx';
import { LogoutLink } from '../components/LogoutLink.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { PublicLinks } from '../components/PublicLinks.jsx';
import { UsedPasswordManager } from '../components/UsedPasswordManager.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import {
  isLoadingAccountCat,
  useExpiresAt,
  useFreeTrialsUntil,
  userCat,
} from '../shared/browser/store/sharedCats.js';
import { formatDate, formatDateTime } from '../shared/js/date';

export const Account = fastMemo(() => {
  return (
    <PrepareData>
      <PageContent>
        <Header />

        <UsedPasswordManager />

        <AccountInfo />

        <ItemsWrapper align="start">
          <UpgradeLink />

          <BabyLink to="/security">
            <Button theme="borderless" icon={<RiShieldCheckLine />}>
              Security
            </Button>
          </BabyLink>

          <BabyLink to="/settings">
            <Button theme="borderless" icon={<RiSettings3Line />}>
              Settings
            </Button>
          </BabyLink>

          {/* <BabyLink to="/changelog">
            <Button theme="borderless" icon={<RiFunctionAddLine />}>
              Changelog
            </Button>
          </BabyLink> */}
        </ItemsWrapper>

        <PublicLinks />

        <ItemsWrapper align="start">
          <LogoutLink />
        </ItemsWrapper>
      </PageContent>
    </PrepareData>
  );
});

const Header = fastMemo(() => {
  const isLoadingAccount = useCat(isLoadingAccountCat);

  return <PageHeader title="Account" isLoading={isLoadingAccount} hasBack />;
});

const AccountInfo = fastMemo(() => {
  const account = useCat(userCat);
  const freeTrialUntil = useFreeTrialsUntil();
  const expiresAt = useExpiresAt();

  const data = useMemo(() => {
    return [
      { key: 'Email', value: account.email },
      { key: 'User Id', value: <Typography.Text copyable>{account.id}</Typography.Text> },
      { key: 'Created at', value: formatDateTime(account.createdAt) },
      {
        key: 'Payment',
        value: expiresAt ? 'Lifetime access' : `Free trial until ${formatDate(freeTrialUntil)}`,
      },
    ];
  }, [account.createdAt, account.email, account.id, expiresAt, freeTrialUntil]);

  if (!account?.id) {
    return null;
  }

  return <Descriptions data={data} style={{ marginBottom: '1rem' }} />;
});

const UpgradeLink = fastMemo(() => {
  const expiresAt = useExpiresAt();

  if (expiresAt) {
    return null;
  }

  return (
    <BabyLink to="/upgrade">
      <Button theme="borderless" icon={<RiMoneyDollarCircleLine />}>
        Upgrade
      </Button>
    </BabyLink>
  );
});
