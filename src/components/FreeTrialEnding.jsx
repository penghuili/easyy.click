import { Banner, Typography } from '@douyinfe/semi-ui';
import { differenceInCalendarDays } from 'date-fns';
import React from 'react';

import { useExpiresAt, useFreeTrialsUntil } from '../shared/browser/store/sharedCats';

export function FreeTrialEnding() {
  const expiresAt = useExpiresAt();
  const freeTrialUntil = useFreeTrialsUntil();

  if (expiresAt || !freeTrialUntil) {
    return null;
  }

  const left = differenceInCalendarDays(new Date(freeTrialUntil), new Date());

  if (left >= 0 && left <= 3) {
    return (
      <Banner
        fullMode={false}
        type="warning"
        bordered
        icon={null}
        closeIcon={null}
        description={
          <>
            {left === 0 && (
              <Typography.Text strong>Today is the last day of your free trial.</Typography.Text>
            )}
            {left === 1 && (
              <Typography.Text strong>Your free trial will end in {left} day.</Typography.Text>
            )}
            {left > 1 && (
              <Typography.Text strong>Your free trial will end in {left} days.</Typography.Text>
            )}
          </>
        }
        style={{ marginBottom: '0.5rem' }}
      />
    );
  }

  return null;
}
