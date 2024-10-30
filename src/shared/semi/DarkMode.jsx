import { Switch, Typography } from '@douyinfe/semi-ui';
import React, { useCallback, useEffect, useState } from 'react';

import { LocalStorage, sharedLocalStorageKeys } from '../browser/LocalStorage';
import { Flex } from './Flex.jsx';

const semiThemeModeClass = 'theme-mode';

export function changeDarkMode(enabled) {
  const body = document.body;
  const msTileColor = document.querySelector('meta[name="msapplication-TileColor"]');
  const themeColor = document.querySelector('meta[name="theme-color"]');

  if (enabled) {
    body.setAttribute(semiThemeModeClass, 'dark');

    const darkBG = getComputedStyle(body).getPropertyValue('--semi-color-bg-0');
    msTileColor.content = darkBG;
    themeColor.content = darkBG;
  } else {
    body.removeAttribute(semiThemeModeClass);
    const primaryColor = getComputedStyle(body).getPropertyValue('--semi-color-primary');
    msTileColor.content = primaryColor;
    themeColor.content = primaryColor;
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
