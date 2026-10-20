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
  useVisualViewport,
  Viewport,
} from '../../components/index.js';
import { CodeView } from '../frame/code-view.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { Contents, Heading, type Section } from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { pages, sections, type SectionValue } from './content.js';
import { propOptionsAdaptiveContent } from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const perTabCode = `const [tab, setTab] = useState('settings');
// Each tab's stack, kept while another tab is shown.
const [stacks, setStacks] = useState({
  settings: ['settings'],
  mail: ['mail'],
});

<TabBar.Root value={tab} onValueChange={setTab}>
  <Viewport.Content>
    {tabs.map(([value]) => (
      <TabBar.Panel
        key={value}
        keepMounted
        value={value}
        render={<Navigation.Root onBack={() => pop(value)} />}
      >
        {stacks[value].map((key) => (
          <Page.Root key={key}>…</Page.Root>
        ))}
      </TabBar.Panel>
    ))}
  </Viewport.Content>
  <Viewport.BlockEnd>
    <TabBar.List>…</TabBar.List>
  </Viewport.BlockEnd>
</TabBar.Root>`;

const sidebarCode = `<Layout.Root>
  <Layout.Column floating aria-label="Sidebar" defaultSize={280}>
    <Sidebar.Root>
      <List.Root listStyle="sidebar">
        <List.Section>
          <List.Group>
            <List.Item selected={section === 'settings'}>
              <List.Image variant="symbol">…</List.Image>
              <List.Title
                render={<button type="button" />}
                onClick={() => setSection('settings')}
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
    {/* The selected section's stack. */}
    <Navigation.Root onBack={pop}>
      {stacks[section].map((key) => (
        <Page.Root key={key}>…</Page.Root>
      ))}
    </Navigation.Root>
  </Layout.Column>
</Layout.Root>`;

const popToRootCode = `const [keys, setKeys] = useState(['settings', 'general', 'about']);

<Navigation.Root onBack={pop}>
  {keys.map((key, depth) => (
    <Page.Root key={key}>
      <Header.Root>
        <Header.Bar>
          <Toolbar.Leading>…</Toolbar.Leading>
          <Toolbar.Title>…</Toolbar.Title>
          <Toolbar.Trailing>
            {/* Cut back to the root: popped in one transition. */}
            {depth > 0 ? (
              <Toolbar.Button onClick={() => setKeys(keys.slice(0, 1))}>
                <Button.Label>Done</Button.Label>
              </Toolbar.Button>
            ) : null}
          </Toolbar.Trailing>
        </Header.Bar>
      </Header.Root>
      …
    </Page.Root>
  ))}
</Navigation.Root>`;

const largeTitlesCode = `<Navigation.Root onBack={pop}>
  {keys.map((key, depth) => (
    <Page.Root key={key}>
      <Header.Root>
        <Header.Bar>…</Header.Bar>
        {/* The root page's large title; the pages pushed on it, the bar's. */}
        {depth === 0 ? (
          <Header.LargeTitle>
            <span>{pages[key].title}</span>
          </Header.LargeTitle>
        ) : null}
      </Header.Root>
      …
    </Page.Root>
  ))}
</Navigation.Root>`;

