import './style.css';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { FunctionComponent, RefObject, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

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
import { CodeAroundContext, Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useLabelledRef } from '../../tooling/frame/render-code.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfForwardFill,
  sfHeartFill,
  sfMagnifyingglass,
  sfPlayFill,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { names } from '../viewport/content.js';
import { phoneTabs, phoneTabValues } from './tabs.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const panelsCode = `<TabBar.Root defaultValue="favorites">
  <Viewport.Content>
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
const field = useRef(null);

{/* Tracking the keyboard over its screen. */}
<Viewport.Provider>
<TabBar.Root
  value={value}
  onValueChange={(next) => {
    if (next !== 'search') {
      setValue(next);
      setSection(next);
      return;
    }
    // Collapsed at once (its accessory shown), the field focused in the
    // press (iOS shows the keyboard only then), not scrolled to (iOS
    // would shift the bars).
    flushSync(() => setValue(next));
    field.current?.focus({ preventScroll: true });
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
      {/* On the accessory's glass, as the collapsed bar's. */}
      <TextField.Frame variant="tab-bar-collapsed">
        <Symbol icon={sfMagnifyingglass} />
        <TextField.Control
          ref={field}
          aria-label="Search"
          placeholder="Search"
          type="search"
        />
        <TextField.Clear />
      </TextField.Frame>
    </TextField.Root>
  </TabBar.Accessory>
</TabBar.Root>
</Viewport.Provider>`;

const searchBesideCode = `const [query, setQuery] = useState('');

{/* Tracking the keyboard over its screen. */}
<Viewport.Provider>
  <TabBar.Root defaultValue="favorites">
    <Viewport.Content>…{/* the rows matching query */}</Viewport.Content>
    <Viewport.BlockEnd>
      <TabBar.List>
        <TabBar.Group>
          <TabBar.Indicator />
          {/* Its only tab: a circle, nothing to choose (no selection). */}
          <TabBar.Tab
            aria-label="Favorites"
            shape="circle"
            value="favorites"
          >
            …
          </TabBar.Tab>
        </TabBar.Group>
        {/* Beside the group, as a group's glass capsule. */}
        <TextField.Root>
          <TextField.Frame variant="tab-bar">
            <Symbol icon={sfMagnifyingglass} />
            <TextField.Control
              aria-label="Search"
              placeholder="Search"
              type="search"
              value={query}
              onValueChange={setQuery}
            />
            <TextField.Clear />
          </TextField.Frame>
        </TextField.Root>
      </TabBar.List>
    </Viewport.BlockEnd>
  </TabBar.Root>
</Viewport.Provider>`;

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
    'Anna Hall',
    'Bella Chen',
    'Benjamin Ortiz',
    'Carla Diaz',
    'Daniel Hughes',
    'David Turner',
    'Elena Petrova',
    'Felix Wagner',
    'Grace Kim',
    'Hank Zimmer',
    'Isabel Costa',
    'John Doe',
    'Kate Brown',
    'Liam Murphy',
    'Maya Singh',
    'Noah Fischer',
  ],
  favorites: ['Anna Hall', 'Kate Brown', 'John Doe'],
  recents: [
    'Kate Brown',
    'Daniel Hughes',
    'Anna Hall',
    'John Doe',
    'Hank Zimmer',
    'David Turner',
    'Kate Brown',
    'Anna Hall',
    'Maya Singh',
    'Daniel Hughes',
    'Grace Kim',
    'Kate Brown',
    'Felix Wagner',
    'John Doe',
    'Anna Hall',
    'Noah Fischer',
  ],
  voicemail: ['Daniel Hughes', 'Hank Zimmer'],
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Header.LargeTitle': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'Page.Root': [],
            'TabBar.Group': [],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.List': [],
            'TabBar.Panel': ['keepMounted', 'render', 'value'],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': ['value'],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockEnd': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('tab-bar-composition-panels') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="tab-bar-composition-panels"
      log={log}
      stage="phone"
      state={[partState]}
      title="Tab bar with panels"
    >
      <TabBar.Root
        {...partProps['TabBar.Root']}
        value={value}
        onValueChange={onValueChange}
      >
        <Viewport.Content {...partProps['Viewport.Content']}>
          {phoneTabs.map(([tab, label]) => (
            <TabBar.Panel
              key={tab}
              {...partProps['TabBar.Panel']}
              keepMounted
              render={<Page.Root {...partProps['Page.Root']} />}
              value={tab}
            >
              {/* (The panel is the page: its header within it, its bar
                 anchored all the same.) */}
              <Header.Root>
                <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                  <Toolbar.Root
                    {...partProps['Toolbar.Root']}
                    placement="block-start"
                  >
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>{label}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                <Viewport.Padding
                  {...partProps['Viewport.Padding']}
                  edge="block-start"
                />
                <Header.LargeTitle {...partProps['Header.LargeTitle']}>
                  <span>{label}</span>
                </Header.LargeTitle>
              </Header.Root>
              <List.Root {...partProps['List.Root']}>
                <List.Section {...partProps['List.Section']}>
                  <List.Group {...partProps['List.Group']}>
                    {rows[tab]?.map((name, index) => (
                      <List.Item
                        key={index}
                        {...partProps['List.Item']}
                      >
                        <List.Content {...partProps['List.Content']}>
                          <List.Title {...partProps['List.Title']}>
                            {name}
                          </List.Title>
                        </List.Content>
                      </List.Item>
                    ))}
                  </List.Group>
                </List.Section>
              </List.Root>
              <Viewport.Padding
                {...partProps['Viewport.Padding']}
                edge="block-end"
              />
            </TabBar.Panel>
          ))}
        </Viewport.Content>
        <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
          <TabBar.List {...partProps['TabBar.List']}>
            <TabBar.Group {...partProps['TabBar.Group']}>
              <TabBar.Indicator {...partProps['TabBar.Indicator']} />
              {phoneTabs.map(([tab, label, icon]) => (
                <TabBar.Tab
                  key={tab}
                  {...partProps['TabBar.Tab']}
                  value={tab}
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

/** Search: the bar collapses, the search field in its accessory. */
const Search: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [value, setValue] = useState<unknown>('favorites');
  const [section, setSection] = useState<unknown>('favorites');
  const [sections] = collapsedSelection([phoneTabValues], section);
  const field = useRef<HTMLInputElement>(null);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Accessory': ['visibleIn'],
            'TabBar.Group': [],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.List': ['collapsed'],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': ['aria-label', 'value', 'visibleWhenCollapsed'],
            'TextField.Clear': [],
            'TextField.Control': ['aria-label', 'placeholder', 'ref', 'type'],
            'TextField.Frame': ['variant'],
            'TextField.Root': [],
            'Viewport.BlockEnd': [],
            'Viewport.Provider': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('tab-bar-composition-search') },
  );

  return (
    <Component
      hasInputGuards
      isInline
      controls={[partControls]}
      id="tab-bar-composition-search"
      log={log}
      stage="phone"
      state={[partState]}
      title="Tab bar with search"
    >
      {/* Tracking the keyboard over its screen (see Viewport.Provider). */}
      <Viewport.Provider {...partProps['Viewport.Provider']}>
        <TabBar.Root
          {...partProps['TabBar.Root']}
          value={value}
          onValueChange={(
            next: unknown,
            { reason }: BaseTabs.Root.ChangeEventDetails,
          ) => {
            addLog(`value change: ${String(next)}/${reason}`);
            if (next !== 'search') {
              setValue(next);
              setSection(next);
              return;
            }
            // Searching: the bar collapsed (its accessory shown) at once, its
            // field focused, still in the press (iOS shows the keyboard
            // only then).
            flushSync(() => setValue(next));
            field.current?.focus({ preventScroll: true });
          }}
        >
          <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
            <TabBar.List
              {...partProps['TabBar.List']}
              collapsed={value === 'search'}
            >
              <TabBar.Group
                {...partProps['TabBar.Group']}
                visibleWhenCollapsed
              >
                <TabBar.Indicator {...partProps['TabBar.Indicator']} />
                {phoneTabs.map(([tab, label, icon], index) => (
                  <TabBar.Tab
                    key={tab}
                    {...partProps['TabBar.Tab']}
                    value={tab}
                    visibleWhenCollapsed={sections?.tab === index}
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
              <TabBar.Group {...partProps['TabBar.Group']}>
                <TabBar.Indicator {...partProps['TabBar.Indicator']} />
                <TabBar.Tab
                  {...partProps['TabBar.Tab']}
                  aria-label="Search"
                  value="search"
                >
                  <TabBar.Icon {...partProps['TabBar.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfMagnifyingglass}
                    />
                  </TabBar.Icon>
                </TabBar.Tab>
              </TabBar.Group>
            </TabBar.List>
            <TabBar.Accessory
              {...partProps['TabBar.Accessory']}
              visibleIn="collapsed"
            >
              <TextField.Root {...partProps['TextField.Root']}>
                <TextField.Frame
                  {...partProps['TextField.Frame']}
                  variant="tab-bar-collapsed"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfMagnifyingglass}
                  />
                  <TextField.Control
                    {...partProps['TextField.Control']}
                    ref={field}
                    aria-label="Search"
                    placeholder="Search"
                    type="search"
                  />
                  <TextField.Clear {...partProps['TextField.Clear']} />
                </TextField.Frame>
              </TextField.Root>
            </TabBar.Accessory>
          </Viewport.BlockEnd>
        </TabBar.Root>
      </Viewport.Provider>
    </Component>
  );
};

/** A search field beside the tabs: a group's glass capsule, filtering. */
const SearchBeside: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [query, setQuery] = useState('');
  const matching = names.filter((name) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'TabBar.Group': [],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.List': [],
            'TabBar.Root': ['defaultValue', 'onValueChange'],
            'TabBar.Tab': ['aria-label', 'shape', 'value'],
            'TextField.Clear': [],
            'TextField.Control': [
              'aria-label',
              'onValueChange',
              'placeholder',
              'type',
              'value',
            ],
            'TextField.Frame': ['variant'],
            'TextField.Root': [],
            'Viewport.BlockEnd': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
            'Viewport.Provider': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('tab-bar-composition-search-beside') },
  );

  return (
    <Component
      hasInputGuards
      isInline
      controls={[partControls]}
      id="tab-bar-composition-search-beside"
      log={log}
      stage="phone"
      state={[partState]}
      title="Tab bar with a search field beside it"
    >
      {/* Tracking the keyboard over its screen (see Viewport.Provider). */}
      <Viewport.Provider {...partProps['Viewport.Provider']}>
        <TabBar.Root
          {...partProps['TabBar.Root']}
          defaultValue="favorites"
          onValueChange={(
            next: unknown,
            { reason }: BaseTabs.Root.ChangeEventDetails,
          ) => addLog(`value change: ${String(next)}/${reason}`)}
        >
          <Viewport.Content {...partProps['Viewport.Content']}>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-start"
            />
            <List.Root {...partProps['List.Root']}>
              <List.Section {...partProps['List.Section']}>
                <List.Group {...partProps['List.Group']}>
                  {matching.map((name) => (
                    <List.Item
                      key={name}
                      {...partProps['List.Item']}
                    >
                      <List.Content {...partProps['List.Content']}>
                        <List.Title {...partProps['List.Title']}>
                          {name}
                        </List.Title>
                      </List.Content>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            </List.Root>
            <Viewport.Padding
              {...partProps['Viewport.Padding']}
              edge="block-end"
            />
          </Viewport.Content>
          <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
            <TabBar.List {...partProps['TabBar.List']}>
              <TabBar.Group {...partProps['TabBar.Group']}>
                <TabBar.Indicator {...partProps['TabBar.Indicator']} />
                <TabBar.Tab
                  {...partProps['TabBar.Tab']}
                  aria-label="Favorites"
                  shape="circle"
                  value="favorites"
                >
                  <TabBar.Icon {...partProps['TabBar.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfHeartFill}
                    />
                  </TabBar.Icon>
                </TabBar.Tab>
              </TabBar.Group>
              <TextField.Root {...partProps['TextField.Root']}>
                <TextField.Frame
                  {...partProps['TextField.Frame']}
                  variant="tab-bar"
                >
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfMagnifyingglass}
                  />
                  <TextField.Control
                    {...partProps['TextField.Control']}
                    aria-label="Search"
                    placeholder="Search"
                    type="search"
                    value={query}
                    onValueChange={(value: string) => setQuery(value)}
                  />
                  <TextField.Clear {...partProps['TextField.Clear']} />
                </TextField.Frame>
              </TextField.Root>
            </TabBar.List>
          </Viewport.BlockEnd>
        </TabBar.Root>
      </Viewport.Provider>
    </Component>
  );
};

/** Badges on Recents and Voicemail. */
const Badges: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [value, onValueChange] = useValue(addLog);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Badge: ['placement'],
            Symbol: ['icon'],
            'TabBar.Group': [],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.List': [],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': ['value'],
            'Viewport.BlockEnd': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('tab-bar-composition-badges') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="tab-bar-composition-badges"
      log={log}
      stage="phone"
      state={[partState]}
      title="Tab bar with badges"
    >
      <TabBar.Root
        {...partProps['TabBar.Root']}
        value={value}
        onValueChange={onValueChange}
      >
        <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
          <TabBar.List {...partProps['TabBar.List']}>
            <TabBar.Group {...partProps['TabBar.Group']}>
              <TabBar.Indicator {...partProps['TabBar.Indicator']} />
              {phoneTabs.map(([tab, label, icon], index) => (
                <TabBar.Tab
                  key={tab}
                  {...partProps['TabBar.Tab']}
                  value={tab}
                >
                  <TabBar.Icon {...partProps['TabBar.Icon']}>
                    <Symbol
                      {...partProps.Symbol}
                      icon={icon}
                    >
                      {index % 2 === 1 ? (
                        <Badge
                          {...partProps.Badge}
                          placement="symbol"
                        >
                          {index}
                        </Badge>
                      ) : null}
                    </Symbol>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'TabBar.Group': [],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.List': ['collapsed'],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': ['value', 'visibleWhenCollapsed'],
            'Viewport.BlockEnd': [],
            'Viewport.Content': ['ref'],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('tab-bar-composition-scroll') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="tab-bar-composition-scroll"
      log={log}
      screenRef={screenRef}
      stage="phone"
      state={[partState]}
      title="Tab bar collapsing on scroll"
    >
      <TabBar.Root
        {...partProps['TabBar.Root']}
        value={value}
        onValueChange={onValueChange}
      >
        <Viewport.Content
          {...partProps['Viewport.Content']}
          ref={contentRef}
        >
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-start"
          />
          <List.Root {...partProps['List.Root']}>
            <List.Section {...partProps['List.Section']}>
              <List.Group {...partProps['List.Group']}>
                {names.map((name) => (
                  <List.Item
                    key={name}
                    {...partProps['List.Item']}
                  >
                    <List.Content {...partProps['List.Content']}>
                      <List.Title {...partProps['List.Title']}>
                        {name}
                      </List.Title>
                    </List.Content>
                  </List.Item>
                ))}
              </List.Group>
            </List.Section>
          </List.Root>
          <Viewport.Padding
            {...partProps['Viewport.Padding']}
            edge="block-end"
          />
        </Viewport.Content>
        <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
          <TabBar.List
            {...partProps['TabBar.List']}
            collapsed={isCollapsed}
          >
            <TabBar.Group
              {...partProps['TabBar.Group']}
              visibleWhenCollapsed
            >
              <TabBar.Indicator {...partProps['TabBar.Indicator']} />
              {phoneTabs.map(([tab, label, icon], index) => (
                <TabBar.Tab
                  key={tab}
                  {...partProps['TabBar.Tab']}
                  value={tab}
                  visibleWhenCollapsed={sections?.tab === index}
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

/** `OnScrollView`, tracking its screen's content layer's scrolling. */
const OnScroll: FunctionComponent = () => {
  const contentRef = useLabelledRef<HTMLDivElement>(
    'contentRef',
    'HTMLDivElement',
  );
  const screenRef = useRef<HTMLDivElement>(null);

  // (In the code: the provider as the app writes it, around the stage's.)
  const around = useMemo(
    () => <Viewport.Provider scroller={contentRef} />,
    [contentRef],
  );

  return (
    <Viewport.Provider
      screen={screenRef}
      scroller={contentRef}
    >
      <CodeAroundContext.Provider value={around}>
        <OnScrollView
          contentRef={contentRef}
          screenRef={screenRef}
        />
      </CodeAroundContext.Provider>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Accessory': [],
            'TabBar.Group': ['visibleWhenCollapsed'],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.List': ['collapsed'],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': [
              'aria-label',
              'onClick',
              'value',
              'visibleWhenCollapsed',
            ],
            'Viewport.BlockEnd': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('tab-bar-composition-accessory') },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id="tab-bar-composition-accessory"
      log={log}
      stage="phone"
      state={[partState]}
      title="Tab bar with an accessory"
    >
      <TabBar.Root
        {...partProps['TabBar.Root']}
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
        <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
          <TabBar.List
            {...partProps['TabBar.List']}
            collapsed={value === 'search'}
          >
            <TabBar.Group
              {...partProps['TabBar.Group']}
              visibleWhenCollapsed={sections?.remains}
            >
              <TabBar.Indicator {...partProps['TabBar.Indicator']} />
              {phoneTabs.map(([tab, label, icon], index) => (
                <TabBar.Tab
                  key={tab}
                  {...partProps['TabBar.Tab']}
                  value={tab}
                  visibleWhenCollapsed={sections?.tab === index}
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
            <TabBar.Group
              {...partProps['TabBar.Group']}
              visibleWhenCollapsed={search?.remains}
            >
              <TabBar.Indicator {...partProps['TabBar.Indicator']} />
              <TabBar.Tab
                {...partProps['TabBar.Tab']}
                aria-label="Search"
                value="search"
                visibleWhenCollapsed={search?.remains}
                onClick={() => {
                  if (value !== 'search') return;
                  addLog(`value change: ${String(section)}/search tab`);
                  setValue(section);
                }}
              >
                <TabBar.Icon {...partProps['TabBar.Icon']}>
                  <Symbol
                    {...partProps.Symbol}
                    icon={sfMagnifyingglass}
                  />
                </TabBar.Icon>
              </TabBar.Tab>
            </TabBar.Group>
          </TabBar.List>
          <TabBar.Accessory {...partProps['TabBar.Accessory']}>
            <span className="tab-bar-demo-accessory-title">Not Playing</span>
            <Symbol
              {...partProps.Symbol}
              icon={sfPlayFill}
            />
            <Symbol
              {...partProps.Symbol}
              icon={sfForwardFill}
            />
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
  ['a-search-field-beside-the-tabs', 'A search field beside the tabs'],
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
        It’s Base UI’s Tabs: the root holds the tabs and the sections’ panels,
        and shows the active tab’s panel.
      </li>
      <li>
        As an app’s shell, each panel renders as a{' '}
        <a href={publicUrl('page')}>Page</a> (with <code>render</code>) that
        scrolls on its own, in the <a href={publicUrl('viewport')}>Viewport</a>
        ’s content layer.
      </li>
      <li>
        The bar floats above it, anchored at the bottom (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        ).
      </li>
      <li>
        Each section keeps its place. <code>keepMounted</code> keeps hidden
        panels mounted (otherwise they unmount), and with them their pages’
        scroll positions. Scroll Recents, switch away and back to see it.
      </li>
      <li>
        <strong>Library:</strong> the tab bar (
        <PartLink
          component="tab-bar"
          part="TabBar.Root"
        />
        , with its tabs, its indicator and its panels kept mounted) floating at
        the bottom (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        ), with each panel a{' '}
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
      <li>Search gets a group of its own, after the sections’ group.</li>
      <li>Choosing it collapses the bar to the section chosen last.</li>
      <li>
        The search field appears next to it, in an accessory that shows only
        while collapsed (<code>visibleIn</code>). It holds a{' '}
        <a href={publicUrl('text-field')}>Text Field</a>’s search field, styled
        for the accessory’s glass like the collapsed bar (
        <PartLink
          component="text-field"
          part="TextField.Frame"
        />{' '}
        <code>variant=&quot;tab-bar-collapsed&quot;</code>).
      </li>
      <li>
        Choosing search focuses the field at once, which opens the keyboard. The
        app does that: it renders the collapsed bar synchronously (
        <code>flushSync</code>), then focuses the field while still handling the
        press, without scrolling to it (<code>preventScroll</code>).
      </li>
      <li>Choosing the section again expands the bar.</li>
      <li>
        <strong>Library:</strong> the search tab’s own group, collapsing the
        bar, and the accessory (
        <PartLink
          component="tab-bar"
          part="TabBar.Accessory"
        />
        ) that shows only while collapsed, with its search field in the
        collapsed bar’s look (
        <PartLink
          component="text-field"
          part="TextField.Frame"
        />{' '}
        <code>variant</code>).
      </li>
      <li>
        <strong>Demo:</strong> the value and the section chosen last (the app’s
        state), and the search field’s query.
      </li>
    </ul>
    <CodeView code={searchCode} />
    <Search />

    <Heading
      id="a-search-field-beside-the-tabs"
      level={2}
    >
      A search field beside the tabs
    </Heading>
    <ul>
      <li>
        A search field that’s always at hand: in the bar, next to the tabs’
        group, taking the bar’s free space.
      </li>
      <li>
        The bar’s only tab is a circle (<code>shape=&quot;circle&quot;</code>),
        without a selection, since there’s nothing to choose.
      </li>
      <li>
        The field looks like a group: a glass capsule as tall as the tabs (
        <PartLink
          component="text-field"
          part="TextField.Frame"
        />{' '}
        <code>variant=&quot;tab-bar&quot;</code>).
      </li>
      <li>
        The on-screen keyboard pushes it up together with the bar (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        , with the keyboard tracked by a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />
        ).
      </li>
      <li>
        <strong>Library:</strong> the search field’s tab bar look (
        <PartLink
          component="text-field"
          part="TextField.Frame"
        />{' '}
        <code>variant</code>) next to a{' '}
        <PartLink
          component="tab-bar"
          part="TabBar.Group"
        />{' '}
        in the{' '}
        <PartLink
          component="tab-bar"
          part="TabBar.List"
        />
        .
      </li>
      <li>
        <strong>Demo:</strong> the query (the app’s state), filtering the rows.
      </li>
    </ul>
    <CodeView code={searchBesideCode} />
    <SearchBeside />

    <Heading
      id="badges-on-tabs"
      level={2}
    >
      Badges on tabs
    </Heading>
    <ul>
      <li>
        A section’s news, such as missed calls or new voicemail: a{' '}
        <a href={publicUrl('badge')}>Badge</a> inside the tab’s{' '}
        <a href={publicUrl('symbol')}>Symbol</a>.
      </li>
      <li>
        It sits on the glyph, and stays solid while the symbol blends with the
        glass.
      </li>
      <li>It shows that there’s activity in the section.</li>
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
      <li>The tab bar minimizes while the content scrolls down.</li>
      <li>
        Inside a <a href={publicUrl('viewport')}>Viewport</a>’s provider,{' '}
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
        App content attached to the bar, such as a music app’s mini player: a{' '}
        <PartLink
          component="tab-bar"
          part="TabBar.Accessory"
        />{' '}
        after the list.
      </li>
      <li>
        It sits above the groups and spans the bar’s width. While the bar is
        collapsed (here, by search), it sits between them.
      </li>
      <li>
        The active tab ignores clicks (as in Base UI’s Tabs). So the search tab,
        clicked while searching, sets the section chosen last itself, which
        expands the bar.
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
        <strong>Demo:</strong> the player, the value and the section chosen
        last.
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
  SearchBeside,
  Badges,
  OnScroll,
  MiniPlayer,
];
