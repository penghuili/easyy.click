import '@nutui/nutui-react/dist/style.css';
import './AppWrapper.css';

import { ConfigProvider } from '@nutui/nutui-react';
import enUS from '@nutui/nutui-react/dist/locales/en-US';
import React from 'react';

if ('virtualKeyboard' in navigator) {
  navigator.virtualKeyboard.overlaysContent = true;
}

export function AppWrapper({ children }) {
  return (
    <ConfigProvider locale={enUS}>
      <div className="appWrapper">{children}</div>
      <div style={{ height: 'env(keyboard-inset-height, 0px)' }} />
    </ConfigProvider>
  );
}
