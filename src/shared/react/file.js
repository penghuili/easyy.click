export const FILI_SIZE_LIMIT_IN_MB = 500; // 500MB
export const FILI_SIZE_LIMIT = FILI_SIZE_LIMIT_IN_MB * 1024 * 1024; // 500MB

export function isImage(mimeType) {
  return !!mimeType && mimeType.startsWith('image/');
}

export function isVideo(mimeType) {
  return !!mimeType && mimeType.startsWith('video/');
}

export function isPdf(mimeType) {
  return !!mimeType && mimeType.startsWith('application/pdf');
}

export async function generateImageThumbnail(inputFile, imageWidth = 600) {
  try {
    return await generateThumbnail(inputFile, imageWidth);
  } catch (e) {
    console.error('Error in generateImageThumbnail:', e);
    throw e;
  }
}

function generateThumbnail(file, imageWidth) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(imageWidth, img.width);
        canvas.height = canvas.width * (img.height / img.width);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          blob => {
            resolve({ blob, width: canvas.width, height: canvas.height });
          },
          'image/png',
          0.95
        );
      };
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function inputFileToUint8Array(file) {
  const fileData = await file.arrayBuffer();
  const binaryData = new Uint8Array(fileData);
  return binaryData;
}

export function inputFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      resolve(event.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function fetchResponseToUint8Array(response) {
  const fileData = await response.arrayBuffer();
  const binaryData = new Uint8Array(fileData);
  return binaryData;
}

export async function blobToUint8Array(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export function uint8ArrayToBlob(uint8Array, type = 'application/octet-stream') {
  return new Blob([uint8Array], { type });
}

export function getFileSizeString(sizeInByte) {
  const gb = Math.floor(sizeInByte / (1024 * 1024 * 1024));
  const mb = Math.floor((sizeInByte % (1024 * 1024 * 1024)) / (1024 * 1024));
  const kb = Math.round((sizeInByte % (1024 * 1024)) / 1024);

  const gbString = gb > 0 ? `${gb}GB ` : '';
  const mbString = mb > 0 ? `${mb}MB ` : '';
  const kbString = `${kb}KB`;

  return `${gbString}${mbString}${kbString}`.trim();
}
