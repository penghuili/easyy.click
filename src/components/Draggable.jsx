import './Draggable.css';

import React, { useRef, useState } from 'react';

const ELEMENT_WIDTH = 120; // Fixed width for elements
const ELEMENT_HEIGHT = 120; // Fixed height for elements
const SPACING = 20; // Spacing between elements
const ITEMS_PER_ROW = 3; // Number of items per row
const ANIMATION_DURATION = 300;

const calculateStandardPositions = elArray => {
  return elArray.map((item, index) => {
    const row = Math.floor(index / ITEMS_PER_ROW);
    const col = index % ITEMS_PER_ROW;
    const x = col * (ELEMENT_WIDTH + SPACING);
    const y = row * (ELEMENT_HEIGHT + SPACING);
    return { ...item, x, y };
  });
};

const Draggable = ({ elements: initialElements }) => {
  const boundaryRef = useRef(null);

  const [elements, setElements] = useState(calculateStandardPositions(initialElements));
  const [dragging, setDragging] = useState(null); // Stores the index of the element being dragged
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, index) => {
    setDragging(index);

    const element = e.target.getBoundingClientRect();
    const boundary = boundaryRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - element.left, y: e.clientY - element.top });

    setElements(prev => {
      const updatedElements = [...elements];
      updatedElements[index] = {
        ...prev[index],
        x: element.left - boundary.left,
        y: element.top - boundary.top,
      };
      return updatedElements;
    });
  };

  const handleMouseMove = e => {
    if (dragging !== null) {
      const boundary = boundaryRef.current.getBoundingClientRect();

      let newX = e.clientX - boundary.left - offset.x;
      let newY = e.clientY - boundary.top - offset.y;

      setElements(prev => {
        const updatedElements = [...elements];
        updatedElements[dragging] = {
          ...prev[dragging],
          x: newX,
          y: newY,
        };
        return updatedElements;
      });
    }
  };

  const handleMouseUp = () => {
    if (dragging !== null) {
      reorderElements(dragging); // Reorder and calculate new positions
      setDragging(null);
    }
  };

  const reorderElements = draggedIndex => {
    const closestIndex = findClosestIndex(elements[draggedIndex].x, elements[draggedIndex].y);

    // Reorder the elements based on the closest index by placing the dragged element in the new position
    const updatedElements = [...elements];
    const [draggedElement] = updatedElements.splice(draggedIndex, 1); // Remove the dragged element
    updatedElements.splice(closestIndex, 0, draggedElement); // Insert it at the new closest position

    const withPositions = calculateStandardPositions(updatedElements);
    const obj = {};
    withPositions.forEach(item => {
      obj[item.content] = item;
    });
    // Update the elements array and recalculate positions
    setElements(elements.map(e => ({ ...e, x: obj[e.content].x, y: obj[e.content].y })));

    setTimeout(() => {
      setElements(withPositions);
    }, ANIMATION_DURATION);
  };

  const findClosestIndex = (x, y) => {
    let minDistance = Infinity;
    let closestIndex = 0;

    elements.forEach((_, index) => {
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

  return (
    <div
      ref={boundaryRef}
      className="boundary"
      style={{
        position: 'relative',
        width: '500px',
        height: '500px',
        border: '2px solid black',
        margin: '20px auto',
        overflow: 'hidden', // Ensure the elements are constrained within the boundary
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {elements.map((element, index) => (
        <div
          key={element.content}
          className="draggable"
          style={{
            position: 'absolute',
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${ELEMENT_WIDTH}px`,
            height: `${ELEMENT_HEIGHT}px`,
            backgroundColor: element.color || 'lightblue',
            cursor: 'move',
            zIndex: dragging === index ? 2 : 1,
            transition:
              dragging === index
                ? 'none'
                : `left ${ANIMATION_DURATION}ms ease-in-out, top ${ANIMATION_DURATION}ms ease-in-out`,
          }}
          onMouseDown={e => handleMouseDown(e, index)}
        >
          {element.content}
        </div>
      ))}
    </div>
  );
};

export default Draggable;
