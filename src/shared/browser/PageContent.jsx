import './PageContent.css';

import React from 'react';
import fastMemo from 'react-fast-memo';

import { getScrollbarWidth } from './getScrollbarWidth';

export const PageContent = fastMemo(({ children, paddingBottom = '5rem' }) => {
  return (
    <div
      className="pageContent"
      style={{
        '--page-content-width': `${Math.min(window.innerWidth, 600) - getScrollbarWidth()}px`,
        '--page-content-padding-bottom': paddingBottom,
      }}
    >
      {children}
    </div>
  );
});