const adaptiveCode = `// Inside a <Viewport.Provider> (the visual viewport, tracked).
const { width } = useVisualViewport();
const compact = width < 768;

// Compact (a phone): the sections are the stack's root page, drilled into.
const keys = opened ? ['sections', ...stacks[section]] : ['sections'];

compact ? (
  <Navigation.Root onBack={pop}>
    {keys.map((key) => (
      <Page.Root key={key}>…</Page.Root>
    ))}
  </Navigation.Root>
) : (
  // Regular (a tablet): the sections in a sidebar, the stack beside it.
  <Layout.Root>
    <Layout.Column floating aria-label="Sidebar" defaultSize={280}>
      <Sidebar.Root>…</Sidebar.Root>
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

/** A tab bar app: each tab its own stack, kept while switching. */
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

  return (
    <Component
      center
      inline
      id="navigation-composition-tabs"
      log={log}
      title="Navigation per tab"
    >
      <div className="navigation-demo-phone">
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
                {stacks[section].map((key, depth) => (
                  <Page.Root key={key}>
                    <Header.Root>
                      <Header.Bar>
                        <Toolbar.Leading>
                          {depth > 0 ? (
                            <Toolbar.Button
                              shape="circle"
                              aria-label={
                                pages[stacks[section][depth - 1] ?? '']?.title
                              }
                              onClick={() => pop(section)}
                            >
                              <Button.Icon>
                                <Symbol icon={sfChevronBackward} />
                              </Button.Icon>
                            </Toolbar.Button>
                          ) : null}
                        </Toolbar.Leading>
                        <Toolbar.Title>
                          <span>{pages[key]?.title}</span>
                        </Toolbar.Title>
                        <Toolbar.Trailing />
                      </Header.Bar>
                    </Header.Root>
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
                  </Page.Root>
                ))}
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
      </div>
    </Component>
  );
};

/** A tablet: the sidebar picks a section, its stack beside it. */
const WithSidebar: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [section, setSection] = useState<SectionValue>('settings');
  const [stacks, setStacks] = useState<Stacks>(rootStacks);
  const keys = stacks[section];
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
      center
      inline
      id="navigation-composition-sidebar"
      log={log}
      title="Navigation beside a sidebar"
    >
      <div className="navigation-demo-tablet">
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
                          onClick={() => {
                            addLog(`section: ${value}`);
                            setSection(value);
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
            <Navigation.Root onBack={pop}>
              {keys.map((key, depth) => (
                <Page.Root key={key}>
                  <Header.Root>
                    <Header.Bar>
                      <Toolbar.Leading>
                        {depth > 0 ? (
                          <Toolbar.Button
                            aria-label={pages[keys[depth - 1] ?? '']?.title}
                            shape="circle"
                            onClick={pop}
                          >
                            <Button.Icon>
                              <Symbol icon={sfChevronBackward} />
                            </Button.Icon>
                          </Toolbar.Button>
                        ) : null}
                      </Toolbar.Leading>
                      <Toolbar.Title>
                        <span>{pages[key]?.title}</span>
                      </Toolbar.Title>
                      <Toolbar.Trailing />
                    </Header.Bar>
                  </Header.Root>
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
                </Page.Root>
              ))}
            </Navigation.Root>
          </Layout.Column>
        </Layout.Root>
      </div>
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
      center
      inline
      id="navigation-composition-pop-to-root"
      log={log}
      title="Navigation popping to its root"
    >
      <div className="navigation-demo-phone">
        <Navigation.Root onBack={pop}>
          {keys.map((key, depth) => (
            <Page.Root key={key}>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    {depth > 0 ? (
                      <Toolbar.Button
                        aria-label={pages[keys[depth - 1] ?? '']?.title}
                        shape="circle"
                        onClick={pop}
                      >
                        <Button.Icon>
                          <Symbol icon={sfChevronBackward} />
                        </Button.Icon>
                      </Toolbar.Button>
                    ) : null}
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>{pages[key]?.title}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing>
                    {depth > 0 ? (
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
                </Header.Bar>
              </Header.Root>
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
            </Page.Root>
          ))}
        </Navigation.Root>
      </div>
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
      center
      inline
      id="navigation-composition-large-titles"
      log={log}
      title="Navigation with large titles"
    >
      <div className="navigation-demo-phone">
        <Navigation.Root onBack={pop}>
          {keys.map((key, depth) => (
            <Page.Root key={key}>
              <Header.Root>
                <Header.Bar>
                  <Toolbar.Leading>
                    {depth > 0 ? (
                      <Toolbar.Button
                        aria-label={pages[keys[depth - 1] ?? '']?.title}
                        shape="circle"
                        onClick={pop}
                      >
                        <Button.Icon>
                          <Symbol icon={sfChevronBackward} />
                        </Button.Icon>
                      </Toolbar.Button>
                    ) : null}
                  </Toolbar.Leading>
                  <Toolbar.Title>
                    <span>{pages[key]?.title}</span>
                  </Toolbar.Title>
                  <Toolbar.Trailing />
                </Header.Bar>
                {depth === 0 ? (
                  <Header.LargeTitle>
                    <span>{pages[key]?.title}</span>
                  </Header.LargeTitle>
                ) : null}
              </Header.Root>
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
            </Page.Root>
          ))}
        </Navigation.Root>
      </div>
    </Component>
  );
};

/**
 * By the window's width: compact (a phone), the sections drilled into as
 * the stack's root page; regular (a tablet), in a sidebar beside the stack
 * (inside a provider tracking the visual viewport, see `Adaptive`).
 */
const AdaptiveView: FunctionComponent = () => {
  const id = 'navigation-composition-adaptive';
  const [log, addLog] = useLog();
  const [externalContent] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsAdaptiveContent,
    '[content]',
    externalContent,
    true,
  );
  const { width } = useVisualViewport();
  // (Unset, by the window's width; or as a phone's, or a tablet's.)
  const compact =
    content.layout === undefined ? width < 768 : content.layout === 'phone';
  const [section, setSection] = useState<SectionValue>('settings');
  // Compact: whether the section is opened (pushed on the sections).
  const [opened, setOpened] = useState(false);
  const [stacks, setStacks] = useState<Stacks>(rootStacks);
  const stack = stacks[section];
  const keys = opened ? ['sections', ...stack] : ['sections'];
  const open = (value: SectionValue) => {
    addLog(`section: ${value}`);
    setSection(value);
    setOpened(true);
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
      setOpened(false);
    }
  };

  return (
    <Component
      center
      inline
      controls={[controlContent]}
      id={id}
      log={log}
      state={[stateContent]}
      title="Navigation, compact or beside a sidebar"
    >
      {compact ? (
        <div className="navigation-demo-phone">
          <Navigation.Root onBack={pop}>
            {keys.map((key, depth) =>
              key === 'sections' ? (
                <Page.Root key={key}>
                  <Header.Root>
                    <Header.Bar>
                      <Toolbar.Title>
                        <span>Apps</span>
                      </Toolbar.Title>
                      <Toolbar.Trailing />
                    </Header.Bar>
                    <Header.LargeTitle>
                      <span>Apps</span>
                    </Header.LargeTitle>
                  </Header.Root>
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
                </Page.Root>
              ) : (
                <Page.Root key={key}>
                  <Header.Root>
                    <Header.Bar>
                      <Toolbar.Leading>
                        <Toolbar.Button
                          shape="circle"
                          aria-label={
                            depth === 1
                              ? 'Apps'
                              : pages[keys[depth - 1] ?? '']?.title
                          }
                          onClick={pop}
                        >
                          <Button.Icon>
                            <Symbol icon={sfChevronBackward} />
                          </Button.Icon>
                        </Toolbar.Button>
                      </Toolbar.Leading>
                      <Toolbar.Title>
                        <span>{pages[key]?.title}</span>
                      </Toolbar.Title>
                      <Toolbar.Trailing />
                    </Header.Bar>
                  </Header.Root>
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
                </Page.Root>
              ),
            )}
          </Navigation.Root>
        </div>
      ) : (
        <div className="navigation-demo-tablet">
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
                            onClick={() => open(value)}
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
                {stack.map((key, depth) => (
                  <Page.Root key={key}>
                    <Header.Root>
                      <Header.Bar>
                        <Toolbar.Leading>
                          {depth > 0 ? (
                            <Toolbar.Button
                              aria-label={pages[stack[depth - 1] ?? '']?.title}
                              shape="circle"
                              onClick={pop}
                            >
                              <Button.Icon>
                                <Symbol icon={sfChevronBackward} />
                              </Button.Icon>
                            </Toolbar.Button>
                          ) : null}
                        </Toolbar.Leading>
                        <Toolbar.Title>
                          <span>{pages[key]?.title}</span>
                        </Toolbar.Title>
                        <Toolbar.Trailing />
                      </Header.Bar>
                    </Header.Root>
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
                  </Page.Root>
                ))}
              </Navigation.Root>
            </Layout.Column>
          </Layout.Root>
        </div>
      )}
    </Component>
  );
};

/** `AdaptiveView`, in a provider tracking the visual viewport. */
const Adaptive: FunctionComponent = () => (
  <Viewport.Provider>
    <AdaptiveView />
  </Viewport.Provider>
);

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
        Drilling in: a row’s title as a button, with a <code>List.DrillIn</code>{' '}
        chevron (see <a href="list/composition#drilling-into-pages">List</a>).
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
        <code>TabBar.Panel</code> rendered as a <code>Navigation.Root</code>.
      </li>
      <li>
        Kept while another tab is shown: the stacks in the app’s state, the
        panels mounted (<code>keepMounted</code>), so pages keep their scroll
        positions.
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
        The keys cut back by several (e.g. Done, or re-selecting the tab): one
        transition, from the top page straight to the root; the pages between
        are gone without moving.
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
        <code>Header.LargeTitle</code>), the pages pushed on it with the bar’s
        title only.
      </li>
      <li>
        In a transition, the bars stay in place, their content fading; the large
        title moves with its page.
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
        By the window’s width (<code>useVisualViewport</code>, in a{' '}
        <code>Viewport.Provider</code>; here below 768px): compact, the sections
        are the stack’s root page, drilled into; regular, a sidebar beside the
        stack.
      </li>
      <li>
        The same state either way (the section, its stack): resize the window
        (or open this page on a phone) to switch, or choose a layout (its
        content’s <code>layout</code>).
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
