import { Modal, Typography } from '@douyinfe/semi-ui';
import React from 'react';

import { isMobileWidth } from '../browser/device';
import { fastMemo } from '../browser/fastMemo';

export const Confirm = fastMemo(({ open, onOpenChange, message, onConfirm, isSaving }) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <>
      <Modal
        visible={open}
        onOk={onConfirm}
        onCancel={handleClose}
        closeOnEsc={true}
        okButtonProps={{ loading: isSaving }}
        style={{ maxWidth: isMobileWidth() ? 350 : 'none' }}
      >
        <Typography.Text>{message}</Typography.Text>
      </Modal>
    </>
  );
});
