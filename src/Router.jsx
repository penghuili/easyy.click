import React from 'react';
import { BabyRoutes } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { isMobileWidth } from './lib/device.js';
import { hasValidFreeTrial } from './lib/hasValidFreeTrial.js';
import {
  isLoadingSettingsCat,
  isLoggedInCat,
  settingsCat,
  useExpiresAt,
  useFreeTrialsUntil,
  useIsEmailVerified,
} from './shared/browser/store/sharedCats.js';
import { initEffect } from './shared/browser/store/sharedEffects.js';
import { ChangeEmail } from './shared/semi/ChangeEmail.jsx';
import { ChangePassword } from './shared/semi/ChangePassword.jsx';
import { PageLoading } from './shared/semi/PageLoading.jsx';
import { PrepareData } from './shared/semi/PrepareData.jsx';
import { ResetPassword } from './shared/semi/ResetPassword.jsx';
import { Security } from './shared/semi/Security.jsx';
import { Settings } from './shared/semi/Settings.jsx';
import { SignIn } from './shared/semi/SignIn.jsx';
import { SignUp } from './shared/semi/SignUp.jsx';
import { Verify2FA } from './shared/semi/Verify2FA.jsx';
import { VerifyEmail } from './shared/semi/VerifyEmail.jsx';
import { Account } from './views/Account.jsx';
import { BrowserExtension } from './views/BrowserExtension.jsx';
import { GroupAdd } from './views/GroupAdd.jsx';
import { GroupDetails } from './views/GroupDetails.jsx';
import { GroupsReorder } from './views/GroupsReorder.jsx';
import { Home } from './views/Home.jsx';
import { Inbox } from './views/Inbox.jsx';
import { LinkDetails } from './views/LinkDetails.jsx';
import { LinksAdd } from './views/LinksAdd.jsx';
import { LinksImport } from './views/LinksImport.jsx';
import { LinksReorder } from './views/LinksReorder.jsx';
import { NoteAdd } from './views/NoteAdd.jsx';
import { NoteDetails } from './views/NoteDetails.jsx';
import { NotesReorder } from './views/NotesReorder.jsx';
import { SpaceAdd } from './views/SpaceAdd.jsx';
import { SpaceDetails } from './views/SpaceDetails.jsx';
import { SpaceExport } from './views/SpaceExport.jsx';
import { Spaces } from './views/Spaces.jsx';
import { SpacesReorder } from './views/SpacesReorder.jsx';
import { Upgrade } from './views/Upgrade.jsx';
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
  '/extension': BrowserExtension,

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

  '/links/add': LinksAdd,
  '/links/details': LinkDetails,
  '/links/reorder': LinksReorder,
  '/links/import': LinksImport,

  '/groups/add': GroupAdd,
  '/groups/details': GroupDetails,
  '/groups/reorder': GroupsReorder,

  '/spaces/add': SpaceAdd,
  '/spaces/details': SpaceDetails,
  '/spaces/reorder': SpacesReorder,
  '/spaces/export': SpaceExport,
  '/spaces': Spaces,

  '/inbox': Inbox,

  '/account': Account,
  '/security': Security,
  '/security/email': ChangeEmail,
  '/security/password': ChangePassword,
  '/settings': Settings,
  '/extension': BrowserExtension,

  '/upgrade': Upgrade,

  '/': Home,
};

const AllRoutes = fastMemo(() => {
  const isLoggedIn = useCat(isLoggedInCat);
  const isVerified = useIsEmailVerified();
  const isLoadingSettings = useCat(isLoadingSettingsCat);
  const settings = useCat(settingsCat);
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
          bgColor="var(--semi-color-bg-0)"
          maxWidth="600px"
        />
      );
    }

    if (isLoadingSettings && !settings) {
      return <PageLoading />;
    }

    if (!expiresAt && !hasValidFreeTrial(freeTrialUntil)) {
      return (
        <BabyRoutes
          routes={upgradeRoutes}
          enableAnimation={isMobileWidth()}
          bgColor="var(--semi-color-bg-0)"
          maxWidth="600px"
        />
      );
    }

    return (
      <BabyRoutes
        routes={loggedInRoutes}
        enableAnimation={isMobileWidth()}
        bgColor="var(--semi-color-bg-0)"
        maxWidth="600px"
      />
    );
  }

  return (
    <BabyRoutes
      routes={publicRoutes}
      enableAnimation={isMobileWidth()}
      bgColor="var(--semi-color-bg-0)"
      maxWidth="600px"
    />
  );
});
