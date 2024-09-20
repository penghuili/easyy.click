import './FontSize.css';

import { Box, RadioGroup, Text } from '@radix-ui/themes';
import React, { useCallback, useState } from 'react';
import fastMemo from 'react-fast-memo';

import { LocalStorage, sharedLocalStorageKeys } from './LocalStorage.js';

const mapper = {
  1: 'peng-scaling-1',
  1.1: 'peng-scaling-1-1',
  1.25: 'peng-scaling-1-25',
  1.5: 'peng-scaling-1-5',
};
export function updateFontSize(fontSize) {
  const classes = Array.from(document.body.classList) || [];
  const newClasses = classes.filter(c => !c.startsWith('peng-scaling-'));
  const newValue = mapper[fontSize] || mapper[1];
  newClasses.push(newValue);
  document.body.classList = newClasses.join(' ');
}

export const FontSize = fastMemo(() => {
  const [scaling, setScaling] = useState(LocalStorage.get(sharedLocalStorageKeys.fontScaling) || 1);

  const handleChange = useCallback(value => {
    setScaling(value);
    LocalStorage.set(sharedLocalStorageKeys.fontScaling, value);
    const classes = Array.from(document.body.classList) || [];
    const newClasses = classes.filter(c => !c.startsWith('peng-scaling-'));
    const newValue = mapper[value] || mapper[1];
    newClasses.push(newValue);
    document.body.classList = newClasses;
  }, []);

  return (
    <Box>
      <Text weight="bold">Font size</Text>
      <RadioGroup.Root value={scaling} onValueChange={handleChange} name="fontSize">
        <RadioGroup.Item value={1}>
          <Text style={{ fontSize: 'calc(16px * 1)' }}>notenote.cc</Text>
        </RadioGroup.Item>
        <RadioGroup.Item value={1.1}>
          <Text style={{ fontSize: 'calc(16px * 1.1)' }}>notenote.cc</Text>
        </RadioGroup.Item>
        <RadioGroup.Item value={1.25}>
          <Text style={{ fontSize: 'calc(16px * 1.25)' }}>notenote.cc</Text>
        </RadioGroup.Item>
        <RadioGroup.Item value={1.5}>
          <Text style={{ fontSize: 'calc(16px * 1.5)' }}>notenote.cc</Text>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </Box>
  );
});
