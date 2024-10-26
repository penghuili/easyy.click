import { Button, Divider, Form, Image, TextArea, Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useCat } from 'usecat';
import browser from 'webextension-polyfill';

import { Flex } from '../src/components/Flex';
import { Link } from '../src/components/Link';
import { PageLoading } from '../src/components/PageLoading';
import { bgActions } from './lib/constants';
import { authErrorCat, isInitingCat, isLoggedInCat, isSigningInCat } from './store/auth/authCats';
import { initEffect, logoutEffect, signInEffect } from './store/auth/authEffects';
import { isCreatingLinkCat, isCreationgSuccessfulCat } from './store/link/linkCats';

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await browser.tabs.query(queryOptions);
  return tab;
}

function Popup() {
  const isIniting = useCat(isInitingCat);
  const isSigningIn = useCat(isSigningInCat);
  const errorMessage = useCat(authErrorCat);
  const isLoggedIn = useCat(isLoggedInCat);
  const isCreatingLink = useCat(isCreatingLinkCat);
  const isCreationgSuccessful = useCat(isCreationgSuccessfulCat);

  const [activeTab, setActiveTab] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [tabTitle, setTabTitle] = useState('');

  const isDisabled = !email || !password || isSigningIn;

  function handleSignin() {
    if (isDisabled) {
      return;
    }

    signInEffect(email, password);
  }

  function handleCreateLink() {
    if (!activeTab) {
      return;
    }

    browser.runtime
      .sendMessage({
        type: bgActions.CREATE_LINK,
        payload: { title: tabTitle, link: activeTab.url },
      })
      .then(() => {
        window.close();
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    initEffect();
  }, []);

  useEffect(() => {
    getCurrentTab().then(tab => {
      if (tab) {
        setActiveTab(tab);
        setTabTitle(tab.title);
      }
    });
  }, [isLoggedIn]);

  function renderContent() {
    if (isIniting) {
      return <PageLoading />;
    }

    if (!isLoggedIn) {
      return (
        <>
          <Image
            src="/icons/icon-192.png"
            width={32}
            height={32}
            style={{ marginRight: '0.5rem' }}
          />
          <Typography.Paragraph>
            Manage frequently used links and notes.{' '}
            <Link href="https://easyy.click" target="_blank">
              Learn more &gt;&gt;
            </Link>
          </Typography.Paragraph>

          <Form onSubmit={handleSignin} style={{ marginTop: '1rem' }}>
            <Form.Input
              type="email"
              field="email"
              label="Email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
            />

            <Form.Input
              type="password"
              field="password"
              label="Password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
            />

            <Flex m="1rem 0 0">
              <Button htmlType="submit" theme="solid" disabled={isDisabled}>
                Sign in
              </Button>

              {!!errorMessage && <Typography.Text type="danger">{errorMessage}</Typography.Text>}

              <Link
                href="https://app.easyy.click/sign-up"
                target="_blank"
                style={{ marginTop: '1rem' }}
              >
                No account? Sign up
              </Link>
            </Flex>
          </Form>
        </>
      );
    }

    return (
      <>
        {!!activeTab && (
          <>
            <Flex>
              <TextArea autosize value={tabTitle} onChange={newValue => setTabTitle(newValue)} />

              <Link href={activeTab.url} target="_blank">
                {activeTab.url}
              </Link>

              <Button
                theme="solid"
                onClick={handleCreateLink}
                disabled={isCreatingLink || !tabTitle}
                style={{
                  marginTop: '2rem',
                }}
              >
                Save link to inbox
              </Button>

              {isCreationgSuccessful && <Typography.Text type="success">Saved!</Typography.Text>}
            </Flex>

            <Divider style={{ margin: '1rem 0' }} />

            <Flex direction="row" justify="end">
              <Button onClick={logoutEffect}>Log out</Button>
            </Flex>
          </>
        )}
      </>
    );
  }

  return (
    <div
      style={{
        minWidth: 200,
      }}
    >
      {renderContent()}
    </div>
  );
}

// Ensure mounting to the root element
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<Popup />);
} else {
  console.error('No root element found to mount React app.');
}
