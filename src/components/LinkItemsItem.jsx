import { Button, Checkbox, Col, Dropdown } from '@douyinfe/semi-ui';
import {
  RiCornerUpRightLine,
  RiDeleteBinLine,
  RiEdit2Line,
  RiExternalLinkLine,
  RiMore2Line,
} from '@remixicon/react';
import React from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { linksLayout } from '../lib/constants.js';
import { Link } from '../shared/semi/Link.jsx';
import { isMovingLinkCat } from '../store/link/linkCats.js';
import { updateLinkEffect } from '../store/link/linkEffect.js';
import { Favicon } from './Favicon.jsx';

export const LinkItemsItem = fastMemo(
  ({
    spaceId,
    link,
    layout,
    showCheckbox,
    selectedLinks,
    onCheckboxChange,
    hasOtherSpaces,
    onMove,
    onDelete,
  }) => {
    const isMoving = useCat(isMovingLinkCat);

    if (!link) {
      return null;
    }

    return (
      <Col
        key={link.sortKey}
        span={layout === linksLayout.LIST ? 24 : 12}
        md={layout === linksLayout.LIST ? 24 : 8}
        style={{
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',

          overflow: 'hidden',
          position: 'relative',
          padding: '0.5rem 1.5rem 0.5rem 0',
        }}
      >
        {showCheckbox ? (
          <Checkbox
            checked={!!selectedLinks[link.sortKey]}
            onChange={e => {
              onCheckboxChange(e.target.checked);
            }}
          >
            <Favicon url={link.link} />
            {link.title}
          </Checkbox>
        ) : (
          <Link
            href={link.link}
            target="_blank"
            onClick={() => {
              updateLinkEffect(
                link.sortKey,
                {
                  count: (link.count || 0) + 1,
                },
                spaceId
              );
            }}
          >
            <Favicon url={link.link} />
            {link.title}
          </Link>
        )}

        {!showCheckbox && (
          <Dropdown
            trigger="click"
            position={'bottomLeft'}
            clickToHide
            render={
              <Dropdown.Menu>
                <Dropdown.Item
                  icon={<RiEdit2Line />}
                  onClick={() => {
                    navigateTo(`/links/details?linkId=${link.sortKey}&spaceId=${spaceId}`);
                  }}
                >
                  Edit link
                </Dropdown.Item>

                {hasOtherSpaces && (
                  <>
                    <Dropdown.Divider />

                    <Dropdown.Item
                      icon={<RiCornerUpRightLine />}
                      onClick={onMove}
                      disabled={isMoving}
                    >
                      Move to ...
                    </Dropdown.Item>

                    <Dropdown.Divider />
                  </>
                )}

                <Dropdown.Item type="danger" icon={<RiDeleteBinLine />} onClick={onDelete}>
                  Delete link
                </Dropdown.Item>

                {link.fromUrl && (
                  <>
                    <Dropdown.Divider />
                    <Dropdown.Item icon={<RiExternalLinkLine />}>
                      <Link href={link.fromUrl} target="_blank">
                        Source page
                      </Link>
                    </Dropdown.Item>
                  </>
                )}
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
        )}
      </Col>
    );
  }
);
