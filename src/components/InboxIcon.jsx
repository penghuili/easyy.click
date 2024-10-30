import { Badge } from '@douyinfe/semi-ui';
import { RiInbox2Line } from '@remixicon/react';
import React, { useMemo } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { settingsCat } from '../shared/browser/store/sharedCats';
import styles from './InboxIcon.module.css';

export const InboxIcon = fastMemo(() => {
  const settings = useCat(settingsCat);

  const counts = useMemo(() => {
    return (settings?.inboxLinksCount || 0) + (settings?.inboxNotesCount || 0);
  }, [settings?.inboxLinksCount, settings?.inboxNotesCount]);

  return (
    <Badge className={styles.wrapper} count={counts > 0 ? counts : null}>
      <RiInbox2Line
        color="var(--semi-color-primary)"
        onClick={() => {
          navigateTo('/inbox');
        }}
        size={25}
        style={{ cursor: 'pointer' }}
      />
    </Badge>
  );
});
