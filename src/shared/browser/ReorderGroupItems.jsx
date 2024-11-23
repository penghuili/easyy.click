import './ReorderGroupItems.css';

import { RiDraggable } from '@remixicon/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { addItem, calculateItemPosition, moveItem } from '../js/position';
import { isMobileWidth } from './device';
import { fastMemo } from './fastMemo';

const ITEMS_PER_ROW = isMobileWidth() ? 2 : 3; // Number of items per row
const ELEMENT_HEIGHT = 48;
const GROUP_HEIGHT = 48;
const ANIMATION_DURATION = 300;
const SCROLL_THRESHOLD = 50; // Distance from the top/bottom edge to start scrolling
const SCROLL_SPEED = 5; // Speed of auto-scrolling

let isScrolling = false;

const calculatePositions = (groupItems, itemWidth) => {
  const obj = {};
  let totalRows = 0;
  let prevGroupId;
  groupItems.forEach((group, groupIndex) => {
    const groupY = groupIndex * GROUP_HEIGHT + totalRows * ELEMENT_HEIGHT + 16;
    obj[group.sortKey] = { x: 0, y: groupY };
    if (prevGroupId) {
      obj[prevGroupId].yEnd = groupY;
    }

    group.items.forEach((item, itemIndex) => {
      const row = Math.floor(itemIndex / ITEMS_PER_ROW);
      const col = itemIndex % ITEMS_PER_ROW;
      const x = col * itemWidth;
      const y = (row + totalRows) * ELEMENT_HEIGHT + groupIndex * GROUP_HEIGHT + GROUP_HEIGHT;
      obj[item.sortKey] = { x, y };
    });

    const rows = Math.ceil(group.items.length / ITEMS_PER_ROW) || 1;
    totalRows += rows;
    prevGroupId = group.sortKey;
  }, []);

  return obj;
};

