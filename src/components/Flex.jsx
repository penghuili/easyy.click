import React from 'react';

import styles from './Flex.module.css';

const justifies = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
};
const aligns = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch',
};

export function Flex({ children, style, direction = 'column', justify, align, wrap, gap, m, p }) {
  return (
    <div
      className={styles.pengFlex}
      style={{
        ...(style || {}),
        flexDirection: direction === 'row' ? 'row' : 'column',
        justifyContent: justifies[justify] || justifies.start,
        alignItems: aligns[align] || aligns.stretch,
        flexWrap: wrap === 'wrap' ? 'wrap' : 'nowrap',
        gap: gap || '0',
        margin: m || '0',
        padding: p || '0',
      }}
    >
      {children}
    </div>
  );
}
