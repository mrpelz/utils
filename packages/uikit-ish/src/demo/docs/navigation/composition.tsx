import { FunctionComponent, useState } from 'react';

import {
  Button,
  Header,
  Layout,
  List,
  Navigation,
  type NavigationBackEventDetails,
  Page,
  Sidebar,
  Symbol,
  TabBar,
  Toolbar,
  useSizeClass,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfChevronBackward } from '../../tooling/icons.js';
import { GuideLink } from '../hig-guide/link.js';
import { pages, sections, type SectionValue } from './content.js';
import { propOptionsAdaptiveContent } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const perTabCode = `// The tabs: value, label.
const tabs = [
  ['settings', 'Settings'],
  ['mail', 'Mail'],
];
const [tab, setTab] = useState('settings');
// Each tab's stack, kept while another tab is shown.
const [stacks, setStacks] = useState({
  settings: ['settings'],
  mail: ['mail'],
});
const pop = (value) =>
  setStacks((current) => ({
    ...current,
    [value]: current[value].slice(0, -1),
  }));
// Back to its root page: cut back to its first key (one transition).
const popToRoot = (value) =>
  setStacks((current) => ({
    ...current,
    [value]: current[value].slice(0, 1),
  }));

<TabBar.Root value={tab} onValueChange={setTab}>
  <Viewport.Content>
    {tabs.map(([value]) => (
      <TabBar.Panel
        key={value}
        keepMounted
        value={value}
        render={<Navigation.Root onBack={() => pop(value)} />}
      >
        <Navigation.SwipeArea />
        <Navigation.Stack>
          {stacks[value].map((key, index) => (
            <Header.Root key={key}>
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  {/* Each pushed page's: staying put between them. */}
                  {index > 0 ? (
                    <Toolbar.Leading>
                      <Navigation.Back render={<Toolbar.Button shape="circle" />}>
                        …
                      </Navigation.Back>
                    </Toolbar.Leading>
                  ) : null}
                  <Toolbar.Title>…</Toolbar.Title>
                </Toolbar.Root>
              </Viewport.BlockStart>
              …
            </Header.Root>
          ))}
        </Navigation.Stack>
      </TabBar.Panel>
    ))}
  </Viewport.Content>
  <Viewport.BlockEnd>
    <TabBar.List>
      <TabBar.Group>
        <TabBar.Indicator />
        {tabs.map(([value]) => (
          <TabBar.Tab
            key={value}
            value={value}
            // Pressed again (already selected): its stack back to its root.
            onClick={() => {
              if (tab === value) popToRoot(value);
            }}
          >
            …
          </TabBar.Tab>
        ))}
      </TabBar.Group>
    </TabBar.List>
  </Viewport.BlockEnd>
</TabBar.Root>`;

const sidebarCode = `const [section, setSection] = useState('settings');
// Each section's stack, kept while another is shown.
const [stacks, setStacks] = useState({
  settings: ['settings'],
  mail: ['mail'],
});
const pop = () =>
  setStacks((current) => ({
    ...current,
    [section]: current[section].slice(0, -1),
  }));
const popToRoot = (value) =>
  setStacks((current) => ({
    ...current,
    [value]: current[value].slice(0, 1),
  }));

<Layout.Root>
  <Layout.Column floating aria-label="Sidebar" defaultSize={280}>
    <Sidebar.Root>
      <List.Root listStyle="sidebar">
        <List.Section>
          <List.Group>
            <List.Item selected={section === 'settings'}>
              <List.Leading>
                <List.Image variant="symbol">…</List.Image>
              </List.Leading>
              <List.Content>
                <List.Title
                  render={<button type="button" />}
                  onClick={() => {
                    // Pressed again (already selected): back to its root.
                    if (section === 'settings') popToRoot('settings');
                    else setSection('settings');
                  }}
                >
                  Settings
                </List.Title>
              </List.Content>
            </List.Item>
            …
          </List.Group>
        </List.Section>
      </List.Root>
    </Sidebar.Root>
  </Layout.Column>
  <Layout.Column clearFloating>
    {/* The selected section's stack. */}
    <Navigation.Root onBack={pop}>
      <Navigation.SwipeArea />
      <Navigation.Stack>
        {stacks[section].map((key, index) => (
          <Header.Root key={key}>
            <Viewport.BlockStart>
              <Toolbar.Root placement="block-start">
                {/* Each pushed page's: staying put between them. */}
                {index > 0 ? (
                  <Toolbar.Leading>
                    <Navigation.Back … />
                  </Toolbar.Leading>
                ) : null}
                <Toolbar.Title>…</Toolbar.Title>
              </Toolbar.Root>
            </Viewport.BlockStart>
            …
          </Header.Root>
        ))}
      </Navigation.Stack>
    </Navigation.Root>
  </Layout.Column>
</Layout.Root>`;

