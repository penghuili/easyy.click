import './ReorderItems.css';

import { RiDraggable } from '@remixicon/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import fastMemo from 'react-fast-memo';

import { calculateItemPosition, moveItem } from '../js/position';
import { isMobileWidth } from './device';

const ITEMS_PER_ROW = isMobileWidth() ? 2 : 3; // Number of items per row
const ELEMENT_HEIGHT = 48; // Fixed height for elements
const ANIMATION_DURATION = 300;
const SCROLL_THRESHOLD = 50; // Distance from the top/bottom edge to start scrolling
const SCROLL_SPEED = 5; // Speed of auto-scrolling

let isScrolling = false;

const calculatePositions = (elArray, itemWidth) => {
  const obj = {};
  elArray.forEach((item, index) => {
    const row = Math.floor(index / ITEMS_PER_ROW);
    const col = index % ITEMS_PER_ROW;
    const x = col * itemWidth;
    const y = row * ELEMENT_HEIGHT;
    obj[item.sortKey] = { x, y };
  });

  return obj;
};

export const ReorderItems = fastMemo(
  ({ items, renderItem, onReorder, onClickItem, reverse, height, bgColor, borderColor }) => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const [innerItems, setInnerItems] = useState(items);
    const [itemWidth, setItemWidth] = useState(160);
    const [positions, setPositions] = useState({});

    const [dragging, setDragging] = useState(null); // Stores the index of the element being dragged
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const contentHeight = useMemo(() => {
      const rows = Math.ceil(items.length / ITEMS_PER_ROW);
      return rows * ELEMENT_HEIGHT;
    }, [items]);

    // Handling dragging (for both mouse and touch events)
    const handleDragMove = e => {
      if (dragging !== null) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const contentBoundary = contentRef.current.getBoundingClientRect();
        const container = containerRef.current;

        let newX = clientX - contentBoundary.left - offset.x;
        let newY = clientY - contentBoundary.top - offset.y;
        // Ensure the dragged element doesn't leave the boundary
        newX = Math.max(0, Math.min(newX, contentBoundary.width - itemWidth));
        newY = Math.max(0, Math.min(newY, contentBoundary.height - ELEMENT_HEIGHT));

        const item = innerItems[dragging];
        setPositions(prev => {
          return {
            ...prev,
            [item.sortKey]: {
              x: newX,
              y: newY,
            },
          };
        });

        // Handle auto-scrolling if near top/bottom
        if (container.scrollHeight > container.clientHeight) {
          const containerBoundary = container.getBoundingClientRect();
          if (clientY - containerBoundary.top < SCROLL_THRESHOLD && container.scrollTop > 0) {
            scrollContainer(-SCROLL_SPEED); // Scroll up
          } else if (
            containerBoundary.bottom - clientY < SCROLL_THRESHOLD &&
            container.scrollTop < container.scrollHeight - container.clientHeight
          ) {
            scrollContainer(SCROLL_SPEED); // Scroll down
          } else {
            cancelScroll(); // Stop scrolling if not near the edge
          }
        }
      }
    };

    // Scroll the container by a certain speed (positive for down, negative for up)
    const scrollContainer = speed => {
      if (!isScrolling) {
        isScrolling = true;
        const container = containerRef.current;

        const scroll = () => {
          if (isScrolling) {
            container.scrollTop += speed;
            const item = innerItems[dragging];
            setPositions(prev => {
              return {
                ...prev,
                [item.sortKey]: {
                  ...prev[dragging],
                  y: prev[dragging].y + speed,
                },
              };
            });
            requestAnimationFrame(scroll); // Continue scrolling while dragging
          }
        };

        requestAnimationFrame(scroll); // Start the scroll
      }
    };

    const cancelScroll = () => {
      isScrolling = false;
    };

    // Handling drag end (for both mouse and touch events)
    const handleDragEnd = () => {
      if (dragging !== null) {
        reorderElements(dragging); // Reorder and calculate new positions
        setDragging(null);
        cancelScroll();
      }
    };

    const reorderElements = draggedIndex => {
      const item = innerItems[draggedIndex];
      const closestResult = findClosestIndex(
        positions[item.sortKey].x,
        positions[item.sortKey].y,
        item.sortKey
      );

      const updatedElements = moveItem(
        innerItems,
        draggedIndex,
        closestResult.isAfterItem ? closestResult.itemIndex + 1 : closestResult.itemIndex
      );

      const newPositions = calculatePositions(updatedElements, itemWidth);
      setPositions(newPositions);

      setTimeout(() => {
        let itemIndex = closestResult.isAfterItem
          ? closestResult.itemIndex + 1
          : closestResult.itemIndex;
        const lastIndex = updatedElements.length - 1;
        if (itemIndex > lastIndex) {
          itemIndex = lastIndex;
        }

        const newPosition = calculateItemPosition(
          updatedElements,
          itemIndex - 1,
          itemIndex + 1,
          reverse
        );
        onReorder({
          item: { ...updatedElements[itemIndex], position: newPosition },
        });
      }, ANIMATION_DURATION);
    };

    const findClosestIndex = (x, y, itemId) => {
      let minDistance = Infinity;
      let minY = Infinity;
      let itemIndex = 0;
      let isAfterItem = false;

      innerItems.forEach((i, index) => {
        if (i.sortKey === itemId) {
          return;
        }
        const itemX = positions[i.sortKey].x;
        const itemY = positions[i.sortKey].y;

        if (Math.abs(itemY - y) <= minY) {
          minY = Math.abs(itemY - y);

          const distance = Math.sqrt((x - itemX) ** 2 + (y - itemY) ** 2);
          if (itemX === 0 || distance < minDistance) {
            minDistance = distance;
            itemIndex = index;
            isAfterItem = x > itemX + itemWidth / 2;
          }
        }
      });

      return { itemIndex, isAfterItem };
    };

    useEffect(() => {
      const iWidth = (contentRef.current.offsetWidth - 2) / ITEMS_PER_ROW;
      setItemWidth(iWidth);

      setPositions(calculatePositions(items, iWidth));
      setInnerItems(items);
    }, [items]);

    useEffect(() => {
      return () => {
        cancelScroll();
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className="reorder-items-container"
        style={{
          ...(height ? { '--reorder-items-height': height } : {}),
        }}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          ref={contentRef}
          className="reorder-items-content"
          style={{
            height: contentHeight,
          }}
        >
          {!!innerItems.length && (
            <Items
              items={innerItems}
              positions={positions}
              itemWidth={itemWidth}
              renderItem={renderItem}
              contentRef={contentRef}
              draggingIndex={dragging}
              onDraggingIndexChange={setDragging}
              onOffsetChange={setOffset}
              onPositionsChange={setPositions}
              onClickItem={onClickItem}
              bgColor={bgColor}
              borderColor={borderColor}
            />
          )}
        </div>
      </div>
    );
  }
);

