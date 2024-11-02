import { Button, Dropdown } from '@douyinfe/semi-ui';
import {
  RiAddLine,
  RiDeleteBinLine,
  RiDragMoveLine,
  RiExportLine,
  RiExternalLinkLine,
  RiLayoutGrid2Line,
  RiListCheck,
  RiLockLine,
  RiMore2Line,
  RiShareLine,
} from '@remixicon/react';
import React from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';

import { linksLayout } from '../lib/constants.js';
import { Flex } from '../shared/semi/Flex.jsx';
import { Link } from '../shared/semi/Link.jsx';
import { useLinkGroups } from '../store/link/linkCats.js';
import { updateSettingsEffect } from '../store/settings/settingsEffects.js';
import { defaultSpaceId, useLinksLayout, useSpace } from '../store/space/spaceCats.js';
import { unshareSpaceLinksEffect, updateSpaceEffect } from '../store/space/spaceEffect.js';

export const LinkItemsActions = fastMemo(({ spaceId, onBulk, onPublicSpace, onDeleteAll }) => {
  const { links } = useLinkGroups(false, spaceId);
  const space = useSpace(spaceId);
  const layout = useLinksLayout(spaceId);

  const renderShareActions = () => {
    if (!space) {
      return null;
    }

    if (space.linksShareId) {
      return (
        <>
          <Dropdown.Item icon={<RiExternalLinkLine />}>
            <a
              href={`https://easyy.click/s/?id=${space.linksShareId}`}
              target="_blank"
              style={{
                color: 'var(--semi-color-text-0)',
                textDecoration: 'none',
              }}
            >
              Open shared page
            </a>
          </Dropdown.Item>

          <Dropdown.Item onClick={onPublicSpace} icon={<RiShareLine />}>
            Public space again
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => {
              unshareSpaceLinksEffect(spaceId);
            }}
            icon={<RiLockLine />}
          >
            Make space private
          </Dropdown.Item>
        </>
      );
    }

    return (
      <>
        <Dropdown.Item onClick={onPublicSpace} icon={<RiShareLine />}>
          Make space public
        </Dropdown.Item>
      </>
    );
  };

  return (
    <Flex direction="row" wrap="wrap" gap="1rem" m="0.5rem 0 1.5rem">
      <Button
        theme="solid"
        onClick={() => navigateTo(`/links/add?spaceId=${spaceId}`)}
        icon={<RiAddLine />}
      >
        Add links
      </Button>

      {links.length > 1 && (
        <Button
          onClick={() => navigateTo(`/links/reorder?spaceId=${spaceId}`)}
          icon={<RiDragMoveLine />}
        >
          Reorder links
        </Button>
      )}

      <Dropdown
        trigger="click"
        position={'bottomLeft'}
        clickToHide
        render={
          <Dropdown.Menu>
            {layout === linksLayout.LIST ? (
              <Dropdown.Item
                icon={<RiLayoutGrid2Line />}
                onClick={() => {
                  if (spaceId === defaultSpaceId) {
                    updateSettingsEffect({ linksLayout: linksLayout.GRID });
                  } else {
                    updateSpaceEffect(spaceId, { linksLayout: linksLayout.GRID });
                  }
                }}
              >
                Grid layout
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                icon={<RiListCheck />}
                onClick={() => {
                  if (spaceId === defaultSpaceId) {
                    updateSettingsEffect({ linksLayout: linksLayout.LIST });
                  } else {
                    updateSpaceEffect(spaceId, { linksLayout: linksLayout.LIST });
                  }
                }}
              >
                List layout
              </Dropdown.Item>
            )}

            <Dropdown.Item
              icon={<RiExportLine />}
              onClick={() => navigateTo(`/spaces/export?spaceId=${spaceId}`)}
            >
              Export links
            </Dropdown.Item>

            {links?.length > 0 && (
              <>
                <Dropdown.Divider />

                {renderShareActions()}

                <Dropdown.Divider />

                <Dropdown.Item icon={<RiDragMoveLine />} onClick={onBulk}>
                  Move multiple links
                </Dropdown.Item>

                <Dropdown.Item type="danger" icon={<RiDeleteBinLine />} onClick={onBulk}>
                  Delete multiple links
                </Dropdown.Item>

                <Dropdown.Item type="danger" icon={<RiDeleteBinLine />} onClick={onDeleteAll}>
                  Delete all links
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        }
      >
        <Button
          theme="borderless"
          icon={<RiMore2Line />}
          style={{
            marginRight: 2,
          }}
        />
      </Dropdown>

      {!!space?.linksShareId && (
        <Link
          href={`https://easyy.click/s/?id=${space.linksShareId}`}
          target="_blank"
          style={{
            top: '2px',
            position: 'relative',
          }}
        >
          <RiExternalLinkLine />
        </Link>
      )}
    </Flex>
  );
});
