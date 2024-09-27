import React from 'react';
import { BabyRoutes } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageLoading } from './components/PageLoading.jsx';
import { PrepareData } from './components/PrepareData.jsx';
import { isMobileWidth } from './lib/device.js';
import { hasValidFreeTrial } from './lib/hasValidFreeTrial.js';
import {
  isLoadingSettingsCat,
  isLoggedInCat,
  useExpiresAt,
  useFreeTrialsUntil,
  useIsEmailVerified,
} from './shared/browser/store/sharedCats.js';
import { initEffect } from './shared/browser/store/sharedEffects.js';
import { Account } from './views/Account.jsx';
import { ChangeEmail } from './views/ChangeEmail.jsx';
import { ChangePassword } from './views/ChangePassword.jsx';
import { Demo } from './views/Demo.jsx';
import { LinkAdd } from './views/LinkAdd.jsx';
import { LinkDetails } from './views/LinkDetails.jsx';
import { LinksReorder } from './views/LinksReorder.jsx';
import { NoteAdd } from './views/NoteAdd.jsx';
import { NoteDetails } from './views/NoteDetails.jsx';
import { Notes } from './views/Notes.jsx';
import { NotesReorder } from './views/NotesReorder.jsx';
import { ResetPassword } from './views/ResetPassword.jsx';
import { Security } from './views/Security.jsx';
import { Settings } from './views/Settings.jsx';
import { SignIn } from './views/SignIn.jsx';
import { SignUp } from './views/SignUp.jsx';
import { Upgrade } from './views/Upgrade.jsx';
import { Verify2FA } from './views/Verify2FA.jsx';
import { VerifyEmail } from './views/VerifyEmail.jsx';
import { Welcome } from './views/Welcome.jsx';

async function load() {
  initEffect();
}

export function Router() {
  return (
    <PrepareData load={load} source="Router">
      <AllRoutes />
    </PrepareData>
  );
}

const publicRoutes = {
  '/sign-up': SignUp,
  '/sign-in': SignIn,
  '/sign-in/2fa': Verify2FA,
  '/reset-password': ResetPassword,

  '/': Welcome,
};
const verifyEmailRoutes = {
  '/security/email': ChangeEmail,
  '/': VerifyEmail,
};
const upgradeRoutes = {
  '/': Upgrade,
};
const loggedInRoutes = {
  '/notes/add': NoteAdd,
  '/notes/details': NoteDetails,
  '/notes/reorder': NotesReorder,

  '/links/add': LinkAdd,
  '/links/details': LinkDetails,
  '/links/reorder': LinksReorder,

  '/demo': Demo,

  '/account': Account,
  '/security': Security,
  '/security/email': ChangeEmail,
  '/security/password': ChangePassword,
  '/settings': Settings,

  '/upgrade': Upgrade,

  '/': Notes,
};

const AllRoutes = fastMemo(() => {
  const isLoggedIn = useCat(isLoggedInCat);
  const isVerified = useIsEmailVerified();
  const isLoadingSettings = useCat(isLoadingSettingsCat);
  const freeTrialUntil = useFreeTrialsUntil();
  const expiresAt = useExpiresAt();

  if (isLoggedIn) {
    if (isVerified === undefined) {
      return <PageLoading />;
    }

    if (!isVerified) {
      return (
        <BabyRoutes
          routes={verifyEmailRoutes}
          enableAnimation={isMobileWidth()}
          bgColor="var(--color-background)"
          maxWidth="600px"
        />
      );
    }

    if (isLoadingSettings) {
      return <PageLoading />;
    }

    if (!expiresAt || !hasValidFreeTrial(freeTrialUntil)) {
      return (
        <BabyRoutes
          routes={upgradeRoutes}
          enableAnimation={isMobileWidth()}
          bgColor="var(--color-background)"
          maxWidth="600px"
        />
      );
    }

    return (
      <BabyRoutes
        routes={loggedInRoutes}
        enableAnimation={isMobileWidth()}
        bgColor="var(--color-background)"
        maxWidth="600px"
      />
    );
  }

  return (
    <BabyRoutes
      routes={publicRoutes}
      enableAnimation={isMobileWidth()}
      bgColor="var(--color-background)"
      maxWidth="600px"
    />
  );
});