export const ReorderGroupItems = fastMemo(
  ({ groupItems, renderItem, onReorder, onClickItem, reverse, height, bgColor, borderColor }) => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const [innerGroupItems, setInnerGroupItems] = useState(groupItems);
    const [itemWidth, setItemWidth] = useState(160);
    const [positions, setPositions] = useState({});

    const [dragging, setDragging] = useState(null); // Stores the index of the element being dragged
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const contentHeight = useMemo(() => {
      const heights = innerGroupItems.map(group => {
        const rows = Math.ceil(group.items.length / ITEMS_PER_ROW);
        return GROUP_HEIGHT + (rows || 1) * ELEMENT_HEIGHT;
      });
      return heights.reduce((acc, height) => acc + height, 0);
    }, [innerGroupItems]);

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

        const item = innerGroupItems[dragging.groupIndex].items[dragging.itemIndex];
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
            setPositions(prev => {
              const item = innerGroupItems[dragging.groupIndex].items[dragging.itemIndex];
              return {
                ...prev,
                [item.sortKey]: {
                  ...prev[item.sortKey],
                  y: prev[item.sortKey].y + speed,
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
      const item = innerGroupItems[draggedIndex.groupIndex].items[draggedIndex.itemIndex];
      const closeResult = findClosestIndex(
        positions[item.sortKey].x,
        positions[item.sortKey].y,
        item.sortKey
      );

      let newGroups;
      if (draggedIndex.groupIndex === closeResult.groupIndex) {
        newGroups = innerGroupItems.map((group, groupIndex) => {
          if (groupIndex === draggedIndex.groupIndex) {
            return {
              ...group,
              items: moveItem(
                group.items,
                draggedIndex.itemIndex,
                closeResult.isAfterItem ? closeResult.itemIndex + 1 : closeResult.itemIndex
              ),
            };
          } else {
            return group;
          }
        });
      } else {
        newGroups = innerGroupItems.map((group, groupIndex) => {
          if (groupIndex === draggedIndex.groupIndex) {
            return { ...group, items: group.items.filter(i => i.sortKey !== item.sortKey) };
          } else if (groupIndex === closeResult.groupIndex) {
            return {
              ...group,
              items: addItem(
                group.items,
                closeResult.isAfterItem ? closeResult.itemIndex + 1 : closeResult.itemIndex,
                item
              ),
            };
          } else {
            return group;
          }
        });
      }

      const newPositions = calculatePositions(newGroups, itemWidth);
      setPositions(newPositions);

      setTimeout(() => {
        let itemIndex = closeResult.isAfterItem ? closeResult.itemIndex + 1 : closeResult.itemIndex;
        const lastIndex = newGroups[closeResult.groupIndex].items.length - 1;
        if (itemIndex > lastIndex) {
          itemIndex = lastIndex;
        }
        const newPosition = calculateItemPosition(
          newGroups[closeResult.groupIndex].items,
          itemIndex - 1,
          itemIndex + 1,
          reverse
        );
        onReorder({
          item: {
            ...newGroups[closeResult.groupIndex].items[itemIndex],
            position: newPosition,
            groupId: newGroups[closeResult.groupIndex].sortKey,
          },
        });
      }, ANIMATION_DURATION);
    };

    const findClosestIndex = (x, y, itemId) => {
      let minDistance = Infinity;
      let minY = Infinity;
      let groupIndex;
      let itemIndex = 0;
      let isAfterItem = false;

      innerGroupItems.forEach((group, gIndex) => {
        const groupPosition = positions[group.sortKey];
        if (y < groupPosition.y || (groupPosition.yEnd && y > groupPosition.yEnd)) {
          return;
        }

        const groupX = positions[group.sortKey].x;
        const groupY = positions[group.sortKey].y;

        if (Math.abs(groupY - y) <= minY) {
          minY = Math.abs(groupY - y);

          const distance = Math.sqrt((x - groupX) ** 2 + (y - groupY) ** 2);
          if (distance < minDistance) {
            minDistance = distance;
            groupIndex = gIndex;
            itemIndex = 0;
            isAfterItem = false;
          }
        }

        group.items.forEach((item, index) => {
          if (item.sortKey === itemId) {
            return;
          }
          const itemX = positions[item.sortKey].x;
          const itemY = positions[item.sortKey].y;

          if (Math.abs(itemY - y) <= minY) {
            minY = Math.abs(itemY - y);
            const distance = Math.sqrt((x - itemX) ** 2 + (y - itemY) ** 2);

            if (itemX === 0 || distance < minDistance) {
              minDistance = distance;
              groupIndex = gIndex;
              itemIndex = index;
              isAfterItem = x > itemX + itemWidth / 2;
            }
          }
        });
      });

      return { groupIndex, itemIndex, isAfterItem };
    };

    useEffect(() => {
      const iWidth = (contentRef.current.offsetWidth - 16) / ITEMS_PER_ROW;
      setItemWidth(iWidth);

      setPositions(calculatePositions(groupItems, iWidth));
      setInnerGroupItems(groupItems);
    }, [groupItems]);

    useEffect(() => {
      return () => {
        cancelScroll();
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className="reorder-group-items-container"
        style={{
          ...(height ? { '--reorder-group-items-height': height } : {}),
        }}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          ref={contentRef}
          className="reorder-group-items-content"
          style={{
            height: contentHeight,
          }}
        >
          {!!innerGroupItems.length &&
            innerGroupItems.map((group, groupIndex) => (
              <div key={group.sortKey}>
                {positions[group.sortKey] ? (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        top: positions[group.sortKey].y,
                        left: positions[group.sortKey].x,
                      }}
                    >
                      {group.title}
                    </div>

                    <Items
                      groupId={group.sortKey}
                      items={group.items}
                      positions={positions}
                      itemWidth={itemWidth}
                      renderItem={renderItem}
                      contentRef={contentRef}
                      draggingIndex={dragging}
                      onDraggingIndexChange={itemIndex => {
                        setDragging({
                          groupIndex,
                          itemIndex,
                        });
                      }}
                      onOffsetChange={setOffset}
                      onPositionsChange={setPositions}
                      onClickItem={onClickItem}
                      bgColor={bgColor}
                      borderColor={borderColor}
                    />
                  </>
                ) : null}
              </div>
            ))}
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

      const element = e.target.closest('.reorder-group-items-draggable').getBoundingClientRect();
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
        className="reorder-group-items-draggable"
        style={{
          left: positions[item.sortKey]?.x,
          top: positions[item.sortKey]?.y,
          width: itemWidth,
          height: `${ELEMENT_HEIGHT}px`,
          zIndex: draggingIndex?.itemIndex === index ? 2 : 1,
          transition:
            draggingIndex?.itemIndex === index
              ? 'none'
              : `left ${ANIMATION_DURATION}ms ease-in-out, top ${ANIMATION_DURATION}ms ease-in-out`,

          ...(bgColor ? { '--reorder-group-items-background-color': bgColor } : {}),
          ...(borderColor ? { '--reorder-group-items-border-color': bgColor } : {}),
        }}
      >
        <span
          className="reorder-group-items-drag-handle"
          onMouseDown={e => handleDragStart(e, index)}
          onTouchStart={e => handleDragStart(e, index)}
        >
          <RiDraggable />
        </span>
        <span
          className="reorder-group-items-drag-content"
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
