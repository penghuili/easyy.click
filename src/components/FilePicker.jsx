import React, { useCallback } from 'react';
import fastMemo from 'react-fast-memo';

import styles from './FilePicker.module.css';

export const FilePicker = fastMemo(
  ({ accept, takePhoto, height, children, disabled, multiple, onSelect }) => {
    const handleChange = useCallback(
      e => {
        const files = onSelect(e.target.files);
        if (files?.length) {
          onSelect(files);
        }
      },
      [onSelect]
    );

    return (
      <span className={styles.wrapper} style={{ height }}>
        {children}
        <input
          className={styles.input}
          type="file"
          accept={accept || 'image/*'}
          capture={takePhoto ? 'environment' : undefined}
          onChange={handleChange}
          disabled={disabled}
          multiple={multiple}
        />
      </span>
    );
  }
);