const popToRootCode = `const [keys, setKeys] = useState(['settings', 'general', 'about']);
const pop = () => setKeys((current) => current.slice(0, -1));

<Navigation.Root onBack={pop}>
  <Navigation.SwipeArea />
  <Navigation.Stack>
    {keys.map((key, index) => (
      <Header.Root key={key}>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            {index > 0 ? (
              <Toolbar.Leading>
                <Navigation.Back … />
              </Toolbar.Leading>
            ) : null}
            <Toolbar.Title>…</Toolbar.Title>
            {index > 0 ? (
              <Toolbar.Trailing>
                {/* Cut back to the root: popped in one transition. On every
                   pushed page, staying put between them (as the back
                   button). */}
                <Navigation.Persistent
                  persistentId="done"
                  render={<Toolbar.Button />}
                  onClick={() => setKeys(keys.slice(0, 1))}
                >
                  <Button.Label>Done</Button.Label>
                </Navigation.Persistent>
              </Toolbar.Trailing>
            ) : null}
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root>…</Page.Root>
      </Header.Root>
    ))}
  </Navigation.Stack>
</Navigation.Root>`;

const deepCode = `// Levels 1 to 8 deep, each page its level.
const [keys, setKeys] = useState(['1', '2', '3', '4', '5', '6', '7', '8']);
const push = (count) =>
  setKeys((current) => [
    ...current,
    ...Array.from({ length: count }, (_, index) =>
      String(current.length + index + 1),
    ),
  ]);
const pop = () => setKeys((current) => current.slice(0, -1));

<Navigation.Root onBack={pop}>
  <Navigation.SwipeArea />
  <Navigation.Stack>
    {keys.map((key, index) => (
      <Header.Root key={key}>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            {/* Pressed again while going back: further back, each press
               its own transition (a cascade). */}
            {index > 0 ? (
              <Toolbar.Leading>
                <Navigation.Back
                  aria-label={\`Level \${keys[index - 1]}\`}
                  render={<Toolbar.Button shape="circle" />}
                >
                  …
                </Navigation.Back>
              </Toolbar.Leading>
            ) : null}
            <Toolbar.Title>
              <span>Level {key}</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root>…{/* rows pushing 1 and 5 levels */}</Page.Root>
      </Header.Root>
    ))}
  </Navigation.Stack>
</Navigation.Root>`;

const largeTitlesCode = `// Each page: its title.
const pages = {
  settings: { title: 'Settings' },
  general: { title: 'General' },
  about: { title: 'About' },
  mail: { title: 'Mailboxes' },
};
const [keys, setKeys] = useState(['settings']);
const pop = () => setKeys((current) => current.slice(0, -1));

<Navigation.Root onBack={pop}>
  <Navigation.SwipeArea />
  <Navigation.Stack>
    {keys.map((key, depth) => (
      <Header.Root key={key}>
        {/* Each page's bar: its title, moving with it; its back button,
           staying put between pushed pages. */}
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            {depth > 0 ? (
              <Toolbar.Leading>
                <Navigation.Back … />
              </Toolbar.Leading>
            ) : null}
            <Toolbar.Title>
              <span>{pages[key].title}</span>
            </Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root>
          <Viewport.Padding edge="block-start" />
          {/* The root page's large title; the pages pushed on it, the bar's. */}
          {depth === 0 ? (
            <Header.LargeTitle>
              <span>{pages[key].title}</span>
            </Header.LargeTitle>
          ) : null}
          …
          <Viewport.Padding edge="block-end" />
        </Page.Root>
      </Header.Root>
    ))}
  </Navigation.Stack>
</Navigation.Root>`;

const adaptiveCode = `// Compact (a phone) or regular (a tablet), by the window's width.
const isCompact = useSizeClass() === 'compact';

// The sections: value, label.
const sections = [
  ['settings', 'Settings'],
  ['mail', 'Mail'],
];
const [section, setSection] = useState('settings');
// Compact: whether the section is opened (pushed on the sections).
const [isOpened, setIsOpened] = useState(false);
// Each section's stack, kept while another is shown.
const [stacks, setStacks] = useState({
  settings: ['settings'],
  mail: ['mail'],
});
const open = (value) => {
  setSection(value);
  setIsOpened(true);
};
// Its root popped (compact): back to the sections.
const pop = () =>
  stacks[section].length > 1
    ? setStacks((current) => ({
        ...current,
        [section]: current[section].slice(0, -1),
      }))
    : setIsOpened(false);
const popToRoot = (value) =>
  setStacks((current) => ({
    ...current,
    [value]: current[value].slice(0, 1),
  }));

// Compact (a phone): the sections are the stack's root page, drilled into.
const keys = isOpened ? ['sections', ...stacks[section]] : ['sections'];

isCompact ? (
  <Navigation.Root onBack={pop}>
    <Navigation.SwipeArea />
    <Navigation.Stack>
      {keys.map((key, index) => (
        <Header.Root key={key}>
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              {/* Each page's own (not the root's): sliding in with the
                 first, staying put on deeper pages (a persistent item). */}
              {index > 0 ? (
                <Toolbar.Leading>
                  <Navigation.Back … />
                </Toolbar.Leading>
              ) : null}
              <Toolbar.Title>…</Toolbar.Title>
            </Toolbar.Root>
          </Viewport.BlockStart>
          …
        </Header.Root>
      ))}
    </Navigation.Stack>
  </Navigation.Root>
) : (
  // Regular (a tablet): the sections in a sidebar, the stack beside it.
  <Layout.Root>
    <Layout.Column floating aria-label="Sidebar" defaultSize={280}>
      <Sidebar.Root>
        <List.Root listStyle="sidebar">
          <List.Section>
            <List.Group>
              {sections.map(([value, label]) => (
                <List.Item key={value} selected={section === value}>
                  <List.Content>
                    <List.Title
                      render={<button type="button" />}
                      onClick={() => {
                        // Pressed again (already selected): back to its root.
                        if (section === value) popToRoot(value);
                        else open(value);
                      }}
                    >
                      {label}
                    </List.Title>
                  </List.Content>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
      </Sidebar.Root>
    </Layout.Column>
    <Layout.Column clearFloating>
      <Navigation.Root onBack={pop}>…</Navigation.Root>
    </Layout.Column>
  </Layout.Root>
)`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** The stacks, one per section: their pages' keys, bottom to top. */
type Stacks = Record<SectionValue, string[]>;

