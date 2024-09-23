import { RiCheckboxCircleLine, RiErrorWarningLine, RiInformationLine } from '@remixicon/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createCat, useCat } from 'usecat';

import { classNames } from './classNames.js';
import styles from './Toast.module.css';

const warningCssColor = '#ffc53d';
const successCssColor = '#30a46c';
const errorCssColor = '#e5484d';

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
    <div
      className={classNames({
        [styles.toastContainer]: true,
        [styles.show]: visible,
        [styles.top]: toast.position === toastPositions.top || !toast.position,
        [styles.bottom]: toast.position === toastPositions.bottom,
      })}
      onClick={handleHide}
    >
      {icon} {toast.message}
    </div>
  );
};
