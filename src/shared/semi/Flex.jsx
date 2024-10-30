import React from 'react';

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
      style={{
        display: 'flex',
        flexDirection: direction === 'row' ? 'row' : 'column',
        justifyContent: justifies[justify] || justifies.start,
        alignItems: aligns[align] || aligns.stretch,
        flexWrap: wrap === 'wrap' ? 'wrap' : 'nowrap',
        gap: gap || '0',
        margin: m || '0',
        padding: p || '0',
        ...(style || {}),
      }}
    >
      {children}
    </div>
  );
}
