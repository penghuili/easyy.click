import { isCreateLinkSuccessfulCat, isCreatingLinkCat } from './linkCats';
import { createLink } from './linkNetwork';

export async function createLinkEffect({ title, link, fromUrl }) {
  isCreatingLinkCat.set(true);

  const { data } = await createLink({ title, link, fromUrl });
  isCreateLinkSuccessfulCat.set(!!data);

  isCreatingLinkCat.set(false);
}
