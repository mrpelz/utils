import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { sfForwardFill } from '@bradleyhodges/sfsymbols/sfForwardFill';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfPlayFill } from '@bradleyhodges/sfsymbols/sfPlayFill';
import { FunctionComponent, useState } from 'react';

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
} from '../../components/index.js';
import { GuideLink } from '../hig-guide/link.js';
import { CodeView } from '../utils/code-view.js';
import { AddLog, useLog } from '../utils/log.js';
import { Component } from '../utils/main.js';
import { phoneTabs, phoneTabValues } from './tabs.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const panelsCode = `<TabBar.Root defaultValue="favorites">
  <Viewport.Content>
    <TabBar.Panel
      render={<Page.Root />}
      value="favorites"
    >
      <Header.Root>…</Header.Root>
      <List.Root>…</List.Root>
    </TabBar.Panel>
    <TabBar.Panel
      render={<Page.Root />}
      value="recents"
    >
      …
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

const searchCode = `const [value, setValue] = useState('favorites');
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
    <TextField.Root style={{ flex: 1 }}>
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
      <Badge>1</Badge>
    </Symbol>
  </TabBar.Icon>
  <TabBar.Label>Recents</TabBar.Label>
</TabBar.Tab>`;

const scrollCode = `// Inside a <Viewport.Provider> (tracking the document's scrolling).
const [collapsed, setCollapsed] = useState(false);

useViewportScroll(({ atTop, direction }) =>
  setCollapsed(!atTop && direction === 'down'),
);

<TabBar.List collapsed={collapsed}>…</TabBar.List>`;

const accessoryCode = `<TabBar.Root
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
    'Anna Haro',
    'Daniel Higgins',
    'David Taylor',
    'Hank Zakroff',
    'John Appleseed',
    'Kate Bell',
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
      center
      inline
      id="tab-bar-composition-panels"
      log={log}
      title="Tab bar with panels"
    >
      {/* (A phone's screen: its fixed layers within, see style.css.) */}
      <div className="tab-bar-demo-screen">
        <TabBar.Root
          value={value}
          onValueChange={onValueChange}
        >
          <Viewport.Content>
            {phoneTabs.map(([tab, label]) => (
              <TabBar.Panel
                key={tab}
                render={<Page.Root />}
                value={tab}
              >
                <Header.Root>
                  <Header.Bar>
                    <Toolbar.Title>
                      <span>{label}</span>
                    </Toolbar.Title>
                  </Header.Bar>
                  <Header.LargeTitle>
                    <span>{label}</span>
                  </Header.LargeTitle>
                </Header.Root>
                <List.Root>
                  <List.Section>
                    <List.Group>
                      {rows[tab]?.map((name, index) => (
                        <List.Item key={index}>
                          <List.Title>{name}</List.Title>
                        </List.Item>
                      ))}
                    </List.Group>
                  </List.Section>
                </List.Root>
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
      </div>
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
      center
      inline
      id="tab-bar-composition-search"
      log={log}
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
          <TextField.Root style={{ flex: 1 }}>
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
      center
      inline
      id="tab-bar-composition-badges"
      log={log}
      title="Tab bar with badges"
    >
      <TabBar.Root
        value={value}
        onValueChange={onValueChange}
      >
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
                    {index % 2 === 1 ? <Badge>{index}</Badge> : null}
                  </Symbol>
                </TabBar.Icon>
                <TabBar.Label>{label}</TabBar.Label>
              </TabBar.Tab>
            ))}
          </TabBar.Group>
        </TabBar.List>
      </TabBar.Root>
    </Component>
  );
};

/**
 * Collapsing as this page scrolls down, expanding as it scrolls up: inside
 * the viewport's provider (see `OnScroll`), so its code is the bar's own.
 */
const OnScrollView: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [value, onValueChange] = useValue(addLog);
  const [collapsed, setCollapsed] = useState(false);
  const [sections] = collapsedSelection([phoneTabValues], value);

  useViewportScroll(({ atTop, direction }) =>
    setCollapsed(!atTop && direction === 'down'),
  );

  return (
    <Component
      center
      inline
      id="tab-bar-composition-scroll"
      log={log}
      title="Tab bar collapsing on scroll"
    >
      <TabBar.Root
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List collapsed={collapsed}>
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
      </TabBar.Root>
    </Component>
  );
};

/** `OnScrollView`, tracking the document's scrolling. */
const OnScroll: FunctionComponent = () => (
  <Viewport.Provider>
    <OnScrollView />
  </Viewport.Provider>
);

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
      center
      inline
      id="tab-bar-composition-accessory"
      log={log}
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
      </TabBar.Root>
    </Component>
  );
};

/** `/tab-bar/composition`: tab bars in an app, and with other components. */
export const TabBarComposition: FunctionComponent = () => (
  <>
    <h2>Switching an app’s sections</h2>
    <p>
      A tab bar is Base UI’s Tabs: its root holds both the tabs and the
      sections’ panels, showing the active tab’s. As an app’s shell (guide{' '}
      <GuideLink to="shell-a">§7.4, shell A</GuideLink>), each panel is a{' '}
      <a href="page">Page</a> (<code>render</code>), scrolling on its own, in
      the <a href="viewport">Viewport</a>’s content layer; the bar floats over
      it, anchored at the bottom (<code>Viewport.BlockEnd</code>). Hidden panels
      unmount (<code>keepMounted</code> keeps them, e.g. their scroll
      positions):
    </p>
    <CodeView code={panelsCode} />
    <Panels />

    <h2>Search</h2>
    <p>
      Search takes a group of its own after the sections’ (iOS 26; guide{' '}
      <GuideLink to="rule-a11">A11</GuideLink>,{' '}
      <GuideLink to="section-7-6">§7.6</GuideLink>). Choosing it collapses the
      bar to the section last chosen, and the search field appears beside it: an
      accessory shown only while collapsed (<code>visibleIn</code>), with a{' '}
      <a href="text-field">TextField</a>’s search field. Choosing the section
      again expands the bar.
    </p>
    <CodeView code={searchCode} />
    <Search />

    <h2>Badges on tabs</h2>
    <p>
      A section’s news (missed calls, new voicemail) goes on its tab, as a{' '}
      <a href="badge">Badge</a> inside the tab’s <a href="symbol">Symbol</a>:
      placed on the glyph, staying solid while the symbol blends with the glass
      (guide <GuideLink to="section-7-5">§7.5</GuideLink>: an activity badge on
      a tab item).
    </p>
    <CodeView code={badgeCode} />
    <Badges />

    <h2>Collapsing on scroll</h2>
    <p>
      As iOS’s tab bars minimize while the content scrolls down: inside a{' '}
      <a href="viewport">Viewport</a>’s provider, <code>useViewportScroll</code>{' '}
      reports the scrolling’s direction (past a threshold) and whether it’s at
      the top. Scroll this page to see it:
    </p>
    <CodeView code={scrollCode} />
    <OnScroll />

    <h2>A mini player</h2>
    <p>
      Content of the app’s attached to the bar, as Music’s mini player: a{' '}
      <code>TabBar.Accessory</code> after the list, above the groups, and
      between them while the bar is collapsed (here, by search). The active tab
      ignores clicks (Base UI’s Tabs), so the search tab, clicked while
      searching, sets the section last chosen itself, expanding the bar.
    </p>
    <CodeView code={accessoryCode} />
    <MiniPlayer />
  </>
);
