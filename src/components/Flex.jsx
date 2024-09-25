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
const wraps = {
  nowrap: 'nowrap',
  wrap: 'wrap',
};

export function Flex({ children, style, direction = 'column', justify, align, wrap, gap, m, p }) {
  return (
    <div
      className={styles.pengFlex}
      style={{
        ...(style || {}),
        ...(direction ? { '--peng-flex-direction': direction } : {}),
        ...(justifies[justify] ? { '--peng-flex-justify': justifies[justify] } : {}),
        ...(aligns[align] ? { '--peng-flex-align': aligns[align] } : {}),
        ...(wraps[wrap] ? { '--peng-flex-wrap': wraps[wrap] } : {}),
        ...(gap ? { '--peng-flex-gap': gap } : {}),
        ...(m ? { '--peng-flex-margin': m } : {}),
        ...(p ? { '--peng-flex-padding': p } : {}),
      }}
    >
      {children}
    </div>
  );
}
