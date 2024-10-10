import { Button, Form } from '@douyinfe/semi-ui';
import React, { useCallback } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { GroupSelector } from '../components/GroupSelector.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isUpdatingLinkCat, linkCat } from '../store/link/linkCats.js';
import { fetchLinkEffect, updateLinkEffect } from '../store/link/linkEffect.js';

const titleCat = createCat('');
const linkValueCat = createCat('');
const groupIdCat = createCat('');

export const LinkDetails = fastMemo(({ queryParams: { linkId, spaceId } }) => {
  const load = useCallback(async () => {
    await fetchLinkEffect(linkId, spaceId);
    const link = linkCat.get();
    if (link) {
      titleCat.set(link.title);
      linkValueCat.set(link.link);
      groupIdCat.set(link.groupId);
    }
  }, [linkId, spaceId]);

  return (
    <PrepareData load={load}>
      <PageContent>
        <PageHeader title="Edit link" hasBack />

        <LinkForm linkId={linkId} spaceId={spaceId} />
      </PageContent>
    </PrepareData>
  );
});

const LinkForm = fastMemo(({ linkId, spaceId }) => {
  const link = useCat(linkCat);
  const isUpdating = useCat(isUpdatingLinkCat);

  const title = useCat(titleCat);
  const linkValue = useCat(linkValueCat);
  const groupId = useCat(groupIdCat);

  const handleSave = useCallback(async () => {
    await updateLinkEffect(
      linkId,
      {
        encryptedPassword: link.encryptedPassword,
        title,
        link: linkValue,
        groupId,
        successMessage: 'Encrypted and saved safely in Frankfurt!',
      },
      spaceId
    );
    goBack();
  }, [linkId, link.encryptedPassword, title, linkValue, groupId, spaceId]);

  const handleUpdateGroup = useCallback(
    async newGroupId => {
      groupIdCat.set(newGroupId);
      await updateLinkEffect(
        linkId,
        {
          encryptedPassword: link.encryptedPassword,
          groupId: newGroupId,
          successMessage: 'Updated!',
        },
        spaceId
      );
    },
    [linkId, link.encryptedPassword, spaceId]
  );

  if (!link) {
    return null;
  }

  return (
    <Form initValues={{ title: link.title, link: link.link }} onSubmit={handleSave}>
      <Form.Input
        field="title"
        label="Link name"
        placeholder="ChatGPT, Youtube, etc"
        value={title}
        onChange={titleCat.set}
      />
      <Form.TextArea
        field="link"
        label="Link"
        placeholder="https://example.com"
        value={linkValue}
        onChange={linkValueCat.set}
      />

      <GroupSelector groupId={groupId} onSelect={handleUpdateGroup} spaceId={spaceId} />

      <Button htmlType="submit" theme="solid" disabled={!title || !linkValue || isUpdating}>
        Update link
      </Button>
    </Form>
  );
});
