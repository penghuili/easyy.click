import { Button, Form, Input, NavBar, TextArea } from '@nutui/nutui-react';
import { RiArrowLeftLine } from '@remixicon/react';
import React, { useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';

import { createTextEffect } from '../store/textEffect';

export const TextAdd = fastMemo(() => {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');

  return (
    <>
      <NavBar
        back={<Button type="primary" fill="none" icon={<RiArrowLeftLine />} />}
        onBackClick={goBack}
      >
        Add text
      </NavBar>

      <Form
        labelPosition="top"
        footer={
          <Button nativeType="submit" type="primary" disabled={!value || !title}>
            Save
          </Button>
        }
        onFinish={({ title, text }) => {
          createTextEffect(title, text);
          goBack();
        }}
      >
        <Form.Item label="Title" name="title">
          <Input placeholder="Title" value={title} onChange={setTitle} />
        </Form.Item>
        <Form.Item label="Text" name="text">
          <TextArea
            placeholder="What do you want to copy?"
            value={value}
            onChange={setValue}
            rows={6}
          />
        </Form.Item>
      </Form>
    </>
  );
});
