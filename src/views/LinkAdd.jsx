import { Button, Form } from '@douyinfe/semi-ui';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { GroupSelector } from '../components/GroupSelector.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { noGroupSortKey } from '../lib/constants.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isCreatingLinkCat } from '../store/link/linkCats.js';
import { createLinkEffect } from '../store/link/linkEffect.js';

export const LinkAdd = fastMemo(({ queryParams: { groupId: groupIdInQuery, spaceId } }) => {
  const isCreating = useCat(isCreatingLinkCat);

  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [groupId, setGroupId] = useState(
    groupIdInQuery && groupIdInQuery !== noGroupSortKey ? groupIdInQuery : ''
  );

  const handleSave = useCallback(async () => {
    await createLinkEffect({ title, link, groupId, showMessage: true }, spaceId);
    goBack();
  }, [title, link, groupId, spaceId]);

  return (
    <PageContent>
      <PageHeader title="Add link" isLoading={isCreating} hasBack />

      <Form onSubmit={handleSave}>
        <Form.Input
          field="title"
          label="Link name"
          placeholder="ChatGPT, Youtube, etc"
          value={title}
          onChange={setTitle}
          autoFocus
        />
        <Form.TextArea
          field="link"
          label="Link"
          placeholder="https://example.com"
          value={link}
          onChange={setLink}
        />

        <GroupSelector groupId={groupId} onSelect={setGroupId} spaceId={spaceId} />

        <Button htmlType="submit" theme="solid" disabled={!link || !title || isCreating}>
          Add link
        </Button>
      </Form>
    </PageContent>
  );
});
