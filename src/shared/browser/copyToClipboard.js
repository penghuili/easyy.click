export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
