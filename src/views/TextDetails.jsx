import { Button, Form, Input, NavBar, TextArea, Toast } from '@nutui/nutui-react';
import { RiArrowLeftLine } from '@remixicon/react';
import React, { useEffect, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';

import { useText } from '../store/textCats';
import { updateTextEffect } from '../store/textEffect';

export const TextDetails = fastMemo(({ queryParams: { textId } }) => {
  const textItem = useText(textId);
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (textItem) {
      setTitle(textItem.title);
      setValue(textItem.text);
    }
  }, [textItem]);

  return (
    <>
      <NavBar
        back={<Button type="primary" fill="none" icon={<RiArrowLeftLine />} />}
        onBackClick={goBack}
      >
        Edit text
      </NavBar>

      {!!textItem && (
        <Form
          initialValues={{ title: textItem.title, text: textItem.text }}
          labelPosition="top"
          footer={
            <Button nativeType="submit" type="primary" disabled={!value || !title}>
              Save
            </Button>
          }
          onFinish={({ title, text }) => {
            updateTextEffect(textId, title, text);
            Toast.show({
              content: 'Updated!',
              icon: 'success',
              style: {
                '--nutui-toast-inner-top': '10%',
              },
            });
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
      )}
    </>
  );
});
