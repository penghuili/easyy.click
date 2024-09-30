import { ActionSheet, Button, Ellipsis, Grid } from '@nutui/nutui-react';
import { RiAddLine, RiMore2Line } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { createCat, useCat } from 'usecat';

import { noGroupSortKey } from '../lib/constants.js';
import { copyToClipboard } from '../lib/copyToClipboard.js';
import { isMobileBrowser } from '../shared/browser/device.js';
import { setToastEffect } from '../shared/browser/store/sharedEffects.js';
import { isDeletingNoteCat, useNoteGroups } from '../store/note/noteCats.js';
import { deleteNoteEffect } from '../store/note/noteEffect.js';
import { Confirm } from './Confirm.jsx';
import { Flex } from './Flex.jsx';
import { PageEmpty } from './PageEmpty.jsx';
import { Text } from './Text.jsx';

const activeNoteCat = createCat(null);
const showActionSheetCat = createCat(false);

export const NoteItems = fastMemo(() => {
  const { groups: noteGroups, notes } = useNoteGroups();

  const handleCopy = useCallback(note => {
    copyToClipboard(note.text);
    setToastEffect(`Copied "${note.title}"!`);
  }, []);

  if (!notes.length) {
    return <PageEmpty>Which notes do you copy paste regularly?</PageEmpty>;
  }

  return (
    <>
      <Flex direction="row" wrap="wrap" gap="1rem" m="0 0 1.5rem">
        <Button onClick={() => navigateTo('/notes/reorder')} size="mini">
          Reorder notes
        </Button>
        <Button onClick={() => navigateTo('/note-groups/add')} size="mini">
          Add tag
        </Button>
        <Button onClick={() => navigateTo('/note-groups/reorder')} size="mini">
          Update tags
        </Button>
      </Flex>

      {noteGroups.map(group => (
        <div key={group.sortKey} style={{ marginBottom: '2rem' }}>
          <Flex direction="row" gap="1rem" align="center">
            <Text bold m="0 0 0.25rem">
              {group.title}
            </Text>

            <Button
              fill="none"
              icon={<RiAddLine />}
              onClick={() =>
                navigateTo(
                  group.sortKey === noGroupSortKey
                    ? '/notes/add'
                    : `/notes/add?groupId=${group.sortKey}`
                )
              }
            />
          </Flex>

          {group.items?.length ? (
            <Grid columns={isMobileBrowser() ? 2 : 3}>
              {group.items.map(item => (
                <Grid.Item key={item.sortKey} style={{ overflow: 'hidden', position: 'relative' }}>
                  <Ellipsis
                    onClick={() => handleCopy(item)}
                    content={item.title}
                    direction="end"
                    rows="2"
                    style={{
                      cursor: 'pointer',
                      paddingRight: '1rem',
                    }}
                  />

                  <Button
                    fill="none"
                    icon={<RiMore2Line width="20" height="20" />}
                    onClick={() => {
                      activeNoteCat.set(item);
                      showActionSheetCat.set(true);
                    }}
                    size="mini"
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: 0,
                    }}
                  />
                </Grid.Item>
              ))}
            </Grid>
          ) : (
            <Text>No notes here.</Text>
          )}
        </div>
      ))}

      <NoteActions />
    </>
  );
});

const NoteActions = fastMemo(() => {
  const showActionSheet = useCat(showActionSheetCat);
  const activeNote = useCat(activeNoteCat);
  const isDeleting = useCat(isDeletingNoteCat);

  const [showConfirm, setShowConfirm] = useState(false);

  const options = [
    {
      name: 'Edit',
      onClick: () => {
        navigateTo(`/notes/details?noteId=${activeNote?.sortKey}`);
      },
    },
    {
      name: 'Delete',
      danger: true,
      onClick: () => {
        setShowConfirm(true);
      },
    },
  ];

  const handleSelectAction = option => {
    option.onClick();
    showActionSheetCat.set(false);
  };

  return (
    <>
      <ActionSheet
        visible={showActionSheet}
        options={options}
        onSelect={handleSelectAction}
        onCancel={() => showActionSheetCat.set(false)}
      />

      <Confirm
        message="Are you sure to delete this note?"
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={async () => {
          await deleteNoteEffect(activeNote?.sortKey);
          setShowConfirm(false);
          activeNoteCat.set(null);
        }}
        isSaving={isDeleting}
      />
    </>
  );
});
