import { Button } from '@douyinfe/semi-ui';
import { RiAddLine } from '@remixicon/react';
import React from 'react';

export function FloatAction({ icon, onClick, style }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 'calc(100% - 7rem)',
        left: 'calc(100% - 5rem)',
        zIndex: 3,
        width: 48,
        height: 0,
        overflow: 'visible',
      }}
    >
      <Button
        theme="solid"
        type="primary"
        icon={icon || <RiAddLine />}
        onClick={onClick}
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          ...(style || {}),
        }}
      />
    </div>
  );
}
