import { Button } from '@douyinfe/semi-ui';
import React, { forwardRef } from 'react';
import fastMemo from 'react-fast-memo';

export const IconButton = fastMemo(
  forwardRef(({ icon, size = 32, theme, type, round, disabled, onClick, style = {} }, ref) => {
    return (
      <Button
        ref={ref}
        icon={icon}
        theme={theme}
        type={type}
        disabled={disabled}
        onClick={onClick}
        style={{ height: size, width: size, borderRadius: round ? '50%' : undefined, ...style }}
      />
    );
  })
);
