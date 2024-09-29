import React, { forwardRef, useEffect, useRef } from 'react';
import fastMemo from 'react-fast-memo';

export const PageContentRef = fastMemo(
  forwardRef((_, ref) => {
    const innerRef = useRef();

    useEffect(() => {
      ref.current = innerRef.current.closest('.page-content');
    }, [ref]);

    return <div ref={innerRef} />;
  })
);
