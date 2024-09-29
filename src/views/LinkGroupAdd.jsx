import { Button, Form, Input } from '@nutui/nutui-react';
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
