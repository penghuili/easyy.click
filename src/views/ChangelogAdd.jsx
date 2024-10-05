import { Button, Form, Typography } from '@douyinfe/semi-ui';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { useAdmin } from '../lib/useAdmin.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isCreatingChangelogCat } from '../store/settings/settingsCats.js';
import { createChangelogEffect } from '../store/settings/settingsEffect.js';

export const ChangelogAdd = fastMemo(() => {
  const isCreating = useCat(isCreatingChangelogCat);
  const isAdmin = useAdmin();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [date, setDate] = useState(new Date());

  const handleSave = useCallback(async () => {
    await createChangelogEffect({
      timestamp: date.getTime(),
      title,
      message,
      imageUrl,
      postUrl,
    });
    goBack();
  }, [date, title, message, imageUrl, postUrl]);

  if (!isAdmin) {
    return (
      <PageContent>
        <Typography.Text>Only admins can access this page.</Typography.Text>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <PageHeader title="Add changelog" isLoading={isCreating} hasBack />

      <Form onSubmit={handleSave}>
        <Form.Input
          field="title"
          label="Title"
          placeholder="Title"
          value={title}
          onChange={setTitle}
        />

        <Form.TextArea
          field="message"
          label="What's changed?"
          placeholder="Change"
          value={message}
          onChange={setMessage}
        />

        <Form.TextArea
          field="imageUrl"
          label="Image url"
          placeholder="Image url"
          value={imageUrl}
          onChange={setImageUrl}
        />

        <Form.TextArea
          field="postUrl"
          label="Post url"
          placeholder="Post url"
          value={postUrl}
          onChange={setPostUrl}
        />

        <Form.DatePicker
          field="date"
          label="Date"
          type="dateTime"
          value={date}
          onChange={setDate}
        />

        <Button htmlType="submit" theme="solid" disabled={!message || !title || isCreating}>
          Create
        </Button>
      </Form>
    </PageContent>
  );
});
