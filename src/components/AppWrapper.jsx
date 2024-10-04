import '../style.css';
import './AppWrapper.css';

import { LocaleProvider } from '@douyinfe/semi-ui';
import en_GB from '@douyinfe/semi-ui/lib/es/locale/source/en_GB';
import React, { useEffect } from 'react';

import { LocalStorage } from '../lib/LocalStorage';
import { sharedLocalStorageKeys } from '../shared/browser/LocalStorage';
import { changeDarkMode } from './DarkMode';
import { updateFontSize } from './FontSize';

export const themeCssColor = 'var(--semi-color-primary)';
export const successCssColor = 'var(--semi-color-success)';
export const warningCssColor = 'var(--semi-color-warning)';
export const errorCssColor = 'var(--semi-color-danger)';
export const textCssColor = 'var(--semi-color-text-0)';

if ('virtualKeyboard' in navigator) {
  navigator.virtualKeyboard.overlaysContent = true;
}

export function AppWrapper({ children }) {
  useEffect(() => {
    updateFontSize(LocalStorage.get(sharedLocalStorageKeys.fontScaling) || 1);
    changeDarkMode(LocalStorage.get(sharedLocalStorageKeys.themeMode) === 'dark');
  }, []);

  return (
    <LocaleProvider locale={en_GB}>
      <div className="appWrapper">{children}</div>
      <div style={{ height: 'env(keyboard-inset-height, 0px)' }} />
    </LocaleProvider>
  );
}
