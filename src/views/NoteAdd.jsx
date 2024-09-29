import { Button, Form, Input, TextArea } from '@nutui/nutui-react';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { NoteGroupSelector } from '../components/NoteGroupSelector.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { noGroupSortKey } from '../lib/constants.js';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isCreatingNoteCat } from '../store/note/noteCats.js';
import { createNoteEffect } from '../store/note/noteEffect';

export const NoteAdd = fastMemo(({ queryParams: { groupId: groupIdInQuery } }) => {
  const isCreating = useCat(isCreatingNoteCat);

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [groupId, setGroupId] = useState(
    groupIdInQuery && groupIdInQuery !== noGroupSortKey ? groupIdInQuery : ''
  );

  const handleSave = useCallback(async () => {
    await createNoteEffect(title, text, groupId);
    goBack();
  }, [title, text, groupId]);

  return (
    <PageContent>
      <PageHeader title="Add note" isLoading={isCreating} hasBack />

      <Form
        labelPosition="top"
        divider
        footer={
          <Button nativeType="submit" type="primary" disabled={!text || !title || isCreating}>
            Add note
          </Button>
        }
        onFinish={handleSave}
      >
        <Form.Item label="Note name" name="title">
          <Input placeholder="Give your note a name" value={title} onChange={setTitle} />
        </Form.Item>
        <Form.Item label="Note" name="text">
          <TextArea
            placeholder="Which note do you copy paste regularly?"
            maxLength={-1}
            value={text}
            onChange={setText}
            rows={6}
          />
        </Form.Item>

        <Form.Item label="Tag" name="tag">
          <NoteGroupSelector groupId={groupId} onSelect={setGroupId} />
        </Form.Item>
      </Form>
    </PageContent>
  );
});
