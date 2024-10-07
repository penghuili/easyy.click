import React from 'react';

import { AppWrapper } from './components/AppWrapper.jsx';
import { Scrollbar } from './components/Scrollbar.jsx';
import { Router } from './Router.jsx';
import { disablePullToRefresh } from './shared/browser/bodySccroll.js';
import { initShared } from './shared/browser/initShared.js';
import { Toast } from './shared/browser/Toast.jsx';
import { apps } from './shared/js/apps.js';

disablePullToRefresh();

initShared({
  logo: '/icons/icon-192.png',
  app: apps['easyy.click'].name,
  privacyUrl: 'https://easyy.click/privacy',
  termsUrl: 'https://easyy.click/terms',
  showNewVersion: true,
});

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
