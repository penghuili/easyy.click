import React from 'react';
import fastMemo from 'react-fast-memo';

import { useTop10Links } from '../store/link/linkCats.js';
import { updateLinkEffect } from '../store/link/linkEffect.js';
import { Flex } from './Flex.jsx';
import { Link } from './Link.jsx';
import { Text } from './Text.jsx';

export const Top10Links = fastMemo(() => {
  const links = useTop10Links();

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
        border: '1px solid var(--nutui-gray-4)',
        borderRadius: 8,
        position: 'relative',
      }}
    >
      <Text
        as="h3"
        size="3"
        bold
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
        }}
      >
        🔥Most used {links.length} links
      </Text>
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
            updateLinkEffect(link.sortKey, {
              count: (link.count || 0) + 1,
              showSuccess: false,
            });
          }}
        >
          {link.title}
          <Text as="span" size="2">
            ({link.count})
          </Text>
        </Link>
      ))}
    </Flex>
  );
});
