import { Typography } from '@douyinfe/semi-ui';
import { differenceInCalendarDays } from 'date-fns';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { isTesting } from '../browser/isTesting.js';
import { useExpiresAt, useFreeTrialsUntil } from '../browser/store/sharedCats.js';
import { formatDate } from '../js/date';

export const PaymentStatus = fastMemo(() => {
  const expiresAt = useExpiresAt();
  const freeTrialUntil = useFreeTrialsUntil();

  if (isTesting()) {
    return null;
  }

  if (!expiresAt && !freeTrialUntil) {
    return <Typography.Text>Free account</Typography.Text>;
  }

  if (expiresAt === 'forever') {
    return <Typography.Text>Life time access</Typography.Text>;
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
      <Typography.Text type="danger">
        {isFreeTrial ? 'Free trial expired' : 'Expired'} (valid until {formattedExpiresDate})
      </Typography.Text>
    );
  }

  const typeMessage = isFreeTrial ? 'Free trial until' : '';
  if (willBeExpiredSoon) {
    if (validDays === 0) {
      return (
        <Typography.Text type="warning">
          {typeMessage} {formattedExpiresDate} (today is the last day)
        </Typography.Text>
      );
    }
    return (
      <Typography.Text type="warning">
        {typeMessage} {formattedExpiresDate} (
        {validDays > 1 ? `${validDays} days left` : '1 day left'})
      </Typography.Text>
    );
  }

  return (
    <Typography.Text>
      {typeMessage} {formattedExpiresDate} ({validDays} days left)
    </Typography.Text>
  );
});
