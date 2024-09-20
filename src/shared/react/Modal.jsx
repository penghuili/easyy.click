import React from 'react';
import { Button, Dialog, Flex } from '@radix-ui/themes';

export function Modal({ open, onOpenChange, title, description, onSave, isSaving, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="450px">
        {!!title && <Dialog.Title>{title}</Dialog.Title>}
        {!!description && (
          <Dialog.Description size="2" mb="4">
            {description}
          </Dialog.Description>
        )}

        {children}

        {!!onSave && (
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={onSave} disabled={isSaving}>
              Ok
            </Button>
          </Flex>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
