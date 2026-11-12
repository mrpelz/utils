import './style.css';

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { FunctionComponent, useMemo, useState } from 'react';

import {
  collapsedSelection,
  Symbol,
  TabBar,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfMagnifyingglass } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  tabBarAccessoryRows,
  tabBarGroupRows,
  tabBarListRows,
  tabBarPanelRows,
  tabBarRootRows,
  tabBarTabRows,
} from './docs.js';
import { propOptionsOverviewList, propOptionsPhoneContent } from './props.js';
import { phoneTabs } from './tabs.js';

/** Phone's tab bar, with a few of its list's props. */
const LiveView: FunctionComponent = () => {
  const id = 'tab-bar-overview';
  const [log, addLog] = useLog();
  const [externalContent, externalList] = useProvidedState(id);
  const [controlContent, content, stateContent] = usePropControl(
    propOptionsPhoneContent,
    { external: externalContent, title: '[content]' },
  );
  const [controlList, propsList, stateList, elementKey] = usePropControl(
    propOptionsOverviewList,
    { external: externalList, isOpen: true, title: 'TabBar.List' },
  );

  const [value, setValue] = useState<unknown>('favorites');
  const tabs = phoneTabs.slice(0, content.tabs);
  // What remains while collapsed: the active tab and its group.
  const [sections, search] = collapsedSelection(
    [tabs.map(([tab]) => tab), ['search']],
    value,
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Group': ['visibleWhenCollapsed'],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': ['aria-label', 'value', 'visibleWhenCollapsed'],
            'Viewport.BlockEnd': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[controlContent, controlList, partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[stateContent, stateList, partState]}
      title="Tab bar"
    >
      <TabBar.Root
        key={elementKey}
        {...partProps['TabBar.Root']}
        value={value}
        onValueChange={(
          next: unknown,
          { reason }: BaseTabs.Root.ChangeEventDetails,
        ) => {
          addLog(`value change: ${String(next)}/${reason}`);
          setValue(next);
        }}
      >
        <Viewport.BlockEnd {...partProps['Viewport.BlockEnd']}>
          <TabBar.List {...propsList}>
            <TabBar.Group
              {...partProps['TabBar.Group']}
              visibleWhenCollapsed={sections?.remains}
            >
              <TabBar.Indicator {...partProps['TabBar.Indicator']} />
              {tabs.map(([tab, label, icon], index) => (
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
                  {content.labels ? (
                    <TabBar.Label {...partProps['TabBar.Label']}>
                      {label}
                    </TabBar.Label>
                  ) : null}
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
        </Viewport.BlockEnd>
      </TabBar.Root>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/tab-bar`: what a tab bar is for, and its props. */
export const TabBarOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>Switches between an app’s top-level sections.</li>
      <li>
        A glass capsule of tabs that floats at the window’s bottom. The
        selection slides to the chosen tab.
      </li>
      <li>It can collapse to its active tab.</li>
      <li>It can carry an accessory, for example a mini player.</li>
      <li>It’s built on Base UI’s Tabs and controls the sections’ panels.</li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        For two to five top-level sections that people switch between, each
        keeping its own place (for example a phone app’s Favorites, Recents,
        Contacts and Voicemail).
      </li>
      <li>Search can get a group of its own, next to the tabs.</li>
      <li>
        Tabs stay put: don’t add, remove or hide them as the app’s state
        changes.
      </li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        Actions such as Add, Compose or Share: use a{' '}
        <a href={publicUrl('toolbar')}>Toolbar</a>. A tab bar navigates; it
        never acts.
      </li>
      <li>
        Switching between views of the same content: use a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control, inside the
        content.
      </li>
      <li>
        Many sections, or sections the user defines (folders, playlists): use a{' '}
        <a href={publicUrl('sidebar')}>Sidebar</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most tab bars set, across the parts.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('tab-bar/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'TabBar.Root',
          pickRows(tabBarRootRows, 'value', 'defaultValue', 'onValueChange'),
        ],
        ['TabBar.List', pickRows(tabBarListRows, 'collapsed', 'size')],
        ['TabBar.Group', pickRows(tabBarGroupRows, 'visibleWhenCollapsed')],
        [
          'TabBar.Tab',
          pickRows(tabBarTabRows, 'value', 'visibleWhenCollapsed', 'disabled'),
        ],
        ['TabBar.Panel', pickRows(tabBarPanelRows, 'value', 'keepMounted')],
        ['TabBar.Accessory', pickRows(tabBarAccessoryRows, 'visibleIn')],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        It’s Base UI’s Tabs. The list has the <code>tablist</code> role, and
        each tab is a <code>button</code> with the <code>tab</code> role and{' '}
        <code>aria-selected</code>. Panels (
        <PartLink
          component="tab-bar"
          part="TabBar.Panel"
        />
        ) have the <code>tabpanel</code> role, are labelled by their tab (whose{' '}
        <code>aria-controls</code> points at them), and can take focus.
      </li>
      <li>
        A tab is named by its label. Give a tab without one an{' '}
        <code>aria-label</code>, for example the search tab.
      </li>
      <li>
        Keyboard: Tab focuses the active tab and skips the others. The arrow
        keys move focus between the tabs, across groups, and wrap at the ends (
        <code>loopFocus</code>). Enter or Space chooses the focused tab, or the
        arrow keys do, with <code>activateOnFocus</code>.
      </li>
      <li>
        When collapsed, the tabs that collapse away are hidden, so neither the
        keyboard nor assistive technology reaches them. The remaining ones stay.
      </li>
      <li>
        The lens and the labels’ width-reserving copies are hidden from
        assistive technology. The accessory isn’t part of the tab list: its
        content belongs to the app, which names it.
      </li>
      <li>
        Its animations (the selection, the lens, collapsing) don’t follow{' '}
        <code>prefers-reduced-motion</code>.
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        When pressed, a glass lens appears under the pointer and follows it
        across the tabs, even into another group. On release, the tab under it
        is chosen, and the lens settles into the selection. The group under the
        lens grows slightly.
      </li>
      <li>
        The selection slides between tabs of the same group, and fades between
        groups.
      </li>
      <li>
        A group too narrow for its tabs keeps its shape and scrolls its tabs
        inside it, by wheel, or by dragging the lens near its ends.
      </li>
      <li>
        The app decides when to collapse and expand it, for example on scrolling
        down and up (
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        ), or on search (see{' '}
        <a href={publicUrl('tab-bar/composition')}>Composition</a>).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const tabBarOverviewDemos = [LiveView];
