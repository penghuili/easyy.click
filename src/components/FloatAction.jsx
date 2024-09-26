import { Button } from '@nutui/nutui-react';
import { RiAddLine } from '@remixicon/react';
import React from 'react';

export function FloatAction({ icon, onClick, style }) {
  return (
    <Button
      fill="solid"
      type="primary"
      icon={icon || <RiAddLine />}
      onClick={onClick}
      shape="round"
      style={{
        ...(style || {}),
        position: 'absolute',
        top: 'calc(100% - 7rem)',
        left: 'calc(100% - 5rem)',
        zIndex: 3,
        width: 48,
        height: 48,
      }}
    />
  );
}
