import { Button, Form, Input, TextArea } from '@nutui/nutui-react';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isCreatingLinkCat } from '../store/link/linkCats.js';
import { createLinkEffect } from '../store/link/linkEffect.js';

export const LinkAdd = fastMemo(() => {
  const isCreating = useCat(isCreatingLinkCat);

  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');

  const handleSave = useCallback(async () => {
    await createLinkEffect(title, link);
    goBack();
  }, [title, link]);

  return (
    <PageContent>
      <PageHeader title="Add link" isLoading={isCreating} hasBack />

      <Form
        labelPosition="top"
        footer={
          <Button nativeType="submit" type="primary" disabled={!link || !title || isCreating}>
            Save
          </Button>
        }
        onFinish={handleSave}
      >
        <Form.Item label="Title" name="title">
          <Input placeholder="Title" value={title} onChange={setTitle} autoFocus />
        </Form.Item>
        <Form.Item label="Link" name="link">
          <TextArea placeholder="Link" maxLength={-1} value={link} onChange={setLink} rows={6} />
        </Form.Item>
      </Form>
    </PageContent>
  );
});
