import { sfChevronBackward } from '@bradleyhodges/sfsymbols/sfChevronBackward';
import { FunctionComponent, useState } from 'react';

import {
  Button,
  Header,
  Layout,
  List,
  Navigation,
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
  <Viewport.Content safeArea="none">
    {tabs.map(([value]) => (
      <TabBar.Panel
        key={value}
        keepMounted
        value={value}
        render={<Navigation.Root onBack={() => pop(value)} />}
      >
        <Navigation.SwipeArea />
        {/* The tab's back button: staying while its pages move. */}
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            <Toolbar.Leading>
              {stacks[value].length > 1 ? (
                <Navigation.Back render={<Toolbar.Button shape="circle" />}>
                  …
                </Navigation.Back>
              ) : null}
            </Toolbar.Leading>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Navigation.Stack>
          {stacks[value].map((key) => (
            <Header.Root key={key}>…</Header.Root>
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
              <List.Image variant="symbol">…</List.Image>
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
            </List.Item>
            …
          </List.Group>
        </List.Section>
      </List.Root>
    </Sidebar.Root>
  </Layout.Column>
  <Layout.Column clearFloating>
    {/* The selected section's stack; its back button spanning the column. */}
    <Navigation.Root onBack={pop}>
      <Navigation.SwipeArea />
      <Viewport.BlockStart>
        <Toolbar.Root placement="block-start">
          <Toolbar.Leading>
            {stacks[section].length > 1 ? <Navigation.Back … /> : null}
          </Toolbar.Leading>
        </Toolbar.Root>
      </Viewport.BlockStart>
      <Navigation.Stack>
        {stacks[section].map((key) => (
          <Header.Root key={key}>…</Header.Root>
        ))}
      </Navigation.Stack>
    </Navigation.Root>
  </Layout.Column>
</Layout.Root>`;

const popToRootCode = `const [keys, setKeys] = useState(['settings', 'general', 'about']);
const pop = () => setKeys((current) => current.slice(0, -1));

<Navigation.Root onBack={pop}>
  <Navigation.SwipeArea />
  <Viewport.BlockStart>
    <Toolbar.Root placement="block-start">
      <Toolbar.Leading>
        {keys.length > 1 ? <Navigation.Back … /> : null}
      </Toolbar.Leading>
      <Toolbar.Trailing>
        {/* Cut back to the root: popped in one transition. */}
        {keys.length > 1 ? (
          <Toolbar.Button onClick={() => setKeys(keys.slice(0, 1))}>
            <Button.Label>Done</Button.Label>
          </Toolbar.Button>
        ) : null}
      </Toolbar.Trailing>
    </Toolbar.Root>
  </Viewport.BlockStart>
  <Navigation.Stack>
    {keys.map((key) => (
      <Header.Root key={key}>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            <Toolbar.Title>…</Toolbar.Title>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root>…</Page.Root>
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
  <Viewport.BlockStart>…</Viewport.BlockStart>
  <Navigation.Stack>
    {keys.map((key, depth) => (
      <Header.Root key={key}>
        {/* Each page's bar: its title, moving with it. */}
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
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
    <Viewport.BlockStart>
      <Toolbar.Root placement="block-start">
        <Toolbar.Leading>
          {keys.length > 1 ? <Navigation.Back … /> : null}
        </Toolbar.Leading>
      </Toolbar.Root>
    </Viewport.BlockStart>
    <Navigation.Stack>
      {keys.map((key) => (
        <Header.Root key={key}>…</Header.Root>
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
        <Viewport.Content safeArea="none">
          {sections.map(([section]) => (
            <TabBar.Panel
              key={section}
              keepMounted
              render={<Navigation.Root onBack={() => pop(section)} />}
              value={section}
            >
              <Navigation.SwipeArea />
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading>
                    {stacks[section].length > 1 ? (
                      <Navigation.Back
                        aria-label={pages[stacks[section].at(-2) ?? '']?.title}
                        render={<Toolbar.Button shape="circle" />}
                      >
                        <Button.Icon>
                          <Symbol icon={sfChevronBackward} />
                        </Button.Icon>
                      </Navigation.Back>
                    ) : null}
                  </Toolbar.Leading>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Navigation.Stack>
                {stacks[section].map((key) => (
                  <Header.Root key={key}>
                    <Viewport.BlockStart>
                      <Toolbar.Root placement="block-start">
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
                                <List.Title
                                  render={<button type="button" />}
                                  onClick={() => push(section, child)}
                                >
                                  {pages[child]?.title}
                                </List.Title>
                                <List.DrillIn />
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
      <Viewport.Content safeArea="none">
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
                        <List.Image variant="symbol">
                          <Symbol icon={icon} />
                        </List.Image>
                        <List.Title
                          render={<button type="button" />}
                          onClick={() => select(value)}
                        >
                          {label}
                        </List.Title>
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
              <Viewport.BlockStart>
                <Toolbar.Root placement="block-start">
                  <Toolbar.Leading>
                    {keys.length > 1 ? (
                      <Navigation.Back
                        aria-label={pages[keys.at(-2) ?? '']?.title}
                        render={<Toolbar.Button shape="circle" />}
                      >
                        <Button.Icon>
                          <Symbol icon={sfChevronBackward} />
                        </Button.Icon>
                      </Navigation.Back>
                    ) : null}
                  </Toolbar.Leading>
                </Toolbar.Root>
              </Viewport.BlockStart>
              <Navigation.Stack>
                {keys.map((key) => (
                  <Header.Root key={key}>
                    <Viewport.BlockStart>
                      <Toolbar.Root placement="block-start">
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
                                <List.Title
                                  render={<button type="button" />}
                                  onClick={() => push(child)}
                                >
                                  {pages[child]?.title}
                                </List.Title>
                                <List.DrillIn />
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
      <Viewport.Content safeArea="none">
        <Navigation.Root onBack={pop}>
          <Navigation.SwipeArea />
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                {keys.length > 1 ? (
                  <Navigation.Back
                    aria-label={pages[keys.at(-2) ?? '']?.title}
                    render={<Toolbar.Button shape="circle" />}
                  >
                    <Button.Icon>
                      <Symbol icon={sfChevronBackward} />
                    </Button.Icon>
                  </Navigation.Back>
                ) : null}
              </Toolbar.Leading>
              <Toolbar.Trailing>
                {keys.length > 1 ? (
                  <Toolbar.Button
                    onClick={() => {
                      addLog('pop to root');
                      setKeys((current) => current.slice(0, 1));
                    }}
                  >
                    <Button.Label>Done</Button.Label>
                  </Toolbar.Button>
                ) : null}
              </Toolbar.Trailing>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Navigation.Stack>
            {keys.map((key) => (
              <Header.Root key={key}>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
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
                            <List.Title
                              render={<button type="button" />}
                              onClick={() => push(child)}
                            >
                              {pages[child]?.title}
                            </List.Title>
                            <List.DrillIn />
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
      <Viewport.Content safeArea="none">
        <Navigation.Root onBack={pop}>
          <Navigation.SwipeArea />
          <Viewport.BlockStart>
            <Toolbar.Root placement="block-start">
              <Toolbar.Leading>
                {keys.length > 1 ? (
                  <Navigation.Back
                    aria-label={pages[keys.at(-2) ?? '']?.title}
                    render={<Toolbar.Button shape="circle" />}
                  >
                    <Button.Icon>
                      <Symbol icon={sfChevronBackward} />
                    </Button.Icon>
                  </Navigation.Back>
                ) : null}
              </Toolbar.Leading>
            </Toolbar.Root>
          </Viewport.BlockStart>
          <Navigation.Stack>
            {keys.map((key, depth) => (
              <Header.Root key={key}>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
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
                            <List.Title
                              render={<button type="button" />}
                              onClick={() => push(child)}
                            >
                              {pages[child]?.title}
                            </List.Title>
                            <List.DrillIn />
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
        <Viewport.Content safeArea="none">
          <Navigation.Root onBack={pop}>
            <Navigation.SwipeArea />
            <Viewport.BlockStart>
              <Toolbar.Root placement="block-start">
                <Toolbar.Leading>
                  {keys.length > 1 ? (
                    <Navigation.Back
                      render={<Toolbar.Button shape="circle" />}
                      aria-label={
                        keys.length === 2
                          ? 'Apps'
                          : pages[keys.at(-2) ?? '']?.title
                      }
                    >
                      <Button.Icon>
                        <Symbol icon={sfChevronBackward} />
                      </Button.Icon>
                    </Navigation.Back>
                  ) : null}
                </Toolbar.Leading>
              </Toolbar.Root>
            </Viewport.BlockStart>
            <Navigation.Stack>
              {keys.map((key) =>
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
                                <List.Image variant="symbol">
                                  <Symbol icon={icon} />
                                </List.Image>
                                <List.Title
                                  render={<button type="button" />}
                                  onClick={() => open(value)}
                                >
                                  {label}
                                </List.Title>
                                <List.DrillIn />
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
                                <List.Title
                                  render={<button type="button" />}
                                  onClick={() => push(child)}
                                >
                                  {pages[child]?.title}
                                </List.Title>
                                <List.DrillIn />
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
        <Viewport.Content safeArea="none">
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
                          <List.Image variant="symbol">
                            <Symbol icon={icon} />
                          </List.Image>
                          <List.Title
                            render={<button type="button" />}
                            onClick={() => select(value)}
                          >
                            {label}
                          </List.Title>
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
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    <Toolbar.Leading>
                      {stack.length > 1 ? (
                        <Navigation.Back
                          aria-label={pages[stack.at(-2) ?? '']?.title}
                          render={<Toolbar.Button shape="circle" />}
                        >
                          <Button.Icon>
                            <Symbol icon={sfChevronBackward} />
                          </Button.Icon>
                        </Navigation.Back>
                      ) : null}
                    </Toolbar.Leading>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Navigation.Stack>
                  {stack.map((key) => (
                    <Header.Root key={key}>
                      <Viewport.BlockStart>
                        <Toolbar.Root placement="block-start">
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
                                  <List.Title
                                    render={<button type="button" />}
                                    onClick={() => push(child)}
                                  >
                                    {pages[child]?.title}
                                  </List.Title>
                                  <List.DrillIn />
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
        , each page’s bar (its title) moving with it; beside the stack, in the{' '}
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />
        , a bar that stays (a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockStart"
        />{' '}
        around a{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Root"
        />
        ) with the{' '}
        <PartLink
          component="navigation"
          part="Navigation.Back"
        />{' '}
        while there’s a page to go back to, and a{' '}
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
        Each tab its own stack (iOS’s tab bar apps, guide{' '}
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
        Each panel its own bar that stays, its back button for its stack (shown
        with its panel).
      </li>
      <li>
        The selected tab pressed again: its stack back to its root page, in one
        transition (iOS’s; the{' '}
        <PartLink
          component="tab-bar"
          part="TabBar.Tab"
        />
        ’s <code>onClick</code>, cutting the stack to its first key).
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
        The bar that stays spans the content column (its containing block, see{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        ), as the pages’ bars do.
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
        Done stays beside the back button, in the bar that stays (both shown
        while there’s a page to go back to); only the pages’ titles move.
      </li>
    </ul>
    <CodeView code={popToRootCode} />
    <PopToRoot />

    <Heading
      id="large-titles"
      level={2}
    >
      Large titles
    </Heading>
    <ul>
      <li>
        iOS’s: the stack’s root page with a large title (
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
        Compact, a drawer instead: see <a href="sidebar/composition">Sidebar</a>
        .
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
  LargeTitles,
  Adaptive,
];
