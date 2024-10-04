import { Radio, RadioGroup, Typography } from '@douyinfe/semi-ui';
import React, { useCallback, useState } from 'react';
import fastMemo from 'react-fast-memo';

import { LocalStorage } from '../lib/LocalStorage';
import { sharedLocalStorageKeys } from '../shared/browser/LocalStorage';
import { Flex } from './Flex';

export function updateFontSize(fontSize) {
  document.documentElement.style.setProperty('--scaling', fontSize);
}

// TODO: Make it work for semi
export const FontSize = fastMemo(() => {
  const [scaling, setScaling] = useState(LocalStorage.get(sharedLocalStorageKeys.fontScaling) || 1);

  const handleChange = useCallback(e => {
    const value = e.target.value;
    setScaling(value);
    LocalStorage.set(sharedLocalStorageKeys.fontScaling, value);
    updateFontSize(value);
  }, []);

  return (
    <Flex>
      <Typography.Title heading={4} style={{ margin: '0 0 0.5rem' }}>
        Font size
      </Typography.Title>

      <RadioGroup direction="vertical" value={scaling} onChange={handleChange}>
        <Radio value={1}>
          <Typography.Text style={{ fontSize: 'calc(16px * 1)' }}>easyy.click</Typography.Text>
        </Radio>
        <Radio value={1.1}>
          <Typography.Text style={{ fontSize: 'calc(16px * 1.1)' }}>easyy.click</Typography.Text>
        </Radio>
        <Radio value={1.25}>
          <Typography.Text style={{ fontSize: 'calc(16px * 1.25)' }}>easyy.click</Typography.Text>
        </Radio>
        <Radio value={1.5}>
          <Typography.Text style={{ fontSize: 'calc(16px * 1.5)' }}>easyy.click</Typography.Text>
        </Radio>
      </RadioGroup>
    </Flex>
  );
});
