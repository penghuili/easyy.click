import React from 'react';
import { BabyRoutes } from 'react-baby-router';

import { isMobileWidth } from './lib/device.js';
import { Demo } from './views/Demo.jsx';
import { TextAdd } from './views/TextAdd.jsx';
import { TextDetails } from './views/TextDetails.jsx';
import { Texts } from './views/Texts.jsx';

const routes = {
  '/texts/add': TextAdd,
  '/texts/details': TextDetails,
  '/demo': Demo,
  '/': Texts,
};

export function Router() {
  return <BabyRoutes routes={routes} enableAnimation={isMobileWidth()} />;
}
