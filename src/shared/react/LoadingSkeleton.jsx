import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: ${({ background }) => background};
  background-size: 200% 100%;
  animation: 1.5s shine linear infinite;

  width: ${({ width }) => width};
  aspect-ratio: 1 / 1;

  @keyframes shine {
    to {
      background-position-x: -200%;
    }
  }
`;

export function LoadingSkeleton({ width, height }) {
  return (
    <Wrapper
      width={width}
      height={height}
      background="linear-gradient(110deg, #e0e0e0 8%, #f0f0f0 18%, #e0e0e0 33%)"
    />
  );
}
