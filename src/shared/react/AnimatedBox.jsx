import { Box } from '@radix-ui/themes';
import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled(Box)`
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.2s ease-in-out;
`;

export function AnimatedBox({ visible, children, mt, mb }) {
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
    <Wrapper ref={contentRef} onTransitionEnd={handleTransitionEnd} mt={mt} mb={mb}>
      {children}
    </Wrapper>
  );
}
