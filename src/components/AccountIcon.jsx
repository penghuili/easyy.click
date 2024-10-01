import { RiEmotionHappyLine, RiEmotionLaughLine, RiEmotionLine } from '@remixicon/react';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';

import styles from './AccountIcon.module.css';

export const AccountIcon = fastMemo(() => {
  const [date, setDate] = useState(new Date());

  const top = useMemo(() => {
    const weekday = format(date, 'EEEEEE');
    if (weekday === 'Sa' || weekday === 'Su') {
      return -48;
    }

    const time = format(date, 'HH:mm');
    if (time < '12:00') {
      return 0;
    }
    if (time < '18:00') {
      return -24;
    }

    return -48;
  }, [date]);

  useEffect(() => {
    const handler = () => {
      setDate(new Date());
    };
    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener('focus', handler);
    };
  }, []);

  return (
    <div className={styles.accountIcons}>
      <div className={styles.accountIconsContent} style={{ top }}>
        <RiEmotionHappyLine />
        <RiEmotionLine />
        <RiEmotionLaughLine />
      </div>
    </div>
  );
});
