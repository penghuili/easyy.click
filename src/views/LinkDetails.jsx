import { Button, Form, Input, TextArea } from '@nutui/nutui-react';
import React, { useCallback } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { LinkGroupSelector } from '../components/LinkGroupSelector.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { linkCat } from '../store/link/linkCats.js';
import { fetchLinkEffect, updateLinkEffect } from '../store/link/linkEffect.js';

const titleCat = createCat('');
const linkValueCat = createCat('');
const groupIdCat = createCat('');

export const LinkDetails = fastMemo(({ queryParams: { linkId } }) => {
  const load = useCallback(async () => {
    await fetchLinkEffect(linkId);
    const link = linkCat.get();
    if (link) {
      titleCat.set(link.title);
      linkValueCat.set(link.link);
      groupIdCat.set(link.groupId);
    }
  }, [linkId]);

  return (
    <PrepareData load={load}>
      <PageContent>
        <PageHeader title="Edit link" hasBack />

        <LinkForm linkId={linkId} />
      </PageContent>
    </PrepareData>
  );
});

const LinkForm = fastMemo(({ linkId }) => {
  const link = useCat(linkCat);

  const title = useCat(titleCat);
  const linkValue = useCat(linkValueCat);
  const groupId = useCat(groupIdCat);

  const handleSave = useCallback(async () => {
    await updateLinkEffect(linkId, {
      encryptedPassword: link.encryptedPassword,
      title,
      link: linkValue,
      groupId,
    });
    goBack();
  }, [linkId, link.encryptedPassword, title, linkValue, groupId]);

  const handleUpdateGroup = useCallback(
    async newGroupId => {
      groupIdCat.set(newGroupId);
      await updateLinkEffect(linkId, {
        encryptedPassword: link.encryptedPassword,
        groupId: newGroupId,
      });
    },
    [linkId, link.encryptedPassword]
  );

  if (!link) {
    return null;
  }

  return (
    <Form
      initialValues={{ title: link.title, link: link.link }}
      labelPosition="top"
      divider
      footer={
        <Button nativeType="submit" type="primary" disabled={!title || !linkValue}>
          Update link
        </Button>
      }
      onFinish={handleSave}
    >
      <Form.Item label="Link name" name="title">
        <Input placeholder="ChatGPT, Youtube, etc" value={title} onChange={titleCat.set} />
      </Form.Item>
      <Form.Item label="Link" name="link">
        <TextArea
          placeholder="https://example.com"
          maxLength={-1}
          rows={6}
          value={linkValue}
          onChange={linkValueCat.set}
        />
      </Form.Item>

      <Form.Item label="Tag" name="tag">
        <LinkGroupSelector groupId={groupId} onSelect={handleUpdateGroup} />
      </Form.Item>
    </Form>
  );
});
