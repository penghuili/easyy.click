import { Switch, Typography } from '@douyinfe/semi-ui';
import React, { useCallback, useEffect, useState } from 'react';

import { LocalStorage } from '../lib/LocalStorage';
import { sharedLocalStorageKeys } from '../shared/browser/LocalStorage';
import { Flex } from './Flex';

const semiThemeModeClass = 'theme-mode';

export function changeDarkMode(enabled) {
  const body = document.body;
  if (enabled) {
    body.setAttribute(semiThemeModeClass, 'dark');
  } else {
    body.removeAttribute(semiThemeModeClass);
  }
}

export function DarkMode() {
  const [darkMode, setDarkMode] = useState(
    LocalStorage.get(sharedLocalStorageKeys.themeMode) === 'dark'
  );

  const handleChange = useCallback(newChecked => {
    setDarkMode(newChecked);
    LocalStorage.set(sharedLocalStorageKeys.themeMode, newChecked ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    changeDarkMode(darkMode);
  }, [darkMode]);

  return (
    <Flex direction="row" justify="between" align="center">
      <Typography.Text>Dark mode</Typography.Text>
      <Switch checked={darkMode} onChange={handleChange} style={{ marginLeft: '1rem' }} />
    </Flex>
  );
}
