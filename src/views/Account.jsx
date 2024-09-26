import { Button, Cell } from '@nutui/nutui-react';
import { RiMoneyDollarCircleLine, RiSettings3Line, RiShieldCheckLine } from '@remixicon/react';
import React, { useCallback, useMemo } from 'react';
import { BabyLink } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { ItemsWrapper } from '../components/ItemsWrapper.jsx';
import { LogoutLink } from '../components/LogoutLink.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { PublicLinks } from '../components/PublicLinks.jsx';
import { copyToClipboard } from '../shared/browser/copyToClipboard';
import { PageContent } from '../shared/browser/PageContent.jsx';
import {
  isLoadingAccountCat,
  useExpiresAt,
  useFreeTrialsUntil,
  userCat,
} from '../shared/browser/store/sharedCats.js';
import { setToastEffect } from '../shared/browser/store/sharedEffects';
import { formatDate, formatDateTime } from '../shared/js/date';

export const Account = fastMemo(() => {
  return (
    <PrepareData>
      <PageContent>
        <Header />

        <AccountInfo />

        <ItemsWrapper align="start">
          <UpgradeLink />

          <BabyLink to="/security">
            <Button fill="none" icon={<RiShieldCheckLine />}>
              Security
            </Button>
          </BabyLink>

          <BabyLink to="/settings">
            <Button fill="none" icon={<RiSettings3Line />}>
              Settings
            </Button>
          </BabyLink>
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

  const handleCopyUserId = useCallback(async () => {
    await copyToClipboard(account.id);
    setToastEffect('Copied!');
  }, [account.id]);

  const paymentStatus = useMemo(() => {
    if (expiresAt) {
      return <Cell title="Payment" extra="Lifetime access" />;
    }

    if (freeTrialUntil) {
      return <Cell title="Payment" extra={`Free trial until ${formatDate(freeTrialUntil)}`} />;
    }

    return null;
  }, [expiresAt, freeTrialUntil]);

  if (!account?.id) {
    return null;
  }

  return (
    <Cell.Group style={{ marginBottom: '2rem' }}>
      <Cell title="Email" extra={account.email} />
      <Cell title="User Id" extra={account.id} clickable onClick={handleCopyUserId} />
      <Cell title="Created at" extra={formatDateTime(account.createdAt)} />
      {paymentStatus}
    </Cell.Group>
  );
});

const UpgradeLink = fastMemo(() => {
  const expiresAt = useExpiresAt();

  if (expiresAt) {
    return null;
  }

  return (
    <BabyLink to="/upgrade">
      <Button fill="none" icon={<RiMoneyDollarCircleLine />}>
        Upgrade
      </Button>
    </BabyLink>
  );
});
