import './style.css';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { sfForwardFill } from '@bradleyhodges/sfsymbols/sfForwardFill';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfPlayFill } from '@bradleyhodges/sfsymbols/sfPlayFill';
import { FunctionComponent, RefObject, useRef, useState } from 'react';

import {
  Badge,
  collapsedSelection,
  Header,
  List,
  Page,
  Symbol,
  TabBar,
  TextField,
  Toolbar,
  useViewportScroll,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import { useLabelledRef } from '../../tooling/frame/render-code.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { names } from '../viewport/content.js';
import { phoneTabs, phoneTabValues } from './tabs.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const panelsCode = `<TabBar.Root defaultValue="favorites">
  <Viewport.Content safeArea="none">
    {/* Kept mounted while hidden: its page keeps its scroll position. */}
    <TabBar.Panel
      keepMounted
      render={<Page.Root />}
      value="favorites"
    >
      <Header.Root>…</Header.Root>
      <List.Root>…</List.Root>
      <Viewport.Padding edge="block-end" />
    </TabBar.Panel>
    <TabBar.Panel
      keepMounted
      render={<Page.Root />}
      value="recents"
    >
      …
      <Viewport.Padding edge="block-end" />
    </TabBar.Panel>
    …
  </Viewport.Content>
  <Viewport.BlockEnd>
    <TabBar.List>
      <TabBar.Group>
        <TabBar.Indicator />
        <TabBar.Tab value="favorites">…</TabBar.Tab>
        <TabBar.Tab value="recents">…</TabBar.Tab>
        …
      </TabBar.Group>
    </TabBar.List>
  </Viewport.BlockEnd>
</TabBar.Root>`;

const searchCode = `// The sections' tabs (the bar's first group).
const sectionValues = ['favorites', 'recents', 'contacts'];
const [value, setValue] = useState('favorites');
// The section last chosen, remaining while searching.
const [section, setSection] = useState('favorites');
const [sections] = collapsedSelection([sectionValues], section);

<TabBar.Root
  value={value}
  onValueChange={(next) => {
    setValue(next);
    if (next !== 'search') setSection(next);
  }}
>
  {/* Searching, the bar collapses: its section remains. */}
  <TabBar.List collapsed={value === 'search'}>
    <TabBar.Group visibleWhenCollapsed>
      <TabBar.Indicator />
      <TabBar.Tab
        value="favorites"
        visibleWhenCollapsed={sections.tab === 0}
      >
        …
      </TabBar.Tab>
      …
    </TabBar.Group>
    <TabBar.Group>
      <TabBar.Indicator />
      <TabBar.Tab
        aria-label="Search"
        value="search"
      >
        …
      </TabBar.Tab>
    </TabBar.Group>
  </TabBar.List>
  {/* The search field, in the collapsed bar. */}
  <TabBar.Accessory visibleIn="collapsed">
    <TextField.Root>
      <TextField.Search>
        <Symbol icon={sfMagnifyingglass} />
        <TextField.Control
          aria-label="Search"
          placeholder="Search"
          type="search"
        />
        <TextField.Clear />
      </TextField.Search>
    </TextField.Root>
  </TabBar.Accessory>
</TabBar.Root>`;

const badgeCode = `<TabBar.Tab value="recents">
  <TabBar.Icon>
    <Symbol icon={sfClockFill}>
      <Badge placement="symbol">1</Badge>
    </Symbol>
  </TabBar.Icon>
  <TabBar.Label>Recents</TabBar.Label>
</TabBar.Tab>`;

const scrollCode = `// Inside a <Viewport.Provider scroller={contentRef}> (tracking the
// content layer's scrolling, not the document's).
const [isCollapsed, setIsCollapsed] = useState(false);

useViewportScroll(({ atTop, direction }) =>
  setIsCollapsed(!atTop && direction === 'down'),
);

<TabBar.List collapsed={isCollapsed}>…</TabBar.List>`;

const accessoryCode = `const [value, setValue] = useState('favorites');
// The section last chosen, returned to from searching.
const [section, setSection] = useState('favorites');

<TabBar.Root
  value={value}
  onValueChange={(next) => {
    setValue(next);
    if (next !== 'search') setSection(next);
  }}
>
  <TabBar.List collapsed={value === 'search'}>
    …
    <TabBar.Group visibleWhenCollapsed={value === 'search'}>
      <TabBar.Indicator />
      {/* The active tab ignores clicks: searching, it returns to the section. */}
      <TabBar.Tab
        aria-label="Search"
        value="search"
        visibleWhenCollapsed={value === 'search'}
        onClick={() => {
          if (value === 'search') setValue(section);
        }}
      >
        …
      </TabBar.Tab>
    </TabBar.Group>
  </TabBar.List>
  <TabBar.Accessory>
    <span style={{ flex: 1 }}>Not Playing</span>
    <Symbol icon={sfPlayFill} />
    <Symbol icon={sfForwardFill} />
  </TabBar.Accessory>
</TabBar.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

// Each section's rows (a page's content).
const rows: Record<string, readonly string[]> = {
  contacts: [
    'Aaron Black',
    'Abigail Moss',
    'Anna Haro',
    'Bella Chen',
    'Benjamin Ortiz',
    'Carla Diaz',
    'Daniel Higgins',
    'David Taylor',
    'Elena Petrova',
    'Felix Wagner',
    'Grace Kim',
    'Hank Zakroff',
    'Isabel Costa',
    'John Appleseed',
    'Kate Bell',
    'Liam Murphy',
    'Maya Singh',
    'Noah Fischer',
  ],
  favorites: ['Anna Haro', 'Kate Bell', 'John Appleseed'],
  recents: [
    'Kate Bell',
    'Daniel Higgins',
    'Anna Haro',
    'John Appleseed',
    'Hank Zakroff',
    'David Taylor',
    'Kate Bell',
    'Anna Haro',
    'Maya Singh',
    'Daniel Higgins',
    'Grace Kim',
    'Kate Bell',
    'Felix Wagner',
    'John Appleseed',
    'Anna Haro',
    'Noah Fischer',
  ],
  voicemail: ['Daniel Higgins', 'Hank Zakroff'],
};

/** The value (initially Favorites), logged. */
const useValue = (addLog: AddLog) => {
  const [value, setValue] = useState<unknown>('favorites');
  const onValueChange = (
    next: unknown,
    { reason }: BaseTabs.Root.ChangeEventDetails,
  ) => {
    addLog(`value change: ${String(next)}/${reason}`);
    setValue(next);
  };

  return [value, onValueChange] as const;
};

/** Phone's sections as pages, in a phone's screen, switched by the bar. */
const Panels: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [value, onValueChange] = useValue(addLog);

  return (
    <Component
      isInline
      id="tab-bar-composition-panels"
      log={log}
      stage="phone"
      title="Tab bar with panels"
    >
      <TabBar.Root
        value={value}
        onValueChange={onValueChange}
      >
        <Viewport.Content safeArea="none">
          {phoneTabs.map(([tab, label]) => (
            <TabBar.Panel
              key={tab}
              keepMounted
              render={<Page.Root />}
              value={tab}
            >
              {/* (The panel is the page: its header within it, its bar
                 anchored all the same.) */}
              <Header.Root>
                <Viewport.BlockStart>
                  <Toolbar.Root placement="block-start">
                    <Toolbar.Title>
                      <span>{label}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Viewport.Padding edge="block-start" />
                <Header.LargeTitle>
                  <span>{label}</span>
                </Header.LargeTitle>
              </Header.Root>
              <List.Root>
                <List.Section>
                  <List.Group>
                    {rows[tab]?.map((name, index) => (
                      <List.Item key={index}>
                        <List.Content>
                          <List.Title>{name}</List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding edge="block-end" />
            </TabBar.Panel>
          ))}
        </Viewport.Content>
        <Viewport.BlockEnd>
          <TabBar.List>
            <TabBar.Group>
              <TabBar.Indicator />
              {phoneTabs.map(([tab, label, icon]) => (
                <TabBar.Tab
                  key={tab}
                  value={tab}
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

/** Search: the bar collapses, the search field in its accessory. */
const Search: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [value, setValue] = useState<unknown>('favorites');
  const [section, setSection] = useState<unknown>('favorites');
  const [sections] = collapsedSelection([phoneTabValues], section);

  return (
    <Component
      hasInputGuards
      isInline
      id="tab-bar-composition-search"
      log={log}
      stage="phone"
      title="Tab bar with search"
    >
      <TabBar.Root
        value={value}
        onValueChange={(
          next: unknown,
          { reason }: BaseTabs.Root.ChangeEventDetails,
        ) => {
          addLog(`value change: ${String(next)}/${reason}`);
          setValue(next);
          if (next !== 'search') setSection(next);
        }}
      >
        <Viewport.BlockEnd>
          <TabBar.List collapsed={value === 'search'}>
            <TabBar.Group visibleWhenCollapsed>
              <TabBar.Indicator />
              {phoneTabs.map(([tab, label, icon], index) => (
                <TabBar.Tab
                  key={tab}
                  value={tab}
                  visibleWhenCollapsed={sections?.tab === index}
                >
                  <TabBar.Icon>
                    <Symbol icon={icon} />
                  </TabBar.Icon>
                  <TabBar.Label>{label}</TabBar.Label>
                </TabBar.Tab>
              ))}
            </TabBar.Group>
            <TabBar.Group>
              <TabBar.Indicator />
              <TabBar.Tab
                aria-label="Search"
                value="search"
              >
                <TabBar.Icon>
                  <Symbol icon={sfMagnifyingglass} />
                </TabBar.Icon>
              </TabBar.Tab>
            </TabBar.Group>
          </TabBar.List>
          <TabBar.Accessory visibleIn="collapsed">
            <TextField.Root>
              <TextField.Search>
                <Symbol icon={sfMagnifyingglass} />
                <TextField.Control
                  aria-label="Search"
                  placeholder="Search"
                  type="search"
                />
                <TextField.Clear />
              </TextField.Search>
            </TextField.Root>
          </TabBar.Accessory>
        </Viewport.BlockEnd>
      </TabBar.Root>
    </Component>
  );
};

/** Badges on Recents and Voicemail. */
const Badges: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [value, onValueChange] = useValue(addLog);

  return (
    <Component
      isInline
      id="tab-bar-composition-badges"
      log={log}
      stage="phone"
      title="Tab bar with badges"
    >
      <TabBar.Root
        value={value}
        onValueChange={onValueChange}
      >
        <Viewport.BlockEnd>
          <TabBar.List>
            <TabBar.Group>
              <TabBar.Indicator />
              {phoneTabs.map(([tab, label, icon], index) => (
                <TabBar.Tab
                  key={tab}
                  value={tab}
                >
                  <TabBar.Icon>
                    <Symbol icon={icon}>
                      {index % 2 === 1 ? (
                        <Badge placement="symbol">{index}</Badge>
                      ) : null}
                    </Symbol>
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

/**
 * Collapsing as its screen's content scrolls down, expanding as it scrolls
 * up: inside the viewport's provider (see `OnScroll`), so its code is the
 * bar's own.
 */
const OnScrollView: FunctionComponent<{
  contentRef: RefObject<HTMLDivElement | null>;
  screenRef: RefObject<HTMLDivElement | null>;
}> = ({ screenRef, contentRef }) => {
  const [log, addLog] = useLog();
  const [value, onValueChange] = useValue(addLog);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sections] = collapsedSelection([phoneTabValues], value);

  useViewportScroll(({ atTop, direction }) =>
    setIsCollapsed(!atTop && direction === 'down'),
  );

  return (
    <Component
      isInline
      id="tab-bar-composition-scroll"
      log={log}
      screenRef={screenRef}
      stage="phone"
      title="Tab bar collapsing on scroll"
    >
      <TabBar.Root
        value={value}
        onValueChange={onValueChange}
      >
        <Viewport.Content ref={contentRef}>
          <Viewport.Padding edge="block-start" />
          <List.Root>
            <List.Section>
              <List.Group>
                {names.map((name) => (
                  <List.Item key={name}>
                    <List.Content>
                      <List.Title>{name}</List.Title>
                    </List.Content>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding edge="block-end" />
        </Viewport.Content>
        <Viewport.BlockEnd>
          <TabBar.List collapsed={isCollapsed}>
            <TabBar.Group visibleWhenCollapsed>
              <TabBar.Indicator />
              {phoneTabs.map(([tab, label, icon], index) => (
                <TabBar.Tab
                  key={tab}
                  value={tab}
                  visibleWhenCollapsed={sections?.tab === index}
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

/** `OnScrollView`, tracking its screen's content layer's scrolling. */
const OnScroll: FunctionComponent = () => {
  const contentRef = useLabelledRef<HTMLDivElement>(
    'contentRef',
    'HTMLDivElement',
  );
  const screenRef = useRef<HTMLDivElement>(null);

  return (
    <Viewport.Provider
      screen={screenRef}
      scroller={contentRef}
    >
      <OnScrollView
        contentRef={contentRef}
        screenRef={screenRef}
      />
    </Viewport.Provider>
  );
};

/** A mini player above the bar, between its groups while collapsed. */
const MiniPlayer: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [value, setValue] = useState<unknown>('favorites');
  const [section, setSection] = useState<unknown>('favorites');
  const [sections, search] = collapsedSelection(
    [phoneTabValues, ['search']],
    value,
  );

  return (
    <Component
      isInline
      id="tab-bar-composition-accessory"
      log={log}
      stage="phone"
      title="Tab bar with an accessory"
    >
      <TabBar.Root
        value={value}
        onValueChange={(
          next: unknown,
          { reason }: BaseTabs.Root.ChangeEventDetails,
        ) => {
          addLog(`value change: ${String(next)}/${reason}`);
          setValue(next);
          if (next !== 'search') setSection(next);
        }}
      >
        <Viewport.BlockEnd>
          <TabBar.List collapsed={value === 'search'}>
            <TabBar.Group visibleWhenCollapsed={sections?.remains}>
              <TabBar.Indicator />
              {phoneTabs.map(([tab, label, icon], index) => (
                <TabBar.Tab
                  key={tab}
                  value={tab}
                  visibleWhenCollapsed={sections?.tab === index}
                >
                  <TabBar.Icon>
                    <Symbol icon={icon} />
                  </TabBar.Icon>
                  <TabBar.Label>{label}</TabBar.Label>
                </TabBar.Tab>
              ))}
            </TabBar.Group>
            <TabBar.Group visibleWhenCollapsed={search?.remains}>
              <TabBar.Indicator />
              <TabBar.Tab
                aria-label="Search"
                value="search"
                visibleWhenCollapsed={search?.remains}
                onClick={() => {
                  if (value !== 'search') return;
                  addLog(`value change: ${String(section)}/search tab`);
                  setValue(section);
                }}
              >
                <TabBar.Icon>
                  <Symbol icon={sfMagnifyingglass} />
                </TabBar.Icon>
              </TabBar.Tab>
            </TabBar.Group>
          </TabBar.List>
          <TabBar.Accessory>
            <span className="tab-bar-demo-accessory-title">Not Playing</span>
            <Symbol icon={sfPlayFill} />
            <Symbol icon={sfForwardFill} />
          </TabBar.Accessory>
        </Viewport.BlockEnd>
      </TabBar.Root>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['switching-an-app-s-sections', 'Switching an app’s sections'],
  ['search', 'Search'],
  ['badges-on-tabs', 'Badges on tabs'],
  ['collapsing-on-scroll', 'Collapsing on scroll'],
  ['a-mini-player', 'A mini player'],
];

/** `/tab-bar/composition`: tab bars in an app, and with other components. */
export const TabBarComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="switching-an-app-s-sections"
      level={2}
    >
      Switching an app’s sections
    </Heading>
    <ul>
      <li>
        Base UI’s Tabs: the root holds the tabs and the sections’ panels,
        showing the active tab’s.
      </li>
      <li>
        As an app’s shell (guide{' '}
        <GuideLink to="shell-a">§7.4, shell A</GuideLink>): each panel a{' '}
        <a href="page">Page</a> (<code>render</code>), scrolling on its own, in
        the <a href="viewport">Viewport</a>’s content layer.
      </li>
      <li>
        The bar floats over it, anchored at the bottom (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        ).
      </li>
      <li>
        Each section keeps its place: <code>keepMounted</code> keeps hidden
        panels (otherwise unmounted), and with them their pages’ scroll
        positions (scroll Recents, switch away and back).
      </li>
      <li>
        <strong>Library:</strong> the tab bar (
        <PartLink
          component="tab-bar"
          part="TabBar.Root"
        />
        , its tabs, indicator and panels kept mounted) floating at the bottom (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        ), each panel a{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />
        .
      </li>
      <li>
        <strong>Demo:</strong> the sections, their rows, and logging the
        selected one.
      </li>
    </ul>
    <CodeView code={panelsCode} />
    <Panels />

    <Heading
      id="search"
      level={2}
    >
      Search
    </Heading>
    <ul>
      <li>
        Search: a group of its own after the sections’ (iOS 26; guide{' '}
        <GuideLink to="rule-a11">A11</GuideLink>,{' '}
        <GuideLink to="section-7-6">§7.6</GuideLink>).
      </li>
      <li>Choosing it collapses the bar to the section last chosen.</li>
      <li>
        The search field appears beside it: an accessory shown only while
        collapsed (<code>visibleIn</code>), holding a{' '}
        <a href="text-field">TextField</a>’s search field.
      </li>
      <li>Choosing the section again expands the bar.</li>
      <li>
        <strong>Library:</strong> the search tab’s own group, collapsing the
        bar, and the accessory (
        <PartLink
          component="tab-bar"
          part="TabBar.Accessory"
        />
        ) shown only while collapsed.
      </li>
      <li>
        <strong>Demo:</strong> the value and the section last chosen (the app’s
        state), and the search field’s query.
      </li>
    </ul>
    <CodeView code={searchCode} />
    <Search />

    <Heading
      id="badges-on-tabs"
      level={2}
    >
      Badges on tabs
    </Heading>
    <ul>
      <li>
        A section’s news (missed calls, new voicemail): a{' '}
        <a href="badge">Badge</a> inside the tab’s <a href="symbol">Symbol</a>.
      </li>
      <li>
        Placed on the glyph, solid while the symbol blends with the glass.
      </li>
      <li>
        Guide <GuideLink to="section-7-5">§7.5</GuideLink>: an activity badge on
        a tab item.
      </li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="badge"
          part="Badge"
        />{' '}
        on the tab’s{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />
        , solid while the symbol blends with the glass.
      </li>
      <li>
        <strong>Demo:</strong> the counts.
      </li>
    </ul>
    <CodeView code={badgeCode} />
    <Badges />

    <Heading
      id="collapsing-on-scroll"
      level={2}
    >
      Collapsing on scroll
    </Heading>
    <ul>
      <li>iOS’s tab bars minimize while the content scrolls down.</li>
      <li>
        Inside a <a href="viewport">Viewport</a>’s provider,{' '}
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />{' '}
        reports the scroll direction (past a threshold) and whether it’s at the
        top.
      </li>
      <li>Scroll the screen’s list to see it.</li>
      <li>
        <strong>Library:</strong> collapsing the bar (<code>collapsed</code>)
        and the viewport’s scroll hook (
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> collapsing it by the scroll’s direction and
        position (the app’s state).
      </li>
    </ul>
    <CodeView code={scrollCode} />
    <OnScroll />

    <Heading
      id="a-mini-player"
      level={2}
    >
      A mini player
    </Heading>
    <ul>
      <li>
        App content attached to the bar (Music’s mini player): a{' '}
        <PartLink
          component="tab-bar"
          part="TabBar.Accessory"
        />{' '}
        after the list.
      </li>
      <li>
        Above the groups; between them while the bar is collapsed (here, by
        search).
      </li>
      <li>
        The active tab ignores clicks (Base UI’s Tabs): the search tab, clicked
        while searching, sets the section last chosen itself, expanding the bar.
      </li>
      <li>
        <strong>Library:</strong> the accessory after the list (
        <PartLink
          component="tab-bar"
          part="TabBar.Accessory"
        />
        ), placed above the groups or between them.
      </li>
      <li>
        <strong>Demo:</strong> the player, the value and the section last
        chosen.
      </li>
    </ul>
    <CodeView code={accessoryCode} />
    <MiniPlayer />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const tabBarCompositionDemos = [
  Panels,
  Search,
  Badges,
  OnScroll,
  MiniPlayer,
];
