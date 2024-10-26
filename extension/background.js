import browser from 'webextension-polyfill';

import { bgActions } from './lib/constants';
import { createLinkEffect } from './store/link/linkEffects';

browser.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

browser.runtime.onMessage.addListener((action, sender, sendResponse) => {
  if (action.type === bgActions.CREATE_LINK) {
    createLinkEffect({ title: action.payload.title, link: action.payload.link });
    sendResponse({ success: true });
    return false;
  }
});
