import './Shine.css';

import React from 'react';

import { fastMemo } from './fastMemo';

export const Shine = fastMemo(() => {
  return <div className="shine" />;
});
