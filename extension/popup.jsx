import { Button, Divider, Form, Image, TextArea, Typography } from '@douyinfe/semi-ui';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useCat } from 'usecat';
import browser from 'webextension-polyfill';

import { Flex } from '../src/shared/semi/Flex';
import { Link } from '../src/shared/semi/Link';
import { PageLoading } from '../src/shared/semi/PageLoading';
import { bgActions } from './lib/constants';
import {
  authErrorCat,
  isInitingCat,
  isLoggedInCat,
  isSigningInCat,
  isVerifying2FACat,
  twoFATempCodeCat,
} from './store/auth/authCats';
import { initEffect, logoutEffect, signInEffect, verify2FAEffect } from './store/auth/authEffects';
import { isCreateLinkSuccessfulCat, isCreatingLinkCat } from './store/link/linkCats';

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await browser.tabs.query(queryOptions);
  return tab;
}

function Popup() {
  const isIniting = useCat(isInitingCat);
  const isSigningIn = useCat(isSigningInCat);
  const errorMessage = useCat(authErrorCat);
  const twoFATempCode = useCat(twoFATempCodeCat);
  const isVerifying2FA = useCat(isVerifying2FACat);
  const isLoggedIn = useCat(isLoggedInCat);
  const isCreatingLink = useCat(isCreatingLinkCat);
  const isCreationgSuccessful = useCat(isCreateLinkSuccessfulCat);

  const [activeTab, setActiveTab] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFACode, setTwoFACode] = useState('');

  const [tabTitle, setTabTitle] = useState('');

  const isDisabled = !email || !password || isSigningIn;
  const isDisabled2FA = !twoFACode || isVerifying2FA;

  function handleSignin() {
    if (isDisabled) {
      return;
    }

    signInEffect(email, password);
  }

  function handleVerifyCode() {
    if (isDisabled2FA) {
      return;
    }

    verify2FAEffect(twoFACode);
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
      if (twoFATempCode) {
        return (
          <>
            <Typography.Paragraph>Enter the code from your authenticator app</Typography.Paragraph>

            <Form onSubmit={handleVerifyCode} style={{ marginTop: '1rem' }}>
              <Form.Input
                type="text"
                field="code"
                label="Code"
                placeholder="Code"
                value={twoFACode}
                onChange={setTwoFACode}
              />

              <Flex m="1rem 0 0">
                <Button htmlType="submit" theme="solid" disabled={isDisabled2FA}>
                  Verify
                </Button>

                {!!errorMessage && <Typography.Text type="danger">{errorMessage}</Typography.Text>}

                <Button
                  onClick={() => {
                    twoFATempCodeCat.set('');
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  Cancel
                </Button>
              </Flex>
            </Form>
          </>
        );
      }

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
              <Image src="/icons/icon-192.png" width={32} height={32} />
              <Typography.Title heading={4}>Save current tab</Typography.Title>

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

            <Flex direction="row" justify="between" align="center" gap="0.5rem">
              <a href="https://app.easyy.click/inbox" target="_blank">
                <Button>Open Inbox</Button>
              </a>
              <Button theme="outline" onClick={logoutEffect}>
                Log out
              </Button>
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
