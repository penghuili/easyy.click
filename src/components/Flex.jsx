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

export function Flex({ children, style, direction = 'column', justify, align, gap, m, p }) {
  return (
    <div
      className={styles.flex}
      style={{
        ...(style || {}),
        ...(direction ? { '--flex-direction': direction } : {}),
        ...(justifies[justify] ? { '--flex-justify': justifies[justify] } : {}),
        ...(aligns[align] ? { '--flex-align': aligns[align] } : {}),
        ...(gap ? { '--flex-gap': gap } : {}),
        ...(m ? { '--flex-margin': m } : {}),
        ...(p ? { '--flex-padding': p } : {}),
      }}
    >
      {children}
    </div>
  );
}
