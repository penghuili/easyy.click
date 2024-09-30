import React, { useEffect, useRef, useState } from 'react';

import { classNames } from './classNames';
import styles from './XiangCai.module.css';

export const Xiangcai = ({ targetClassName }) => {
  const imageRef = useRef(null);

  const [show, setShow] = useState(false);

  useEffect(() => {
    const imgElement = imageRef.current;

    imgElement.addEventListener('click', () => {
      setShow(false);
    });

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setShow(true);
        } else {
          setShow(false);
        }
      });
    }, options);

    const target = document.querySelector(targetClassName);
    if (target) {
      observer.observe(target);
    }
  }, [targetClassName]);

  return (
    <img
      className={classNames({
        [styles.xiangCai]: true,
        [styles.show]: show,
      })}
      src="xiangcai.png"
      ref={imageRef}
    />
  );
};
