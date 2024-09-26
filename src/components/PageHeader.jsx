import { Avatar, Button, Loading, NavBar } from '@nutui/nutui-react';
import { RiArrowLeftLine } from '@remixicon/react';
import React, { useCallback, useMemo } from 'react';
import { goBack, navigateTo } from 'react-baby-router';

import { logo } from '../shared/browser/initShared.js';
import { NewVersionAvailable } from './NewVersionAvailable.jsx';

export function PageHeader({ title, right, isLoading, hasBack }) {
  const handleClick = useCallback(() => {
    if (hasBack) {
      goBack();
    } else {
      navigateTo('/');
    }
  }, [hasBack]);

  const iconElement = useMemo(() => {
    if (hasBack) {
      return <Button type="primary" fill="none" icon={<RiArrowLeftLine />} />;
    }

    return <Avatar src={logo} shape="square" background="transparent" />;
  }, [hasBack]);

  return (
    <>
      <NavBar titleAlign="left" back={iconElement} onBackClick={handleClick} right={right}>
        {title} {isLoading && <Loading type="spinner" />}
      </NavBar>

      <NewVersionAvailable />
    </>
  );
}
