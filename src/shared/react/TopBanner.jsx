import { Button, Text } from '@radix-ui/themes';
import React, { useCallback, useMemo } from 'react';
import { createCat, useCat } from 'usecat';

import { Banner } from './Banner.jsx';

export const topBannerCat = createCat({
  message: '',
  buttonText: 'Close',
});

export function TopBanner() {
  const { message, buttonText, onButtonClick } = useCat(topBannerCat);

  const handleClick = useCallback(() => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      topBannerCat.reset();
    }
  }, [onButtonClick]);

  const rightElement = useMemo(
    () => (
      <Button variant="soft" onClick={handleClick}>
        {buttonText}
      </Button>
    ),
    [buttonText, handleClick]
  );

  if (!message) {
    return null;
  }

  return (
    <Banner open right={rightElement}>
      <Text as="p">{message}</Text>
    </Banner>
  );
}
