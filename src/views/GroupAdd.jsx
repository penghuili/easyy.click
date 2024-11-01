import { Button, Form } from '@douyinfe/semi-ui';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { SpaceHint } from '../components/SpaceHint.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { isCreatingGroupCat } from '../store/group/groupCats.js';
import { createGroupEffect } from '../store/group/groupEffect.js';

export const GroupAdd = fastMemo(({ queryParams: { spaceId } }) => {
  const isCreating = useCat(isCreatingGroupCat);

  const [title, setTitle] = useState('');

  const handleSave = useCallback(async () => {
    await createGroupEffect(title, spaceId, { showMessage: true });
    goBack();
  }, [spaceId, title]);

  return (
    <PageContent>
      <PageHeader title="Add tag" isLoading={isCreating} hasBack />

      <SpaceHint spaceId={spaceId} />

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
