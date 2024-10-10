import { Button, Select } from '@douyinfe/semi-ui';
import { RiPlanetLine } from '@remixicon/react';
import React, { useEffect, useMemo, useRef } from 'react';
import { navigateTo } from 'react-baby-router';

import { useSpaces } from '../store/space/spaceCats';
import { fetchSpacesEffect } from '../store/space/spaceEffect';
import { Flex } from './Flex';

export function SpaceSelector({ value, onChange }) {
  const spaces = useSpaces();

  const ref = useRef();

  const innerSpaces = useMemo(() => {
    return spaces.map(space => ({
      value: space.sortKey,
      label: (
        <span
          style={{
            color: space.color,
          }}
        >
          {space.title}
        </span>
      ),
    }));
  }, [spaces]);

  useEffect(() => {
    fetchSpacesEffect();
  }, []);

  return (
    <>
      <Select
        ref={ref}
        clickToHide
        optionList={innerSpaces}
        value={value}
        onChange={onChange}
        outerBottomSlot={
          <Flex
            m="1rem 0"
            style={{ borderTop: '1px solid var(--semi-color-border)' }}
            align="start"
          >
            <Button
              icon={<RiPlanetLine />}
              theme="borderless"
              block
              style={{ justifyContent: 'flex-start' }}
              onClick={() => {
                navigateTo('/spaces');
                ref.current.close();
              }}
            >
              All spaces
            </Button>
          </Flex>
        }
      />
    </>
  );
}
