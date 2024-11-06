export function isValidUrl(str) {
  try {
    // Create a new URL object to check if the string is a valid URL
    const url = new URL(str);
    // Check if the URL has a valid protocol (http, https)
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    // If URL constructor throws, it's not a valid URL
    return false;
  }
}
