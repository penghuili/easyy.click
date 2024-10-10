import { Button, Form } from '@douyinfe/semi-ui';
import React, { useCallback, useRef, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { GroupSelector } from '../components/GroupSelector.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { noGroupSortKey } from '../lib/constants.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { debounce } from '../shared/js/debounce.js';
import { isCreatingLinkCat, isLoadingPageInfoCat } from '../store/link/linkCats.js';
import { createLinkEffect, fetchPageInfoEffect } from '../store/link/linkEffect.js';

const titleCat = createCat('');
const debouncedFetchInfo = debounce(async (pageLink, ref) => {
  const data = await fetchPageInfoEffect(pageLink);
  if (data?.title) {
    titleCat.set(data.title);
    ref.current.formApi.setValue('title', data.title);
  }
}, 500);

export const LinkAdd = fastMemo(({ queryParams: { groupId: groupIdInQuery, spaceId } }) => {
  const isCreating = useCat(isCreatingLinkCat);
  const isLoadingPageInfo = useCat(isLoadingPageInfoCat);

  const formRef = useRef(null);
  const title = useCat(titleCat);
  const [link, setLink] = useState('');
  const [groupId, setGroupId] = useState(
    groupIdInQuery && groupIdInQuery !== noGroupSortKey ? groupIdInQuery : ''
  );

  const handleLinkChange = useCallback(value => {
    setLink(value);

    debouncedFetchInfo(value, formRef);
  }, []);
  const handleSave = useCallback(async () => {
    await createLinkEffect({ title, link, groupId, showMessage: true }, spaceId);
    goBack();
  }, [title, link, groupId, spaceId]);

  return (
    <PageContent>
      <PageHeader title="Add link" isLoading={isCreating || isLoadingPageInfo} hasBack />

      <Form ref={formRef} onSubmit={handleSave}>
        <Form.TextArea
          field="link"
          label="Link"
          placeholder="https://example.com"
          value={link}
          onChange={handleLinkChange}
          autoFocus
        />

        <Form.Input
          field="title"
          label="Link name"
          placeholder="ChatGPT, Youtube, etc"
          value={title}
          onChange={titleCat.set}
        />

        <GroupSelector groupId={groupId} onSelect={setGroupId} spaceId={spaceId} />

        <Button htmlType="submit" theme="solid" disabled={!link || !title || isCreating}>
          Add link
        </Button>
      </Form>
    </PageContent>
  );
});
