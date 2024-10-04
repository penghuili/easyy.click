import { Button, Form } from '@douyinfe/semi-ui';
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

      <Form onSubmit={handleSave}>
        <Form.Input
          field="title"
          label="Note name"
          placeholder="Give your note a name"
          value={title}
          onChange={setTitle}
        />

        <Form.TextArea
          field="text"
          label="Note"
          placeholder="Which note do you copy paste regularly?"
          value={text}
          onChange={setText}
        />

        <NoteGroupSelector groupId={groupId} onSelect={setGroupId} />

        <Button htmlType="submit" theme="solid" disabled={!text || !title || isCreating}>
          Add note
        </Button>
      </Form>
    </PageContent>
  );
});
