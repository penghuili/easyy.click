import React from 'react';

export function Favicon({ url }) {
  const favLink = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(url)}`;

  return (
    <img
      src={favLink}
      style={{
        display: 'inline-block',
        marginRight: '0.25rem',
        width: '16px',
        height: '16px',
        position: 'relative',
        top: 4,
      }}
    />
  );
}
