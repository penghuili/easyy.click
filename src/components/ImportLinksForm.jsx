import { ArrayField, Button, Form } from '@douyinfe/semi-ui';
import { RiDeleteBinLine } from '@remixicon/react';
import React, { useCallback, useRef, useState } from 'react';
import { replaceTo } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Link } from '../shared/semi/Link.jsx';
import { isCreatingLinksCat } from '../store/link/linkCats.js';
import { createLinksEffect } from '../store/link/linkEffect.js';
import { inboxSpaceId } from '../store/space/spaceCats.js';

export const ImportLinksForm = fastMemo(({ initLinks }) => {
  const isCreating = useCat(isCreatingLinksCat);

  const formRef = useRef(null);
  const [formValues, setFormValues] = useState({ links: initLinks });

  const filledForm =
    !!formValues?.links?.length && formValues.links.every(link => !!link.link && !!link.title);

  const handleFormValuesChange = useCallback(values => {
    setFormValues({ links: (values.links || []).map(link => ({ ...link })) });
  }, []);

  const handleSave = useCallback(async () => {
    console.log('save', formValues.links);
    await createLinksEffect({ links: formValues.links, showMessage: true }, inboxSpaceId);
    replaceTo('/inbox');
  }, [formValues]);

  return (
    <Form ref={formRef} onValueChange={handleFormValuesChange} onSubmit={handleSave}>
      <ArrayField field="links" initValue={initLinks}>
        {({ arrayFields }) => (
          <>
            {arrayFields.map(({ field, key, remove }, index) => (
              <div
                key={key}
                style={{
                  marginBottom: '2rem',
                  border: '1px solid var(--semi-color-border',
                  borderRadius: 8,
                  padding: '1rem 0.5rem',
                }}
              >
                {formValues?.links?.[index]?.link && (
                  <Link href={formValues?.links?.[index]?.link} target="_blank">
                    {formValues?.links?.[index]?.link}
                  </Link>
                )}

                <Form.Input
                  field={`${field}[title]`}
                  label="Link name"
                  placeholder="ChatGPT, Youtube, etc"
                />

                <Button
                  onClick={remove}
                  icon={<RiDeleteBinLine size={16} />}
                  type="danger"
                  size="small"
                  theme="solid"
                >
                  Delete this link
                </Button>
              </div>
            ))}
          </>
        )}
      </ArrayField>

      <Button htmlType="submit" theme="solid" block disabled={!filledForm || isCreating}>
        {formValues?.links?.length ? `Import ${formValues?.links?.length} links` : 'Import links'}
      </Button>
    </Form>
  );
});
