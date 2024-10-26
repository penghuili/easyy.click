import { isCreateNoteSuccessfulCat, isCreatingNoteCat } from './noteCats';
import { createNote } from './noteNetwork';

export async function createNoteEffect({ title, text, fromUrl }) {
  isCreatingNoteCat.set(true);

  const { data } = await createNote({ title, text, fromUrl });
  isCreateNoteSuccessfulCat.set(!!data);

  isCreatingNoteCat.set(false);
}
