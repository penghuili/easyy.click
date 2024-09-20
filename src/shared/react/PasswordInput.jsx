import { RiEyeCloseLine, RiEyeLine } from '@remixicon/react';
import React, { useState } from 'react';

import { InputField } from './InputField.jsx';

export function PasswordInput({ label, value, onChange, onSubmit }) {
  const [show, setShow] = useState(false);

  return (
    <InputField
      type={show ? 'text' : 'password'}
      label={label || 'Password'}
      placeholder="Your password"
      icon={
        show ? (
          <RiEyeLine
            onClick={() => {
              setShow(false);
            }}
          />
        ) : (
          <RiEyeCloseLine
            onClick={() => {
              setShow(true);
            }}
          />
        )
      }
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}
