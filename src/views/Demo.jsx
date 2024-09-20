import { Button, NavBar } from '@nutui/nutui-react';
import { RiArrowLeftLine } from '@remixicon/react';
import React from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';

import Draggable from '../components/Draggable.jsx';

export const Demo = fastMemo(() => {
  const elements = [
    { color: 'lightgreen', content: 'Item 1' },
    { color: 'lightcoral', content: 'Item 2' },
    { color: 'lightblue', content: 'Item 3' },
    { color: 'lightyellow', content: 'Item 4' },
    { color: 'lightpink', content: 'Item 5' },
    { color: 'lightgray', content: 'Item 6' },
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
