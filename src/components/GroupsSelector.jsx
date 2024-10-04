import { Button, Input, Radio, RadioGroup, Typography } from '@douyinfe/semi-ui';
import React from 'react';

import { Flex } from './Flex';

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
      <Typography.Paragraph strong style={{ marginBottom: '0.5rem' }}>
        Tags
      </Typography.Paragraph>
      <Flex m="0 0 1rem">
        {groups.length ? (
          <RadioGroup
            value={groupId}
            onChange={e => onSelect(e.target.value)}
            direction="horizontal"
          >
            {groups.map(group => (
              <Radio key={group.sortKey} value={group.sortKey}>
                {group.title}
              </Radio>
            ))}
          </RadioGroup>
        ) : (
          <Typography.Text type="secondary">No tags yet.</Typography.Text>
        )}
      </Flex>

      <Flex
        direction="row"
        align="center"
        justify="start"
        gap="0.5rem"
        style={{ maxWidth: 300 }}
        m="0 0 1rem"
      >
        <Input placeholder="New tag name" value={title} onChange={onTitleChange} />
        <Button theme="outline" disabled={!title || isCreating} onClick={onCreate}>
          Create
        </Button>
      </Flex>
    </div>
  );
}
