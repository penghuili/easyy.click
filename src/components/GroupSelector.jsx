import { Button, Input, Radio, RadioGroup, Typography } from '@douyinfe/semi-ui';
import React, { useCallback, useEffect, useState } from 'react';
import { useCat } from 'usecat';

import { isCreatingGroupCat, useGroups } from '../store/group/groupCats';
import { createGroupEffect, fetchGroupsEffect } from '../store/group/groupEffect';
import { Flex } from './Flex';

export function GroupSelector({ field, groupId, onSelect, spaceId }) {
  const groups = useGroups(spaceId);
  const isCreating = useCat(isCreatingGroupCat);

  const [title, setTitle] = useState('');

  const handleCreate = useCallback(async () => {
    const newGroup = await createGroupEffect(title, spaceId);
    if (newGroup) {
      onSelect(newGroup.sortKey);
      setTitle('');
    }
  }, [onSelect, spaceId, title]);

  useEffect(() => {
    fetchGroupsEffect(false, true, spaceId);
  }, [spaceId]);

  return (
    <div>
      <Typography.Paragraph strong style={{ marginBottom: '0.5rem' }}>
        Tags
      </Typography.Paragraph>
      <Flex m="0 0 1rem">
        {groups.length ? (
          <RadioGroup
            field={field}
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
        <Input placeholder="New tag name" value={title} onChange={setTitle} />
        <Button theme="outline" disabled={!title || isCreating} onClick={handleCreate}>
          Create
        </Button>
      </Flex>
    </div>
  );
}
