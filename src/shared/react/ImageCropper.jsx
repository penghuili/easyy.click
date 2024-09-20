import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { disablePullToRefresh, enablePullToRefresh } from './bodySccroll';
import { isAndroidBrowser, isIOSBrowser } from './device';

const PADDING = 10;

export const ImageCropper = forwardRef(({ width, pickedImage, onError }, ref) => {
  const [image, setImage] = useState(null);
  const [imagePosition, setImagePosition] = useState({ x: PADDING, y: PADDING });
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  const [isLandscape, setIsLandscape] = useState(false);
  const [squareSize, setSquareSize] = useState(width);

  const imageContainerRef = useRef(null);
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    crop: cropImage,
  }));

  useEffect(() => {
    disablePullToRefresh();
    return () => {
      enablePullToRefresh();
    };
  }, []);

  useEffect(() => {
    const createImage = () => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
      };
      img.onerror = e => {
        setImage(null);
        onError(e);
      };
      img.src = URL.createObjectURL(pickedImage);
    };

    if (pickedImage) {
      createImage();
    } else {
      setImage(null);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [onError, pickedImage]);

  useEffect(() => {
    const setupCropArea = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setImagePosition({ x: PADDING, y: PADDING });

      let newSquareSize = squareSize;
      if (image.width < width - 2 * PADDING || image.height < width - 2 * PADDING) {
        newSquareSize = Math.min(image.width, image.height) + 2 * PADDING;
        setSquareSize(newSquareSize);
      }

      const newScaleWidth = Math.min(1, (newSquareSize - 2 * PADDING) / image.width);
      const newScaleHeight = Math.min(1, (newSquareSize - 2 * PADDING) / image.height);
      const newScale = Math.max(newScaleWidth, newScaleHeight);
      setScale(newScale);

      canvas.width = image.width * newScale;
      canvas.height = image.height * newScale;

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const newIsLandscape = canvas.width > canvas.height;
      setIsLandscape(newIsLandscape);
    };

    if (image) {
      setupCropArea();
    }
  }, [image, squareSize, width]);

  useEffect(() => {
    const drag = e => {
      if (!isDragging) return;
      if (!isAndroidBrowser() && !isIOSBrowser()) {
        e.preventDefault();
      }
      const currentX = e.clientX || e.touches?.[0]?.clientX;
      const currentY = e.clientY || e.touches?.[0]?.clientY;
      if (currentX === undefined || currentY === undefined) {
        return;
      }
      const startX = parseFloat(imageContainerRef.current.dataset.startX);
      const startY = parseFloat(imageContainerRef.current.dataset.startY);

      let newX = currentX - startX;
      if (newX < squareSize - canvasRef.current.width - PADDING) {
        newX = squareSize - canvasRef.current.width - PADDING;
      }
      if (newX > PADDING) {
        newX = PADDING;
      }
      let newY = currentY - startY;
      if (newY < squareSize - canvasRef.current.height - PADDING) {
        newY = squareSize - canvasRef.current.height - PADDING;
      }
      if (newY > PADDING) {
        newY = PADDING;
      }

      if (isLandscape) {
        setImagePosition({ x: newX, y: PADDING });
      } else {
        setImagePosition({ x: PADDING, y: newY });
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', drag);
      document.addEventListener('touchmove', drag);
      document.addEventListener('mouseup', stopDragging);
      document.addEventListener('touchend', stopDragging);
    } else {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchend', stopDragging);
    }

    return () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('mouseup', stopDragging);
      document.removeEventListener('touchend', stopDragging);
    };
  }, [isDragging, isLandscape, squareSize]);

  const startDragging = e => {
    if (!isAndroidBrowser() && !isIOSBrowser()) {
      e.preventDefault();
    }
    setIsDragging(true);
    const startX = e.clientX || e.touches[0].clientX;
    const startY = e.clientY || e.touches[0].clientY;
    imageContainerRef.current.dataset.startX = startX - imagePosition.x;
    imageContainerRef.current.dataset.startY = startY - imagePosition.y;
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const cropImage = imageWidth => {
    const newCanvas = document.createElement('canvas');
    const newCtx = newCanvas.getContext('2d');
    const originalSquareSize = (squareSize - 2 * PADDING) / scale;

    const targetWidth = Math.min(imageWidth || 900, Math.max(originalSquareSize, image.width));

    const scaleFactor = targetWidth / originalSquareSize;

    newCanvas.width = targetWidth;
    newCanvas.height = targetWidth;

    newCtx.drawImage(
      image,
      -(imagePosition.x - PADDING) / scale,
      -(imagePosition.y - PADDING) / scale,
      (squareSize - 2 * PADDING) / scale,
      (squareSize - 2 * PADDING) / scale,
      0,
      0,
      targetWidth,
      targetWidth
    );

    // If you need to sharpen the image after scaling up, you can use this:
    if (scaleFactor > 1) {
      newCtx.imageSmoothingEnabled = false;
      newCtx.mozImageSmoothingEnabled = false;
      newCtx.webkitImageSmoothingEnabled = false;
      newCtx.msImageSmoothingEnabled = false;
    }

    return newCanvas;
  };

  return (
    <div>
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          width: squareSize,
          height: squareSize,
          overflow: 'hidden',
        }}
      >
        <div
          ref={imageContainerRef}
          style={{
            position: 'absolute',
            left: imagePosition.x,
            top: imagePosition.y,
            cursor: 'move',
          }}
          onMouseDown={startDragging}
          onTouchStart={startDragging}
        >
          <canvas ref={canvasRef} />
        </div>
        {!!image && (
          <div
            style={{
              position: 'relative',
              top: PADDING,
              left: PADDING,
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.25)',
              width: squareSize - 2 * PADDING,
              height: squareSize - 2 * PADDING,
              boxSizing: 'border-box',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
});
