import { Button, Form } from '@douyinfe/semi-ui';
import React, { useCallback } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { SpaceColorSelector } from '../components/SpaceColorSelector.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isUpdatingSpaceCat, spaceCat } from '../store/space/spaceCats.js';
import { fetchSpaceEffect, updateSpaceEffect } from '../store/space/spaceEffect.js';

const titleCat = createCat('');
const colorCat = createCat('');

export const SpaceDetails = fastMemo(({ queryParams: { spaceId } }) => {
  const load = useCallback(async () => {
    await fetchSpaceEffect(spaceId);
    const space = spaceCat.get();
    if (space) {
      titleCat.set(space.title);
      colorCat.set(space.color);
    }
  }, [spaceId]);

  return (
    <PrepareData load={load}>
      <PageContent>
        <PageHeader title="Edit space" hasBack />

        <SpaceForm spaceId={spaceId} />
      </PageContent>
    </PrepareData>
  );
});

const SpaceForm = fastMemo(({ spaceId }) => {
  const space = useCat(spaceCat);
  const title = useCat(titleCat);
  const color = useCat(colorCat);
  const isUpdating = useCat(isUpdatingSpaceCat);

  const handleSave = useCallback(async () => {
    await updateSpaceEffect(
      spaceId,
      { encryptedPassword: space.encryptedPassword, title, color },
      spaceId
    );
    goBack();
  }, [spaceId, space.encryptedPassword, title, color]);

  if (!space) {
    return null;
  }

  return (
    <Form initValues={{ title: space.title }} onSubmit={handleSave}>
      <Form.Input
        field="title"
        label="Tag name"
        placeholder="Give your tag a name"
        value={title}
        onChange={titleCat.set}
      />

      <SpaceColorSelector color={color} onSelect={colorCat.set} />

      <Button htmlType="submit" theme="solid" disabled={!title || isUpdating}>
        Update space
      </Button>
    </Form>
  );
});
