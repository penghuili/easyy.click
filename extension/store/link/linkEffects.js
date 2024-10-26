import { isCreatingLinkCat, isCreationgSuccessfulCat } from './linkCats';
import { createLink } from './linkNetwork';

export async function createLinkEffect({ title, link, count, groupId, moved }) {
  isCreatingLinkCat.set(true);

  const { data } = await createLink({ title, link, count, groupId, moved });
  isCreationgSuccessfulCat.set(!!data);

  isCreatingLinkCat.set(false);
}
