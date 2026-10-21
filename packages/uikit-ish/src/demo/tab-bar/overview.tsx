import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { FunctionComponent, useState } from 'react';

import { collapsedSelection, Symbol, TabBar } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
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
    '[content]',
    externalContent,
  );
  const [controlList, propsList, stateList, elementKey] = usePropControl(
    propOptionsOverviewList,
    'TabBar.List',
    externalList,
    true,
  );

  const [value, setValue] = useState<unknown>('favorites');
  const tabs = phoneTabs.slice(0, content.tabs);
  // What remains while collapsed: the active tab and its group.
  const [sections, search] = collapsedSelection(
    [tabs.map(([tab]) => tab), ['search']],
    value,
  );

  return (
    <Component
      center
      inline
      controls={[controlContent, controlList]}
      id={id}
      log={log}
      state={[stateContent, stateList]}
      title="Tab bar"
    >
      <TabBar.Root
        key={elementKey}
        value={value}
        onValueChange={(
          next: unknown,
          { reason }: BaseTabs.Root.ChangeEventDetails,
        ) => {
          addLog(`value change: ${String(next)}/${reason}`);
          setValue(next);
        }}
      >
        <TabBar.List {...propsList}>
          <TabBar.Group visibleWhenCollapsed={sections?.remains}>
            <TabBar.Indicator />
            {tabs.map(([tab, label, icon], index) => (
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
            >
              <TabBar.Icon>
                <Symbol icon={sfMagnifyingglass} />
              </TabBar.Icon>
            </TabBar.Tab>
          </TabBar.Group>
        </TabBar.List>
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
      <li>
        Switches between an app’s top-level sections (UIKit{' '}
        <code>UITabBar</code>).
      </li>
      <li>
        A glass capsule of tabs, floating at the window’s bottom; the selection
        slides to the tab chosen.
      </li>
      <li>
        Can collapse to its active tab (UIKit{' '}
        <code>tabBarMinimizeBehavior</code>).
      </li>
      <li>Can carry an accessory, e.g. a mini player.</li>
      <li>Base UI’s Tabs: controls the sections’ panels.</li>
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
        For two to five top-level sections people switch between, each keeping
        its own place (e.g. Phone’s Favorites, Recents, Contacts, Voicemail).
      </li>
      <li>Search can take a group of its own, beside the tabs (iOS 26).</li>
      <li>
        Tabs stay put: don’t add, remove or hide them as the app’s state changes
        (guide <GuideLink to="rule-g2">G2</GuideLink>).
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
        Actions (Add, Compose, Share): a <a href="toolbar">Toolbar</a>, as a tab
        bar navigates and never acts (guide{' '}
        <GuideLink to="rule-g1">G1</GuideLink>).
      </li>
      <li>
        Switching between views of the same content: a{' '}
        <a href="segmented">Segmented</a> control, in the content.
      </li>
      <li>
        Many or user-defined sections (folders, playlists): a{' '}
        <a href="sidebar">Sidebar</a> (guide{' '}
        <GuideLink to="section-7-3">§7.3</GuideLink>).
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most tab bars set, across their parts.</li>
      <li>
        All parts’ props: <a href="tab-bar/parts">Parts</a>.
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
        It’s Base UI’s Tabs: the list has the <code>tablist</code> role, each
        tab is a <code>button</code> with the <code>tab</code> role and{' '}
        <code>aria-selected</code>. Panels (
        <PartLink
          component="tab-bar"
          part="TabBar.Panel"
        />
        ) have the <code>tabpanel</code> role, are labelled by their tab (whose{' '}
        <code>aria-controls</code> points at them), and are focusable.
      </li>
      <li>
        A tab is named by its label; give a tab without one an{' '}
        <code>aria-label</code> (e.g. search’s).
      </li>
      <li>
        Keyboard: Tab focuses the active tab (the others are skipped); arrow
        keys move the focus between the tabs, across groups, wrapping at the
        ends (<code>loopFocus</code>); Enter or Space chooses the focused tab
        (or the arrow keys do, with <code>activateOnFocus</code>).
      </li>
      <li>
        Collapsed, the tabs that collapse away are hidden, so neither the
        keyboard nor assistive technology reaches them; the remaining ones stay.
      </li>
      <li>
        The lens and the labels’ width-reserving copies are hidden from
        assistive technology. The accessory isn’t part of the tab list: its
        content is the app’s, to be named as such.
      </li>
      <li>
        Its animations (selection, lens, collapsing) don’t follow{' '}
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
        Pressed, a glass lens appears under the pointer and follows it across
        the tabs, also into another group; released, the tab under it is chosen,
        and the lens settles into the selection. The group under the lens grows
        slightly.
      </li>
      <li>
        The selection slides between tabs of a group, and fades between groups.
      </li>
      <li>
        A group too narrow for its tabs keeps its shape and scrolls its tabs
        within (by wheel, or by dragging the lens near its ends).
      </li>
      <li>
        Collapsing and expanding are the app’s: e.g. on scrolling down and up (
        <PartLink
          component="viewport"
          part="useViewportScroll"
        />
        ), or on search (see <a href="tab-bar/composition">Composition</a>).
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const tabBarOverviewDemos = [LiveView];
