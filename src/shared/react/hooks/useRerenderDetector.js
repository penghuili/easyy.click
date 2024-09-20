import { useRef } from 'react';

export function useRerenderDetector(componentName, props, shouldLog = () => true) {
  const renderCount = useRef(0);
  const previousProps = useRef(props);

  if (!import.meta.env.DEV || !import.meta.env.VITE_RERENDER_LOGS) {
    return;
  }

  if (!shouldLog(props)) {
    return;
  }

  // Increment render count
  renderCount.current += 1;

  // Skip logging for the first render
  if (renderCount.current === 1) {
    previousProps.current = props;
    return;
  }

  const changes = {};

  // Detect prop changes
  Object.keys({ ...previousProps.current, ...props }).forEach(key => {
    if (previousProps.current[key] !== props[key]) {
      changes[key] = {
        from: previousProps.current[key],
        to: props[key],
      };
    }
  });

  // Log changes if any
  if (Object.keys(changes).length > 0) {
    console.log(
      `[${componentName}] re-render #${renderCount.current - 1} due to changes:`,
      changes
    );
  } else {
    console.warn(`[${componentName}] re-render #${renderCount.current - 1} (no changes detected)`);
  }

  // Update previous props
  previousProps.current = props;
}
