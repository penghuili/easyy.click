import { Button, Form, Input, TextArea } from '@nutui/nutui-react';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isCreatingNoteCat } from '../store/note/noteCats.js';
import { createNoteEffect } from '../store/note/noteEffect';

export const NoteAdd = fastMemo(() => {
  const isCreating = useCat(isCreatingNoteCat);

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleSave = useCallback(async () => {
    await createNoteEffect(title, text);
    goBack();
  }, [title, text]);

  return (
    <PageContent>
      <PageHeader title="Add note" isLoading={isCreating} hasBack />

      <Form
        labelPosition="top"
        footer={
          <Button nativeType="submit" type="primary" disabled={!text || !title || isCreating}>
            Save
          </Button>
        }
        onFinish={handleSave}
      >
        <Form.Item label="Title" name="title">
          <Input placeholder="Title" value={title} onChange={setTitle} />
        </Form.Item>
        <Form.Item label="Text" name="text">
          <TextArea
            placeholder="What do you want to copy?"
            maxLength={-1}
            value={text}
            onChange={setText}
            rows={6}
          />
        </Form.Item>
      </Form>
    </PageContent>
  );
});
