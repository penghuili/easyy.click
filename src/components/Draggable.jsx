import './Draggable.css';

import React, { useRef, useState } from 'react';

const Draggable = ({ elements }) => {
  const boundaryRef = useRef(null);

  const [positions, setPositions] = useState(elements.map(el => ({ x: el.x, y: el.y })));
  const [dragging, setDragging] = useState(null); // Stores the index of the element being dragged
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, index) => {
    setDragging(index);
    const element = e.target.getBoundingClientRect();
    setOffset({ x: e.clientX - element.left, y: e.clientY - element.top });
  };

  const handleMouseMove = e => {
    if (dragging !== null) {
      const boundary = boundaryRef.current.getBoundingClientRect();
      const element = e.target.getBoundingClientRect();

      let newX = e.clientX - offset.x;
      let newY = e.clientY - offset.y;

      // Ensure the element stays within the boundaries
      if (newX < boundary.left) newX = boundary.left;
      if (newY < boundary.top) newY = boundary.top;
      if (newX + element.width > boundary.right) newX = boundary.right - element.width;
      if (newY + element.height > boundary.bottom) newY = boundary.bottom - element.height;

      // Update position
      const updatedPositions = [...positions];
      updatedPositions[dragging] = {
        x: newX - boundary.left,
        y: newY - boundary.top,
      };
      setPositions(updatedPositions);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
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
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {elements.map((element, index) => (
        <div
          key={index}
          className="draggable"
          style={{
            position: 'absolute',
            left: `${positions[index].x}px`,
            top: `${positions[index].y}px`,
            cursor: 'move',
            width: element.width || '100px',
            height: element.height || '100px',
            backgroundColor: element.color || 'lightblue',
          }}
          onMouseDown={e => handleMouseDown(e, index)}
        >
          {element.content || `Drag Me ${index + 1}`}
        </div>
      ))}
    </div>
  );
};

export default Draggable;
