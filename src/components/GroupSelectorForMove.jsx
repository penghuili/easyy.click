import { Modal } from '@douyinfe/semi-ui';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { isMobileWidth } from '../shared/browser/device';
import { Flex } from '../shared/semi/Flex';
import { GroupSelector } from './GroupSelector';
import { SpaceSelector } from './SpaceSelector';

export const GroupSelectorForMove = fastMemo(
  ({
    excludeSpaceId,
    open,
    onOpenChange,
    groupId,
    onSelectGroup,
    spaceId,
    onSelectSpace,
    onConfirm,
    isSaving,
  }) => {
    const handleClose = () => {
      onOpenChange(false);
    };

    return (
      <>
        <Modal
          title="Choose a new space and a new tag:"
          visible={open}
          onOk={onConfirm}
          onCancel={handleClose}
          closeOnEsc={true}
          okButtonProps={{ loading: isSaving }}
          style={{ maxWidth: isMobileWidth() ? 350 : 'none' }}
        >
          <SpaceSelector
            value={spaceId}
            onChange={onSelectSpace}
            excludeId={excludeSpaceId}
            showBottom={false}
          />
          <Flex p="2rem 0 0" />
          {!!spaceId && (
            <GroupSelector groupId={groupId} onSelect={onSelectGroup} spaceId={spaceId} />
          )}
        </Modal>
      </>
    );
  }
);
