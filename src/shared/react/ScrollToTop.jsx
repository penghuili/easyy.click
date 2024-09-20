import { IconButton } from '@radix-ui/themes';
import { RiArrowUpSLine } from '@remixicon/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import fastMemo from 'react-fast-memo';

import { PageContentRef } from './PageContentRef.jsx';

export const ScrollToTop = fastMemo(() => {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const pageWrapperRef = useRef();

  const handleScrollToTop = useCallback(() => {
    if (!pageWrapperRef.current) {
      return;
    }

    pageWrapperRef.current.scrollTop = 0;
  }, []);

  useEffect(() => {
    const handleToggle = () => {
      setShow(pageWrapperRef.current.scrollTop > 1500);
    };
    pageWrapperRef.current.addEventListener('scroll', handleToggle);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      pageWrapperRef.current.removeEventListener('scroll', handleToggle);
    };
  }, []);

  return (
    <div style={{ display: show ? 'block' : 'none' }} ref={ref}>
      <IconButton onClick={handleScrollToTop} mr="2" variant="ghost">
        <RiArrowUpSLine />
      </IconButton>

      <PageContentRef ref={pageWrapperRef} />
    </div>
  );
});
