import { Modal, Typography } from '@douyinfe/semi-ui';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { isMobileWidth } from '../browser/device';

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
