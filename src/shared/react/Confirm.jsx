import { AlertDialog, Button, Flex, VisuallyHidden } from '@radix-ui/themes';
import React from 'react';
import fastMemo from 'react-fast-memo';

export const Confirm = fastMemo(
  ({
    open,
    onOpenChange,
    title,
    message,
    children,
    confirmButtonLabel,
    showCancelButton = true,
    onConfirm,
    isSaving,
  }) => {
    return (
      <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
        <VisuallyHidden>
          <AlertDialog.Title>Confirm</AlertDialog.Title>
        </VisuallyHidden>
        <AlertDialog.Content maxWidth="450px">
          {!!title && <AlertDialog.Title>{title}</AlertDialog.Title>}
          {!!message && <AlertDialog.Description size="2">{message}</AlertDialog.Description>}

          {children}

          <Flex gap="3" mt="4" justify="end">
            {showCancelButton && (
              <AlertDialog.Cancel>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </AlertDialog.Cancel>
            )}
            <Button variant="solid" onClick={onConfirm} disabled={isSaving}>
              {confirmButtonLabel || 'Confirm'}
            </Button>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    );
  }
);
