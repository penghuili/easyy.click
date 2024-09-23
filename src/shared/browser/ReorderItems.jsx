import './ReorderItems.css';

import { RiDraggable } from '@remixicon/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import fastMemo from 'react-fast-memo';

import { calculateItemPosition } from '../js/position';
import { isMobileWidth } from './device';
import { getScrollbarWidth } from './getScrollbarWidth';

const SPACING = 20; // Spacing between elements
const ITEMS_PER_ROW = isMobileWidth() ? 2 : 3; // Number of items per row
const ELEMENT_WIDTH =
  (Math.min(window.innerWidth, 600) -
    getScrollbarWidth() -
    16 -
    20 -
    SPACING * (ITEMS_PER_ROW - 1)) /
  ITEMS_PER_ROW; // Fixed width for elements
const ELEMENT_HEIGHT = 48; // Fixed height for elements
const ANIMATION_DURATION = 300;
const SCROLL_THRESHOLD = 50; // Distance from the top/bottom edge to start scrolling
const SCROLL_SPEED = 5; // Speed of auto-scrolling

let isScrolling = false;

const calculateStandardPositions = elArray => {
  return elArray.map((item, index) => {
    const row = Math.floor(index / ITEMS_PER_ROW);
    const col = index % ITEMS_PER_ROW;
    const x = col * (ELEMENT_WIDTH + SPACING);
    const y = row * (ELEMENT_HEIGHT + SPACING);
    return { ...item, x, y };
  });
};

export const ReorderItems = fastMemo(
  ({ items, renderItem, onReorder, onClickItem, reverse, height, bgColor, borderColor }) => {
    const boundaryRef = useRef(null);
    const containerRef = useRef(null);

    const [itemsWithPosition, setItemsWithPosition] = useState(calculateStandardPositions(items));
    const [dragging, setDragging] = useState(null); // Stores the index of the element being dragged
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const boundaryHeight = useMemo(() => {
      const rows = Math.ceil(items.length / ITEMS_PER_ROW);
      return rows * (ELEMENT_HEIGHT + SPACING) - SPACING;
    }, [items]);

    // Handling drag start (for both mouse and touch events)
    const handleDragStart = (e, index) => {
      e.preventDefault(); // Prevent default touch behavior
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      setDragging(index);

      const element = e.target.closest('.reorder-items-draggable').getBoundingClientRect();
      const boundary = boundaryRef.current.getBoundingClientRect();
      setOffset({ x: clientX - element.left, y: clientY - element.top });

      setItemsWithPosition(prev => {
        const updatedElements = [...itemsWithPosition];
        updatedElements[index] = {
          ...prev[index],
          x: element.left - boundary.left,
          y: element.top - boundary.top,
        };
        return updatedElements;
      });
    };

    // Handling dragging (for both mouse and touch events)
    const handleDragMove = e => {
      if (dragging !== null) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const boundary = boundaryRef.current.getBoundingClientRect();
        const container = containerRef.current;

        let newX = clientX - boundary.left - offset.x;
        let newY = clientY - boundary.top - offset.y;
        // Ensure the dragged element doesn't leave the boundary
        newX = Math.max(0, Math.min(newX, boundary.width - ELEMENT_WIDTH));
        newY = Math.max(0, Math.min(newY, boundary.height - ELEMENT_HEIGHT));

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

      const elementsWithPosition = calculateStandardPositions(updatedElements);
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
        const gridX = col * (ELEMENT_WIDTH + SPACING);
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
      setItemsWithPosition(calculateStandardPositions(items));
    }, [items]);

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
          ref={boundaryRef}
          className="reorder-items-content"
          style={{
            height: boundaryHeight,
          }}
        >
          {itemsWithPosition.map((element, index) => (
            <div
              key={element.sortKey}
              className="reorder-items-draggable"
              style={{
                left: element.x,
                top: `${element.y}px`,
                width: ELEMENT_WIDTH,
                height: `${ELEMENT_HEIGHT}px`,
                zIndex: dragging === index ? 2 : 1,
                transition:
                  dragging === index
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
          ))}
        </div>
      </div>
    );
  }
);
