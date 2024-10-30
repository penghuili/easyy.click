import { Button, Col, Dropdown, Row, Tag } from '@douyinfe/semi-ui';
import { RiAddLine, RiDragMoveLine, RiMore2Line } from '@remixicon/react';
import React, { useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Flex } from '../shared/semi/Flex.jsx';
import { PageEmpty } from '../shared/semi/PageEmpty.jsx';
import { PageLoading } from '../shared/semi/PageLoading.jsx';
import { isDeletingGroupCat, isLoadingGroupsCat, useGroups } from '../store/group/groupCats.js';
import { deleteGroupEffect } from '../store/group/groupEffect.js';
import { Confirm } from './Confirm.jsx';

export const confirmDeleteGroupMessage = `Only this tag will be deleted, your links / notes with this tag will be moved to "Links without tag" or "Notes without tag". Go ahead?`;

export const GroupItems = fastMemo(({ spaceId }) => {
  const groups = useGroups(spaceId);
  const isDeletingGroup = useCat(isDeletingGroupCat);
  const isLoading = useCat(isLoadingGroupsCat);

  const [activeGroup, setActiveGroup] = useState(null);
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);

  const renderActions = () => {
    return (
      <Flex direction="row" wrap="wrap" gap="1rem" m="0.5rem 0 1.5rem">
        <Button
          theme="solid"
          onClick={() => navigateTo(`/groups/add?spaceId=${spaceId}`)}
          icon={<RiAddLine />}
        >
          Add tag
        </Button>

        {groups.length > 1 && (
          <Button
            onClick={() => navigateTo(`/groups/reorder?spaceId=${spaceId}`)}
            icon={<RiDragMoveLine />}
          >
            Reorder tags
          </Button>
        )}
      </Flex>
    );
  };

  if (!groups.length) {
    return (
      <>
        {renderActions()}

        {isLoading ? (
          <PageLoading />
        ) : (
          <PageEmpty>Use tags to organise your links and notes.</PageEmpty>
        )}
      </>
    );
  }

  return (
    <>
      {renderActions()}

      <Row type="flex">
        {groups.map(group => (
          <Col
            key={group.sortKey}
            span={12}
            md={8}
            style={{
              overflow: 'hidden',
              position: 'relative',
              padding: '0.5rem 1.5rem 0.5rem 0',
            }}
          >
            <Tag size="large" color="green">
              {group.title}
            </Tag>

            <Dropdown
              trigger="click"
              position={'bottomLeft'}
              clickToHide
              render={
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      navigateTo(`/groups/details?groupId=${group.sortKey}&spaceId=${spaceId}`);
                    }}
                  >
                    Edit tag
                  </Dropdown.Item>
                  <Dropdown.Item
                    type="danger"
                    onClick={() => {
                      setActiveGroup(group);
                      setShowDeleteGroupConfirm(true);
                    }}
                  >
                    Delete tag
                  </Dropdown.Item>
                </Dropdown.Menu>
              }
            >
              <Button
                theme="borderless"
                icon={<RiMore2Line width="20" height="20" />}
                size="small"
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                }}
              />
            </Dropdown>
          </Col>
        ))}
      </Row>

      <Confirm
        message={confirmDeleteGroupMessage}
        open={showDeleteGroupConfirm}
        onOpenChange={setShowDeleteGroupConfirm}
        onConfirm={async () => {
          if (!activeGroup) return;

          await deleteGroupEffect(activeGroup.sortKey, spaceId);
          setShowDeleteGroupConfirm(false);
          setActiveGroup(null);
        }}
        isSaving={isDeletingGroup}
      />
    </>
  );
});
