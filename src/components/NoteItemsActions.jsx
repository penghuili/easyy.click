import { Button, Dropdown } from '@douyinfe/semi-ui';
import {
  RiAddLine,
  RiCheckboxMultipleLine,
  RiDeleteBinLine,
  RiDragMoveLine,
  RiExportLine,
  RiMore2Line,
} from '@remixicon/react';
import React from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';

import { Flex } from '../shared/semi/Flex.jsx';
import { useNoteGroups } from '../store/note/noteCats.js';

export const NoteItemsActions = fastMemo(({ spaceId, onBulk, onDeleteAll }) => {
  const { notes } = useNoteGroups(spaceId);

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

              <Dropdown.Divider />

              <Dropdown.Item icon={<RiCheckboxMultipleLine />} onClick={onBulk}>
                Bulk actions
              </Dropdown.Item>

              <Dropdown.Item type="danger" icon={<RiDeleteBinLine />} onClick={onDeleteAll}>
                Delete all notes
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
});
