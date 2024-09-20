import { Button } from '@radix-ui/themes';
import { RiUserUnfollowLine } from '@remixicon/react';
import React, { useState } from 'react';
import { useCat } from 'usecat';

import { errorColor } from './AppWrapper.jsx';
import { Confirm } from './Confirm.jsx';
import { isDeletingAccountCat } from './store/sharedCats.js';
import { deleteAccountEffect } from './store/sharedEffects';

export function DeleteAccountLink() {
  const isDeleting = useCat(isDeletingAccountCat);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setShowConfirm(true)}
        color={errorColor}
        disabled={isDeleting}
      >
        <RiUserUnfollowLine />
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
