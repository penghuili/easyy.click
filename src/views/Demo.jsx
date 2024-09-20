import { Button, NavBar } from '@nutui/nutui-react';
import { RiArrowLeftLine } from '@remixicon/react';
import React from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';

import Draggable from '../components/Draggable.jsx';

export const Demo = fastMemo(() => {
  const elements = [
    { x: 50, y: 50, color: 'lightgreen', content: 'Element 1' },
    { x: 150, y: 100, color: 'lightcoral', content: 'Element 2' },
    { x: 250, y: 150, color: 'lightblue', content: 'Element 3', width: '120px', height: '120px' },
  ];

  return (
    <>
      <NavBar
        back={<Button type="primary" fill="none" icon={<RiArrowLeftLine />} />}
        onBackClick={goBack}
      >
        Demo
      </NavBar>

      <Draggable elements={elements} />
    </>
  );
});