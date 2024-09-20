import React from 'react';
import { Box, IconButton, Text, TextField } from '@radix-ui/themes';

export function InputField({
  type = 'text',
  label,
  placeholder,
  icon,
  value,
  autoFocus,
  disabled,
  onChange,
  onSubmit,
}) {
  return (
    <Box>
      {!!label && <Text as="label">{label}</Text>}
      <TextField.Root
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={event => {
          if (onSubmit && event.key === 'Enter') {
            onSubmit();
          }
        }}
        autoFocus={autoFocus}
        disabled={disabled}
      >
        {!!icon && (
          <TextField.Slot side="right">
            <IconButton size="1" variant="ghost">
              {icon}
            </IconButton>
          </TextField.Slot>
        )}
      </TextField.Root>
    </Box>
  );
}
