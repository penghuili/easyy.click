import { Button, Text } from '@radix-ui/themes';
import { differenceInCalendarDays } from 'date-fns';
import React, { useCallback } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { formatDate } from '../js/date';
import { errorColor, warningColor } from './AppWrapper.jsx';
import { isTesting } from './isTesting.js';
import { isLoggedInCat, useExpiresAt, useFreeTrialsUntil } from './store/sharedCats.js';

export const PaymentStatus = fastMemo(() => {
  const expiresAt = useExpiresAt();
  const freeTrialUntil = useFreeTrialsUntil();

  if (isTesting()) {
    return null;
  }

  if (!expiresAt && !freeTrialUntil) {
    return <Text>Free account</Text>;
  }

  if (expiresAt === 'forever') {
    return <Text weight="bold">Life time access</Text>;
  }

  const isFreeTrial = !expiresAt && !!freeTrialUntil;

  const expiresDate = new Date(expiresAt || freeTrialUntil);
  const formattedExpiresDate = formatDate(expiresDate);
  const today = new Date();
  const formattedToday = formatDate(today);
  const isExpired = formattedExpiresDate < formattedToday;
  const validDays = differenceInCalendarDays(expiresDate, today);
  const willBeExpiredSoon = validDays <= 7;

  if (isExpired) {
    return (
      <Text color={errorColor}>
        {isFreeTrial ? 'Free trial expired' : 'Expired'} (valid until {formattedExpiresDate})
      </Text>
    );
  }

  if (willBeExpiredSoon) {
    return (
      <Text color={warningColor}>
        {isFreeTrial ? 'Free trial until' : ''} {formattedExpiresDate} ({validDays}{' '}
        {validDays > 1 ? 'days' : 'day'} left)
      </Text>
    );
  }

  return (
    <Text>
      {isFreeTrial ? 'Free trial until' : ''} {formattedExpiresDate} ({validDays} days left)
    </Text>
  );
});

export const UpgradeButton = fastMemo(() => {
  const expiresAt = useExpiresAt();
  const freeTrialUntil = useFreeTrialsUntil();
  const isLoggedIn = useCat(isLoggedInCat);

  const isUpgradePage = window.location.pathname === '/upgrade';

  const handleNavigate = useCallback(() => {
    navigateTo('/upgrade');
  }, []);

  if (isTesting() || !isLoggedIn || isUpgradePage) {
    return null;
  }

  if (!expiresAt && !freeTrialUntil) {
    return (
      <Button size="1" variant="soft" color="green" mr="2" onClick={handleNavigate}>
        Try Pro for free
      </Button>
    );
  }

  if (!expiresAt && freeTrialUntil && freeTrialUntil >= formatDate(new Date())) {
    return (
      <Button size="1" variant="soft" color="violet" mr="2" onClick={handleNavigate}>
        Free trying
      </Button>
    );
  }

  if ((expiresAt || freeTrialUntil) < formatDate(new Date())) {
    return (
      <Button size="1" variant="soft" color="violet" mr="2" onClick={handleNavigate}>
        Upgrade to Pro
      </Button>
    );
  }

  return null;
});
