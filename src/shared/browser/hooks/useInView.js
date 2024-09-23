import { useEffect, useRef } from 'react';

import { useRefValue } from './useRefValue';

function checkCSSVisibility(element) {
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility !== 'visible') {
    return false;
  }

  const parentWithOverflow =
    element.closest(':not(body):not(html)[style*="overflow: hidden"]') ||
    element.closest(':not(body):not(html)[style*="overflowX: hidden"]') ||
    element.closest(':not(body):not(html)[style*="overflowY: hidden"]');
  if (parentWithOverflow) {
    const parentBounds = parentWithOverflow.getBoundingClientRect();
    const elemBounds = element.getBoundingClientRect();

    if (
      elemBounds.right < parentBounds.left ||
      elemBounds.left > parentBounds.right ||
      elemBounds.bottom < parentBounds.top ||
      elemBounds.top > parentBounds.bottom
    ) {
      return false; // Element is entirely outside its parent
    }
  }

  return true;
}

export function useInView(callback, options = {}) {
  const ref = useRef(null);
  const callbackRef = useRefValue(callback);
  const optionsRef = useRefValue(options);

  useEffect(() => {
    const element = ref.current;
    const currentOptions = optionsRef.current;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          if (checkCSSVisibility(ref.current)) {
            callbackRef.current();
          }
          if (!currentOptions.alwaysObserve) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
        ...currentOptions,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [callbackRef, optionsRef]);

  return ref;
}
