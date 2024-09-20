import { useEffect, useRef } from 'react';

export function useRefValue(value) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
