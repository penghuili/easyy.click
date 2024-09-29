import { Button, Input, Radio } from '@nutui/nutui-react';
import React from 'react';

import { Flex } from './Flex';
import { Text } from './Text';

export function GroupsSelector({
  groups,
  groupId,
  onSelect,
  title,
  onTitleChange,
  isCreating,
  onCreate,
}) {
  return (
    <div>
      <Flex m="0 0 0.5rem">
        {groups.length ? (
          <Radio.Group value={groupId} onChange={onSelect} direction="horizontal">
            {groups.map(group => (
              <Radio key={group.sortKey} value={group.sortKey}>
                {group.title}
              </Radio>
            ))}
          </Radio.Group>
        ) : (
          <Text size="3" color="var(--nutui-gray-6)">
            No tags yet.
          </Text>
        )}
      </Flex>

      <Flex direction="row" align="center" justify="start" m="0" style={{ maxWidth: 300 }}>
        <Input placeholder="New tag name" value={title} onChange={onTitleChange} />
        <Button size="mini" disabled={!title || isCreating} onClick={onCreate}>
          Create
        </Button>
      </Flex>
    </div>
  );
}
