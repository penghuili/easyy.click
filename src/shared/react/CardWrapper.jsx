import React from 'react';

export function CardWrapper({ children }) {
  return (
    <div
      style={{
        border: 'var(--gray-4) 1px solid',
        borderRadius: '4px',
        marginBottom: '1.5rem',
        padding: '0.5rem',
      }}
    >
      {children}
    </div>
  );
}
