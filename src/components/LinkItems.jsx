import { Row, Typography } from '@douyinfe/semi-ui';
import React, { useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { PageEmpty } from '../shared/semi/PageEmpty.jsx';
import { PageLoading } from '../shared/semi/PageLoading.jsx';
import { RouteLink } from '../shared/semi/RouteLink.jsx';
import { isUpdatingGroupCat } from '../store/group/groupCats.js';
import { shareGroupLinksEffect } from '../store/group/groupEffect.js';
import {
  isDeletingLinkCat,
  isDeletingLinksCat,
  isLoadingLinksCat,
  isMovingLinkCat,
  useLinkGroups,
} from '../store/link/linkCats.js';
import {
  deleteLinkEffect,
  deleteLinksEffect,
  moveLinkEffect,
  moveLinksEffect,
} from '../store/link/linkEffect.js';
import {
  isUpdatingSpaceCat,
  useLinksLayout,
  useSpace,
  useSpaces,
} from '../store/space/spaceCats.js';
import { shareSpaceLinksEffect } from '../store/space/spaceEffect.js';
import { BulkUpdateLinks } from './BulkUpdateLinks.jsx';
import { Confirm } from './Confirm.jsx';
import { GroupSelectorForMove } from './GroupSelectorForMove.jsx';
import { LinkItemsActions } from './LinkItemsActions.jsx';
import { LinkItemsGroupTitle } from './LinkItemsGroupTitle.jsx';
import { LinkItemsItem } from './LinkItemsItem.jsx';
import { Top10Links } from './Top10Links.jsx';

export const LinkItems = fastMemo(({ spaceId }) => {
  const { groups: linkGroups, links } = useLinkGroups(false, spaceId);
  const isUpdatingGroup = useCat(isUpdatingGroupCat);
  const isUpdatingSpace = useCat(isUpdatingSpaceCat);
  const isDeletingLink = useCat(isDeletingLinkCat);
  const isDeletingLinks = useCat(isDeletingLinksCat);
  const isMoving = useCat(isMovingLinkCat);
  const isLoading = useCat(isLoadingLinksCat);
  const spaces = useSpaces();
  const space = useSpace(spaceId);
  const linksLayout = useLinksLayout(spaceId);

  const otherSpaces = useMemo(
    () => spaces.filter(space => space.sortKey !== spaceId),
    [spaceId, spaces]
  );

  const [activeLink, setActiveLink] = useState(null);
  const [showDeleteLinkConfirm, setShowDeleteLinkConfirm] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [showDeleteGroupLinksConfirm, setShowDeleteGroupLinksConfirm] = useState(false);

  const [newSpaceId, setNewSpaceId] = useState(null);
  const [newSpaceGroupId, setNewSpaceGroupId] = useState(null);
  const [showMoveLinkModal, setShowMoveLinkModal] = useState(false);
  const [showMoveLinksModal, setShowMoveLinksModal] = useState(false);

  const [showBulkActions, setShowBulkActions] = useState(false);
  const [linksToUpdateObj, setLinksToUpdateObj] = useState({});

  const [showPublicGroupConfirm, setShowPublicGroupConfirm] = useState(false);
  const [showPublicSpaceConfirm, setShowPublicSpaceConfirm] = useState(false);

  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  if (!links.length) {
    return (
      <>
        <LinkItemsActions
          spaceId={spaceId}
          onPublicSpace={() => setShowPublicGroupConfirm(true)}
          onBulk={() => setShowBulkActions(true)}
          onDeleteAll={() => setShowDeleteAllConfirm(true)}
        />

        {isLoading ? (
          <PageLoading />
        ) : (
          <PageEmpty>
            <Typography.Paragraph>Which webites do you visit regularly?</Typography.Paragraph>

            <RouteLink to="/links/import" m="1rem 0 0">
              or Import browser bookmarks
            </RouteLink>
          </PageEmpty>
        )}
      </>
    );
  }

  return (
    <>
      <LinkItemsActions
        spaceId={spaceId}
        onPublicSpace={() => setShowPublicGroupConfirm(true)}
        onBulk={() => setShowBulkActions(true)}
        onDeleteAll={() => setShowDeleteAllConfirm(true)}
      />

      <Top10Links spaceId={spaceId} />

      {showBulkActions && (
        <BulkUpdateLinks
          spaceId={spaceId}
          linksObj={linksToUpdateObj}
          onReset={() => {
            setLinksToUpdateObj({});
            setShowBulkActions(false);
          }}
        />
      )}

      {linkGroups.map(group => (
        <div key={group.sortKey} style={{ marginBottom: '2rem' }}>
          <LinkItemsGroupTitle
            spaceId={spaceId}
            group={group}
            hasOtherSpaces={!!otherSpaces.length}
            showCheckbox={showBulkActions}
            selectedLinks={linksToUpdateObj}
            onCheckboxChange={checked => {
              if (checked) {
                const obj = {};
                group.items.forEach(item => {
                  obj[item.sortKey] = item;
                });
                setLinksToUpdateObj({
                  ...linksToUpdateObj,
                  ...obj,
                });
              } else {
                const obj = {};
                group.items.forEach(item => {
                  obj[item.sortKey] = null;
                });
                setLinksToUpdateObj({
                  ...linksToUpdateObj,
                  ...obj,
                });
              }
            }}
            onPublic={() => {
              setActiveGroup(group);
              setShowPublicGroupConfirm(true);
            }}
            onDelete={() => {
              setActiveGroup(group);
              setShowDeleteGroupLinksConfirm(true);
            }}
            onMove={() => {
              setActiveGroup(group);
              setShowMoveLinksModal(true);
            }}
          />

          {group.items?.length ? (
            <>
              <Row type="flex">
                {group.items.map(link => (
                  <LinkItemsItem
                    key={link.sortKey}
                    spaceId={spaceId}
                    layout={linksLayout}
                    link={link}
                    selectedLinks={linksToUpdateObj}
                    showCheckbox={showBulkActions}
                    onCheckboxChange={checked => {
                      setLinksToUpdateObj({
                        ...linksToUpdateObj,
                        [link.sortKey]: checked ? link : null,
                      });
                    }}
                    hasOtherSpaces={!!otherSpaces.length}
                    onMove={() => {
                      setActiveLink(link);
                      setShowMoveLinkModal(true);
                    }}
                    onDelete={() => {
                      setActiveLink(link);
                      setShowDeleteLinkConfirm(true);
                    }}
                  />
                ))}
              </Row>
            </>
          ) : (
            <Typography.Text type="secondary">No links here.</Typography.Text>
          )}
        </div>
      ))}

      <GroupSelectorForMove
        excludeSpaceId={spaceId}
        open={showMoveLinkModal}
        onOpenChange={setShowMoveLinkModal}
        groupId={newSpaceGroupId}
        onSelectGroup={setNewSpaceGroupId}
        spaceId={newSpaceId}
        onSelectSpace={setNewSpaceId}
        onConfirm={async () => {
          if (!activeLink || !newSpaceId) {
            return;
          }

          await moveLinkEffect(activeLink, spaceId, newSpaceId, newSpaceGroupId);

          setShowMoveLinkModal(false);
          setActiveLink(null);
          setNewSpaceId(null);
        }}
        isSaving={isMoving}
      />

      <GroupSelectorForMove
        excludeSpaceId={spaceId}
        open={showMoveLinksModal}
        onOpenChange={setShowMoveLinksModal}
        groupId={newSpaceGroupId}
        onSelectGroup={setNewSpaceGroupId}
        spaceId={newSpaceId}
        onSelectSpace={setNewSpaceId}
        onConfirm={async () => {
          if (!activeGroup || !newSpaceId) {
            return;
          }

          await moveLinksEffect(activeGroup.items, spaceId, newSpaceId, newSpaceGroupId);

          setShowMoveLinksModal(false);
          setActiveGroup(null);
          setNewSpaceId(null);
        }}
        isSaving={isMoving}
      />

      <Confirm
        message="Are you sure to delete this link?"
        open={showDeleteLinkConfirm}
        onOpenChange={setShowDeleteLinkConfirm}
        onConfirm={async () => {
          if (!activeLink) {
            return;
          }

          await deleteLinkEffect(activeLink?.sortKey, { showMessage: true }, spaceId);
          setShowDeleteLinkConfirm(false);
          setActiveLink(null);
        }}
        isSaving={isDeletingLink}
      />

      <Confirm
        message="After public, anyone with the shared link can see links in this tag. Are you sure?"
        open={showPublicGroupConfirm}
        onOpenChange={setShowPublicGroupConfirm}
        onConfirm={async () => {
          if (!activeGroup) {
            return;
          }

          const payload = {
            type: 'links-group',
            space: space?.title,
            group: activeGroup.title,
            links: activeGroup.items.map(link => ({
              id: link.sortKey,
              title: link.title,
              link: link.link,
            })),
          };

          await shareGroupLinksEffect(activeGroup?.sortKey, payload, spaceId);
          setShowPublicGroupConfirm(false);
          setActiveGroup(null);
        }}
        isSaving={isUpdatingGroup}
      />

      <Confirm
        message="After public, anyone with the shared link can see links in this space. Are you sure?"
        open={showPublicSpaceConfirm}
        onOpenChange={setShowPublicSpaceConfirm}
        onConfirm={async () => {
          if (!space) {
            return;
          }

          const payload = {
            type: 'links-space',
            space: space?.title,
            groups: linkGroups
              .map(group => ({
                id: group.sortKey,
                title: group.title,
                links: group.items.map(link => ({
                  id: link.sortKey,
                  title: link.title,
                  link: link.link,
                })),
              }))
              .filter(group => group.links.length > 0),
          };

          await shareSpaceLinksEffect(spaceId, payload);
          setShowPublicSpaceConfirm(false);
        }}
        isSaving={isUpdatingSpace}
      />

      <Confirm
        message="All links with this tag will be deleted. Are you sure?"
        open={showDeleteGroupLinksConfirm}
        onOpenChange={setShowDeleteGroupLinksConfirm}
        onConfirm={async () => {
          if (!activeGroup?.items?.length) {
            return;
          }

          await deleteLinksEffect(
            activeGroup.items.map(link => link.sortKey),
            { showMessage: true },
            spaceId
          );
          setShowDeleteGroupLinksConfirm(false);
          setActiveGroup(null);
        }}
        isSaving={isDeletingLinks}
      />

      <Confirm
        message="All links in this space will be deleted. Are you sure?"
        open={showDeleteAllConfirm}
        onOpenChange={setShowDeleteAllConfirm}
        onConfirm={async () => {
          if (!links?.length) {
            return;
          }

          await deleteLinksEffect(
            links.map(link => link.sortKey),
            { showMessage: true },
            spaceId
          );
          setShowDeleteAllConfirm(false);
        }}
        isSaving={isDeletingLinks}
      />
    </>
  );
});
