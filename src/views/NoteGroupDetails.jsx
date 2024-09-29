import { Button, Form, Input } from '@nutui/nutui-react';
import React, { useCallback } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isUpdatingNoteGroupCat, noteGroupCat } from '../store/noteGroup/noteGroupCats.js';
import { fetchNoteGroupEffect, updateNoteGroupEffect } from '../store/noteGroup/noteGroupEffect.js';

const titleCat = createCat('');

export const NoteGroupDetails = fastMemo(({ queryParams: { groupId } }) => {
  const load = useCallback(async () => {
    await fetchNoteGroupEffect(groupId);
    const group = noteGroupCat.get();
    if (group) {
      titleCat.set(group.title);
    }
  }, [groupId]);

  return (
    <PrepareData load={load}>
      <PageContent>
        <PageHeader title="Edit note tag" hasBack />

        <GroupForm groupId={groupId} />
      </PageContent>
    </PrepareData>
  );
});

const GroupForm = fastMemo(({ groupId }) => {
  const group = useCat(noteGroupCat);
  const title = useCat(titleCat);
  const isUpdating = useCat(isUpdatingNoteGroupCat);

  const handleSave = useCallback(async () => {
    await updateNoteGroupEffect(groupId, { encryptedPassword: group.encryptedPassword, title });
    goBack();
  }, [groupId, group.encryptedPassword, title]);

  if (!group) {
    return null;
  }

  return (
    <Form
      initialValues={{ title: group.title, text: group.text }}
      labelPosition="top"
      divider
      footer={
        <Button nativeType="submit" type="primary" disabled={!title || isUpdating}>
          Update tag
        </Button>
      }
      onFinish={handleSave}
    >
      <Form.Item label="Tag name" name="title">
        <Input placeholder="Give your tag a name" value={title} onChange={titleCat.set} />
      </Form.Item>
    </Form>
  );
});