import React from 'react';

import { AppWrapper } from './components/AppWrapper.jsx';
import { Router } from './Router.jsx';
import { initShared } from './shared/browser/initShared.js';
import { Toast } from './shared/browser/Toast.jsx';
import { apps } from './shared/js/apps.js';

initShared({
  logo: '/icons/icon-192.png',
  app: apps['easyy.click'].name,
  privacyUrl: 'https://notenote.cc/privacy/',
  termsUrl: 'https://notenote.cc/terms/',
  showNewVersion: false,
});

function App() {
  return (
    <AppWrapper>
      <Router />

      <Toast />
    </AppWrapper>
  );
}

export default App;
