export function canShare() {
  return !!navigator.share;
}

export async function share({ title, url, text }) {
  try {
    await navigator.share({ title, url, text });
  } catch (error) {
    console.log(error);
  }
}
