import './PageContent.css';

import React, { useEffect, useState } from 'react';

import { fastMemo } from './fastMemo';
import { getScrollbarWidth } from './getScrollbarWidth';

export const PageContent = fastMemo(({ children, width = 600, paddingBottom = '5rem' }) => {
  const [contentWidth, setContentWidth] = useState(
    Math.min(window.innerWidth, width) - getScrollbarWidth()
  );

  useEffect(() => {
    const handleResize = () => {
      setContentWidth(Math.min(window.innerWidth, 600) - getScrollbarWidth());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="pageContent"
      style={{
        '--page-content-width': `${contentWidth}px`,
        '--page-content-padding-bottom': paddingBottom,
      }}
    >
      {children}
    </div>
  );
});
