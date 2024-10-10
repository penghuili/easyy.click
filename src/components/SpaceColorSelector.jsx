import { Radio, RadioGroup, Typography } from '@douyinfe/semi-ui';
import { RiSquareFill } from '@remixicon/react';
import React from 'react';

import { Flex } from './Flex';

export const spaceColors = [
  'rgb(249, 57, 32)',
  'rgb(233, 30, 99)',
  'rgb(180, 73, 194)',
  'rgb(106, 58, 199)',
  'rgb(63, 81, 181)',
  'rgb(0, 100, 250)',
  'rgb(0, 149, 238)',
  'rgb(5, 164, 182)',
  'rgb(0, 179, 161)',
  'rgb(59, 179, 70)',
  'rgb(123, 182, 60)',
  'rgb(155, 209, 0)',
  'rgb(250, 200, 0)',
  'rgb(240, 177, 20)',
  'rgb(252, 136, 0)',
  'rgb(107, 112, 117)',
];

export function SpaceColorSelector({ color, onSelect }) {
  return (
    <div>
      <Typography.Paragraph strong style={{ marginBottom: '0.5rem' }}>
        Pick a color
      </Typography.Paragraph>
      <Flex m="0 0 1rem">
        <RadioGroup value={color} onChange={e => onSelect(e.target.value)} direction="horizontal">
          {spaceColors.map(item => (
            <Radio key={item} value={item}>
              <RiSquareFill color={item} />
            </Radio>
          ))}
        </RadioGroup>
      </Flex>
    </div>
  );
}
