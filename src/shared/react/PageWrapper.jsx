import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  padding: env(safe-area-inset-top) 0 env(safe-area-inset-bottom);
  box-sizing: border-box;
`;

export function PageWrapper({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
