import { Button, Col, Dropdown, Row, Typography } from '@douyinfe/semi-ui';
import { RiAddLine, RiDragMoveLine, RiMore2Line } from '@remixicon/react';
import React, { useCallback, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { noGroupSortKey } from '../lib/constants.js';
import { copyToClipboard } from '../lib/copyToClipboard.js';
import { setToastEffect } from '../shared/browser/store/sharedEffects.js';
import { isDeletingGroupCat } from '../store/group/groupCats.js';
import { deleteGroupEffect } from '../store/group/groupEffect.js';
import { isDeletingNoteCat, isLoadingNotesCat, useNoteGroups } from '../store/note/noteCats.js';
import { deleteNoteEffect } from '../store/note/noteEffect.js';
import { Confirm } from './Confirm.jsx';
import { Flex } from './Flex.jsx';
import { confirmDeleteGroupMessage } from './GroupItems.jsx';
import { PageEmpty } from './PageEmpty.jsx';
import { PageLoading } from './PageLoading.jsx';

export const NoteItems = fastMemo(() => {
  const { groups: noteGroups, notes } = useNoteGroups();
  const isDeletingNote = useCat(isDeletingNoteCat);
  const isDeletingGroup = useCat(isDeletingGroupCat);
  const isLoading = useCat(isLoadingNotesCat);

  const [activeNote, setActiveNote] = useState(null);
  const [showDeleteNoteConfirm, setShowDeleteNoteConfirm] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);

  const handleCopy = useCallback(note => {
    copyToClipboard(note.text);
    setToastEffect(`Copied "${note.title}"!`);
  }, []);

  function renderActions() {
    return (
      <Flex direction="row" wrap="wrap" gap="1rem" m="0.5rem 0 1.5rem">
        <Button theme="solid" onClick={() => navigateTo('/notes/add')} icon={<RiAddLine />}>
          Add note
        </Button>

        {notes.length > 1 && (
          <Button onClick={() => navigateTo('/notes/reorder')} icon={<RiDragMoveLine />}>
            Reorder notes
          </Button>
        )}
      </Flex>
    );
  }

  if (!notes.length) {
    return (
      <>
        {renderActions()}

        {isLoading ? (
          <PageLoading />
        ) : (
          <PageEmpty>Which notes do you copy paste regularly?</PageEmpty>
        )}
      </>
    );
  }

  return (
    <>
      {renderActions()}

      {noteGroups.map(group => (
        <div key={group.sortKey} style={{ marginBottom: '2rem' }}>
          <Flex direction="row" justify="between" align="center">
            <Typography.Title heading={5}>{group.title}</Typography.Title>

            <Flex direction="row" gap="1rem" align="center">
              <Button
                theme="borderless"
                icon={<RiAddLine />}
                onClick={() =>
                  navigateTo(
                    group.sortKey === noGroupSortKey
                      ? '/notes/add'
                      : `/notes/add?groupId=${group.sortKey}`
                  )
                }
              />
              <Dropdown
                trigger="click"
                position={'bottomLeft'}
                clickToHide
                render={
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        navigateTo(`/note-groups/details?groupId=${group.sortKey}`);
                      }}
                    >
                      Edit tag
                    </Dropdown.Item>
                    <Dropdown.Item
                      type="danger"
                      onClick={() => {
                        setActiveGroup(group);
                        setShowDeleteGroupConfirm(true);
                      }}
                    >
                      Delete tag
                    </Dropdown.Item>
                  </Dropdown.Menu>
                }
              >
                <Button
                  theme="borderless"
                  icon={<RiMore2Line />}
                  style={{
                    marginRight: 2,
                  }}
                />
              </Dropdown>
            </Flex>
          </Flex>

          {group.items?.length ? (
            <>
              <Row type="flex">
                {group.items.map(item => (
                  <Col
                    key={item.sortKey}
                    span={12}
                    md={8}
                    style={{
                      overflow: 'hidden',
                      position: 'relative',
                      padding: '0.5rem 1.5rem 0.5rem 0',
                    }}
                  >
                    <Typography.Text
                      onClick={() => handleCopy(item)}
                      direction="end"
                      style={{
                        cursor: 'pointer',
                        paddingRight: '1rem',
                      }}
                    >
                      {item.title}
                    </Typography.Text>

                    <Dropdown
                      trigger="click"
                      position={'bottomLeft'}
                      clickToHide
                      render={
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              navigateTo(`/notes/details?noteId=${item.sortKey}`);
                            }}
                          >
                            Edit note
                          </Dropdown.Item>
                          <Dropdown.Item
                            type="danger"
                            onClick={() => {
                              setActiveNote(item);
                              setShowDeleteNoteConfirm(true);
                            }}
                          >
                            Delete note
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      }
                    >
                      <Button
                        theme="borderless"
                        icon={<RiMore2Line width="20" height="20" />}
                        size="small"
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                        }}
                      />
                    </Dropdown>
                  </Col>
                ))}
              </Row>
            </>
          ) : (
            <Typography.Text type="secondary">No notes here.</Typography.Text>
          )}
        </div>
      ))}

      <Confirm
        message="Are you sure to delete this note?"
        open={showDeleteNoteConfirm}
        onOpenChange={setShowDeleteNoteConfirm}
        onConfirm={async () => {
          if (!activeNote) return;

          await deleteNoteEffect(activeNote?.sortKey);
          setShowDeleteNoteConfirm(false);
          setActiveNote(null);
        }}
        isSaving={isDeletingNote}
      />

      <Confirm
        message={confirmDeleteGroupMessage}
        open={showDeleteGroupConfirm}
        onOpenChange={setShowDeleteGroupConfirm}
        onConfirm={async () => {
          if (!activeGroup) return;

          await deleteGroupEffect(activeGroup?.sortKey);
          setShowDeleteGroupConfirm(false);
          setActiveGroup(null);
        }}
        isSaving={isDeletingGroup}
      />
    </>
  );
});
