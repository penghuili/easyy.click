import { useEffect } from 'react';
import fastMemo from 'react-fast-memo';

import { randomBetween } from '../shared/js/utils';

const emojis = [
  '😎',
  '🤩',
  '🎉',
  '🔥',
  '😸',
  '💪',
  '🥳',
  '🙈',
  '😏',
  '😱',
  '🤪',
  '💯',
  '😒',
  '🌞',
  '🫣',
  '🙃',
  '🤤',
  '🫶',
];

function getEmoji() {
  const index = randomBetween(0, emojis.length - 1);
  return emojis[index];
}

export const PageTitleUpdator = fastMemo(() => {
  useEffect(() => {
    const handleFocus = () => {
      document.title = 'easyy';
    };
    const handleBlur = () => {
      document.title = getEmoji();
    };
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
  }, []);

  return null;
});
