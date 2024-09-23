import '@nutui/nutui-react/dist/style.css';
import '../style.css';
import './AppWrapper.css';

import { ConfigProvider } from '@nutui/nutui-react';
import enUS from '@nutui/nutui-react/dist/locales/en-US';
import React, { useEffect } from 'react';

import { LocalStorage } from '../lib/LocalStorage';
import { sharedLocalStorageKeys } from '../shared/browser/LocalStorage';
import { updateFontSize } from './FontSize';

export const themeCssColor = 'var(--nutui-color-primary)';
export const successCssColor = '#30a46c';
export const warningCssColor = '#ffc53d';
export const errorCssColor = '#e5484d';
export const textCssColor = 'var(--nutui-gray-7)';

if ('virtualKeyboard' in navigator) {
  navigator.virtualKeyboard.overlaysContent = true;
}

export function AppWrapper({ children }) {
  useEffect(() => {
    updateFontSize(LocalStorage.get(sharedLocalStorageKeys.fontScaling) || 1);
  }, []);

  return (
    <ConfigProvider locale={enUS}>
      <div className="appWrapper">{children}</div>
      <div style={{ height: 'env(keyboard-inset-height, 0px)' }} />
    </ConfigProvider>
  );
}
