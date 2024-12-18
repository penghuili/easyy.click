import React from 'react';

import { Router } from './Router.jsx';
import { disablePullToRefresh } from './shared/browser/bodySccroll.js';
import { initShared } from './shared/browser/initShared.js';
import { registerSW } from './shared/browser/registerSW.js';
import { Scrollbar } from './shared/browser/Scrollbar.jsx';
import { Toast } from './shared/browser/Toast.jsx';
import { apps } from './shared/js/apps.js';
import { AppWrapper } from './shared/semi/AppWrapper.jsx';

disablePullToRefresh();

initShared({
  logo: '/icons/icon-192.png',
  app: apps['easyy.click'].name,
  privacyUrl: 'https://easyy.click/privacy',
  termsUrl: 'https://easyy.click/terms',
  resetPassword: false,
});

registerSW();

function App() {
  return (
    <AppWrapper>
      <Router />

      <Toast />
      <Scrollbar thumbColor="#78c174" trackColor="#def0dc" />
    </AppWrapper>
  );
}

export default App;
