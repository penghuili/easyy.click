import { Button, Form } from '@douyinfe/semi-ui';
import React, { useCallback } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { SpaceHint } from '../components/SpaceHint.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { PageHeader } from '../shared/semi/PageHeader.jsx';
import { PrepareData } from '../shared/semi/PrepareData.jsx';
import { groupCat, isUpdatingGroupCat } from '../store/group/groupCats.js';
import { fetchGroupEffect, updateGroupEffect } from '../store/group/groupEffect.js';

const titleCat = createCat('');

export const GroupDetails = fastMemo(({ queryParams: { groupId, spaceId } }) => {
  const load = useCallback(async () => {
    await fetchGroupEffect(groupId, spaceId);
    const group = groupCat.get();
    if (group) {
      titleCat.set(group.title);
    }
  }, [groupId, spaceId]);

  return (
    <PrepareData load={load}>
      <PageContent>
        <PageHeader title="Edit tag" hasBack />

        <SpaceHint spaceId={spaceId} />

        <GroupForm groupId={groupId} spaceId={spaceId} />
      </PageContent>
    </PrepareData>
  );
});

const GroupForm = fastMemo(({ groupId, spaceId }) => {
  const group = useCat(groupCat);
  const title = useCat(titleCat);
  const isUpdating = useCat(isUpdatingGroupCat);

  const handleSave = useCallback(async () => {
    await updateGroupEffect(
      groupId,
      { encryptedPassword: group.encryptedPassword, title },
      spaceId
    );
    goBack();
  }, [groupId, group.encryptedPassword, title, spaceId]);

  if (!group) {
    return null;
  }

  return (
    <Form initValues={{ title: group.title }} onSubmit={handleSave}>
      <Form.Input
        field="title"
        label="Tag name"
        placeholder="Give your tag a name"
        value={title}
        onChange={titleCat.set}
      />

      <Button htmlType="submit" theme="solid" disabled={!title || isUpdating}>
        Update tag
      </Button>
    </Form>
  );
});
