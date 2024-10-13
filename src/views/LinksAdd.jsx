import React from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { CreateLinksForm } from '../components/CreateLinksForm.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { SpaceHint } from '../components/SpaceHint.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isCreatingLinksCat, isLoadingPageInfoCat } from '../store/link/linkCats.js';

export const LinksAdd = fastMemo(({ queryParams: { groupId: groupIdInQuery, spaceId } }) => {
  const isCreating = useCat(isCreatingLinksCat);
  const isLoadingPageInfo = useCat(isLoadingPageInfoCat);

  return (
    <PageContent>
      <PageHeader title="Add links" isLoading={isCreating || isLoadingPageInfo} hasBack />

      <SpaceHint spaceId={spaceId} />

      <CreateLinksForm
        autoFocus
        initLinks={[{ link: '', title: '', groupId: groupIdInQuery || null }]}
        spaceId={spaceId}
      />
    </PageContent>
  );
});
