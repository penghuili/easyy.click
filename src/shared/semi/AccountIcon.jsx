import {
  RiEmotion2Line,
  RiEmotionHappyLine,
  RiEmotionLaughLine,
  RiEmotionLine,
} from '@remixicon/react';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';

import { fastMemo } from '../browser/fastMemo';
import styles from './AccountIcon.module.css';

const iconSize = 25;

export const AccountIcon = fastMemo(({ onClick }) => {
  const [date, setDate] = useState(new Date());

  const top = useMemo(() => {
    const weekday = format(date, 'EEEEEE');
    if (weekday === 'Sa' || weekday === 'Su') {
      return -iconSize * 3;
    }

    const time = format(date, 'HH:mm');

    if (time < '06:00' || time >= '23:00') {
      return 0;
    }
    if (time < '12:00') {
      return -iconSize;
    }
    if (time < '18:00') {
      return -iconSize * 2;
    }

    return -iconSize * 3;
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
    <div className={styles.accountIcons} onClick={onClick}>
      <div
        className={styles.accountIconsContent}
        style={{ top, height: iconSize * 4, cursor: 'pointer' }}
      >
        <RiEmotion2Line size={iconSize} color="var(--semi-color-primary)" />
        <RiEmotionHappyLine size={iconSize} color="var(--semi-color-primary)" />
        <RiEmotionLine size={iconSize} color="var(--semi-color-primary)" />
        <RiEmotionLaughLine size={iconSize} color="var(--semi-color-primary)" />
      </div>
    </div>
  );
});
