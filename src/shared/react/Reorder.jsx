import { Box, Flex, Spinner, Text } from '@radix-ui/themes';
import { Heading } from '@radix-ui/themes/dist/cjs/index.js';
import React, { useState } from 'react';
import styled from 'styled-components';

import { calculateItemPosition } from '../js/position';

const EmptyWrapper = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  border: ${({ disabled }) => `2px dashed ${disabled ? 'var(--gray-6)' : 'var(--gray-8)'}`};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

function Empty({ isLoading, disabled, onClick }) {
  return (
    <EmptyWrapper
      onClick={() => {
        if (disabled) {
          return;
        }
        onClick();
      }}
      disabled={disabled}
    >
      {isLoading && <Spinner size="small" />}
    </EmptyWrapper>
  );
}

export function Reorder({ items, vertical, reverse, onReorder, renderItem }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [preIndex, setPreIndex] = useState(null);
  const [afterIndex, setAfterIndex] = useState(null);

  function handleReorder(indexBefore, indexAfter) {
    if (!selectedItem) {
      return;
    }

    setPreIndex(indexBefore);
    setAfterIndex(indexAfter);

    const newPosition = calculateItemPosition(items, indexBefore, indexAfter, reverse);
    onReorder({
      itemId: selectedItem.sortKey,
      newPosition,
      onSucceeded: () => {
        setSelectedItem(null);
        setSelectedItemIndex(null);
        setPreIndex(null);
        setAfterIndex(null);
      },
    });
  }

  if (!items?.length) {
    return null;
  }

  return (
    <>
      <Heading>Reorder</Heading>
      <Text mb="4" as="p">
        1. Select an item; 2. Choose its new position:
      </Text>
      <Flex direction={vertical ? 'column' : 'row'} wrap={vertical ? 'nowrap' : 'wrap'}>
        {items.map((item, index) => (
          <Flex
            key={item.sortKey}
            direction={vertical ? 'column' : 'row'}
            align={vertical ? 'start' : 'center'}
            mb={vertical ? '0' : '0.5rem'}
          >
            {index === 0 && (
              <Empty
                isLoading={preIndex === -1 && afterIndex === 0}
                disabled={selectedItemIndex === 0}
                onClick={() => handleReorder(-1, 0)}
              />
            )}
            <Box
              p="0.25rem"
              style={{
                margin: vertical ? '0.5rem 0' : '0 0.5rem 0 0',
                display: 'block',
                minWidth: '5rem',
                textOverflow: 'ellipsis',
                maxWidth: vertical ? 'auto' : '10rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                borderColor:
                  selectedItem?.sortKey === item.sortKey ? 'var(--accent-9)' : 'var(--gray-8)',
                borderWidth: '1px',
                borderStyle: 'solid',
              }}
              onClick={() => {
                if (selectedItem?.sortKey === item.sortKey) {
                  setSelectedItem(null);
                  setSelectedItemIndex(null);
                } else {
                  setSelectedItem(item);
                  setSelectedItemIndex(index);
                }
              }}
            >
              {renderItem ? renderItem(item) : item.title}
            </Box>

            <Empty
              isLoading={preIndex === index && afterIndex === index + 1}
              disabled={selectedItemIndex === index + 1 || selectedItemIndex === index}
              onClick={() => handleReorder(index, index + 1)}
            />
          </Flex>
        ))}
      </Flex>
    </>
  );
}
