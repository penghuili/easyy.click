import '@radix-ui/themes/styles.css';
import './style.css';

import { Theme } from '@radix-ui/themes';
import React, { useEffect } from 'react';

import { useThemeMode } from './DarkMode.jsx';
import { updateFontSize } from './FontSize.jsx';
import { LocalStorage, sharedLocalStorageKeys } from './LocalStorage.js';
import { PageWrapper } from './PageWrapper.jsx';

export const themeColor = 'tomato';
export const successColor = 'green';
export const warningColor = 'amber';
export const errorColor = 'red';

export const themeCssColor = 'var(--accent-a11)';
export const successCssColor = 'var(--green-9)';
export const warningCssColor = 'var(--amber-9)';
export const errorCssColor = 'var(--red-9)';
export const textCssColor = 'var(--gray-12)';

if ('virtualKeyboard' in navigator) {
  navigator.virtualKeyboard.overlaysContent = true;
}

export function AppWrapper({ children }) {
  const themeMode = useThemeMode();

  useEffect(() => {
    updateFontSize(LocalStorage.get(sharedLocalStorageKeys.fontScaling) || 1);
  }, []);

  return (
    <Theme accentColor={themeColor} appearance={themeMode}>
      <PageWrapper>{children}</PageWrapper>
      <div style={{ height: 'env(keyboard-inset-height, 0px)' }} />
    </Theme>
  );
}
