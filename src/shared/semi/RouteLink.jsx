import React, { useCallback } from 'react';
import { navigateTo } from 'react-baby-router';

import { fastMemo } from '../browser/fastMemo';
import { Link } from './Link.jsx';

export const RouteLink = fastMemo(({ to, children, m }) => {
  const handleClick = useCallback(
    e => {
      e.preventDefault();
      navigateTo(to);
    },
    [to]
  );

  return (
    <Link href={to} m={m} onClick={handleClick}>
      {children}
    </Link>
  );
});
