import { createCat, useCat } from 'usecat';

export const isLoggedInCat = createCat(false);
export const authErrorCat = createCat(null);
export const isSigningUpCat = createCat(false);
export const isResendingVerificationCodeCat = createCat(false);
export const userCat = createCat({});
export const isVerifyingEmailCat = createCat(false);
export const isSigningInCat = createCat(false);
export const isSkipping2FACat = createCat(false);
export const isVerifying2FACat = createCat(false);
export const isGenerating2FACat = createCat(false);
export const isEnabling2FACat = createCat(false);
export const isDisabling2FACat = createCat(false);
export const isLoggingOutFromAllDevicesCat = createCat(false);
export const isLoadingAccountCat = createCat(false);
export const settingsCat = createCat(null);
export const isLoadingSettingsCat = createCat(false);
export const isUpdatingSettingsCat = createCat(false);
export const isDeletingAccountCat = createCat(false);
export const isChangingEmailCat = createCat(false);
export const isChangingPasswordCat = createCat(false);
export const isLoggingOutCat = createCat(false);

export function useUserCreatedAt() {
  const user = useCat(userCat);
  return user?.createdAt;
}
export function useExpiresAt() {
  const settings = useCat(settingsCat);
  return settings?.expiresAt;
}
export function useFreeTrialsUntil() {
  const settings = useCat(settingsCat);
  return settings?.freeTrial;
}
export function useTwoFactorEnabled() {
  const user = useCat(userCat);
  return user?.twoFactorEnabled;
}
export function useIsEmailVerified() {
  const user = useCat(userCat);
  return user?.verified;
}
