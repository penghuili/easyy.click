import { Button, Form } from '@douyinfe/semi-ui';
import React, { useCallback, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { spaceColors, SpaceColorSelector } from '../components/SpaceColorSelector.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isCreatingSpaceCat } from '../store/space/spaceCats.js';
import { createSpaceEffect } from '../store/space/spaceEffect.js';

export const SpaceAdd = fastMemo(() => {
  const isCreating = useCat(isCreatingSpaceCat);

  const [title, setTitle] = useState('');
  const [color, setColor] = useState(spaceColors[0]);

  const handleSave = useCallback(async () => {
    await createSpaceEffect(title, color);
    goBack();
  }, [color, title]);

  return (
    <PageContent>
      <PageHeader title="Add space" isLoading={isCreating} hasBack />

      <Form onSubmit={handleSave}>
        <Form.Input
          field="title"
          label="Space name"
          placeholder="Work, Home, Invest, etc"
          value={title}
          onChange={setTitle}
          autoFocus
        />

        <SpaceColorSelector color={color} onSelect={setColor} />

        <Button htmlType="submit" theme="solid" disabled={!title || isCreating}>
          Create space
        </Button>
      </Form>
    </PageContent>
  );
});
