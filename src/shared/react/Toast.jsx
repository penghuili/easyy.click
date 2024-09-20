import { RiCheckboxCircleLine, RiErrorWarningLine, RiInformationLine } from '@remixicon/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { createCat, useCat } from 'usecat';

import { errorCssColor, successCssColor, warningCssColor } from './AppWrapper.jsx';

export const toastTypes = {
  success: 'success',
  error: 'error',
  info: 'info',
};

export const toastPositions = {
  top: 'top',
  bottom: 'bottom',
};

const defaultDuration = 3000;
export const toastCat = createCat({
  message: '',
  type: toastTypes.success,
  position: toastPositions.top,
  duration: defaultDuration,
});

export const Toast = () => {
  const toast = useCat(toastCat);

  const [visible, setVisible] = useState(false);

  const handleHide = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    let timerId;

    if (toast.message) {
      setVisible(true);

      timerId = setTimeout(() => {
        setVisible(false);
      }, toast.duration || defaultDuration);
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [toast]);

  const icon = useMemo(() => {
    if (toast.type === toastTypes.info) {
      return <RiInformationLine color={warningCssColor} />;
    }
    if (toast.type === toastTypes.error) {
      return <RiErrorWarningLine color={errorCssColor} />;
    }

    return <RiCheckboxCircleLine color={successCssColor} />;
  }, [toast.type]);

  return (
    <ToastContainer
      className={`${visible ? 'show' : ''} ${toast.position || toastPositions.top}`}
      onClick={handleHide}
    >
      {icon} {toast.message}
    </ToastContainer>
  );
};

const ToastContainer = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  color: #333;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
  z-index: 4000;

  display: flex;
  align-items: center;
  gap: 4px;

  &.show {
    opacity: 1;
  }

  &.top {
    top: 20px;
    transform: translateX(-50%) translateY(-20px);
  }

  &.bottom {
    bottom: 20px;
    transform: translateX(-50%) translateY(20px);
  }

  &.show.top {
    transform: translateX(-50%) translateY(0);
  }

  &.show.bottom {
    transform: translateX(-50%) translateY(0);
  }
`;
