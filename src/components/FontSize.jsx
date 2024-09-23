import { Radio } from '@nutui/nutui-react';
import React, { useCallback, useState } from 'react';
import fastMemo from 'react-fast-memo';

import { LocalStorage } from '../lib/LocalStorage';
import { sharedLocalStorageKeys } from '../shared/browser/LocalStorage';
import { Flex } from './Flex';
import { Text } from './Text';

export function updateFontSize(fontSize) {
  document.documentElement.style.setProperty('--scaling', fontSize);
}

export const FontSize = fastMemo(() => {
  const [scaling, setScaling] = useState(LocalStorage.get(sharedLocalStorageKeys.fontScaling) || 1);

  const handleChange = useCallback(value => {
    setScaling(value);
    LocalStorage.set(sharedLocalStorageKeys.fontScaling, value);
    updateFontSize(value);
  }, []);

  return (
    <Flex>
      <Text as="h3" size="5" m="0 0 0.5rem">
        Font size
      </Text>

      <Radio.Group value={scaling} onChange={handleChange}>
        <Radio value={1}>
          <Text as="span" style={{ fontSize: 'calc(16px * 1)' }}>
            easyy.click
          </Text>
        </Radio>
        <Radio value={1.1}>
          <Text as="span" style={{ fontSize: 'calc(16px * 1.1)' }}>
            easyy.click
          </Text>
        </Radio>
        <Radio value={1.25}>
          <Text as="span" style={{ fontSize: 'calc(16px * 1.25)' }}>
            easyy.click
          </Text>
        </Radio>
        <Radio value={1.5}>
          <Text as="span" style={{ fontSize: 'calc(16px * 1.5)' }}>
            easyy.click
          </Text>
        </Radio>
      </Radio.Group>
    </Flex>
  );
});
