import { Button, Form, Input, TextArea } from '@nutui/nutui-react';
import React, { useCallback } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { PageContent } from '../components/PageContent.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { noteCat } from '../store/note/noteCats.js';
import { fetchNoteEffect, updateNoteEffect } from '../store/note/noteEffect';

const titleCat = createCat('');
const textCat = createCat('');

export const NoteDetails = fastMemo(({ queryParams: { noteId } }) => {
  const load = useCallback(async () => {
    await fetchNoteEffect(noteId);
    const note = noteCat.get();
    if (note) {
      titleCat.set(note.title);
      textCat.set(note.text);
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

  const handleSave = useCallback(async () => {
    await updateNoteEffect(noteId, { encryptedPassword: note.encryptedPassword, title, text });
    goBack();
  }, [noteId, note.encryptedPassword, title, text]);

  if (!note) {
    return null;
  }

  return (
    <Form
      initialValues={{ title: note.title, text: note.text }}
      labelPosition="top"
      footer={
        <Button nativeType="submit" type="primary" disabled={!title || !text}>
          Save
        </Button>
      }
      onFinish={handleSave}
    >
      <Form.Item label="Title" name="title">
        <Input placeholder="Title" value={title} onChange={titleCat.set} />
      </Form.Item>
      <Form.Item label="Text" name="text">
        <TextArea
          placeholder="What do you want to copy?"
          maxLength={-1}
          value={text}
          onChange={textCat.set}
          rows={6}
        />
      </Form.Item>
    </Form>
  );
});
