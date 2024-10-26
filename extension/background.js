import browser from 'webextension-polyfill';

import { bgActions } from './lib/constants';
import { extStorage, storageKeys } from './lib/storage';
import { truncateString } from './lib/truncateString';
import { createLinkEffect } from './store/link/linkEffects';
import { getPageInfo } from './store/link/linkNetwork';
import { createNoteEffect } from './store/note/noteEffects';

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

const CONTEXT_MENU_ID = 'save_to_easyy_click';

// Function to create or update the context menu item based on login status
function updateContextMenu(loggedIn) {
  // Remove the menu item first to avoid duplicates
  browser.contextMenus.removeAll();

  if (loggedIn) {
    // Create the context menu item only if the user is logged in
    browser.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: 'Save to easyy.click',
      contexts: ['link', 'selection'], // Show on link and selection right-click
    });
  }
}

// Check login status from storage on startup
extStorage.get(storageKeys.loggedIn).then(loggedIn => {
  updateContextMenu(loggedIn);
});

// Listen for storage changes to update the context menu when login status changes
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.loggedIn) {
    updateContextMenu(changes.loggedIn.newValue);
  }
});

// Listen for context menu item clicks
browser.contextMenus.onClicked.addListener(async info => {
  if (info.menuItemId === CONTEXT_MENU_ID) {
    if (info.selectionText) {
      await createNoteEffect({
        title: truncateString(info.selectionText, 25),
        text: info.selectionText,
        fromUrl: info.pageUrl,
      });
    } else if (info.linkUrl) {
      const { data: pageInfo } = await getPageInfo(info.linkUrl);
      const title = pageInfo?.title || new URL(info.linkUrl).hostname;
      await createLinkEffect({ title, link: info.linkUrl, fromUrl: info.pageUrl });
    }
  }
});