const rootStacks: Stacks = { mail: ['mail'], settings: ['settings'] };

/**
 * A tab bar app: each tab its own stack, kept while switching; its tab
 * pressed again, back to its root.
 */
const PerTab: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [tab, setTab] = useState<SectionValue>('settings');
  const [stacks, setStacks] = useState<Stacks>(rootStacks);
  const push = (section: SectionValue, key: string) => {
    addLog(`push: ${section}/${key}`);
    setStacks((current) => ({
      ...current,
      [section]: [...current[section], key],
    }));
  };
  const pop = (section: SectionValue) => {
    addLog(`pop: ${section}`);
    setStacks((current) => ({
      ...current,
      [section]: current[section].slice(0, -1),
    }));
  };
  const popToRoot = (section: SectionValue) => {
    addLog(`pop to root: ${section}`);
    setStacks((current) => ({
      ...current,
      [section]: current[section].slice(0, 1),
    }));
  };

  return (
    <Component
      isInline
      id="navigation-composition-tabs"
      log={log}
      stage="phone"
      title="Navigation per tab"
    >
      <TabBar.Root
        value={tab}
        onValueChange={(value: SectionValue) => {
          addLog(`tab: ${value}`);
          setTab(value);
        }}
      >
        <Viewport.Content>
          {sections.map(([section]) => (
            <TabBar.Panel
              key={section}
              keepMounted
              render={<Navigation.Root onBack={() => pop(section)} />}
              value={section}
            >
              <Navigation.SwipeArea />
              <Navigation.Stack>
                {stacks[section].map((key, index) => (
                  <Header.Root key={key}>
                    <Viewport.BlockStart>
                      <Toolbar.Root placement="block-start">
                        {index > 0 ? (
                          <Toolbar.Leading>
                            <Navigation.Back
                              render={<Toolbar.Button shape="circle" />}
                              aria-label={
                                pages[stacks[section][index - 1] ?? '']?.title
                              }
                            >
                              <Button.Icon>
                                <Symbol icon={sfChevronBackward} />
                              </Button.Icon>
                            </Navigation.Back>
                          </Toolbar.Leading>
                        ) : null}
                        <Toolbar.Title>
                          <span>{pages[key]?.title}</span>
                        </Toolbar.Title>
                      </Toolbar.Root>
                    </Viewport.BlockStart>
                    <Page.Root>
                      <Viewport.Padding edge="block-start" />
                      <List.Root>
                        <List.Section>
                          <List.Group>
                            {pages[key]?.children.map((child) => (
                              <List.Item key={child}>
                                <List.Content>
                                  <List.Title
                                    render={<button type="button" />}
                                    onClick={() => push(section, child)}
                                  >
                                    {pages[child]?.title}
                                  </List.Title>
                                </List.Content>
                                <List.Trailing>
                                  <List.DrillIn />
                                </List.Trailing>
                              </List.Item>
                            ))}
                          </List.Group>
                        </List.Section>
                      </List.Root>
                      <Viewport.Padding edge="block-end" />
                    </Page.Root>
                  </Header.Root>
                ))}
              </Navigation.Stack>
            </TabBar.Panel>
          ))}
        </Viewport.Content>
        <Viewport.BlockEnd keyboard="cover">
          <TabBar.List>
            <TabBar.Group>
              <TabBar.Indicator />
              {sections.map(([section, label, icon]) => (
                <TabBar.Tab
                  key={section}
                  value={section}
                  onClick={() => {
                    if (tab === section) popToRoot(section);
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
    </Component>
  );
};

/** A tablet: the sidebar picks a section, its stack beside it. */
const WithSidebar: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [section, setSection] = useState<SectionValue>('settings');
  const [stacks, setStacks] = useState<Stacks>(rootStacks);
  const keys = stacks[section];
  // Its sidebar row pressed again (already selected): its stack back to its
  // root; otherwise, switched to.
  const select = (value: SectionValue) => {
    if (value !== section) {
      addLog(`section: ${value}`);
      setSection(value);
      return;
    }
    addLog(`pop to root: ${value}`);
    setStacks((current) => ({
      ...current,
      [value]: current[value].slice(0, 1),
    }));
  };
  const push = (key: string) => {
    addLog(`push: ${section}/${key}`);
    setStacks((current) => ({
      ...current,
      [section]: [...current[section], key],
    }));
  };
  const pop = () => {
    addLog(`pop: ${section}`);
    setStacks((current) => ({
      ...current,
      [section]: current[section].slice(0, -1),
    }));
  };

  return (
    <Component
      isExpanded
      isInline
      id="navigation-composition-sidebar"
      log={log}
      stage="tablet"
      title="Navigation beside a sidebar"
    >
      <Viewport.Content>
        <Layout.Root>
          <Layout.Column
            floating
            aria-label="Sidebar"
            defaultSize={280}
          >
            <Sidebar.Root>
              <List.Root listStyle="sidebar">
                <List.Section>
                  <List.Group>
                    {sections.map(([value, label, icon]) => (
                      <List.Item
                        key={value}
                        selected={section === value}
                      >
                        <List.Leading>
                          <List.Image variant="symbol">
                            <Symbol icon={icon} />
                          </List.Image>
                        </List.Leading>
                        <List.Content>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => select(value)}
                          >
                            {label}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
            </Sidebar.Root>
          </Layout.Column>
          <Layout.Column clearFloating>
            <Navigation.Root onBack={pop}>
              <Navigation.SwipeArea />
              <Navigation.Stack>
                {keys.map((key, index) => (
                  <Header.Root key={key}>
                    <Viewport.BlockStart>
                      <Toolbar.Root placement="block-start">
                        {index > 0 ? (
                          <Toolbar.Leading>
                            <Navigation.Back
                              aria-label={pages[keys[index - 1] ?? '']?.title}
                              render={<Toolbar.Button shape="circle" />}
                            >
                              <Button.Icon>
                                <Symbol icon={sfChevronBackward} />
                              </Button.Icon>
                            </Navigation.Back>
                          </Toolbar.Leading>
                        ) : null}
                        <Toolbar.Title>
                          <span>{pages[key]?.title}</span>
                        </Toolbar.Title>
                      </Toolbar.Root>
                    </Viewport.BlockStart>
                    <Page.Root>
                      <Viewport.Padding edge="block-start" />
                      <List.Root>
                        <List.Section>
                          <List.Group>
                            {pages[key]?.children.map((child) => (
                              <List.Item key={child}>
                                <List.Content>
                                  <List.Title
                                    render={<button type="button" />}
                                    onClick={() => push(child)}
                                  >
                                    {pages[child]?.title}
                                  </List.Title>
                                </List.Content>
                                <List.Trailing>
                                  <List.DrillIn />
                                </List.Trailing>
                              </List.Item>
                            ))}
                          </List.Group>
                        </List.Section>
                      </List.Root>
                      <Viewport.Padding edge="block-end" />
                    </Page.Root>
                  </Header.Root>
                ))}
              </Navigation.Stack>
            </Navigation.Root>
          </Layout.Column>
        </Layout.Root>
      </Viewport.Content>
    </Component>
  );
};

/** Deep in a stack, Done pops back to its root in one transition. */
const PopToRoot: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [keys, setKeys] = useState(['settings', 'general', 'about']);
  const push = (key: string) => {
    addLog(`push: ${key}`);
    setKeys((current) => [...current, key]);
  };
  const pop = () => {
    addLog('pop');
    setKeys((current) => current.slice(0, -1));
  };

  return (
    <Component
      isInline
      id="navigation-composition-pop-to-root"
      log={log}
      stage="phone"
      title="Navigation popping to its root"
    >
      <Viewport.Content>
        <Navigation.Root onBack={pop}>
          <Navigation.SwipeArea />
          <Navigation.Stack>
            {keys.map((key, index) => (
              <Header.Root key={key}>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    {index > 0 ? (
                      <Toolbar.Leading>
                        <Navigation.Back
                          aria-label={pages[keys[index - 1] ?? '']?.title}
                          render={<Toolbar.Button shape="circle" />}
                        >
                          <Button.Icon>
                            <Symbol icon={sfChevronBackward} />
                          </Button.Icon>
                        </Navigation.Back>
                      </Toolbar.Leading>
                    ) : null}
                    <Toolbar.Title>
                      <span>{pages[key]?.title}</span>
                    </Toolbar.Title>
                    {/* Done, as the back button: on every pushed page,
                       staying put between them (a persistent item). */}
                    {index > 0 ? (
                      <Toolbar.Trailing>
                        <Navigation.Persistent
                          persistentId="done"
                          render={<Toolbar.Button />}
                          onClick={() => {
                            addLog('pop to root');
                            setKeys((current) => current.slice(0, 1));
                          }}
                        >
                          <Button.Label>Done</Button.Label>
                        </Navigation.Persistent>
                      </Toolbar.Trailing>
                    ) : null}
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root>
                  <Viewport.Padding edge="block-start" />
                  <List.Root>
                    <List.Section>
                      <List.Group>
                        {pages[key]?.children.map((child) => (
                          <List.Item key={child}>
                            <List.Content>
                              <List.Title
                                render={<button type="button" />}
                                onClick={() => push(child)}
                              >
                                {pages[child]?.title}
                              </List.Title>
                            </List.Content>
                            <List.Trailing>
                              <List.DrillIn />
                            </List.Trailing>
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  </List.Root>
                  <Viewport.Padding edge="block-end" />
                </Page.Root>
              </Header.Root>
            ))}
          </Navigation.Stack>
        </Navigation.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The root page with a large title, the pages pushed on it without. */
/** Levels deep: going back quickly, pressing back again mid-transition. */
const Deep: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [keys, setKeys] = useState(() =>
    Array.from({ length: 8 }, (_, index) => String(index + 1)),
  );
  const push = (count: number) => {
    addLog(`push: ${String(count)}`);
    setKeys((current) => [
      ...current,
      ...Array.from({ length: count }, (_, index) =>
        String(current.length + index + 1),
      ),
    ]);
  };
  const pop = ({ reason }: NavigationBackEventDetails) => {
    addLog(`pop (${reason})`);
    setKeys((current) => current.slice(0, -1));
  };

  return (
    <Component
      isInline
      id="navigation-composition-deep"
      log={log}
      stage="phone"
      title="Navigation, levels deep"
    >
      <Viewport.Content>
        <Navigation.Root onBack={pop}>
          <Navigation.SwipeArea />
          <Navigation.Stack>
            {keys.map((key, index) => (
              <Header.Root key={key}>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    {index > 0 ? (
                      <Toolbar.Leading>
                        <Navigation.Back
                          aria-label={`Level ${keys[index - 1] ?? ''}`}
                          render={<Toolbar.Button shape="circle" />}
                        >
                          <Button.Icon>
                            <Symbol icon={sfChevronBackward} />
                          </Button.Icon>
                        </Navigation.Back>
                      </Toolbar.Leading>
                    ) : null}
                    <Toolbar.Title>
                      <span>Level {key}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root>
                  <Viewport.Padding edge="block-start" />
                  <List.Root>
                    <List.Section>
                      <List.Group>
                        {[1, 5].map((count) => (
                          <List.Item key={count}>
                            <List.Content>
                              <List.Title
                                render={<button type="button" />}
                                onClick={() => push(count)}
                              >
                                {count === 1
                                  ? `Level ${String(index + 2)}`
                                  : `${String(count)} levels deeper`}
                              </List.Title>
                            </List.Content>
                            <List.Trailing>
                              <List.DrillIn />
                            </List.Trailing>
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  </List.Root>
                  <Viewport.Padding edge="block-end" />
                </Page.Root>
              </Header.Root>
            ))}
          </Navigation.Stack>
        </Navigation.Root>
      </Viewport.Content>
    </Component>
  );
};

const LargeTitles: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [keys, setKeys] = useState(['settings']);
  const push = (key: string) => {
    addLog(`push: ${key}`);
    setKeys((current) => [...current, key]);
  };
  const pop = () => {
    addLog('pop');
    setKeys((current) => current.slice(0, -1));
  };

  return (
    <Component
      isInline
      id="navigation-composition-large-titles"
      log={log}
      stage="phone"
      title="Navigation with large titles"
    >
      <Viewport.Content>
        <Navigation.Root onBack={pop}>
          <Navigation.SwipeArea />
          <Navigation.Stack>
            {keys.map((key, depth) => (
              <Header.Root key={key}>
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
                      <span>{pages[key]?.title}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root>
                  <Viewport.Padding edge="block-start" />
                  {depth === 0 ? (
                    <Header.LargeTitle>
                      <span>{pages[key]?.title}</span>
                    </Header.LargeTitle>
                  ) : null}

                  <List.Root>
                    <List.Section>
                      <List.Group>
                        {pages[key]?.children.map((child) => (
                          <List.Item key={child}>
                            <List.Content>
                              <List.Title
                                render={<button type="button" />}
                                onClick={() => push(child)}
                              >
                                {pages[child]?.title}
                              </List.Title>
                            </List.Content>
                            <List.Trailing>
                              <List.DrillIn />
                            </List.Trailing>
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  </List.Root>
                  <Viewport.Padding edge="block-end" />
                </Page.Root>
              </Header.Root>
            ))}
          </Navigation.Stack>
        </Navigation.Root>
      </Viewport.Content>
    </Component>
  );
};

/**
 * By the window's width: compact (a phone), the sections drilled into as
 * the stack's root page; regular (a tablet), in a sidebar beside the stack
 * (inside a provider tracking the visual viewport, see `Adaptive`).
 */
const Adaptive: FunctionComponent = () => {
  const id = 'navigation-composition-adaptive';
  const [log, addLog] = useLog();
  const [externalContent] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsAdaptiveContent,
    { external: externalContent, isOpen: true, title: '[content]' },
  );
  const sizeClass = useSizeClass();
  // (Unset, by the window's width; or as a phone's, or a tablet's.)
  const isCompact =
    content.layout === undefined
      ? sizeClass === 'compact'
      : content.layout === 'phone';
  const [section, setSection] = useState<SectionValue>('settings');
  // Compact: whether the section is opened (pushed on the sections).
  const [isOpened, setIsOpened] = useState(false);
  const [stacks, setStacks] = useState<Stacks>(rootStacks);
  const stack = stacks[section];
  const keys = isOpened ? ['sections', ...stack] : ['sections'];
  const open = (value: SectionValue) => {
    addLog(`section: ${value}`);
    setSection(value);
    setIsOpened(true);
  };
  // Regular: its sidebar row pressed again (already selected), its stack
  // back to its root; otherwise, opened.
  const select = (value: SectionValue) => {
    if (value !== section) {
      open(value);
      return;
    }
    addLog(`pop to root: ${value}`);
    setStacks((current) => ({
      ...current,
      [value]: current[value].slice(0, 1),
    }));
  };
  const push = (key: string) => {
    addLog(`push: ${section}/${key}`);
    setStacks((current) => ({
      ...current,
      [section]: [...current[section], key],
    }));
  };
  const pop = () => {
    addLog(`pop: ${section}`);
    if (stack.length > 1) {
      setStacks((current) => ({
        ...current,
        [section]: current[section].slice(0, -1),
      }));
    } else {
      setIsOpened(false);
    }
  };

  return (
    <Component
      isExpanded
      isInline
      controls={[controlContent]}
      id={id}
      log={log}
      stage={isCompact ? 'phone' : 'tablet'}
      state={[stateContent]}
      title="Navigation, compact or beside a sidebar"
    >
      {isCompact ? (
        <Viewport.Content>
          <Navigation.Root onBack={pop}>
            <Navigation.SwipeArea />
            <Navigation.Stack>
              {keys.map((key, index) =>
                key === 'sections' ? (
                  <Header.Root key={key}>
                    <Viewport.BlockStart>
                      <Toolbar.Root placement="block-start">
                        <Toolbar.Title>
                          <span>Apps</span>
                        </Toolbar.Title>
                      </Toolbar.Root>
                    </Viewport.BlockStart>
                    <Page.Root>
                      <Viewport.Padding edge="block-start" />
                      <Header.LargeTitle>
                        <span>Apps</span>
                      </Header.LargeTitle>

                      <List.Root>
                        <List.Section>
                          <List.Group>
                            {sections.map(([value, label, icon]) => (
                              <List.Item key={value}>
                                <List.Leading>
                                  <List.Image variant="symbol">
                                    <Symbol icon={icon} />
                                  </List.Image>
                                </List.Leading>
                                <List.Content>
                                  <List.Title
                                    render={<button type="button" />}
                                    onClick={() => open(value)}
                                  >
                                    {label}
                                  </List.Title>
                                </List.Content>
                                <List.Trailing>
                                  <List.DrillIn />
                                </List.Trailing>
                              </List.Item>
                            ))}
                          </List.Group>
                        </List.Section>
                      </List.Root>
                      <Viewport.Padding edge="block-end" />
                    </Page.Root>
                  </Header.Root>
                ) : (
                  <Header.Root key={key}>
                    <Viewport.BlockStart>
                      <Toolbar.Root placement="block-start">
                        {/* In each page's bar: sliding with the first page
                           to have one, staying put on deeper ones (see
                           Navigation.Persistent). */}
                        <Toolbar.Leading>
                          <Navigation.Back
                            render={<Toolbar.Button shape="circle" />}
                            aria-label={
                              index === 1
                                ? 'Apps'
                                : pages[keys[index - 1] ?? '']?.title
                            }
                          >
                            <Button.Icon>
                              <Symbol icon={sfChevronBackward} />
                            </Button.Icon>
                          </Navigation.Back>
                        </Toolbar.Leading>
                        <Toolbar.Title>
                          <span>{pages[key]?.title}</span>
                        </Toolbar.Title>
                      </Toolbar.Root>
                    </Viewport.BlockStart>
                    <Page.Root>
                      <Viewport.Padding edge="block-start" />
                      <List.Root>
                        <List.Section>
                          <List.Group>
                            {pages[key]?.children.map((child) => (
                              <List.Item key={child}>
                                <List.Content>
                                  <List.Title
                                    render={<button type="button" />}
                                    onClick={() => push(child)}
                                  >
                                    {pages[child]?.title}
                                  </List.Title>
                                </List.Content>
                                <List.Trailing>
                                  <List.DrillIn />
                                </List.Trailing>
                              </List.Item>
                            ))}
                          </List.Group>
                        </List.Section>
                      </List.Root>
                      <Viewport.Padding edge="block-end" />
                    </Page.Root>
                  </Header.Root>
                ),
              )}
            </Navigation.Stack>
          </Navigation.Root>
        </Viewport.Content>
      ) : (
        <Viewport.Content>
          <Layout.Root>
            <Layout.Column
              floating
              aria-label="Sidebar"
              defaultSize={280}
            >
              <Sidebar.Root>
                <List.Root listStyle="sidebar">
                  <List.Section>
                    <List.Group>
                      {sections.map(([value, label, icon]) => (
                        <List.Item
                          key={value}
                          selected={section === value}
                        >
                          <List.Leading>
                            <List.Image variant="symbol">
                              <Symbol icon={icon} />
                            </List.Image>
                          </List.Leading>
                          <List.Content>
                            <List.Title
                              render={<button type="button" />}
                              onClick={() => select(value)}
                            >
                              {label}
                            </List.Title>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
              </Sidebar.Root>
            </Layout.Column>
            <Layout.Column clearFloating>
              <Navigation.Root onBack={pop}>
                <Navigation.SwipeArea />
                <Navigation.Stack>
                  {stack.map((key, index) => (
                    <Header.Root key={key}>
                      <Viewport.BlockStart>
                        <Toolbar.Root placement="block-start">
                          {index > 0 ? (
                            <Toolbar.Leading>
                              <Navigation.Back
                                render={<Toolbar.Button shape="circle" />}
                                aria-label={
                                  pages[stack[index - 1] ?? '']?.title
                                }
                              >
                                <Button.Icon>
                                  <Symbol icon={sfChevronBackward} />
                                </Button.Icon>
                              </Navigation.Back>
                            </Toolbar.Leading>
                          ) : null}
                          <Toolbar.Title>
                            <span>{pages[key]?.title}</span>
                          </Toolbar.Title>
                        </Toolbar.Root>
                      </Viewport.BlockStart>
                      <Page.Root>
                        <Viewport.Padding edge="block-start" />
                        <List.Root>
                          <List.Section>
                            <List.Group>
                              {pages[key]?.children.map((child) => (
                                <List.Item key={child}>
                                  <List.Content>
                                    <List.Title
                                      render={<button type="button" />}
                                      onClick={() => push(child)}
                                    >
                                      {pages[child]?.title}
                                    </List.Title>
                                  </List.Content>
                                  <List.Trailing>
                                    <List.DrillIn />
                                  </List.Trailing>
                                </List.Item>
                              ))}
                            </List.Group>
                          </List.Section>
                        </List.Root>
                        <Viewport.Padding edge="block-end" />
                      </Page.Root>
                    </Header.Root>
                  ))}
                </Navigation.Stack>
              </Navigation.Root>
            </Layout.Column>
          </Layout.Root>
        </Viewport.Content>
      )}
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const pageSections: readonly Section[] = [
  ['a-stack-per-tab', 'A stack per tab'],
  ['beside-a-sidebar', 'Beside a sidebar'],
  ['popping-to-the-root', 'Popping to the root'],
  ['going-back-quickly', 'Going back quickly'],
  ['large-titles', 'Large titles'],
  ['compact-or-regular', 'Compact or regular'],
];

/** `/navigation/composition`: stacks in tab bars, layouts, and pages. */
export const NavigationComposition: FunctionComponent = () => (
  <>
    <Contents sections={pageSections} />
    <ul className="demo-lead">
      <li>
        A navigation holds pages (a <a href="page">Page</a> with a{' '}
        <a href="header">Header</a> each); it’s held by what switches between
        sections (a <a href="tab-bar">Tab bar</a>, a{' '}
        <a href="sidebar">Sidebar</a>
        ).
      </li>
      <li>
        Drilling in: a row’s title as a button, with a{' '}
        <PartLink
          component="list"
          part="List.DrillIn"
        />{' '}
        chevron (see <a href="list/composition#drilling-into-pages">List</a>).
      </li>
      <li>
        In each: the pages in its{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        , each page’s bar (its title) moving with it; in each pushed page’s bar,
        the{' '}
        <PartLink
          component="navigation"
          part="Navigation.Back"
        />
        , staying put between pushed pages (a persistent item, see{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        ), and a{' '}
        <PartLink
          component="navigation"
          part="Navigation.SwipeArea"
        />
        .
      </li>
    </ul>

    <Heading
      id="a-stack-per-tab"
      level={2}
    >
      A stack per tab
    </Heading>
    <ul>
      <li>
        Each tab its own stack (tab bar apps, guide{' '}
        <GuideLink to="shell-a">shell A</GuideLink>): a{' '}
        <PartLink
          component="tab-bar"
          part="TabBar.Panel"
        />{' '}
        rendered as a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />
        .
      </li>
      <li>
        Kept while another tab is shown: the stacks in the app’s state, the
        panels mounted (<code>keepMounted</code>), so pages keep their scroll
        positions.
      </li>
      <li>
        Each panel’s pages with their own back buttons, for its stack (shown
        with its panel).
      </li>
      <li>
        The selected tab pressed again: its stack back to its root page, in one
        transition (the{' '}
        <PartLink
          component="tab-bar"
          part="TabBar.Tab"
        />
        ’s <code>onClick</code>, cutting the stack to its first key).
      </li>
      <li>
        <strong>Library:</strong> the navigation (
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />
        , its stack, back button and swipe area), the tab bar (
        <PartLink
          component="tab-bar"
          part="TabBar.Root"
        />
        , panels kept mounted) and the transition cutting back to the root.
      </li>
      <li>
        <strong>Demo:</strong> each tab’s stack (the app’s state), pressing the
        selected tab again to pop it, and the pages.
      </li>
    </ul>
    <CodeView code={perTabCode} />
    <PerTab />

    <Heading
      id="beside-a-sidebar"
      level={2}
    >
      Beside a sidebar
    </Heading>
    <ul>
      <li>
        A tablet’s: the sidebar picks a section (a <a href="layout">Layout</a>’s
        floating column), its stack in the content column (
        <code>clearFloating</code>: the pages’ content clear of the sidebar).
      </li>
      <li>
        Switching sections switches stacks (shown at once, not pushed); each
        section’s stack is kept.
      </li>
      <li>
        The selected section’s row pressed again: its stack back to its root
        page, in one transition (as a tab pressed again,{' '}
        <a href="navigation/composition#a-stack-per-tab">per tab</a>).
      </li>
      <li>
        The pages’ bars span the content column (its containing block, see{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        ), the back button with them.
      </li>
      <li>
        <strong>Library:</strong> the navigation in a layout’s column beside a
        floating{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />{' '}
        (<code>clearFloating</code>).
      </li>
      <li>
        <strong>Demo:</strong> the section and each section’s stack, switching
        between them, and the pages.
      </li>
    </ul>
    <CodeView code={sidebarCode} />
    <WithSidebar />

    <Heading
      id="popping-to-the-root"
      level={2}
    >
      Popping to the root
    </Heading>
    <ul>
      <li>
        The keys cut back by several (e.g. Done, or the selected tab pressed
        again: <a href="navigation/composition#a-stack-per-tab">per tab</a>):
        one transition, from the top page straight to the root; the pages
        between are gone without moving.
      </li>
      <li>
        Done, as the back button, in each pushed page’s bar: both persistent
        items (Done a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        ), staying put between pushed pages; only the titles move.
      </li>
      <li>
        <strong>Library:</strong> one transition from the top page straight to
        the root when the keys are cut back by several.
      </li>
      <li>
        <strong>Demo:</strong> the stack’s keys and the Done button cutting them
        back.
      </li>
    </ul>
    <CodeView code={popToRootCode} />
    <PopToRoot />

    <Heading
      id="going-back-quickly"
      level={2}
    >
      Going back quickly
    </Heading>
    <ul>
      <li>
        Levels deep (eight to start with; drill in one level, or five at once):
        the back button pressed again while going back goes back further, each
        press its own transition: the page it revealed starts leaving at once,
        from where it is, while the earlier ones carry on (a cascade).
      </li>
      <li>
        Pressed while a page is pushed: it goes back from where it is (no jump).
      </li>
      <li>
        It stays pressable while it stays put (a persistent item, see{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        ): between pushed pages, not as it slides out with the first.
      </li>
      <li>
        <strong>Library:</strong> the back button pressable mid-transition, and
        the stack running a transition per pop as its keys change again (
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the levels (the app’s keys), pushing one or five,
        popping one per press.
      </li>
    </ul>
    <CodeView code={deepCode} />
    <Deep />

    <Heading
      id="large-titles"
      level={2}
    >
      Large titles
    </Heading>
    <ul>
      <li>
        The stack’s root page with a large title (
        <PartLink
          component="header"
          part="Header.LargeTitle"
        />
        ), the pages pushed on it with the bar’s title only.
      </li>
      <li>
        In a transition, each page’s header moves with it, its bar and large
        title too; the back button stays.
      </li>
      <li>
        <strong>Library:</strong> the root page’s large title (
        <PartLink
          component="header"
          part="Header.LargeTitle"
        />
        ) and each page’s header moving with it in a transition.
      </li>
      <li>
        <strong>Demo:</strong> the stack’s keys and the pages.
      </li>
    </ul>
    <CodeView code={largeTitlesCode} />
    <LargeTitles />

    <Heading
      id="compact-or-regular"
      level={2}
    >
      Compact or regular
    </Heading>
    <ul>
      <li>
        By the window’s size class (
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        : compact below 768px): compact, the sections are the stack’s root page,
        drilled into; regular, a sidebar beside the stack.
      </li>
      <li>
        The same state either way (the section, its stack): resize the window
        (or open this page on a phone) to switch, or choose a layout (its
        content’s <code>layout</code>).
      </li>
      <li>
        Regular, the selected section’s sidebar row pressed again: its stack
        back to its root page, in one transition (as a tab pressed again,{' '}
        <a href="navigation/composition#a-stack-per-tab">per tab</a>).
      </li>
      <li>
        Compact, the back button is in each page’s bar from the first opened
        section on (
        <PartLink
          component="navigation"
          part="Navigation.Back"
        />
        , a persistent item: see{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        ): it slides in and out with the section’s root page, and stays put on
        deeper pages, also while swiping back.
      </li>
      <li>
        Compact, a drawer instead: see <a href="sidebar/composition">Sidebar</a>
        .
      </li>
      <li>
        <strong>Library:</strong> the navigation (its back button a persistent
        item), the{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />{' '}
        in a layout’s column and the window’s size class (
        <code>useSizeClass</code>).
      </li>
      <li>
        <strong>Demo:</strong> choosing the drilled-into or sidebar layout by
        the size class, the section and its stack.
      </li>
    </ul>
    <CodeView code={adaptiveCode} />
    <Adaptive />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const navigationCompositionDemos = [
  PerTab,
  WithSidebar,
  PopToRoot,
  Deep,
  LargeTitles,
  Adaptive,
];
