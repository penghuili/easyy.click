import { Button } from '@douyinfe/semi-ui';
import { RiUserUnfollowLine } from '@remixicon/react';
import React, { useState } from 'react';
import { useCat } from 'usecat';

import { isDeletingAccountCat } from '../shared/browser/store/sharedCats.js';
import { deleteAccountEffect } from '../shared/browser/store/sharedEffects.js';
import { Confirm } from './Confirm.jsx';

export function DeleteAccountLink() {
  const isDeleting = useCat(isDeletingAccountCat);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <Button
        theme="borderless"
        onClick={() => setShowConfirm(true)}
        type="danger"
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
