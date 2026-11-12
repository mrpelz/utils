import { FunctionComponent, useMemo, useState } from 'react';

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
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfChevronBackward } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Navigation.Back': ['aria-label', 'render'],
            'Navigation.Root': ['onBack'],
            'Navigation.Stack': [],
            'Navigation.SwipeArea': [],
            'Page.Root': [],
            'TabBar.Group': [],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.List': [],
            'TabBar.Panel': ['keepMounted', 'render', 'value'],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': ['onClick', 'value'],
            'Toolbar.Button': ['shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockEnd': ['keyboard'],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('navigation-composition-tabs') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="navigation-composition-tabs"
      log={log}
      stage="phone"
      state={[partState]}
      title="Navigation per tab"
    >
      <TabBar.Root
        {...partProps['TabBar.Root']}
        value={tab}
        onValueChange={(value: SectionValue) => {
          addLog(`tab: ${value}`);
          setTab(value);
        }}
      >
        <Viewport.Content {...partProps['Viewport.Content']}>
          {sections.map(([section]) => (
            <TabBar.Panel
              key={section}
              {...partProps['TabBar.Panel']}
              keepMounted
              value={section}
              render={
                <Navigation.Root
                  {...partProps['Navigation.Root']}
                  onBack={() => pop(section)}
                />
              }
            >
              <Navigation.SwipeArea {...partProps['Navigation.SwipeArea']} />
              <Navigation.Stack {...partProps['Navigation.Stack']}>
                {stacks[section].map((key, index) => (
                  <Header.Root key={key}>
                    <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                      <Toolbar.Root
                        {...partProps['Toolbar.Root']}
                        placement="block-start"
                      >
                        {index > 0 ? (
                          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                            <Navigation.Back
                              {...partProps['Navigation.Back']}
                              aria-label={
                                pages[stacks[section][index - 1] ?? '']?.title
                              }
                              render={
                                <Toolbar.Button
                                  {...partProps['Toolbar.Button']}
                                  shape="circle"
                                />
                              }
                            >
                              <Button.Icon {...partProps['Button.Icon']}>
                                <Symbol
                                  {...partProps.Symbol}
                                  icon={sfChevronBackward}
                                />
                              </Button.Icon>
                            </Navigation.Back>
                          </Toolbar.Leading>
                        ) : null}
                        <Toolbar.Title {...partProps['Toolbar.Title']}>
                          <span>{pages[key]?.title}</span>
                        </Toolbar.Title>
                      </Toolbar.Root>
                    </Viewport.BlockStart>
                    <Page.Root {...partProps['Page.Root']}>
                      <Viewport.Padding
                        {...partProps['Viewport.Padding']}
                        edge="block-start"
                      />
                      <List.Root {...partProps['List.Root']}>
                        <List.Section {...partProps['List.Section']}>
                          <List.Group {...partProps['List.Group']}>
                            {pages[key]?.children.map((child) => (
                              <List.Item
                                key={child}
                                {...partProps['List.Item']}
                              >
                                <List.Content {...partProps['List.Content']}>
                                  <List.Title
                                    {...partProps['List.Title']}
                                    render={<button type="button" />}
                                    onClick={() => push(section, child)}
                                  >
                                    {pages[child]?.title}
                                  </List.Title>
                                </List.Content>
                                <List.Trailing {...partProps['List.Trailing']}>
                                  <List.DrillIn
                                    {...partProps['List.DrillIn']}
                                  />
                                </List.Trailing>
                              </List.Item>
                            ))}
                          </List.Group>
                        </List.Section>
                      </List.Root>
                      <Viewport.Padding
                        {...partProps['Viewport.Padding']}
                        edge="block-end"
                      />
                    </Page.Root>
                  </Header.Root>
                ))}
              </Navigation.Stack>
            </TabBar.Panel>
          ))}
        </Viewport.Content>
        <Viewport.BlockEnd
          {...partProps['Viewport.BlockEnd']}
          keyboard="cover"
        >
          <TabBar.List {...partProps['TabBar.List']}>
            <TabBar.Group {...partProps['TabBar.Group']}>
              <TabBar.Indicator {...partProps['TabBar.Indicator']} />
              {sections.map(([section, label, icon]) => (
                <TabBar.Tab
                  key={section}
                  {...partProps['TabBar.Tab']}
                  value={section}
                  onClick={() => {
                    if (tab === section) popToRoot(section);
                  }}
                >
                  <TabBar.Icon {...partProps['TabBar.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={icon}
                    />
                  </TabBar.Icon>
                  <TabBar.Label {...partProps['TabBar.Label']}>
                    {label}
                  </TabBar.Label>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Layout.Column': ['aria-label', 'defaultSize', 'floating'],
            'Layout.Root': [],
            'List.Content': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Image': ['variant'],
            'List.Item': ['selected'],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Navigation.Back': ['aria-label', 'render'],
            'Navigation.Root': ['onBack'],
            'Navigation.Stack': [],
            'Navigation.SwipeArea': [],
            'Page.Root': [],
            'Sidebar.Root': [],
            'Toolbar.Button': ['shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('navigation-composition-sidebar') },
  );

  return (
    <Component
      isExpanded
      isInline
      controls={[partControls]}
      id="navigation-composition-sidebar"
      log={log}
      stage="tablet"
      state={[partState]}
      title="Navigation beside a sidebar"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Layout.Root {...partProps['Layout.Root']}>
          <Layout.Column
            {...partProps['Layout.Column']}
            floating
            aria-label="Sidebar"
            defaultSize={280}
          >
            <Sidebar.Root {...partProps['Sidebar.Root']}>
              <List.Root
                {...partProps['List.Root']}
                listStyle="sidebar"
              >
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {sections.map(([value, label, icon]) => (
                      <List.Item
                        key={value}
                        {...partProps['List.Item']}
                        selected={section === value}
                      >
                        <List.Leading {...partProps['List.Leading']}>
                          <List.Image
                            {...partProps['List.Image']}
                            variant="symbol"
                          >
                            <Symbol
                              {...partProps.Symbol}
                              icon={icon}
                            />
                          </List.Image>
                        </List.Leading>
                        <List.Content {...partProps['List.Content']}>
                          <List.Title
                            {...partProps['List.Title']}
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
          <Layout.Column
            {...partProps['Layout.Column']}
            clearFloating
          >
            <Navigation.Root
              {...partProps['Navigation.Root']}
              onBack={pop}
            >
              <Navigation.SwipeArea {...partProps['Navigation.SwipeArea']} />
              <Navigation.Stack {...partProps['Navigation.Stack']}>
                {keys.map((key, index) => (
                  <Header.Root key={key}>
                    <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                      <Toolbar.Root
                        {...partProps['Toolbar.Root']}
                        placement="block-start"
                      >
                        {index > 0 ? (
                          <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                            <Navigation.Back
                              {...partProps['Navigation.Back']}
                              aria-label={pages[keys[index - 1] ?? '']?.title}
                              render={
                                <Toolbar.Button
                                  {...partProps['Toolbar.Button']}
                                  shape="circle"
                                />
                              }
                            >
                              <Button.Icon {...partProps['Button.Icon']}>
                                <Symbol
                                  {...partProps.Symbol}
                                  icon={sfChevronBackward}
                                />
                              </Button.Icon>
                            </Navigation.Back>
                          </Toolbar.Leading>
                        ) : null}
                        <Toolbar.Title {...partProps['Toolbar.Title']}>
                          <span>{pages[key]?.title}</span>
                        </Toolbar.Title>
                      </Toolbar.Root>
                    </Viewport.BlockStart>
                    <Page.Root {...partProps['Page.Root']}>
                      <Viewport.Padding
                        {...partProps['Viewport.Padding']}
                        edge="block-start"
                      />
                      <List.Root {...partProps['List.Root']}>
                        <List.Section {...partProps['List.Section']}>
                          <List.Group {...partProps['List.Group']}>
                            {pages[key]?.children.map((child) => (
                              <List.Item
                                key={child}
                                {...partProps['List.Item']}
                              >
                                <List.Content {...partProps['List.Content']}>
                                  <List.Title
                                    {...partProps['List.Title']}
                                    render={<button type="button" />}
                                    onClick={() => push(child)}
                                  >
                                    {pages[child]?.title}
                                  </List.Title>
                                </List.Content>
                                <List.Trailing {...partProps['List.Trailing']}>
                                  <List.DrillIn
                                    {...partProps['List.DrillIn']}
                                  />
                                </List.Trailing>
                              </List.Item>
                            ))}
                          </List.Group>
                        </List.Section>
                      </List.Root>
                      <Viewport.Padding
                        {...partProps['Viewport.Padding']}
                        edge="block-end"
                      />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Label': [],
            'List.Content': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Navigation.Back': ['aria-label', 'render'],
            'Navigation.Persistent': ['onClick', 'persistentId', 'render'],
            'Navigation.Root': ['onBack'],
            'Navigation.Stack': [],
            'Navigation.SwipeArea': [],
            'Page.Root': [],
            'Toolbar.Button': ['shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Toolbar.Trailing': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('navigation-composition-pop-to-root') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="navigation-composition-pop-to-root"
      log={log}
      stage="phone"
      state={[partState]}
      title="Navigation popping to its root"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Navigation.Root
          {...partProps['Navigation.Root']}
          onBack={pop}
        >
          <Navigation.SwipeArea {...partProps['Navigation.SwipeArea']} />
          <Navigation.Stack {...partProps['Navigation.Stack']}>
            {keys.map((key, index) => (
              <Header.Root key={key}>
                <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                  <Toolbar.Root
                    {...partProps['Toolbar.Root']}
                    placement="block-start"
                  >
                    {index > 0 ? (
                      <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                        <Navigation.Back
                          {...partProps['Navigation.Back']}
                          aria-label={pages[keys[index - 1] ?? '']?.title}
                          render={
                            <Toolbar.Button
                              {...partProps['Toolbar.Button']}
                              shape="circle"
                            />
                          }
                        >
                          <Button.Icon {...partProps['Button.Icon']}>
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfChevronBackward}
                            />
                          </Button.Icon>
                        </Navigation.Back>
                      </Toolbar.Leading>
                    ) : null}
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>{pages[key]?.title}</span>
                    </Toolbar.Title>
                    {/* Done, as the back button: on every pushed page,
                       staying put between them (a persistent item). */}
                    {index > 0 ? (
                      <Toolbar.Trailing {...partProps['Toolbar.Trailing']}>
                        <Navigation.Persistent
                          {...partProps['Navigation.Persistent']}
                          persistentId="done"
                          render={
                            <Toolbar.Button {...partProps['Toolbar.Button']} />
                          }
                          onClick={() => {
                            addLog('pop to root');
                            setKeys((current) => current.slice(0, 1));
                          }}
                        >
                          <Button.Label {...partProps['Button.Label']}>
                            Done
                          </Button.Label>
                        </Navigation.Persistent>
                      </Toolbar.Trailing>
                    ) : null}
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root {...partProps['Page.Root']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
                  <List.Root {...partProps['List.Root']}>
                    <List.Section {...partProps['List.Section']}>
                      <List.Group {...partProps['List.Group']}>
                        {pages[key]?.children.map((child) => (
                          <List.Item
                            key={child}
                            {...partProps['List.Item']}
                          >
                            <List.Content {...partProps['List.Content']}>
                              <List.Title
                                {...partProps['List.Title']}
                                render={<button type="button" />}
                                onClick={() => push(child)}
                              >
                                {pages[child]?.title}
                              </List.Title>
                            </List.Content>
                            <List.Trailing {...partProps['List.Trailing']}>
                              <List.DrillIn {...partProps['List.DrillIn']} />
                            </List.Trailing>
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  </List.Root>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-end"
                  />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'List.Content': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Navigation.Back': ['aria-label', 'render'],
            'Navigation.Root': ['onBack'],
            'Navigation.Stack': [],
            'Navigation.SwipeArea': [],
            'Page.Root': [],
            'Toolbar.Button': ['shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('navigation-composition-deep') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="navigation-composition-deep"
      log={log}
      stage="phone"
      state={[partState]}
      title="Navigation, levels deep"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Navigation.Root
          {...partProps['Navigation.Root']}
          onBack={pop}
        >
          <Navigation.SwipeArea {...partProps['Navigation.SwipeArea']} />
          <Navigation.Stack {...partProps['Navigation.Stack']}>
            {keys.map((key, index) => (
              <Header.Root key={key}>
                <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                  <Toolbar.Root
                    {...partProps['Toolbar.Root']}
                    placement="block-start"
                  >
                    {index > 0 ? (
                      <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                        <Navigation.Back
                          {...partProps['Navigation.Back']}
                          aria-label={`Level ${keys[index - 1] ?? ''}`}
                          render={
                            <Toolbar.Button
                              {...partProps['Toolbar.Button']}
                              shape="circle"
                            />
                          }
                        >
                          <Button.Icon {...partProps['Button.Icon']}>
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfChevronBackward}
                            />
                          </Button.Icon>
                        </Navigation.Back>
                      </Toolbar.Leading>
                    ) : null}
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>Level {key}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root {...partProps['Page.Root']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
                  <List.Root {...partProps['List.Root']}>
                    <List.Section {...partProps['List.Section']}>
                      <List.Group {...partProps['List.Group']}>
                        {[1, 5].map((count) => (
                          <List.Item
                            key={count}
                            {...partProps['List.Item']}
                          >
                            <List.Content {...partProps['List.Content']}>
                              <List.Title
                                {...partProps['List.Title']}
                                render={<button type="button" />}
                                onClick={() => push(count)}
                              >
                                {count === 1
                                  ? `Level ${String(index + 2)}`
                                  : `${String(count)} levels deeper`}
                              </List.Title>
                            </List.Content>
                            <List.Trailing {...partProps['List.Trailing']}>
                              <List.DrillIn {...partProps['List.DrillIn']} />
                            </List.Trailing>
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  </List.Root>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-end"
                  />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Header.LargeTitle': [],
            'List.Content': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Navigation.Back': ['aria-label', 'render'],
            'Navigation.Root': ['onBack'],
            'Navigation.Stack': [],
            'Navigation.SwipeArea': [],
            'Page.Root': [],
            'Toolbar.Button': ['shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('navigation-composition-large-titles') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="navigation-composition-large-titles"
      log={log}
      stage="phone"
      state={[partState]}
      title="Navigation with large titles"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Navigation.Root
          {...partProps['Navigation.Root']}
          onBack={pop}
        >
          <Navigation.SwipeArea {...partProps['Navigation.SwipeArea']} />
          <Navigation.Stack {...partProps['Navigation.Stack']}>
            {keys.map((key, depth) => (
              <Header.Root key={key}>
                <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                  <Toolbar.Root
                    {...partProps['Toolbar.Root']}
                    placement="block-start"
                  >
                    {depth > 0 ? (
                      <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                        <Navigation.Back
                          {...partProps['Navigation.Back']}
                          aria-label={pages[keys[depth - 1] ?? '']?.title}
                          render={
                            <Toolbar.Button
                              {...partProps['Toolbar.Button']}
                              shape="circle"
                            />
                          }
                        >
                          <Button.Icon {...partProps['Button.Icon']}>
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfChevronBackward}
                            />
                          </Button.Icon>
                        </Navigation.Back>
                      </Toolbar.Leading>
                    ) : null}
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>{pages[key]?.title}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Page.Root {...partProps['Page.Root']}>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-start"
                  />
                  {depth === 0 ? (
                    <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                      <span>{pages[key]?.title}</span>
                    </Header.LargeTitle>
                  ) : null}

                  <List.Root {...partProps['List.Root']}>
                    <List.Section {...partProps['List.Section']}>
                      <List.Group {...partProps['List.Group']}>
                        {pages[key]?.children.map((child) => (
                          <List.Item
                            key={child}
                            {...partProps['List.Item']}
                          >
                            <List.Content {...partProps['List.Content']}>
                              <List.Title
                                {...partProps['List.Title']}
                                render={<button type="button" />}
                                onClick={() => push(child)}
                              >
                                {pages[child]?.title}
                              </List.Title>
                            </List.Content>
                            <List.Trailing {...partProps['List.Trailing']}>
                              <List.DrillIn {...partProps['List.DrillIn']} />
                            </List.Trailing>
                          </List.Item>
                        ))}
                      </List.Group>
                    </List.Section>
                  </List.Root>
                  <Viewport.Padding
                    {...partProps['Viewport.Padding']}
                    edge="block-end"
                  />
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Header.LargeTitle': [],
            'Layout.Column': ['aria-label', 'defaultSize', 'floating'],
            'Layout.Root': [],
            'List.Content': [],
            'List.DrillIn': [],
            'List.Group': [],
            'List.Image': ['variant'],
            'List.Item': ['selected'],
            'List.Leading': [],
            'List.Root': ['listStyle'],
            'List.Section': [],
            'List.Title': ['onClick', 'render'],
            'List.Trailing': [],
            'Navigation.Back': ['aria-label', 'render'],
            'Navigation.Root': ['onBack'],
            'Navigation.Stack': [],
            'Navigation.SwipeArea': [],
            'Page.Root': [],
            'Sidebar.Root': [],
            'Toolbar.Button': ['shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isExpanded
      isInline
      controls={[controlContent, partControls]}
      id={id}
      log={log}
      stage={isCompact ? 'phone' : 'tablet'}
      state={[stateContent, partState]}
      title="Navigation, compact or beside a sidebar"
    >
      {isCompact ? (
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Navigation.Root
            {...partProps['Navigation.Root']}
            onBack={pop}
          >
            <Navigation.SwipeArea {...partProps['Navigation.SwipeArea']} />
            <Navigation.Stack {...partProps['Navigation.Stack']}>
              {keys.map((key, index) =>
                key === 'sections' ? (
                  <Header.Root key={key}>
                    <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                      <Toolbar.Root
                        {...partProps['Toolbar.Root']}
                        placement="block-start"
                      >
                        <Toolbar.Title {...partProps['Toolbar.Title']}>
                          <span>Apps</span>
                        </Toolbar.Title>
                      </Toolbar.Root>
                    </Viewport.BlockStart>
                    <Page.Root {...partProps['Page.Root']}>
                      <Viewport.Padding
                        {...partProps['Viewport.Padding']}
                        edge="block-start"
                      />
                      <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                        <span>Apps</span>
                      </Header.LargeTitle>

                      <List.Root {...partProps['List.Root']}>
                        <List.Section {...partProps['List.Section']}>
                          <List.Group {...partProps['List.Group']}>
                            {sections.map(([value, label, icon]) => (
                              <List.Item
                                key={value}
                                {...partProps['List.Item']}
                              >
                                <List.Leading {...partProps['List.Leading']}>
                                  <List.Image
                                    {...partProps['List.Image']}
                                    variant="symbol"
                                  >
                                    <Symbol
                                      {...partProps.Symbol}
                                      icon={icon}
                                    />
                                  </List.Image>
                                </List.Leading>
                                <List.Content {...partProps['List.Content']}>
                                  <List.Title
                                    {...partProps['List.Title']}
                                    render={<button type="button" />}
                                    onClick={() => open(value)}
                                  >
                                    {label}
                                  </List.Title>
                                </List.Content>
                                <List.Trailing {...partProps['List.Trailing']}>
                                  <List.DrillIn
                                    {...partProps['List.DrillIn']}
                                  />
                                </List.Trailing>
                              </List.Item>
                            ))}
                          </List.Group>
                        </List.Section>
                      </List.Root>
                      <Viewport.Padding
                        {...partProps['Viewport.Padding']}
                        edge="block-end"
                      />
                    </Page.Root>
                  </Header.Root>
                ) : (
                  <Header.Root key={key}>
                    <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                      <Toolbar.Root
                        {...partProps['Toolbar.Root']}
                        placement="block-start"
                      >
                        {/* In each page's bar: sliding with the first page
                           to have one, staying put on deeper ones (see
                           Navigation.Persistent). */}
                        <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                          <Navigation.Back
                            {...partProps['Navigation.Back']}
                            aria-label={
                              index === 1
                                ? 'Apps'
                                : pages[keys[index - 1] ?? '']?.title
                            }
                            render={
                              <Toolbar.Button
                                {...partProps['Toolbar.Button']}
                                shape="circle"
                              />
                            }
                          >
                            <Button.Icon {...partProps['Button.Icon']}>
                              <Symbol
                                {...partProps.Symbol}
                                icon={sfChevronBackward}
                              />
                            </Button.Icon>
                          </Navigation.Back>
                        </Toolbar.Leading>
                        <Toolbar.Title {...partProps['Toolbar.Title']}>
                          <span>{pages[key]?.title}</span>
                        </Toolbar.Title>
                      </Toolbar.Root>
                    </Viewport.BlockStart>
                    <Page.Root {...partProps['Page.Root']}>
                      <Viewport.Padding
                        {...partProps['Viewport.Padding']}
                        edge="block-start"
                      />
                      <List.Root {...partProps['List.Root']}>
                        <List.Section {...partProps['List.Section']}>
                          <List.Group {...partProps['List.Group']}>
                            {pages[key]?.children.map((child) => (
                              <List.Item
                                key={child}
                                {...partProps['List.Item']}
                              >
                                <List.Content {...partProps['List.Content']}>
                                  <List.Title
                                    {...partProps['List.Title']}
                                    render={<button type="button" />}
                                    onClick={() => push(child)}
                                  >
                                    {pages[child]?.title}
                                  </List.Title>
                                </List.Content>
                                <List.Trailing {...partProps['List.Trailing']}>
                                  <List.DrillIn
                                    {...partProps['List.DrillIn']}
                                  />
                                </List.Trailing>
                              </List.Item>
                            ))}
                          </List.Group>
                        </List.Section>
                      </List.Root>
                      <Viewport.Padding
                        {...partProps['Viewport.Padding']}
                        edge="block-end"
                      />
                    </Page.Root>
                  </Header.Root>
                ),
              )}
            </Navigation.Stack>
          </Navigation.Root>
        </Viewport.Content>
      ) : (
        <Viewport.Content {...partProps['Viewport.Content']}>
          <Layout.Root {...partProps['Layout.Root']}>
            <Layout.Column
              {...partProps['Layout.Column']}
              floating
              aria-label="Sidebar"
              defaultSize={280}
            >
              <Sidebar.Root {...partProps['Sidebar.Root']}>
                <List.Root
                  {...partProps['List.Root']}
                  listStyle="sidebar"
                >
                  <List.Section {...partProps['List.Section']}>
                    <List.Group {...partProps['List.Group']}>
                      {sections.map(([value, label, icon]) => (
                        <List.Item
                          key={value}
                          {...partProps['List.Item']}
                          selected={section === value}
                        >
                          <List.Leading {...partProps['List.Leading']}>
                            <List.Image
                              {...partProps['List.Image']}
                              variant="symbol"
                            >
                              <Symbol
                                {...partProps.Symbol}
                                icon={icon}
                              />
                            </List.Image>
                          </List.Leading>
                          <List.Content {...partProps['List.Content']}>
                            <List.Title
                              {...partProps['List.Title']}
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
            <Layout.Column
              {...partProps['Layout.Column']}
              clearFloating
            >
              <Navigation.Root
                {...partProps['Navigation.Root']}
                onBack={pop}
              >
                <Navigation.SwipeArea {...partProps['Navigation.SwipeArea']} />
                <Navigation.Stack {...partProps['Navigation.Stack']}>
                  {stack.map((key, index) => (
                    <Header.Root key={key}>
                      <Viewport.BlockStart
                        {...partProps['Viewport.BlockStart']}
                      >
                        <Toolbar.Root
                          {...partProps['Toolbar.Root']}
                          placement="block-start"
                        >
                          {index > 0 ? (
                            <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                              <Navigation.Back
                                {...partProps['Navigation.Back']}
                                aria-label={
                                  pages[stack[index - 1] ?? '']?.title
                                }
                                render={
                                  <Toolbar.Button
                                    {...partProps['Toolbar.Button']}
                                    shape="circle"
                                  />
                                }
                              >
                                <Button.Icon {...partProps['Button.Icon']}>
                                  <Symbol
                                    {...partProps.Symbol}
                                    icon={sfChevronBackward}
                                  />
                                </Button.Icon>
                              </Navigation.Back>
                            </Toolbar.Leading>
                          ) : null}
                          <Toolbar.Title {...partProps['Toolbar.Title']}>
                            <span>{pages[key]?.title}</span>
                          </Toolbar.Title>
                        </Toolbar.Root>
                      </Viewport.BlockStart>
                      <Page.Root {...partProps['Page.Root']}>
                        <Viewport.Padding
                          {...partProps['Viewport.Padding']}
                          edge="block-start"
                        />
                        <List.Root {...partProps['List.Root']}>
                          <List.Section {...partProps['List.Section']}>
                            <List.Group {...partProps['List.Group']}>
                              {pages[key]?.children.map((child) => (
                                <List.Item
                                  key={child}
                                  {...partProps['List.Item']}
                                >
                                  <List.Content {...partProps['List.Content']}>
                                    <List.Title
                                      {...partProps['List.Title']}
                                      render={<button type="button" />}
                                      onClick={() => push(child)}
                                    >
                                      {pages[child]?.title}
                                    </List.Title>
                                  </List.Content>
                                  <List.Trailing
                                    {...partProps['List.Trailing']}
                                  >
                                    <List.DrillIn
                                      {...partProps['List.DrillIn']}
                                    />
                                  </List.Trailing>
                                </List.Item>
                              ))}
                            </List.Group>
                          </List.Section>
                        </List.Root>
                        <Viewport.Padding
                          {...partProps['Viewport.Padding']}
                          edge="block-end"
                        />
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
        A navigation holds pages, each a <a href={publicUrl('page')}>Page</a>{' '}
        with a <a href={publicUrl('header')}>Header</a>. It’s held by what
        switches between sections: a <a href={publicUrl('tab-bar')}>Tab Bar</a>{' '}
        or a <a href={publicUrl('sidebar')}>Sidebar</a>.
      </li>
      <li>
        Drilling in uses a row’s title as a button, with a{' '}
        <PartLink
          component="list"
          part="List.DrillIn"
        />{' '}
        chevron (see{' '}
        <a href={publicUrl('list/composition#drilling-into-pages')}>List</a>).
      </li>
      <li>
        In each example, the pages sit in its{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        , and each page’s bar (its title) moves with it. Each pushed page’s bar
        holds the{' '}
        <PartLink
          component="navigation"
          part="Navigation.Back"
        />
        , which stays put between pushed pages (it’s a persistent item, see{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        ). A{' '}
        <PartLink
          component="navigation"
          part="Navigation.SwipeArea"
        />{' '}
        handles swiping back.
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
        Each tab has its own stack, as in an app built around a tab bar: a{' '}
        <PartLink
          component="tab-bar"
          part="TabBar.Panel"
        />{' '}
        renders as a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />
        .
      </li>
      <li>
        Stacks are kept while another tab shows. They live in the app’s state,
        and the panels stay mounted (<code>keepMounted</code>), so pages keep
        their scroll positions.
      </li>
      <li>
        Each panel’s pages have their own back buttons, for their stack, shown
        with their panel.
      </li>
      <li>
        Pressing the selected tab again takes its stack back to the root page,
        in one transition. The{' '}
        <PartLink
          component="tab-bar"
          part="TabBar.Tab"
        />
        ’s <code>onClick</code> cuts the stack to its first key.
      </li>
      <li>
        <strong>Library:</strong> the navigation (
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />
        , with its stack, back button and swipe area), the tab bar (
        <PartLink
          component="tab-bar"
          part="TabBar.Root"
        />
        , with panels kept mounted) and the transition that cuts back to the
        root.
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
        On a tablet, the sidebar picks a section (as a{' '}
        <a href={publicUrl('layout')}>Layout</a>’s floating column), and that
        section’s stack shows in the content column (<code>clearFloating</code>{' '}
        keeps the pages’ content clear of the sidebar).
      </li>
      <li>
        Switching sections switches stacks, shown at once rather than pushed.
        Each section’s stack is kept.
      </li>
      <li>
        Pressing the selected section’s row again takes its stack back to the
        root page in one transition, like pressing a tab again (see{' '}
        <a href={publicUrl('navigation/composition#a-stack-per-tab')}>
          per tab
        </a>
        ).
      </li>
      <li>
        The pages’ bars span the content column, which is their containing block
        (see{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        ), and the back button goes with them.
      </li>
      <li>
        <strong>Library:</strong> the navigation in a layout column next to a
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
        When the keys are cut back by several pages (for example by Done, or by
        pressing the selected tab again, see{' '}
        <a href={publicUrl('navigation/composition#a-stack-per-tab')}>
          per tab
        </a>
        ), there’s one transition, from the top page straight to the root. The
        pages in between disappear without moving.
      </li>
      <li>
        Done sits in each pushed page’s bar, like the back button. Both are
        persistent items (Done is a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        ), so they stay put between pushed pages, and only the titles move.
      </li>
      <li>
        <strong>Library:</strong> one transition from the top page straight to
        the root when the keys are cut back by several.
      </li>
      <li>
        <strong>Demo:</strong> the stack’s keys, and the Done button that cuts
        them back.
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
        The stack starts eight levels deep (drill in one level, or five at
        once). Pressing the back button again while going back goes back
        further, and each press runs its own transition. The page it revealed
        starts leaving at once, from where it is, while the earlier ones carry
        on, as a cascade.
      </li>
      <li>
        Swiping back again while going back (from the leading edge, the{' '}
        <PartLink
          component="navigation"
          part="Navigation.SwipeArea"
        />
        ) works the same. The page still leaving carries on, and the swipe takes
        the page it revealed from where it is. Let go too early, and only that
        page settles back.
      </li>
      <li>
        Pressed while a page is being pushed, it goes back from where the page
        is, without a jump.
      </li>
      <li>
        It stays pressable while it stays put (it’s a persistent item, see{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        ): between pushed pages, but not while it slides out with the first one.
      </li>
      <li>
        <strong>Library:</strong> the back button, pressable mid-transition, and
        the stack running one transition per pop as its keys keep changing (
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the levels (the app’s keys), pushing one or five,
        and popping one per press.
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
        The stack’s root page has a large title (
        <PartLink
          component="header"
          part="Header.LargeTitle"
        />
        ). The pages pushed on top of it only have the bar’s title.
      </li>
      <li>
        During a transition, each page’s header moves with it, bar and large
        title included. The back button stays.
      </li>
      <li>
        <strong>Library:</strong> the root page’s large title (
        <PartLink
          component="header"
          part="Header.LargeTitle"
        />
        ), and each page’s header moving with it during a transition.
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
        It follows the window’s size class (
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        ; compact below 768px). On compact widths, the sections are the stack’s
        root page, and you drill into them. On regular widths, a sidebar sits
        next to the stack.
      </li>
      <li>
        The state (the section and its stack) is the same either way. Resize the
        window (or open this page on a phone) to switch, or choose a layout with
        the <code>layout</code> control.
      </li>
      <li>
        On regular widths, pressing the selected section’s sidebar row again
        takes its stack back to the root page in one transition, like pressing a
        tab again (see{' '}
        <a href={publicUrl('navigation/composition#a-stack-per-tab')}>
          per tab
        </a>
        ).
      </li>
      <li>
        On compact widths, the back button sits in each page’s bar from the
        first opened section on (
        <PartLink
          component="navigation"
          part="Navigation.Back"
        />
        , a persistent item, see{' '}
        <PartLink
          component="navigation"
          part="Navigation.Persistent"
        />
        ). It slides in and out with the section’s root page, and stays put on
        deeper pages, also while swiping back.
      </li>
      <li>
        On compact widths, a drawer is another option (see{' '}
        <a href={publicUrl('sidebar/composition')}>Sidebar</a>).
      </li>
      <li>
        <strong>Library:</strong> the navigation (with its back button as a
        persistent item), the{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />{' '}
        in a layout column, and the window’s size class (
        <code>useSizeClass</code>).
      </li>
      <li>
        <strong>Demo:</strong> choosing the drilled-into or the sidebar layout
        by the size class, the section, and its stack.
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
