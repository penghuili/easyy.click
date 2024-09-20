import { Button, Cell, NavBar, Toast } from '@nutui/nutui-react';
import { RiAddLine, RiPencilLine } from '@remixicon/react';
import React from 'react';
import { navigateTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { copyToClipboard } from '../lib/copyToClipboard';
import { textsCat } from '../store/textCats';

export const Texts = fastMemo(() => {
  const texts = useCat(textsCat);

  return (
    <>
      <NavBar
        right={
          <Button
            type="primary"
            fill="none"
            icon={<RiAddLine />}
            onClick={() => {
              navigateTo(`/texts/add`);
            }}
          />
        }
      >
        Texts
      </NavBar>

      {texts.map(({ sortKey, title, text }) => (
        <Cell
          key={sortKey}
          clickable
          title={title}
          extra={
            <Button
              type="primary"
              fill="none"
              icon={<RiPencilLine />}
              onClick={e => {
                e.stopPropagation();
                navigateTo(`/texts/details?textId=${sortKey}`);
              }}
            />
          }
          onClick={async () => {
            await copyToClipboard(text);
            Toast.show('Copied!');
          }}
        />
      ))}
    </>
  );
});
