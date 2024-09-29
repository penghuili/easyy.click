import { Button, Form, Input } from '@nutui/nutui-react';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isCreatingNoteGroupCat } from '../store/noteGroup/noteGroupCats.js';
import { createNoteGroupEffect } from '../store/noteGroup/noteGroupEffect.js';

export const NoteGroupAdd = fastMemo(() => {
  const isCreating = useCat(isCreatingNoteGroupCat);

  const [title, setTitle] = useState('');

  const handleSave = useCallback(async () => {
    await createNoteGroupEffect(title);
    goBack();
  }, [title]);

  return (
    <PageContent>
      <PageHeader title="Add note tag" isLoading={isCreating} hasBack />

      <Form
        labelPosition="top"
        divider
        footer={
          <Button nativeType="submit" type="primary" disabled={!title || isCreating}>
            Add tag
          </Button>
        }
        onFinish={handleSave}
      >
        <Form.Item label="Tag name" name="title">
          <Input placeholder="Give your tag a name" value={title} onChange={setTitle} autoFocus />
        </Form.Item>
      </Form>
    </PageContent>
  );
});
