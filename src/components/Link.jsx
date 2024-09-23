import React from 'react';

import styles from './Link.module.css';
import { fontSizes } from './Text.jsx';

export function Link({ href, onClick, target, children, style, size = '4', m }) {
  return (
    <a
      className={styles.link}
      style={{
        ...(style || {}),
        ...(fontSizes[size] ? { '--link-size': fontSizes[size] } : {}),
        ...(m ? { '--link-margin': m } : {}),
      }}
      href={href}
      target={target}
      rel="noreferrer noopener"
      onClick={onClick}
    >
      {children}
    </a>
  );
}
