import React, { useEffect, useRef } from 'react';
import fastMemo from 'react-fast-memo';

export const PageContentRef = fastMemo(({ ref }) => {
  const innerRef = useRef();

  useEffect(() => {
    ref.current = getPageWrapper(innerRef.current);
  }, [ref]);

  return <div ref={innerRef} />;
});

function getPageWrapper(element) {
  let wrapper = element;
  while (wrapper && wrapper.tagName !== 'BODY' && !wrapper.classList.contains('page-content')) {
    wrapper = wrapper.parentElement;
  }

  return wrapper?.classList?.contains('page-content') ? wrapper : null;
}
