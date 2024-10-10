import { Button, Form } from '@douyinfe/semi-ui';
import React, { useCallback } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { GroupSelector } from '../components/GroupSelector.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PrepareData } from '../components/PrepareData.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { isUpdatingNoteCat, noteCat } from '../store/note/noteCats.js';
import { fetchNoteEffect, updateNoteEffect } from '../store/note/noteEffect';

const titleCat = createCat('');
const textCat = createCat('');
const groupIdCat = createCat('');

export const NoteDetails = fastMemo(({ queryParams: { noteId, spaceId } }) => {
  const load = useCallback(async () => {
    await fetchNoteEffect(noteId, spaceId);
    const note = noteCat.get();
    if (note) {
      titleCat.set(note.title);
      textCat.set(note.text);
      groupIdCat.set(note.groupId);
    }
  }, [noteId, spaceId]);

  return (
    <PrepareData load={load}>
      <PageContent>
        <PageHeader title="Edit note" hasBack />

        <NoteForm noteId={noteId} spaceId={spaceId} />
      </PageContent>
    </PrepareData>
  );
});

const NoteForm = fastMemo(({ noteId, spaceId }) => {
  const note = useCat(noteCat);
  const isUpdating = useCat(isUpdatingNoteCat);

  const title = useCat(titleCat);
  const text = useCat(textCat);
  const groupId = useCat(groupIdCat);

  const handleSave = useCallback(async () => {
    await updateNoteEffect(
      noteId,
      {
        encryptedPassword: note.encryptedPassword,
        title,
        text,
        successMessage: 'Encrypted and saved safely in Frankfurt!',
      },
      spaceId
    );
    goBack();
  }, [noteId, note.encryptedPassword, title, text, spaceId]);

  const handleUpdateGroup = useCallback(
    async newGroupId => {
      groupIdCat.set(newGroupId);
      await updateNoteEffect(
        noteId,
        {
          encryptedPassword: note.encryptedPassword,
          groupId: newGroupId,
          successMessage: 'Updated!',
        },
        spaceId
      );
    },
    [noteId, note.encryptedPassword, spaceId]
  );

  if (!note) {
    return null;
  }

  return (
    <Form initValues={{ title: note.title, text: note.text }} onSubmit={handleSave}>
      <Form.Input
        field="title"
        label="Note name"
        placeholder="Give your note a name"
        value={title}
        onChange={titleCat.set}
      />

      <Form.TextArea
        field="text"
        label="Note"
        placeholder="Which note do you copy paste regularly?"
        value={text}
        onChange={textCat.set}
      />

      <GroupSelector groupId={groupId} onSelect={handleUpdateGroup} spaceId={spaceId} />

      <Button htmlType="submit" theme="solid" disabled={!title || !text || isUpdating}>
        Update note
      </Button>
    </Form>
  );
});
