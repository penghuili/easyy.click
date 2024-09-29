import { Button, Form, Input, TextArea } from '@nutui/nutui-react';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { LinkGroupSelector } from '../components/LinkGroupSelector.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { noGroupSortKey } from '../lib/constants.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isCreatingLinkCat } from '../store/link/linkCats.js';
import { createLinkEffect } from '../store/link/linkEffect.js';

export const LinkAdd = fastMemo(({ queryParams: { groupId: groupIdInQuery } }) => {
  const isCreating = useCat(isCreatingLinkCat);

  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [groupId, setGroupId] = useState(
    groupIdInQuery && groupIdInQuery !== noGroupSortKey ? groupIdInQuery : ''
  );

  const handleSave = useCallback(async () => {
    await createLinkEffect(title, link, groupId);
    goBack();
  }, [title, link, groupId]);

  return (
    <PageContent>
      <PageHeader title="Add link" isLoading={isCreating} hasBack />

      <Form
        labelPosition="top"
        divider
        footer={
          <Button nativeType="submit" type="primary" disabled={!link || !title || isCreating}>
            Add link
          </Button>
        }
        onFinish={handleSave}
      >
        <Form.Item label="Link name" name="title">
          <Input placeholder="ChatGPT, Youtube, etc" value={title} onChange={setTitle} autoFocus />
        </Form.Item>
        <Form.Item label="Link" name="link">
          <TextArea
            placeholder="https://example.com"
            maxLength={-1}
            value={link}
            onChange={setLink}
            rows={6}
          />
        </Form.Item>

        <Form.Item label="Tag" name="tag">
          <LinkGroupSelector groupId={groupId} onSelect={setGroupId} />
        </Form.Item>
      </Form>
    </PageContent>
  );
});
