import './style.css';

import { FunctionComponent, useState } from 'react';

import {
  Header,
  List,
  Page,
  Toolbar,
  Viewport,
} from '../../components/index.js';
import { ClientOnly } from '../tooling/shared/client-only.js';
import { useRawDocument } from '../tooling/shared/raw-document.js';
import { isIos27 } from './detect.js';

// A demo page (`/ios27-status-bar`, added to the Home Screen as its own
// app, see scripts/demo-head.js): iOS 27 detected by the head, the app
// started below the status bar (see detect.ts), and the app's logic
// following it: its top edge effect hard (a solid bar, a line), beneath
// the system's opaque bar; else soft, under the status bar as usual.

const title = 'iOS 27 Status Bar';

const meta = (name: string) =>
  document
    .querySelector(`meta[name="${CSS.escape(name)}"]`)
    ?.getAttribute('content') ?? '(none)';

/** Safari's version (iOS 26 and later: the OS version frozen, see detect.ts). */
const safariVersion = () =>
  navigator.userAgent.split('Version/')[1]?.split(' ')[0] ?? '(none)';

const isInstalled = () =>
  matchMedia('(display-mode: standalone)').matches ||
  (navigator as { standalone?: boolean }).standalone === true;

/** A row: a label and its value. */
const Row: FunctionComponent<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <List.Item>
    <List.Content>
      <List.Title>
        <span className="ios27-status-bar-row">
          <span>{label}</span>
          <span className="ios27-status-bar-value">{value}</span>
        </span>
      </List.Title>
    </List.Content>
  </List.Item>
);

const App: FunctionComponent = () => {
  // (Decided by the head, as the page loaded: fixed.)
  const [ios27] = useState(isIos27);

  return (
    <Viewport.Provider>
      <Viewport.Content>
        <Header.Root>
          <Viewport.BlockStart edgeEffect={ios27 ? 'hard' : 'soft'}>
            <Toolbar.Root placement="block-start">
              <Toolbar.Title>
                <span>{title}</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root>
            <Viewport.Padding edge="block-start" />
            <List.Root>
              <List.Section>
                <List.Header>
                  <List.Title>Detected</List.Title>
                </List.Header>
                <List.Group>
                  <Row
                    label="iOS 27 or later"
                    value={ios27 ? 'Yes' : 'No'}
                  />
                  <Row
                    label="Safari version"
                    value={safariVersion()}
                  />
                  <Row
                    label="Status bar style"
                    value={meta('apple-mobile-web-app-status-bar-style')}
                  />
                  <Row
                    label="Top edge effect"
                    value={ios27 ? 'Hard' : 'Soft'}
                  />
                  <Row
                    label="Home Screen app"
                    value={isInstalled() ? 'Yes' : 'No'}
                  />
                </List.Group>
              </List.Section>
              <List.Section>
                <List.Header>
                  <List.Title>How It Works</List.Title>
                </List.Header>
                <List.Block>
                  <p className="ios27-status-bar-text">
                    On iOS 27, a Home Screen app under the status bar gets a
                    blur at its top, reaching down over its top bar. Detected as
                    the page loads, the status bar style is “default” instead:
                    the system draws its own opaque status bar, and the app
                    starts below it, so nothing of it is blurred. The app reads
                    the same detection and gives its top bar a hard edge effect
                    beneath the system’s bar.
                  </p>
                  <p className="ios27-status-bar-text">
                    iOS reads the status bar style when the app is added to the
                    Home Screen: an app added before updating to iOS 27 keeps
                    its old style until it’s removed and added again.
                  </p>
                </List.Block>
              </List.Section>
              <List.Section>
                <List.Header>
                  <List.Title>Content to Scroll</List.Title>
                </List.Header>
                <List.Group>
                  {Array.from({ length: 30 }, (_, index) => (
                    <List.Item key={index}>
                      <List.Content>
                        <List.Title>Row {index + 1}</List.Title>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding edge="block-end" />
          </Page.Root>
        </Header.Root>
      </Viewport.Content>
    </Viewport.Provider>
  );
};

/** `/ios27-status-bar`: the demo, the page's own (see `useRawDocument`). */
export const Ios27StatusBarPage: FunctionComponent = () => {
  useRawDocument(true, title);

  return (
    <ClientOnly>
      <App />
    </ClientOnly>
  );
};
