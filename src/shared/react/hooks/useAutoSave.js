import { useEffect, useRef, useState } from 'react';

export function useAutoSave(onSave, delay = 1000) {
  const [content, setContent] = useState('');
  const timerIdRef = useRef(null);

  const handleChange = newContent => {
    setContent(newContent);

    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    timerIdRef.current = setTimeout(() => {
      onSave(newContent);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  return [content, handleChange];
}
