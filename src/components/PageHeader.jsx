import { Avatar, Button, Spin } from '@douyinfe/semi-ui';
import { RiArrowLeftLine } from '@remixicon/react';
import React, { useMemo } from 'react';
import { goBack } from 'react-baby-router';

import { logo } from '../shared/browser/initShared.js';
import { Flex } from './Flex.jsx';
import { NewVersionAvailable } from './NewVersionAvailable.jsx';

export function PageHeader({ title, right, isLoading, hasBack }) {
  const iconElement = useMemo(() => {
    if (hasBack) {
      return (
        <Button
          type="primary"
          theme="borderless"
          icon={<RiArrowLeftLine />}
          onClick={goBack}
          style={{ marginRight: '0.5rem' }}
        />
      );
    }

    return <Avatar src={logo} size="small" style={{ marginRight: '0.5rem' }} />;
  }, [hasBack]);

  return (
    <>
      <Flex
        direction="row"
        justify="between"
        align="center"
        titleAlign="left"
        m="0 0 1rem"
        p="0.5rem 0 0"
      >
        <Flex direction="row" align="center">
          {iconElement} {title} {isLoading && <Spin style={{ marginLeft: '1rem' }} />}
        </Flex>
        {right && (
          <Flex direction="row" align="center">
            {right}
          </Flex>
        )}
      </Flex>

      <NewVersionAvailable />
    </>
  );
}
