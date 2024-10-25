import { Button, Col, Dropdown, Row, Typography } from '@douyinfe/semi-ui';
import { RiAddLine, RiDragMoveLine, RiExportLine, RiMore2Line } from '@remixicon/react';
import React, { useCallback, useMemo, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { copyToClipboard } from '../shared/browser/copyToClipboard.js';
import { setToastEffect } from '../shared/browser/store/sharedEffects.js';
import { isDeletingGroupCat, noGroupSortKey } from '../store/group/groupCats.js';
import { deleteGroupEffect } from '../store/group/groupEffect.js';
import {
  isDeletingNoteCat,
  isLoadingNotesCat,
  isMovingNoteCat,
  useNoteGroups,
} from '../store/note/noteCats.js';
import { deleteNoteEffect, moveNoteEffect } from '../store/note/noteEffect.js';
import { useSpaces } from '../store/space/spaceCats.js';
import { Confirm } from './Confirm.jsx';
import { Flex } from './Flex.jsx';
import { confirmDeleteGroupMessage } from './GroupItems.jsx';
import { GroupSelectorForMove } from './GroupSelectorForMove.jsx';
import { PageEmpty } from './PageEmpty.jsx';
import { PageLoading } from './PageLoading.jsx';

export const NoteItems = fastMemo(({ spaceId }) => {
  const { groups: noteGroups, notes } = useNoteGroups(spaceId);
  const isDeletingNote = useCat(isDeletingNoteCat);
  const isDeletingGroup = useCat(isDeletingGroupCat);
  const isLoading = useCat(isLoadingNotesCat);
  const isMoving = useCat(isMovingNoteCat);
  const spaces = useSpaces();

  const otherSpaces = useMemo(
    () => spaces.filter(space => space.sortKey !== spaceId),
    [spaceId, spaces]
  );

  const [activeNote, setActiveNote] = useState(null);
  const [showDeleteNoteConfirm, setShowDeleteNoteConfirm] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);

  const [newSpace, setNewSpace] = useState(null);
  const [newSpaceGroupId, setNewSpaceGroupId] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);

  const handleCopy = useCallback(note => {
    copyToClipboard(note.text);
    setToastEffect(`Copied "${note.title}"!`);
  }, []);

  function renderActions() {
    return (
      <Flex direction="row" wrap="wrap" gap="1rem" m="0.5rem 0 1.5rem">
        <Button
          theme="solid"
          onClick={() => navigateTo(`/notes/add?spaceId=${spaceId}`)}
          icon={<RiAddLine />}
        >
          Add note
        </Button>

        {notes.length > 1 && (
          <Button
            onClick={() => navigateTo(`/notes/reorder?spaceId=${spaceId}`)}
            icon={<RiDragMoveLine />}
          >
            Reorder notes
          </Button>
        )}

        {!!notes?.length && (
          <Dropdown
            trigger="click"
            position={'bottomLeft'}
            clickToHide
            render={
              <Dropdown.Menu>
                <Dropdown.Item
                  icon={<RiExportLine />}
                  onClick={() => navigateTo(`/spaces/export?spaceId=${spaceId}`)}
                >
                  Export notes
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
                      ? `/notes/add?spaceId=${spaceId}`
                      : `/notes/add?groupId=${group.sortKey}&spaceId=${spaceId}`
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
                        navigateTo(
                          `/note-groups/details?groupId=${group.sortKey}&spaceId=${spaceId}`
                        );
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
                              navigateTo(
                                `/notes/details?noteId=${item.sortKey}&spaceId=${spaceId}`
                              );
                            }}
                          >
                            Edit note
                          </Dropdown.Item>

                          {otherSpaces.length > 0 && (
                            <>
                              <Dropdown.Divider />

                              {otherSpaces.map(space => (
                                <Dropdown.Item
                                  key={space.sortKey}
                                  onClick={() => {
                                    setActiveNote(item);
                                    setNewSpace(space);
                                    setShowMoveModal(true);
                                  }}
                                  disabled={isMoving}
                                >
                                  Move to "{space.title}"
                                </Dropdown.Item>
                              ))}

                              <Dropdown.Divider />
                            </>
                          )}

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

      <GroupSelectorForMove
        open={showMoveModal}
        onOpenChange={setShowMoveModal}
        groupId={newSpaceGroupId}
        onSelect={setNewSpaceGroupId}
        spaceId={newSpace?.sortKey}
        onConfirm={async () => {
          if (!activeNote || !newSpace) {
            return;
          }

          await moveNoteEffect(activeNote, spaceId, newSpace.sortKey, newSpaceGroupId);

          setShowMoveModal(false);
          setActiveNote(null);
          setNewSpace(null);
        }}
        isSaving={isMoving}
      />

      <Confirm
        message="Are you sure to delete this note?"
        open={showDeleteNoteConfirm}
        onOpenChange={setShowDeleteNoteConfirm}
        onConfirm={async () => {
          if (!activeNote) return;

          await deleteNoteEffect(activeNote?.sortKey, { showMessage: true }, spaceId);
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

          await deleteGroupEffect(activeGroup?.sortKey, spaceId);
          setShowDeleteGroupConfirm(false);
          setActiveGroup(null);
        }}
        isSaving={isDeletingGroup}
      />
    </>
  );
});
