import { Button, Checkbox, Col, Dropdown, Typography } from '@douyinfe/semi-ui';
import { RiCornerUpRightLine, RiDeleteBinLine, RiEdit2Line, RiMore2Line } from '@remixicon/react';
import React, { useCallback } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { copyToClipboard } from '../shared/browser/copyToClipboard.js';
import { setToastEffect } from '../shared/browser/store/sharedEffects.js';
import { isMovingNoteCat } from '../store/note/noteCats.js';

export const NoteItemsItem = fastMemo(
  ({
    spaceId,
    note,
    showCheckbox,
    selectedNotes,
    onCheckboxChange,
    hasOtherSpaces,
    onMove,
    onDelete,
  }) => {
    const isMoving = useCat(isMovingNoteCat);

    const handleCopy = useCallback(note => {
      copyToClipboard(note.text);
      setToastEffect(`Copied "${note.title}"!`);
    }, []);

    if (!note) {
      return null;
    }

    return (
      <Col
        span={12}
        md={8}
        style={{
          overflow: 'hidden',
          position: 'relative',
          padding: '0.5rem 1.5rem 0.5rem 0',
        }}
      >
        {showCheckbox ? (
          <Checkbox
            checked={!!selectedNotes[note.sortKey]}
            onChange={e => {
              onCheckboxChange(e.target.checked);
            }}
          >
            {note.title}
          </Checkbox>
        ) : (
          <Typography.Text
            onClick={() => handleCopy(note)}
            direction="end"
            style={{
              cursor: 'pointer',
              paddingRight: '1rem',
            }}
          >
            {note.title}
          </Typography.Text>
        )}

        {!showCheckbox && (
          <Dropdown
            trigger="click"
            position={'bottomLeft'}
            clickToHide
            render={
              <Dropdown.Menu>
                <Dropdown.Item
                  icon={<RiEdit2Line />}
                  onClick={() => {
                    navigateTo(`/notes/details?noteId=${note.sortKey}&spaceId=${spaceId}`);
                  }}
                >
                  Edit note
                </Dropdown.Item>

                {hasOtherSpaces && (
                  <>
                    <Dropdown.Divider />

                    <Dropdown.Item
                      icon={<RiCornerUpRightLine />}
                      onClick={onMove}
                      disabled={isMoving}
                    >
                      Move to ...
                    </Dropdown.Item>

                    <Dropdown.Divider />
                  </>
                )}

                <Dropdown.Item type="danger" icon={<RiDeleteBinLine />} onClick={onDelete}>
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
        )}
      </Col>
    );
  }
);