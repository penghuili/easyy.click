import { Box, Text, TextArea } from '@radix-ui/themes';
import React from 'react';

export function AreaField({
  label,
  placeholder,
  minHeight = '8rem',
  value,
  disabled,
  autofocus,
  onChange,
  onPaste,
  style,
}) {
  return (
    <Box>
      {!!label && <Text as="label">{label}</Text>}
      <TextArea
        autoFocus={autofocus}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onPaste={onPaste}
        disabled={disabled}
        resize="vertical"
        style={{
          ...(style || {}),
          minHeight,
        }}
      />
    </Box>
  );
}
