import { Button, Popup } from '@nutui/nutui-react';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { Flex } from './Flex';
import { Text } from './Text';

export const Confirm = fastMemo(
  ({
    open,
    onOpenChange,
    message,
    children,
    confirmButtonLabel,
    showCancelButton = true,
    onConfirm,
    isSaving,
  }) => {
    return (
      <Popup visible={open} onClose={() => onOpenChange(false)} round style={{ padding: '2rem' }}>
        <Text>{message}</Text>

        {children}

        <Flex direction="row" gap="1rem" m="2rem 0 0" justify="end">
          {showCancelButton && (
            <Button fill="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
          <Button type="primary" onClick={onConfirm} disabled={isSaving}>
            {confirmButtonLabel || 'Confirm'}
          </Button>
        </Flex>
      </Popup>
    );
  }
);
