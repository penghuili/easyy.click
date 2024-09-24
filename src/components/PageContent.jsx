import './PageContent.css';

import React from 'react';
import fastMemo from 'react-fast-memo';

import { getScrollbarWidth } from '../shared/browser/getScrollbarWidth';

export const PageContent = fastMemo(({ children }) => {
  return (
    <div
      className="pageContent"
      style={{
        '--page-content-width': `${Math.min(window.innerWidth, 600) - getScrollbarWidth()}px`,
      }}
    >
      {children}
    </div>
  );
});
