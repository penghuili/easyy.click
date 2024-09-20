import './style.css';

import React from 'react';

import { AppWrapper } from './components/AppWrapper.jsx';
import { Router } from './Router.jsx';

function App() {
  return (
    <AppWrapper>
      <Router />
    </AppWrapper>
  );
}

export default App;
