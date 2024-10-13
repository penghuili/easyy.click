import { ArrayField, Button, Form, Input, Typography } from '@douyinfe/semi-ui';
import { RiAddLine, RiDeleteBinLine } from '@remixicon/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { goBack } from 'react-baby-router';
import fastMemo from 'react-fast-memo';
import { useCat } from 'usecat';

import { Flex } from '../components/Flex.jsx';
import { PageHeader } from '../components/PageHeader.jsx';
import { SpaceHint } from '../components/SpaceHint.jsx';
import { PageContent } from '../shared/browser/PageContent.jsx';
import { debounce } from '../shared/js/debounce.js';
import { isCreatingGroupCat, useGroups } from '../store/group/groupCats.js';
import { createGroupEffect, fetchGroupsEffect } from '../store/group/groupEffect.js';
import { isCreatingLinksCat, isLoadingPageInfoCat } from '../store/link/linkCats.js';
import { createLinksEffect, fetchPageInfoEffect } from '../store/link/linkEffect.js';

const debouncedFetchInfo = debounce(async (pageLink, ref, linkIndex) => {
  if (!pageLink || !pageLink.trim()) {
    return;
  }

  const data = await fetchPageInfoEffect(pageLink);
  if (data?.title) {
    ref.current.formApi.setValue(`links[${linkIndex}][title]`, data.title);
  }
}, 500);

export const LinkAdd = fastMemo(({ queryParams: { groupId: groupIdInQuery, spaceId } }) => {
  const isCreating = useCat(isCreatingLinksCat);
  const isLoadingPageInfo = useCat(isLoadingPageInfoCat);
  const groups = useGroups(spaceId);

  const formRef = useRef(null);
  const [formValues, setFormValues] = useState();

  const filledForm =
    !!formValues?.links?.length && formValues.links.every(link => !!link.link && !!link.title);

  const handleFetchPageTitle = useCallback(async changedField => {
    const keys = Object.keys(changedField);
    const key = keys[0];
    if (!key) {
      return;
    }

    const regex = /\[(\d+)\]\[(\w+)\]/;
    const match = key.match(regex);
    if (!match) {
      return;
    }

    const [, index, field] = match;
    if (field !== 'link') {
      return;
    }

    debouncedFetchInfo(changedField[key], formRef, index);
  }, []);

  const handleFormValuesChange = useCallback(
    (values, changedField) => {
      setFormValues({ ...values });

      handleFetchPageTitle(changedField);
    },
    [handleFetchPageTitle]
  );

  const handleSave = useCallback(async () => {
    await createLinksEffect({ links: formValues.links }, spaceId);
    goBack();
  }, [formValues?.links, spaceId]);

  useEffect(() => {
    fetchGroupsEffect(false, true, spaceId);
  }, [spaceId]);

  return (
    <PageContent>
      <PageHeader title="Add links" isLoading={isCreating || isLoadingPageInfo} hasBack />

      <SpaceHint spaceId={spaceId} />

      <Form ref={formRef} onValueChange={handleFormValuesChange} onSubmit={handleSave}>
        <ArrayField
          field="links"
          initValue={[{ link: '', title: '', groupId: groupIdInQuery || null }]}
        >
          {({ addWithInitValue, arrayFields }) => (
            <>
              {arrayFields.map(({ field, key, remove }, index) => (
                <div
                  key={key}
                  style={{
                    marginBottom: '4rem',
                    border: '1px solid var(--semi-color-border',
                    borderRadius: 8,
                    padding: '0 0.5rem 1rem',
                  }}
                >
                  <Form.Input
                    field={`${field}[link]`}
                    label="Link"
                    placeholder="https://example.com"
                    autoFocus
                  />

                  <Form.Input
                    field={`${field}[title]`}
                    label="Link name"
                    placeholder="ChatGPT, Youtube, etc"
                  />

                  {groups?.length ? (
                    <Form.RadioGroup field={`${field}[groupId]`} label="Tag" direction="horizontal">
                      {groups.map(group => (
                        <Form.Radio key={group.sortKey} value={group.sortKey}>
                          {group.title}
                        </Form.Radio>
                      ))}
                    </Form.RadioGroup>
                  ) : (
                    <Flex m="0.75rem 0 0.75rem">
                      <Typography.Text strong>Tag</Typography.Text>
                      <Typography.Text type="secondary">No tags yet.</Typography.Text>
                    </Flex>
                  )}

                  <CreateGroup spaceId={spaceId} />

                  <Flex direction="row" gap="0.5rem" m="1.5rem 0 0">
                    {index === arrayFields.length - 1 && (
                      <Button
                        onClick={() =>
                          addWithInitValue({
                            link: '',
                            title: '',
                            groupId: formValues?.links?.[index]?.groupId || null,
                          })
                        }
                        icon={<RiAddLine size={16} />}
                        size="small"
                        disabled={
                          !formValues?.links?.[index]?.link || !formValues?.links?.[index]?.title
                        }
                        theme="solid"
                      >
                        Add another link
                      </Button>
                    )}
                    {index > 0 && (
                      <Button
                        onClick={remove}
                        icon={<RiDeleteBinLine size={16} />}
                        type="danger"
                        size="small"
                        theme="solid"
                      >
                        Delete this link
                      </Button>
                    )}
                  </Flex>
                </div>
              ))}
            </>
          )}
        </ArrayField>

        <Button htmlType="submit" theme="solid" block disabled={!filledForm || isCreating}>
          Create
        </Button>
      </Form>
    </PageContent>
  );
});

const CreateGroup = fastMemo(({ spaceId }) => {
  const isCreating = useCat(isCreatingGroupCat);

  const [title, setTitle] = useState('');

  const handleCreate = useCallback(async () => {
    const newGroup = await createGroupEffect(title, spaceId);
    if (newGroup) {
      setTitle('');
    }
  }, [spaceId, title]);

  return (
    <div>
      <Flex
        direction="row"
        align="center"
        justify="start"
        gap="0.5rem"
        style={{ maxWidth: 300 }}
        m="0 0 1rem"
      >
        <Input placeholder="New tag name" value={title} onChange={setTitle} />
        <Button theme="outline" disabled={!title || isCreating} onClick={handleCreate}>
          Create
        </Button>
      </Flex>
    </div>
  );
});
