import { Button } from '@douyinfe/semi-ui';
import { RiCornerUpRightLine, RiDeleteBinLine, RiFileCopyLine } from '@remixicon/react';
import React, { useMemo, useState } from 'react';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { copyToClipboard } from '../shared/browser/copyToClipboard.js';
import { setToastEffect } from '../shared/browser/Toast.jsx';
import { Flex } from '../shared/semi/Flex.jsx';
import { isDeletingLinksCat, isMovingLinkCat } from '../store/link/linkCats.js';
import { deleteLinksEffect, moveLinksEffect } from '../store/link/linkEffect.js';
import { Confirm } from './Confirm.jsx';
import { GroupSelectorForMove } from './GroupSelectorForMove.jsx';

export const BulkUpdateLinks = fastMemo(({ spaceId, linksObj, onReset, showCancel = true }) => {
  const isDeletingLinks = useCat(isDeletingLinksCat);
  const isMoving = useCat(isMovingLinkCat);

  const [newSpaceId, setNewSpaceId] = useState(null);
  const [newSpaceGroupId, setNewSpaceGroupId] = useState(null);

  const linksToMove = useMemo(() => {
    return Object.keys(linksObj)
      .filter(key => linksObj[key])
      .map(key => linksObj[key]);
  }, [linksObj]);
  const [showSelectGroupForMoveMultiple, setShowSelectGroupForMoveMultiple] = useState(false);

  const [showDeleteMultipleConfirm, setShowDeleteMultipleConfirm] = useState(false);

  const linksToDeleteSortKeys = useMemo(() => {
    return Object.keys(linksObj).filter(key => linksObj[key]);
  }, [linksObj]);

  const selectedCount = linksToDeleteSortKeys.length;

  return (
    <>
      <Flex direction="row" wrap="wrap" gap="1rem" m="0.5rem 0 1.5rem">
        <Button
          onClick={() => setShowSelectGroupForMoveMultiple(true)}
          icon={<RiCornerUpRightLine />}
          disabled={!selectedCount}
        >
          Move
        </Button>

        <Button
          onClick={async () => {
            const text = linksToMove.map(link => `${link.title}\n${link.link}`).join('\n\n');
            await copyToClipboard(text);
            setToastEffect('Copied!');
            onReset();
          }}
          icon={<RiFileCopyLine />}
          disabled={!selectedCount}
        >
          Copy
        </Button>

        <Button
          type="danger"
          onClick={() => setShowDeleteMultipleConfirm(true)}
          icon={<RiDeleteBinLine />}
          disabled={!selectedCount}
        >
          Delete
        </Button>

        {showCancel && (
          <Button theme="borderless" onClick={onReset}>
            Cancel
          </Button>
        )}
      </Flex>

      <GroupSelectorForMove
        excludeSpaceId={spaceId}
        open={showSelectGroupForMoveMultiple}
        onOpenChange={setShowSelectGroupForMoveMultiple}
        groupId={newSpaceGroupId}
        onSelectGroup={setNewSpaceGroupId}
        spaceId={newSpaceId}
        onSelectSpace={setNewSpaceId}
        onConfirm={async () => {
          if (!linksToMove?.length || !newSpaceId) {
            return;
          }

          await moveLinksEffect(linksToMove, spaceId, newSpaceId, newSpaceGroupId);

          setShowSelectGroupForMoveMultiple(false);
          setNewSpaceId(null);
          onReset();
        }}
        isSaving={isMoving}
      />

      <Confirm
        message={
          selectedCount > 1
            ? `Are you sure to delete the selected ${selectedCount} links?`
            : `Are you sure to delete the selected link?`
        }
        open={showDeleteMultipleConfirm}
        onOpenChange={setShowDeleteMultipleConfirm}
        onConfirm={async () => {
          if (!linksToDeleteSortKeys?.length) {
            return;
          }

          await deleteLinksEffect(linksToDeleteSortKeys, { showMessage: true }, spaceId);
          setShowDeleteMultipleConfirm(false);
          onReset();
        }}
        isSaving={isDeletingLinks}
      />
    </>
  );
});
