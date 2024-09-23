import { Button, Cell } from '@nutui/nutui-react';
import { RiSettings3Line, RiShieldCheckLine } from '@remixicon/react';
import React, { useCallback } from 'react';
import { BabyLink } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { ItemsWrapper } from '../components/ItemsWrapper.jsx';
import { LogoutLink } from '../components/LogoutLink.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { copyToClipboard } from '../shared/browser/copyToClipboard';
import { isLoadingAccountCat, userCat } from '../shared/browser/store/sharedCats.js';
import { setToastEffect } from '../shared/browser/store/sharedEffects';
import { formatDateTime } from '../shared/js/date';

export const Account = fastMemo(() => {
  return (
    <PrepareData>
      <Header />

      <AccountInfo />

      <ItemsWrapper align="start">
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

      <ItemsWrapper align="start">
        <LogoutLink />
      </ItemsWrapper>
    </PrepareData>
  );
});

const Header = fastMemo(() => {
  const isLoadingAccount = useCat(isLoadingAccountCat);

  return <PageHeader title="Account" isLoading={isLoadingAccount} hasBack />;
});

const AccountInfo = fastMemo(() => {
  const account = useCat(userCat);

  const handleCopyUserId = useCallback(async () => {
    await copyToClipboard(account.id);
    setToastEffect('Copied!');
  }, [account.id]);

  if (!account?.id) {
    return null;
  }

  return (
    <Cell.Group style={{ marginBottom: '2rem' }}>
      <Cell title="Email" extra={account.email} />
      <Cell title="User Id" extra={account.id} clickable onClick={handleCopyUserId} />
      <Cell title="Created at" extra={formatDateTime(account.createdAt)} />
    </Cell.Group>
  );
});
