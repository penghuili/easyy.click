import { LocalStorage, sharedLocalStorageKeys } from './LocalStorage';

export function saveTWA() {
  if (document.referrer?.includes?.('android-app://')) {
    LocalStorage.set(sharedLocalStorageKeys.isTWA, true);
  }
}

export function isAndroidApp() {
  return !!LocalStorage.get(sharedLocalStorageKeys.isTWA);
}

export function isAndroidBrowser() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android/i.test(userAgent) && /mobile/i.test(userAgent);
}

export function isIOSBrowser() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const iOS_devices = /iphone|ipad|ipod/;

  // Check if it's an iOS device
  if (iOS_devices.test(userAgent)) {
    return true;
  }

  // Special check for iPad on iOS 13+ (which reports as Mac)
  if (userAgent.includes('mac') && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
    return true;
  }

  return false;
}

export function isMobileBrowser() {
  return isAndroidBrowser() || isIOSBrowser();
}

export function isInstalledOnHomeScreen() {
  return (
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  );
}

export function isMobileWidth() {
  return window.innerWidth < 768;
}
