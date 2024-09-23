import { Button } from '@nutui/nutui-react';
import { RiUserUnfollowLine } from '@remixicon/react';
import React, { useState } from 'react';
import { useCat } from 'usecat';

import { isDeletingAccountCat } from '../shared/browser/store/sharedCats.js';
import { deleteAccountEffect } from '../shared/browser/store/sharedEffects.js';
import { errorCssColor } from './AppWrapper.jsx';
import { Confirm } from './Confirm.jsx';

export function DeleteAccountLink() {
  const isDeleting = useCat(isDeletingAccountCat);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <Button
        fill="none"
        onClick={() => setShowConfirm(true)}
        color={errorCssColor}
        disabled={isDeleting}
        icon={<RiUserUnfollowLine />}
      >
        Delete account
      </Button>

      <Confirm
        message="All your data will be deleted. Are you sure?"
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={deleteAccountEffect}
        isSaving={isDeleting}
      />
    </>
  );
}
