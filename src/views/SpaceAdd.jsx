import { Button, Form } from '@douyinfe/semi-ui';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { createGroupEffect } from '../store/group/groupEffect.js';
import { isCreatingSpaceCat } from '../store/space/spaceCats.js';

export const SpaceAdd = fastMemo(() => {
  const isCreating = useCat(isCreatingSpaceCat);

  const [title, setTitle] = useState('');
  const [color, setColor] = useState('');

  const handleSave = useCallback(async () => {
    await createGroupEffect(title);
    goBack();
  }, [title]);

  return (
    <PageContent>
      <PageHeader title="Add tag" isLoading={isCreating} hasBack />

      <Form onSubmit={handleSave}>
        <Form.Input
          field="title"
          label="Tag name"
          placeholder="Give your tag a name"
          value={title}
          onChange={setTitle}
          autoFocus
        />

        <Button htmlType="submit" theme="solid" disabled={!title || isCreating}>
          Add tag
        </Button>
      </Form>
    </PageContent>
  );
});
