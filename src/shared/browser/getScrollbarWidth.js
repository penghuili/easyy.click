import { useEffect, useState } from 'react';

export function getScrollbarWidth() {
  // Create a temporary div element with a scrollbar
  const scrollDiv = document.createElement('div');
  scrollDiv.style.width = '100px';
  scrollDiv.style.height = '100px';
  scrollDiv.style.overflow = 'scroll';
  scrollDiv.style.position = 'absolute';
  scrollDiv.style.top = '-9999px';

  // Append the div to the body
  document.body.appendChild(scrollDiv);

  // Calculate the scrollbar width
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

  // Remove the div from the body
  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}

export const widthWithoutScrollbar = window.innerWidth - getScrollbarWidth();

export const useWidthWithoutScrollbar = () => {
  const [width, setWidth] = useState(widthWithoutScrollbar);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth - getScrollbarWidth());
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
};
