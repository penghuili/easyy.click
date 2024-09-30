import { Button, Form, Input, TextArea } from '@nutui/nutui-react';
import React, { useCallback } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { NoteGroupSelector } from '../components/NoteGroupSelector.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { noteCat } from '../store/note/noteCats.js';
import { fetchNoteEffect, updateNoteEffect } from '../store/note/noteEffect';

const titleCat = createCat('');
const textCat = createCat('');
const groupIdCat = createCat('');

export const NoteDetails = fastMemo(({ queryParams: { noteId } }) => {
  const load = useCallback(async () => {
    await fetchNoteEffect(noteId);
    const note = noteCat.get();
    if (note) {
      titleCat.set(note.title);
      textCat.set(note.text);
      groupIdCat.set(note.groupId);
    }
  }, [noteId]);

  return (
    <PrepareData load={load}>
      <PageContent>
        <PageHeader title="Edit note" hasBack />

        <NoteForm noteId={noteId} />
      </PageContent>
    </PrepareData>
  );
});

const NoteForm = fastMemo(({ noteId }) => {
  const note = useCat(noteCat);

  const title = useCat(titleCat);
  const text = useCat(textCat);
  const groupId = useCat(groupIdCat);

  const handleSave = useCallback(async () => {
    await updateNoteEffect(noteId, {
      encryptedPassword: note.encryptedPassword,
      title,
      text,
      successMessage: 'Encrypted and saved safely in Franfurt!',
    });
    goBack();
  }, [noteId, note.encryptedPassword, title, text]);

  const handleUpdateGroup = useCallback(
    async newGroupId => {
      groupIdCat.set(newGroupId);
      await updateNoteEffect(noteId, {
        encryptedPassword: note.encryptedPassword,
        groupId: newGroupId,
        successMessage: 'Updated!',
      });
    },
    [noteId, note.encryptedPassword]
  );

  if (!note) {
    return null;
  }

  return (
    <Form
      initialValues={{ title: note.title, text: note.text }}
      labelPosition="top"
      divider
      footer={
        <Button nativeType="submit" type="primary" disabled={!title || !text}>
          Update note
        </Button>
      }
      onFinish={handleSave}
    >
      <Form.Item label="Note name" name="title">
        <Input placeholder="Give your note a name" value={title} onChange={titleCat.set} />
      </Form.Item>
      <Form.Item label="Note" name="text">
        <TextArea
          placeholder="Which note do you copy paste regularly?"
          maxLength={-1}
          value={text}
          onChange={textCat.set}
          rows={6}
        />
      </Form.Item>

      <Form.Item label="Tag" name="tag">
        <NoteGroupSelector groupId={groupId} onSelect={handleUpdateGroup} />
      </Form.Item>
    </Form>
  );
});
