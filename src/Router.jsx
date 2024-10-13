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
  settingsCat,
  useExpiresAt,
  useFreeTrialsUntil,
  useIsEmailVerified,
} from './shared/browser/store/sharedCats.js';
import { initEffect } from './shared/browser/store/sharedEffects.js';
import { Account } from './views/Account.jsx';
import { ChangeEmail } from './views/ChangeEmail.jsx';
import { Changelog } from './views/Changelog.jsx';
import { ChangelogAdd } from './views/ChangelogAdd.jsx';
import { ChangePassword } from './views/ChangePassword.jsx';
import { Demo } from './views/Demo.jsx';
import { GroupAdd } from './views/GroupAdd.jsx';
import { GroupDetails } from './views/GroupDetails.jsx';
import { GroupsReorder } from './views/GroupsReorder.jsx';
import { Gumroad } from './views/Gumroad.jsx';
import { Home } from './views/Home.jsx';
import { LinkDetails } from './views/LinkDetails.jsx';
import { LinksAdd } from './views/LinksAdd.jsx';
import { LinksImport } from './views/LinksImport.jsx';
import { LinksReorder } from './views/LinksReorder.jsx';
import { NoteAdd } from './views/NoteAdd.jsx';
import { NoteDetails } from './views/NoteDetails.jsx';
import { NotesReorder } from './views/NotesReorder.jsx';
import { ResetPassword } from './views/ResetPassword.jsx';
import { Security } from './views/Security.jsx';
import { Settings } from './views/Settings.jsx';
import { SignIn } from './views/SignIn.jsx';
import { SignUp } from './views/SignUp.jsx';
import { SpaceAdd } from './views/SpaceAdd.jsx';
import { SpaceDetails } from './views/SpaceDetails.jsx';
import { Spaces } from './views/Spaces.jsx';
import { SpacesReorder } from './views/SpacesReorder.jsx';
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

  '/changelog': Changelog,

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
  '/spaces': Spaces,

  '/account': Account,
  '/security': Security,
  '/security/email': ChangeEmail,
  '/security/password': ChangePassword,
  '/settings': Settings,

  '/upgrade': Upgrade,
  '/gumroad': Gumroad,

  '/demo': Demo,
  '/changelog': Changelog,
  '/changelog/add': ChangelogAdd,

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
