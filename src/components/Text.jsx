import React from 'react';

import styles from './Text.module.css';

export const fontSizes = {
  1: 'var(--nutui-font-size-1)',
  2: 'var(--nutui-font-size-2)',
  3: 'var(--nutui-font-size-3)',
  4: 'var(--nutui-font-size-4)',
  5: 'var(--nutui-font-size-5)',
  6: 'var(--nutui-font-size-6)',
  7: 'var(--nutui-font-size-7)',
  8: 'var(--nutui-font-size-8)',
  9: 'var(--nutui-font-size-9)',
  10: 'var(--nutui-font-size-10)',
};

export function Text({ as: Component = 'p', children, onClick, style, color, size = '4', m }) {
  return (
    <Component
      className={styles.text}
      onClick={onClick}
      style={{
        ...(style || {}),
        ...(color ? { '--text-color': color } : {}),
        ...(fontSizes[size] ? { '--text-size': fontSizes[size] } : {}),
        ...(m ? { '--text-margin': m } : {}),
      }}
    >
      {children}
    </Component>
  );
}
