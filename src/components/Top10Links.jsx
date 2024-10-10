import { Typography } from '@douyinfe/semi-ui';
import React from 'react';
import fastMemo from 'react-fast-memo';

import { useTop10Links } from '../store/link/linkCats.js';
import { updateLinkEffect } from '../store/link/linkEffect.js';
import { Flex } from './Flex.jsx';
import { Link } from './Link.jsx';

export const Top10Links = fastMemo(({ spaceId }) => {
  const links = useTop10Links(spaceId);

  if (links.length < 2) {
    return null;
  }

  return (
    <Flex
      direction="row"
      wrap="wrap"
      gap="0.25rem 1rem"
      m="0 0 1.5rem"
      p="2.5rem 1rem 1rem"
      style={{
        border: '1px solid var(--semi-color-border)',
        borderRadius: 8,
        position: 'relative',
      }}
    >
      <Typography.Text
        strong
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
        }}
      >
        🔥Most used {links.length} links
      </Typography.Text>

      {links.map(link => (
        <Link
          key={link.sortKey}
          href={link.link}
          target="_blank"
          style={{
            display: 'inline-flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'baseline',
          }}
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
          {link.title}
          <Typography.Text size="small">({link.count})</Typography.Text>
        </Link>
      ))}
    </Flex>
  );
});
