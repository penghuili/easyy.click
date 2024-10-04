import { Button, Form } from '@douyinfe/semi-ui';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isCreatingLinkGroupCat } from '../store/linkGroup/linkGroupCats.js';
import { createLinkGroupEffect } from '../store/linkGroup/linkGroupEffect.js';

export const LinkGroupAdd = fastMemo(() => {
  const isCreating = useCat(isCreatingLinkGroupCat);

  const [title, setTitle] = useState('');

  const handleSave = useCallback(async () => {
    await createLinkGroupEffect(title);
    goBack();
  }, [title]);

  return (
    <PageContent>
      <PageHeader title="Add link tag" isLoading={isCreating} hasBack />

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
