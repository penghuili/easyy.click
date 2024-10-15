import { Modal } from '@douyinfe/semi-ui';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { isMobileWidth } from '../shared/browser/device';
import { GroupSelector } from './GroupSelector';

export const GroupSelectorForMove = fastMemo(
  ({ open, onOpenChange, groupId, onSelect, spaceId, onConfirm, isSaving }) => {
    const handleClose = () => {
      onOpenChange(false);
    };

    return (
      <>
        <Modal
          title="Choose a tag in the new space:"
          visible={open}
          onOk={onConfirm}
          onCancel={handleClose}
          closeOnEsc={true}
          okButtonProps={{ loading: isSaving }}
          style={{ maxWidth: isMobileWidth() ? 350 : 'none' }}
        >
          <GroupSelector groupId={groupId} onSelect={onSelect} spaceId={spaceId} />
        </Modal>
      </>
    );
  }
);
