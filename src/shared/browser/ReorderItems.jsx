import './ReorderItems.css';

import { RiDraggable } from '@remixicon/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import fastMemo from 'react-fast-memo';

import { calculateItemPosition } from '../js/position';
import { isMobileWidth } from './device';

const SPACING = 20; // Spacing between elements
const ITEMS_PER_ROW = isMobileWidth() ? 2 : 3; // Number of items per row
const ELEMENT_HEIGHT = 48; // Fixed height for elements
const ANIMATION_DURATION = 300;
const SCROLL_THRESHOLD = 50; // Distance from the top/bottom edge to start scrolling
const SCROLL_SPEED = 5; // Speed of auto-scrolling

let isScrolling = false;

const calculateStandardPositions = (elArray, itemWidth) => {
  return elArray.map((item, index) => {
    const row = Math.floor(index / ITEMS_PER_ROW);
    const col = index % ITEMS_PER_ROW;
    const x = col * (itemWidth + SPACING);
    const y = row * (ELEMENT_HEIGHT + SPACING);
    return { ...item, x, y };
  });
};

export const ReorderItems = fastMemo(
  ({ items, renderItem, onReorder, onClickItem, reverse, height, bgColor, borderColor }) => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const [itemWidth, setItemWidth] = useState(null);

    const [itemsWithPosition, setItemsWithPosition] = useState([]);
    const [dragging, setDragging] = useState(null); // Stores the index of the element being dragged
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const contentHeight = useMemo(() => {
      const rows = Math.ceil(items.length / ITEMS_PER_ROW);
      return rows * (ELEMENT_HEIGHT + SPACING) - SPACING;
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

        setItemsWithPosition(prev => {
          const updatedElements = [...itemsWithPosition];
          updatedElements[dragging] = {
            ...prev[dragging],
            x: newX,
            y: newY,
          };
          return updatedElements;
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
            setItemsWithPosition(prev => {
              const updatedElements = [...itemsWithPosition];
              updatedElements[dragging] = {
                ...prev[dragging],
                y: prev[dragging].y + speed,
              };
              return updatedElements;
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
      const closestIndex = findClosestIndex(
        itemsWithPosition[draggedIndex].x,
        itemsWithPosition[draggedIndex].y
      );

      // Reorder the elements based on the closest index by placing the dragged element in the new position
      const updatedElements = [...itemsWithPosition];
      const [draggedElement] = updatedElements.splice(draggedIndex, 1); // Remove the dragged element
      updatedElements.splice(closestIndex, 0, draggedElement); // Insert it at the new closest position

      const elementsWithPosition = calculateStandardPositions(updatedElements, itemWidth);
      const obj = {};
      elementsWithPosition.forEach(item => {
        obj[item.sortKey] = item;
      });
      // Update the elements array and recalculate positions
      setItemsWithPosition(
        itemsWithPosition.map(e => ({ ...e, x: obj[e.sortKey].x, y: obj[e.sortKey].y }))
      );

      setTimeout(() => {
        setItemsWithPosition(elementsWithPosition);
        const newPosition = calculateItemPosition(
          elementsWithPosition,
          closestIndex - 1,
          closestIndex + 1,
          reverse
        );
        onReorder({
          item: { ...elementsWithPosition[closestIndex], position: newPosition },
          newItems: elementsWithPosition,
        });
      }, ANIMATION_DURATION);
    };

    const findClosestIndex = (x, y) => {
      let minDistance = Infinity;
      let closestIndex = 0;

      itemsWithPosition.forEach((_, index) => {
        const row = Math.floor(index / ITEMS_PER_ROW);
        const col = index % ITEMS_PER_ROW;
        const gridX = col * (itemWidth + SPACING);
        const gridY = row * (ELEMENT_HEIGHT + SPACING);

        const distance = Math.sqrt((x - gridX) ** 2 + (y - gridY) ** 2);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    };

    useEffect(() => {
      if (contentRef.current?.offsetWidth) {
        setItemWidth(
          (contentRef.current.offsetWidth - SPACING * (ITEMS_PER_ROW - 1) - 2) / ITEMS_PER_ROW
        );
      }
    }, []);

    useEffect(() => {
      if (items?.length && itemWidth) {
        setItemsWithPosition(calculateStandardPositions(items, itemWidth));
      }
    }, [items, itemWidth]);

    useEffect(() => {
      // Clean up scrolling on unmount
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
          {!!itemsWithPosition.length && (
            <Items
              items={itemsWithPosition}
              itemWidth={itemWidth}
              renderItem={renderItem}
              contentRef={contentRef}
              draggingIndex={dragging}
              onDraggingIndexChange={setDragging}
              onOffsetChange={setOffset}
              onItemsChange={setItemsWithPosition}
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
    itemWidth,
    renderItem,
    contentRef,
    draggingIndex,
    onDraggingIndexChange,
    onOffsetChange,
    onItemsChange,
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

      onItemsChange(prev => {
        const updatedElements = [...items];
        updatedElements[index] = {
          ...prev[index],
          x: element.left - contentBoundary.left,
          y: element.top - contentBoundary.top,
        };
        return updatedElements;
      });
    };

    return items.map((element, index) => (
      <div
        key={element.sortKey}
        className="reorder-items-draggable"
        style={{
          left: element.x,
          top: `${element.y}px`,
          width: itemWidth,
          height: `${ELEMENT_HEIGHT}px`,
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
        <span className="reorder-items-drag-content" onClick={() => onClickItem(element)}>
          {renderItem(element)}
        </span>
      </div>
    ));
  }
);