const Items = fastMemo(
  ({
    items,
    positions,
    itemWidth,
    renderItem,
    contentRef,
    draggingIndex,
    onDraggingIndexChange,
    onOffsetChange,
    onPositionsChange,
    onClickItem,
    bgColor,
    borderColor,
  }) => {
    // Handling drag start (for both mouse and touch events)
    const handleDragStart = (e, index) => {
      e.preventDefault(); // Prevent default touch behavior
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      onDraggingIndexChange(index);

      const element = e.target.closest('.reorder-items-draggable').getBoundingClientRect();
      const contentBoundary = contentRef.current.getBoundingClientRect();
      onOffsetChange({ x: clientX - element.left, y: clientY - element.top });

      onPositionsChange(prev => {
        return {
          ...prev,
          [items[index].sortKey]: {
            x: element.left - contentBoundary.left,
            y: element.top - contentBoundary.top,
          },
        };
      });
    };

    return items.map((item, index) => (
      <div
        key={item.sortKey}
        className="reorder-items-draggable"
        style={{
          left: positions[item.sortKey]?.x,
          top: positions[item.sortKey]?.y,
          width: itemWidth,
          height: ELEMENT_HEIGHT,
          zIndex: draggingIndex === index ? 2 : 1,
          transition:
            draggingIndex === index
              ? 'none'
              : `left ${ANIMATION_DURATION}ms ease-in-out, top ${ANIMATION_DURATION}ms ease-in-out`,

          ...(bgColor ? { '--reorder-items-background-color': bgColor } : {}),
          ...(borderColor ? { '--reorder-items-border-color': bgColor } : {}),
        }}
      >
        <span
          className="reorder-items-drag-handle"
          onMouseDown={e => handleDragStart(e, index)}
          onTouchStart={e => handleDragStart(e, index)}
        >
          <RiDraggable />
        </span>
        <span
          className="reorder-items-drag-content"
          onClick={() => {
            if (onClickItem) {
              onClickItem(item);
            }
          }}
        >
          {renderItem(item)}
        </span>
      </div>
    ));
  }
);
