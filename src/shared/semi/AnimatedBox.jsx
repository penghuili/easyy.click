import React, { useCallback, useEffect, useRef } from 'react';

export function AnimatedBox({ visible, children }) {
  const contentRef = useRef(null);

  const handleTransitionEnd = useCallback(() => {
    const content = contentRef.current;
    if (visible) {
      content.style.maxHeight = 'none';
    }
  }, [visible]);

  useEffect(() => {
    const content = contentRef.current;
    let timerId;
    if (visible) {
      content.style.maxHeight = `${content.scrollHeight}px`;
    } else {
      contentRef.current.style.maxHeight = `${content.scrollHeight}px`;
      timerId = setTimeout(() => {
        contentRef.current.style.maxHeight = '0';
      }, 10);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [visible]);

  return (
    <div
      ref={contentRef}
      onTransitionEnd={handleTransitionEnd}
      style={{
        maxHeight: 0,
        overflow: 'hidden',
        transition: 'max-height 0.2s ease-in-out',
      }}
    >
      {children}
    </div>
  );
}
