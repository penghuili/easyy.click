import { Button, DatePicker, Form, Input, TextArea } from '@nutui/nutui-react';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { Text } from '../components/Text.jsx';
import { useAdmin } from '../lib/useAdmin.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { formatDateTime } from '../shared/js/date.js';
import { isCreatingChangelogCat } from '../store/changelog/changelogCats.js';
import { createChangelogEffect } from '../store/changelog/changelogEffect.js';

export const ChangelogAdd = fastMemo(() => {
  const isCreating = useCat(isCreatingChangelogCat);
  const isAdmin = useAdmin();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleDateChange = useCallback((_, values) => {
    const dateString = `${values.slice(0, 3).join('-')}T${values.slice(3).join(':')}:00`;
    setDate(new Date(dateString));
  }, []);

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
        <Text>Only admins can access this page.</Text>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <PageHeader title="Add changelog" isLoading={isCreating} hasBack />

      <Form
        labelPosition="top"
        divider
        footer={
          <Button nativeType="submit" type="primary" disabled={!message || !title || isCreating}>
            Create
          </Button>
        }
        onFinish={handleSave}
      >
        <Form.Item label="Title" name="title">
          <Input placeholder="Title" value={title} onChange={setTitle} />
        </Form.Item>

        <Form.Item label="Message" name="message">
          <TextArea
            placeholder="What's changed?"
            maxLength={-1}
            value={message}
            onChange={setMessage}
            rows={6}
          />
        </Form.Item>

        <Form.Item label="Image url" name="imageUrl">
          <TextArea
            placeholder="Image url"
            maxLength={-1}
            value={imageUrl}
            onChange={setImageUrl}
            rows={6}
          />
        </Form.Item>

        <Form.Item label="Post url" name="postUrl">
          <TextArea
            placeholder="Post url"
            maxLength={-1}
            value={postUrl}
            onChange={setPostUrl}
            rows={6}
          />
        </Form.Item>

        <Form.Item label="Date" name="date">
          <Text onClick={() => setShowDatePicker(true)}>{formatDateTime(date)}</Text>
        </Form.Item>
      </Form>
      <DatePicker
        title="Date"
        visible={showDatePicker}
        type="datetime"
        defaultValue={date}
        onClose={() => setShowDatePicker(false)}
        onConfirm={handleDateChange}
      />
    </PageContent>
  );
});
