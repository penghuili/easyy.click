import React, { useEffect, useRef } from 'react';
import fastMemo from 'react-fast-memo';

export const PageContentRef = fastMemo(({ ref }) => {
  const innerRef = useRef();

  useEffect(() => {
    ref.current = innerRef.current.closest('.page-content');
  }, [ref]);

  return <div ref={innerRef} />;
});
