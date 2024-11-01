import { Button, Checkbox, Dropdown, Typography } from '@douyinfe/semi-ui';
import { RiAddLine, RiCornerUpRightLine, RiDeleteBinLine, RiMore2Line } from '@remixicon/react';
import React, { useMemo } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';

import { useIsBuiltInGroup } from '../lib/useIsBuiltInGroup.js';
import { Flex } from '../shared/semi/Flex.jsx';

export const NoteItemsGroupTitle = fastMemo(
  ({
    spaceId,
    group,
    hasOtherSpaces,
    showCheckbox,
    selectedNotes,
    onCheckboxChange,
    onMove,
    onDelete,
  }) => {
    const isBuiltInGroup = useIsBuiltInGroup(group?.sortKey);

    const checkboxValue = useMemo(() => {
      const selectedCount = group?.items?.filter(item => selectedNotes[item.sortKey])?.length;
      const allItemsCount = group?.items?.length;
      return {
        all: !!allItemsCount && selectedCount === allItemsCount,
        some: selectedCount > 0 && selectedCount < allItemsCount,
      };
    }, [group?.items, selectedNotes]);

    return (
      <Flex direction="row" justify="between" align="center">
        <Flex direction="row" gap="0.5rem" align="center">
          {showCheckbox ? (
            <Checkbox
              checked={checkboxValue.all}
              indeterminate={checkboxValue.some}
              onChange={e => {
                onCheckboxChange(e.target.checked);
              }}
            >
              <Typography.Title heading={5}>{group.title}</Typography.Title>
            </Checkbox>
          ) : (
            <Typography.Title heading={5}>{group.title}</Typography.Title>
          )}
        </Flex>

        {!showCheckbox && (
          <Flex direction="row" gap="1rem" align="center">
            <Button
              theme="borderless"
              icon={<RiAddLine />}
              onClick={() =>
                navigateTo(
                  isBuiltInGroup
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
                  {hasOtherSpaces && (
                    <>
                      <Dropdown.Item icon={<RiCornerUpRightLine />} onClick={onMove}>
                        Move links to ...
                      </Dropdown.Item>

                      <Dropdown.Divider />
                    </>
                  )}

                  <Dropdown.Item type="danger" onClick={onDelete} icon={<RiDeleteBinLine />}>
                    Delete links
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
        )}
      </Flex>
    );
  }
);
