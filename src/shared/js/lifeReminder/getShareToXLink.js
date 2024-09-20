import { profileTypes } from './profileTypes';

export function getShareToXLink(profile, message) {
  const content = encodeURIComponent(
    `"${profile.name}"${
      profile.profileType !== profileTypes.noDate && message ? `\n${message}` : ''
    }\n\nReminded by @remiindcc`
  );
  return `https://x.com/intent/post?text=${content}`;
}
