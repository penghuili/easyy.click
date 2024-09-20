export async function canvasToBlob(canvas, type, quality) {
  return new Promise(resolve => {
    canvas.toBlob(resolve, type || 'image/png', quality || 0.9);
  });
}
