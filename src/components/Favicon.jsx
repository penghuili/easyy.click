import React, { useMemo, useState } from 'react';

export function Favicon({ url }) {
  const link = useMemo(() => {
    return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(url)}`;
  }, [url]);

  const [isSuccessful, setIsSuccessful] = useState(undefined);

  return (
    <img
      src={link}
      style={{
        display: isSuccessful ? 'inline-block' : 'none',
        marginRight: '0.25rem',
        width: '16px',
        height: '16px',
      }}
      onLoad={() => {
        setIsSuccessful(true);
      }}
      onError={() => {
        setIsSuccessful(false);
      }}
    />
  );
}
