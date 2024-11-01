import { Button, Checkbox, Dropdown, Typography } from '@douyinfe/semi-ui';
import {
  RiAddLine,
  RiCornerUpRightLine,
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiLockLine,
  RiMore2Line,
  RiShareLine,
} from '@remixicon/react';
import React, { useMemo } from 'react';
import { navigateTo } from 'react-baby-router';

import { useIsBuiltInGroup } from '../lib/useIsBuiltInGroup';
import { Flex } from '../shared/semi/Flex';
import { Link } from '../shared/semi/Link';
import { unshareGroupLinksEffect } from '../store/group/groupEffect';

export function LinkItemsGroupTitle({
  spaceId,
  group,
  hasOtherSpaces,
  showCheckbox,
  selectedLinks,
  onCheckboxChange,
  onPublic,
  onMove,
  onDelete,
}) {
  const isBuiltInGroup = useIsBuiltInGroup(group?.sortKey);

  const checkboxValue = useMemo(() => {
    const selectedCount = group?.items?.filter(item => selectedLinks[item.sortKey])?.length;
    const allItemsCount = group?.items?.length;
    return {
      all: !!allItemsCount && selectedCount === allItemsCount,
      some: selectedCount > 0 && selectedCount < allItemsCount,
    };
  }, [group?.items, selectedLinks]);

  return (
    <Flex direction="row" justify="between" align="center">
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
        <>
          {group.linksShareId ? (
            <Flex direction="row" align="center" gap="0.5rem">
              <Typography.Title heading={5}>{group.title}</Typography.Title>
              <Link
                href={`https://easyy.click/s/?id=${group.linksShareId}`}
                target="_blank"
                style={{
                  top: '2px',
                  position: 'relative',
                }}
              >
                <RiExternalLinkLine />
              </Link>
            </Flex>
          ) : (
            <Typography.Title heading={5}>{group.title}</Typography.Title>
          )}
        </>
      )}

      {!showCheckbox && (
        <Flex direction="row" gap="1rem" align="center">
          <Button
            theme="borderless"
            icon={<RiAddLine />}
            onClick={() =>
              navigateTo(
                isBuiltInGroup
                  ? `/links/add?spaceId=${spaceId}`
                  : `/links/add?groupId=${group.sortKey}&spaceId=${spaceId}`
              )
            }
          />

          <Dropdown
            trigger="click"
            position={'bottomLeft'}
            clickToHide
            render={
              <Dropdown.Menu>
                {group.linksShareId ? (
                  <>
                    <Dropdown.Item icon={<RiExternalLinkLine />}>
                      <a
                        href={`https://easyy.click/s/?id=${group.linksShareId}`}
                        target="_blank"
                        style={{
                          color: 'var(--semi-color-text-0)',
                          textDecoration: 'none',
                        }}
                      >
                        Open shared page
                      </a>
                    </Dropdown.Item>

                    <Dropdown.Item onClick={onPublic} icon={<RiShareLine />}>
                      Public tag again
                    </Dropdown.Item>

                    <Dropdown.Item
                      onClick={() => {
                        unshareGroupLinksEffect(group.sortKey, spaceId);
                      }}
                      icon={<RiLockLine />}
                    >
                      Make tag private
                    </Dropdown.Item>
                  </>
                ) : (
                  <Dropdown.Item onClick={onPublic} icon={<RiShareLine />}>
                    Make tag public
                  </Dropdown.Item>
                )}

                <Dropdown.Divider />

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
