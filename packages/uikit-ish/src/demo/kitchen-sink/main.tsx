import { FunctionComponent, useState } from 'react';

import {
  Button,
  Header,
  List,
  Navigation,
  Page,
  Symbol,
  TabBar,
  Toolbar,
  Viewport,
} from '../../components/index.js';
import {
  sfChevronBackward,
  sfEnvelope,
  sfGearshape,
} from '../tooling/icons.js';
import { ClientOnly } from '../tooling/shared/client-only.js';
import { useRawDocument } from '../tooling/shared/raw-document.js';

// The kitchen sink: the library's components in an app, as an app's
// structure nests them (no frame, controls or prose: as a raw demo is
// shown). Not exhaustive yet.

/** Its pages: their titles and the pages they drill into. */
const pages: Record<string, { children: string[]; title: string }> = {
  about: { children: [], title: 'About' },
  archive: { children: ['message'], title: 'Archive' },
  general: { children: ['about', 'update'], title: 'General' },
  inbox: { children: ['message'], title: 'Inbox' },
  location: { children: [], title: 'Location Services' },
  mail: { children: ['inbox', 'sent', 'archive'], title: 'Mailboxes' },
  message: { children: [], title: 'Message' },
  privacy: { children: ['location'], title: 'Privacy & Security' },
  sent: { children: ['message'], title: 'Sent' },
  settings: { children: ['general', 'privacy'], title: 'Settings' },
  update: { children: [], title: 'Software Update' },
};

/** Its tabs, each a stack of its own (from its root page): value, label, symbol. */
const tabs = [
  ['settings', 'Settings', sfGearshape],
  ['mail', 'Mail', sfEnvelope],
] as const;

type TabValue = (typeof tabs)[number][0];

/** The stacks, one per tab: their pages' keys, bottom to top. */
type Stacks = Record<TabValue, string[]>;

const rootStacks: Stacks = { mail: ['mail'], settings: ['settings'] };

/** Rows below each page's own, so every page scrolls. */
const fillerRows = 30;

/**
 * A page of a stack: its bar (the back button in it, below the root), its
 * large title, its rows drilling in, then enough rows to scroll.
 */
const StackPage: FunctionComponent<{
  depth: number;
  keys: readonly string[];
  onPush: (key: string) => void;
}> = ({ depth, keys, onPush }) => {
  const key = keys[depth] ?? '';
  const page = pages[key] ?? { children: [], title: key };

  return (
    <Header.Root>
      <Viewport.BlockStart>
        <Toolbar.Root placement="block-start">
          {depth > 0 ? (
            <Toolbar.Leading>
              <Navigation.Back
                aria-label={pages[keys[depth - 1] ?? '']?.title}
                render={<Toolbar.Button shape="circle" />}
              >
                <Button.Icon>
                  <Symbol icon={sfChevronBackward} />
                </Button.Icon>
              </Navigation.Back>
            </Toolbar.Leading>
          ) : null}
          <Toolbar.Title>
            <span>{page.title}</span>
          </Toolbar.Title>
        </Toolbar.Root>
      </Viewport.BlockStart>
      <Page.Root>
        <Viewport.Padding edge="block-start" />
        <Header.LargeTitle>
          <span>{page.title}</span>
        </Header.LargeTitle>
        <List.Root>
          {page.children.length > 0 ? (
            <List.Section>
              <List.Group>
                {page.children.map((child) => (
                  <List.Item key={child}>
                    <List.Content>
                      <List.Title
                        render={<button type="button" />}
                        onClick={() => onPush(child)}
                      >
                        {pages[child]?.title ?? child}
                      </List.Title>
                    </List.Content>
                    <List.Trailing>
                      <List.DrillIn />
                    </List.Trailing>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          ) : null}
          <List.Section>
            <List.Group>
              {Array.from({ length: fillerRows }, (_, index) => (
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
  );
};

/**
 * A tab bar app: each tab its own navigation stack, kept while switching;
 * its tab pressed again, back to its root.
 */
const App: FunctionComponent = () => {
  const [tab, setTab] = useState<TabValue>('settings');
  const [stacks, setStacks] = useState<Stacks>(rootStacks);

  const push = (value: TabValue, key: string) =>
    setStacks((current) => ({ ...current, [value]: [...current[value], key] }));
  const pop = (value: TabValue) =>
    setStacks((current) => ({
      ...current,
      [value]: current[value].slice(0, -1),
    }));
  const popToRoot = (value: TabValue) =>
    setStacks((current) => ({
      ...current,
      [value]: current[value].slice(0, 1),
    }));

  return (
    <Viewport.Provider>
      <TabBar.Root
        value={tab}
        onValueChange={(value: TabValue) => setTab(value)}
      >
        <Viewport.Content>
          {tabs.map(([value]) => (
            <TabBar.Panel
              key={value}
              keepMounted
              render={<Navigation.Root onBack={() => pop(value)} />}
              value={value}
            >
              <Navigation.SwipeArea />
              <Navigation.Stack>
                {stacks[value].map((key, depth) => (
                  <StackPage
                    key={key}
                    depth={depth}
                    keys={stacks[value]}
                    onPush={(child) => push(value, child)}
                  />
                ))}
              </Navigation.Stack>
            </TabBar.Panel>
          ))}
        </Viewport.Content>
        <Viewport.BlockEnd keyboard="cover">
          <TabBar.List>
            <TabBar.Group>
              <TabBar.Indicator />
              {tabs.map(([value, label, icon]) => (
                <TabBar.Tab
                  key={value}
                  value={value}
                  onClick={() => {
                    if (tab === value) popToRoot(value);
                  }}
                >
                  <TabBar.Icon>
                    <Symbol icon={icon} />
                  </TabBar.Icon>
                  <TabBar.Label>{label}</TabBar.Label>
                </TabBar.Tab>
              ))}
            </TabBar.Group>
          </TabBar.List>
        </Viewport.BlockEnd>
      </TabBar.Root>
    </Viewport.Provider>
  );
};

/** `/kitchen-sink`: the app, the page's own (see `useRawDocument`). */
export const KitchenSinkPage: FunctionComponent = () => {
  useRawDocument(true, 'Kitchen sink');

  return (
    <ClientOnly>
      <App />
    </ClientOnly>
  );
};
