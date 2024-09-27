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
        <Form.Item label="Note name" name="title">
          <Input placeholder="Give your note a name" value={title} onChange={setTitle} />
        </Form.Item>
        <Form.Item label="Note" name="text">
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
