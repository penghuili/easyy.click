import { Button, Descriptions, Typography } from '@douyinfe/semi-ui';
import {
  RiImportLine,
  RiSettings3Line,
  RiShieldCheckLine,
  RiVipCrown2Line,
} from '@remixicon/react';
import React, { useMemo } from 'react';
import { BabyLink } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { AppVersion } from '../components/AppVersion.jsx';
import { PublicLinks } from '../components/PublicLinks.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import {
  isLoadingAccountCat,
  useExpiresAt,
  useFreeTrialsUntil,
  userCat,
} from '../shared/browser/store/sharedCats.js';
import { formatDate, formatDateTime } from '../shared/js/date';
import { AlsoBuilt } from '../shared/semi/AlsoBuilt.jsx';
import { ItemsWrapper } from '../shared/semi/ItemsWrapper.jsx';
import { LogoutLink } from '../shared/semi/LogoutLink.jsx';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { PrepareData } from '../shared/semi/PrepareData.jsx';
import { UsedPasswordManager } from '../shared/semi/UsedPasswordManager.jsx';

export const Account = fastMemo(() => {
  return (
    <PrepareData>
      <PageContent>
        <Header />

        <UsedPasswordManager />

        <AccountInfo />

        <ItemsWrapper align="start">
          <UpgradeLink />

          <BabyLink to="/links/import">
            <Button theme="outline" icon={<RiImportLine />}>
              Import browser bookmarks
            </Button>
          </BabyLink>

          <BabyLink to="/security">
            <Button theme="outline" icon={<RiShieldCheckLine />}>
              Security
            </Button>
          </BabyLink>

          <BabyLink to="/settings">
            <Button theme="outline" icon={<RiSettings3Line />}>
              Settings
            </Button>
          </BabyLink>
        </ItemsWrapper>

        <PublicLinks />

        <ItemsWrapper align="start">
          <LogoutLink />
        </ItemsWrapper>

        <AlsoBuilt />
        <AppVersion />
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
      ...(freeTrialUntil
        ? [
            {
              key: 'Payment',
              value: expiresAt
                ? 'Lifetime access'
                : `Free trial until ${formatDate(freeTrialUntil)}`,
            },
          ]
        : []),
    ];
  }, [account.createdAt, account.email, account.id, expiresAt, freeTrialUntil]);

  if (!account?.id) {
    return null;
  }

  return <Descriptions data={data} style={{ marginBottom: '1rem' }} />;
});

const UpgradeLink = fastMemo(() => {
  const expiresAt = useExpiresAt();

  if (expiresAt === 'forever') {
    return null;
  }

  if (expiresAt) {
    return (
      <a href="https://billing.stripe.com/p/login/aEUbKYaKO6H2aiYeUU" target="_blank">
        <Button theme="outline" icon={<RiVipCrown2Line />}>
          Manage subscription
        </Button>
      </a>
    );
  }

  return (
    <BabyLink to="/upgrade">
      <Button theme="solid" icon={<RiVipCrown2Line />}>
        Upgrade
      </Button>
    </BabyLink>
  );
});
