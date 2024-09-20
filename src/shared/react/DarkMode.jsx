import './FontSize.css';

import { Flex, Switch } from '@radix-ui/themes';
import React, { useCallback, useEffect } from 'react';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { apps } from '../js/apps.js';
import { appName } from './initShared.js';
import { LocalStorage, sharedLocalStorageKeys } from './LocalStorage.js';

export const themeModeCat = createCat(getThemeMode());

export function useThemeMode() {
  const themeMode = useCat(themeModeCat);

  useEffect(() => {
    updateMetaThemeColor(themeMode);
  }, [themeMode]);

  return themeMode;
}

export const DarkMode = fastMemo(() => {
  const themeMode = useCat(themeModeCat);

  const handleChange = useCallback(value => {
    themeModeCat.set(value ? 'dark' : 'light');
    LocalStorage.set(sharedLocalStorageKeys.themeMode, value ? 'dark' : 'light');
  }, []);

  return (
    <Flex gap="2">
      <Switch checked={themeMode === 'dark'} onCheckedChange={handleChange} /> Dark mode
    </Flex>
  );
});

function updateMetaThemeColor(themeMode) {
  if (themeMode === 'dark') {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    metaThemeColor.setAttribute('content', '#121113');

    const msTileColor = document.querySelector('meta[name="msapplication-TileColor"]');
    msTileColor.setAttribute('content', '#121113');
  } else {
    const accentColor = apps[appName].color;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    metaThemeColor.setAttribute('content', accentColor);

    const msTileColor = document.querySelector('meta[name="msapplication-TileColor"]');
    msTileColor.setAttribute('content', accentColor);
  }
}

function getThemeMode() {
  return (
    LocalStorage.get(sharedLocalStorageKeys.themeMode) || (browserHasDarkMode() ? 'dark' : 'light')
  );
}

function browserHasDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
