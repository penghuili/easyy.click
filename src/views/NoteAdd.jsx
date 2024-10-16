import { Button, Form } from '@douyinfe/semi-ui';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { GroupSelector } from '../components/GroupSelector.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { SpaceHint } from '../components/SpaceHint.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { noGroupSortKey } from '../store/group/groupCats.js';
import { isCreatingNoteCat } from '../store/note/noteCats.js';
import { createNoteEffect } from '../store/note/noteEffect';

export const NoteAdd = fastMemo(({ queryParams: { groupId: groupIdInQuery, spaceId } }) => {
  const isCreating = useCat(isCreatingNoteCat);

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [groupId, setGroupId] = useState(
    groupIdInQuery && groupIdInQuery !== noGroupSortKey ? groupIdInQuery : ''
  );

  const handleSave = useCallback(async () => {
    await createNoteEffect({ title, text, groupId, showMessage: true }, spaceId);
    goBack();
  }, [title, text, groupId, spaceId]);

  return (
    <PageContent>
      <PageHeader title="Add note" isLoading={isCreating} hasBack />

      <SpaceHint spaceId={spaceId} />

      <Form onSubmit={handleSave}>
        <Form.Input
          field="title"
          label="Note name"
          placeholder="Give your note a name"
          value={title}
          onChange={setTitle}
          autoFocus
        />

        <Form.TextArea
          field="text"
          label="Note"
          placeholder="Which note do you copy paste regularly?"
          value={text}
          onChange={setText}
        />

        <GroupSelector groupId={groupId} onSelect={setGroupId} spaceId={spaceId} />

        <Button htmlType="submit" theme="solid" disabled={!text || !title || isCreating}>
          Add note
        </Button>
      </Form>
    </PageContent>
  );
});
