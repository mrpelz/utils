import './style.css';

import { CSSProperties, FunctionComponent, useEffect, useState } from 'react';

import {
  Header,
  isIos27,
  List,
  Page,
  Toolbar,
  Viewport,
} from '../../components/index.js';
import { ClientOnly } from '../tooling/shared/client-only.js';
import { useRawDocument } from '../tooling/shared/raw-document.js';

// A demo page (`/ios27-status-bar`, added to the Home Screen as its own
// app, see scripts/demo-head.js): iOS 27 detected by the head, the app
// started below the status bar (see src/components/viewport/ios27.ts), its
// top bar's edge effect, unset, hard then (a solid bar, a line, beneath the
// system's opaque bar, in its color); else soft, under the status bar.

const title = 'iOS 27 Status Bar';

/** The page's backgrounds to try (Page's own, or a color of its own). */
const pageBackgrounds = {
  grouped: 'Grouped (Page’s own)',
  plain: 'Plain (Page’s own)',
  blue: 'Blue',
  green: 'Green',
  red: 'Red',
} as const;

type PageBackground = keyof typeof pageBackgrounds;

const pageColors: Partial<Record<PageBackground, string>> = {
  blue: 'light-dark(#c4dcf2, #10304a)',
  green: 'light-dark(#cdeccf, #123a1c)',
  red: '#ff3b30',
};

/** The document root's backgrounds to try (which iOS samples, if it). */
const rootBackgrounds = {
  unset: 'Unset',
  red: 'Red',
} as const;

type RootBackground = keyof typeof rootBackgrounds;

/** A choice kept (in local storage) across a reload. */
const useKept = <T extends string>(key: string, initial: T) => {
  const [value, setValue] = useState<T>(() => {
    try {
      return (
        (localStorage.getItem(`ios27-status-bar-${key}`) as T | null) ?? initial
      );
    } catch {
      return initial;
    }
  });
  const set = (next: T) => {
    setValue(next);
    try {
      localStorage.setItem(`ios27-status-bar-${key}`, next);
    } catch {
      // (Storage unavailable: not kept.)
    }
  };
  return [value, set] as const;
};

/** A native select (a demo's: no component of the library's). */
const Choice = <T extends string>({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: T) => void;
  options: Readonly<Record<T, string>>;
  value: T;
}) => (
  <label className="ios27-status-bar-choice">
    <span>{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.currentTarget.value as T)}
    >
      {(Object.keys(options) as T[]).map((key) => (
        <option
          key={key}
          value={key}
        >
          {options[key]}
        </option>
      ))}
    </select>
  </label>
);

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
  const [page, setPage] = useKept<PageBackground>('page', 'grouped');
  const [root, setRoot] = useKept<RootBackground>('root', 'unset');

  // The document root's background (to tell what iOS samples).
  useEffect(() => {
    const { style } = document.documentElement;
    if (root === 'red') style.backgroundColor = '#ff3b30';
    else style.removeProperty('background-color');
    return () => style.removeProperty('background-color');
  }, [root]);

  return (
    <Viewport.Provider>
      <Viewport.Content>
        <Header.Root>
          {/* (Its edge effect unset: on iOS 27 hard, see Viewport.) */}
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Title>
                <span>{title}</span>
              </Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Page.Root
            background={page === 'plain' ? 'plain' : 'grouped'}
            style={
              pageColors[page] === undefined
                ? undefined
                : ({ backgroundColor: pageColors[page] } as CSSProperties)
            }
          >
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
                    value={ios27 ? 'Hard (default on iOS 27)' : 'Soft'}
                  />
                  <Row
                    label="Home Screen app"
                    value={isInstalled() ? 'Yes' : 'No'}
                  />
                </List.Group>
              </List.Section>
              <List.Section>
                <List.Header>
                  <List.Title>Try</List.Title>
                </List.Header>
                <List.Block>
                  <div className="ios27-status-bar-choices">
                    <Choice
                      label="Page background"
                      options={pageBackgrounds}
                      value={page}
                      onChange={setPage}
                    />
                    <Choice
                      label="Document root background"
                      options={rootBackgrounds}
                      value={root}
                      onChange={setRoot}
                    />
                    <button
                      type="button"
                      onClick={() => location.reload()}
                    >
                      Reload (choices kept)
                    </button>
                  </div>
                  <p className="ios27-status-bar-text">
                    Change the page background: the status bar keeps the color
                    it had as the app loaded, and so does the top bar, now solid
                    with its line, even scrolled to the top. Reload: both take
                    the new color, the line showing only as content scrolls
                    under the bar. Set the document root to red: if the status
                    bar turns red, iOS takes the root’s color, not the page’s.
                  </p>
                </List.Block>
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
                    the same detection: its top bar’s edge effect, unset, is
                    hard beneath the system’s bar, its backing the status bar’s
                    color (the page’s as the app loaded, read once by iOS), so
                    the two bars match. Once the page’s color changes, the bar
                    stays solid, its line dividing the bars from the page.
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
