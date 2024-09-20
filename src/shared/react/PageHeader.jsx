import { Avatar, Flex, Heading, IconButton, Spinner } from '@radix-ui/themes';
import { RiArrowLeftLine } from '@remixicon/react';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { useWidthWithoutScrollbar } from './getScrollbarWidth.js';
import { logo, showNewVersion } from './initShared';
import { NewVersionAvailable } from './NewVersionAvailable.jsx';
import { UpgradeButton } from './PaymentStatus.jsx';
import { ScrollToTop } from './ScrollToTop.jsx';
import { goBackEffect } from './store/sharedEffects';
import { TopBanner } from './TopBanner.jsx';

const Wrapper = styled(Flex)`
  width: calc(100% + 1rem);
  height: var(--space-8);
  padding: 0.5rem 0;
  margin-left: -0.5rem;
  margin-bottom: 1rem;

  position: sticky;
  left: 0;
  top: env(safe-area-inset-top);
  z-index: 2000;

  background-color: var(--color-background);
`;
const Content = styled(Flex)`
  width: 100%;
  max-width: 600px;
  z-index: 1;
  padding: 0 0.5rem;
`;

export function PageHeader({ title, right, isLoading, hasBack }) {
  const windowWidth = useWidthWithoutScrollbar();

  const iconElement = useMemo(() => {
    if (hasBack) {
      return (
        <IconButton onClick={goBackEffect} variant="ghost">
          <RiArrowLeftLine />
        </IconButton>
      );
    }

    return <Avatar src={logo} />;
  }, [hasBack]);

  return (
    <>
      <Wrapper justify="center" align="center" width={windowWidth}>
        <Content direction="row" justify="between">
          <Flex align="center" gap="2">
            {iconElement}

            <Heading size="4" as="h1">
              {title}
            </Heading>

            {!!isLoading && <Spinner />}
          </Flex>

          <Flex align="center" gap="1">
            <ScrollToTop />
            <UpgradeButton />
            {right}
          </Flex>
        </Content>
      </Wrapper>

      {showNewVersion && <NewVersionAvailable />}

      <TopBanner />
    </>
  );
}
