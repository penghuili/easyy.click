import { Typography } from '@douyinfe/semi-ui';
import { RiPlanetLine } from '@remixicon/react';
import React from 'react';

import { Flex } from '../shared/semi/Flex';
import { useSpace } from '../store/space/spaceCats';

export function SpaceHint({ spaceId }) {
  const space = useSpace(spaceId);

  if (!space) {
    return null;
  }

  return (
    <Flex direction="row" align="center" m="0 0 1rem" gap="0.25rem">
      This happens in space
      <RiPlanetLine color={space.color} />
      <Typography.Text style={{ color: space.color }}>{space.title}</Typography.Text>.
    </Flex>
  );
}
