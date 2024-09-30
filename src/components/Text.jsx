import React from 'react';

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

export function Text({
  as: Component = 'p',
  children,
  onClick,
  style,
  color,
  size = '4',
  align,
  bold,
  m,
}) {
  return (
    <Component
      onClick={onClick}
      style={{
        color: color || 'var(--nutui-gray-7)',
        fontSize: fontSizes[size] || 'var(--nutui-font-size-4)',
        textAlign: align || 'left',
        margin: m || '0',
        fontWeight: bold ? 'bold' : 'normal',
        ...(style || {}),
      }}
    >
      {children}
    </Component>
  );
}
