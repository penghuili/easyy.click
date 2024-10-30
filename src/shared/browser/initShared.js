export let logo = null;
export let appName = null;
export let privacyUrl = null;
export let termsUrl = null;
export let resetPassword = false;

export function initShared({
  logo: appLogo,
  app: appAppName,
  privacyUrl: appPrivacyUrl = 'https://peng37.com/privacy/',
  termsUrl: appTermsUrl = 'https://peng37.com/terms/',
  resetPassword: appResetPassword = false,
}) {
  logo = appLogo;
  appName = appAppName;
  privacyUrl = appPrivacyUrl;
  termsUrl = appTermsUrl;
  resetPassword = appResetPassword;
}
