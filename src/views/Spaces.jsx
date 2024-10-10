import { Button, Card, Col, Dropdown, Row, Typography } from '@douyinfe/semi-ui';
import { RiAddLine, RiDragMoveLine, RiMore2Line } from '@remixicon/react';
import React, { useEffect, useState } from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Confirm } from '../components/Confirm.jsx';
import { Flex } from '../components/Flex.jsx';
import { PageEmpty } from '../components/PageEmpty.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { PageLoading } from '../components/PageLoading.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import {
  isDeletingSpaceCat,
  isLoadingSpacesCat,
  useCreatedSpaces,
} from '../store/space/spaceCats.js';
import { deleteSpaceEffect, fetchSpacesEffect } from '../store/space/spaceEffect.js';

export const Spaces = fastMemo(() => {
  const spaces = useCreatedSpaces();
  const isLoading = useCat(isLoadingSpacesCat);
  const isDeleting = useCat(isDeletingSpaceCat);

  const [activeSpace, setActiveSpace] = useState(null);
  const [showDeleteSpaceConfirm, setShowDeleteSpaceConfirm] = useState(false);

  useEffect(() => {
    fetchSpacesEffect(false, true);
  }, []);

  const renderActions = () => {
    return (
      <Flex direction="row" wrap="wrap" gap="1rem" m="0.5rem 0 1.5rem">
        <Button theme="solid" onClick={() => navigateTo(`/spaces/add`)} icon={<RiAddLine />}>
          Add space
        </Button>

        {spaces.length > 1 && (
          <Button onClick={() => navigateTo(`/spaces/reorder`)} icon={<RiDragMoveLine />}>
            Reorder spaces
          </Button>
        )}
      </Flex>
    );
  };

  const renderContent = () => {
    if (!spaces.length) {
      return (
        <>
          {renderActions()}

          {isLoading ? (
            <PageLoading />
          ) : (
            <PageEmpty>
              Use spaces to group your links and notes, like "Work", "Study", "Travel", etc.
            </PageEmpty>
          )}
        </>
      );
    }

    return (
      <>
        {renderActions()}

        <Row type="flex">
          {spaces.map(space => (
            <Col
              key={space.sortKey}
              span={12}
              md={8}
              style={{
                overflow: 'hidden',
                position: 'relative',
                padding: '0.5rem 1.5rem 0.5rem 0',
              }}
            >
              <Card
                bodyStyle={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography.Title heading={5} style={{ color: space.color }}>
                  {space.title}
                </Typography.Title>

                <Dropdown
                  trigger="click"
                  position={'bottomLeft'}
                  clickToHide
                  render={
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          navigateTo(`/spaces/details?spaceId=${space.sortKey}`);
                        }}
                      >
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        type="danger"
                        onClick={() => {
                          setActiveSpace(space);
                          setShowDeleteSpaceConfirm(true);
                        }}
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  }
                >
                  <Button
                    theme="borderless"
                    icon={<RiMore2Line width="20" height="20" />}
                    size="small"
                  />
                </Dropdown>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    );
  };

  return (
    <PageContent>
      <PageHeader title="Spaces" isLoading={isLoading} hasBack />

      {renderContent()}

      <Confirm
        message="All links, notes and tags in this space will also be deleted. Are you sure you want to delete this space?"
        open={showDeleteSpaceConfirm}
        onOpenChange={setShowDeleteSpaceConfirm}
        onConfirm={async () => {
          if (!activeSpace) return;

          await deleteSpaceEffect(activeSpace.sortKey);
          setShowDeleteSpaceConfirm(false);
          setActiveSpace(null);
        }}
        isSaving={isDeleting}
      />
    </PageContent>
  );
});
