import { useCat } from 'usecat';

import { userCat } from '../shared/browser/store/sharedCats';

export function useAdmin() {
  const user = useCat(userCat);

  return user?.id === import.meta.env.VITE_ADMIN_USERID;
}
