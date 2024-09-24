import './Scrollbar.css';

import { useEffect } from 'react';
import fastMemo from 'react-fast-memo';

export const Scrollbar = fastMemo(({ thumbColor, trackColor }) => {
  useEffect(() => {
    if (!thumbColor || !trackColor) {
      return;
    }

    const root = document.documentElement;

    root.style.setProperty('--scrollbar-thumb-color', thumbColor);
    root.style.setProperty('--scrollbar-track-color', trackColor);
  }, [thumbColor, trackColor]);

  return null;
});
