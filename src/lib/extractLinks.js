import { isValidUrl } from '../shared/js/isValidUrl';

export function extractLinks(text) {
  const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  const links = text.match(urlPattern);
  return (links || []).filter(i => isValidUrl(i)); // Returns an empty array if no links are found
}
