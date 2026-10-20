import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { sfForwardFill } from '@bradleyhodges/sfsymbols/sfForwardFill';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfPlayFill } from '@bradleyhodges/sfsymbols/sfPlayFill';
import { FunctionComponent, useMemo, useState } from 'react';

import { collapsedSelection, Symbol, TabBar } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { AddLog, useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useCreateStateUrl, useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { PartLink } from '../guide/sections.js';
import {
  tabBarAccessoryRows,
  tabBarGroupRows,
  tabBarIconRows,
  tabBarIndicatorRows,
  tabBarLabelRows,
  tabBarListRows,
  tabBarPanelRows,
  tabBarRootRows,
  tabBarTabRows,
} from './docs.js';
import {
  getPropOptionsTab,
  propOptionsAccessory,
  propOptionsGroup,
  propOptionsList,
  propOptionsPanel,
  propOptionsRoot,
  propOptionsStyling,
} from './props.js';
import { phoneTabs, phoneTabValues } from './tabs.js';

// Every view writes out its tab bar (Phone's, see tabs.ts), the part's
// props on it (on the first group, its indicator, its first tab and that
// tab's symbol and label), so its code shows as it'd be used.

/** The tab bar's value, logged, and what remains while collapsed. */
const usePhoneState = (addLog: AddLog) => {
  const [value, setValue] = useState<unknown>('favorites');
  const [sections, search] = collapsedSelection(
    [phoneTabValues, ['search']],
    value,
  );
  const onValueChange = (
    next: unknown,
    { reason }: BaseTabs.Root.ChangeEventDetails,
  ) => {
    addLog(`value change: ${String(next)}/${reason}`);
    setValue(next);
  };

  return { onValueChange, search, sections, value };
};

/** `TabBar.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'tab-bar-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsRoot,
    'TabBar.Root',
    external,
    true,
    true,
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="TabBar.Root"
    >
      <TabBar.Root
        key={elementKey}
        {...props}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List>
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

/** `TabBar.List`, outlined, with its props. */
const ListPart: FunctionComponent = () => {
  const id = 'tab-bar-parts-list';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsList,
    'TabBar.List',
    external,
    true,
    true,
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="TabBar.List"
    >
      <TabBar.Root
        key={elementKey}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List {...props}>
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

/** `TabBar.Group` (the sections'), outlined, with its props. */
const GroupPart: FunctionComponent = () => {
  const id = 'tab-bar-parts-group';
  const [log, addLog] = useLog();
  const [external, externalList] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsGroup,
    'TabBar.Group',
    external,
    true,
    true,
  );
  const [controlList, propsList, stateList] = usePropControl(
    propOptionsList,
    'TabBar.List',
    externalList,
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  return (
    <Component
      center
      inline
      controls={[control, controlList]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state, stateList])}
      title="TabBar.Group"
    >
      <TabBar.Root
        key={elementKey}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List {...propsList}>
          <TabBar.Group
            {...props}
            visibleWhenCollapsed={
              (props.visibleWhenCollapsed as boolean | undefined) ??
              sections?.remains
            }
          >
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

/** `TabBar.Indicator` (the sections' group's), outlined, with its props. */
const IndicatorPart: FunctionComponent = () => {
  const id = 'tab-bar-parts-indicator';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsStyling,
    'TabBar.Indicator',
    external,
    true,
    true,
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="TabBar.Indicator"
    >
      <TabBar.Root
        key={elementKey}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List>
          <TabBar.Group visibleWhenCollapsed={sections?.remains}>
            <TabBar.Indicator {...props} />
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

/** `TabBar.Tab` (Favorites), outlined, with its props. */
const TabPart: FunctionComponent = () => {
  const id = 'tab-bar-parts-tab';
  const [log, addLog] = useLog();
  const [external, externalList] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsTab(addLog), [addLog]),
    'TabBar.Tab',
    external,
    true,
    true,
  );
  const [controlList, propsList, stateList] = usePropControl(
    propOptionsList,
    'TabBar.List',
    externalList,
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  return (
    <Component
      center
      inline
      controls={[control, controlList]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state, stateList])}
      title="TabBar.Tab"
    >
      <TabBar.Root
        key={elementKey}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List {...propsList}>
          <TabBar.Group visibleWhenCollapsed={sections?.remains}>
            <TabBar.Indicator />
            {phoneTabs.map(([tab, label, icon], index) => (
              <TabBar.Tab
                key={tab}
                value={tab}
                visibleWhenCollapsed={sections?.tab === index}
                {...(index === 0 ? props : {})}
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

/** `TabBar.Icon` (Favorites'), outlined, with its props. */
const IconPart: FunctionComponent = () => {
  const id = 'tab-bar-parts-icon';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsStyling,
    'TabBar.Icon',
    external,
    true,
    true,
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="TabBar.Icon"
    >
      <TabBar.Root
        key={elementKey}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List>
          <TabBar.Group visibleWhenCollapsed={sections?.remains}>
            <TabBar.Indicator />
            {phoneTabs.map(([tab, label, icon], index) => (
              <TabBar.Tab
                key={tab}
                value={tab}
                visibleWhenCollapsed={sections?.tab === index}
              >
                <TabBar.Icon {...(index === 0 ? props : {})}>
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

/** `TabBar.Label` (Favorites'), outlined, with its props. */
const LabelPart: FunctionComponent = () => {
  const id = 'tab-bar-parts-label';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsStyling,
    'TabBar.Label',
    external,
    true,
    true,
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="TabBar.Label"
    >
      <TabBar.Root
        key={elementKey}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List>
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
                <TabBar.Label {...(index === 0 ? props : {})}>
                  {label}
                </TabBar.Label>
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

/** `TabBar.Panel` (Favorites'), outlined, with its props. */
const PanelPart: FunctionComponent = () => {
  const id = 'tab-bar-parts-panel';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsPanel,
    'TabBar.Panel',
    external,
    true,
    true,
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  return (
    <Component
      center
      inline
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="TabBar.Panel"
    >
      <TabBar.Root
        key={elementKey}
        className="tab-bar-demo-panels"
        value={value}
        onValueChange={onValueChange}
      >
        {phoneTabs.map(([tab, label], index) => (
          <TabBar.Panel
            key={tab}
            value={tab}
            {...(index === 0 ? props : {})}
          >
            {label}
          </TabBar.Panel>
        ))}
        <TabBar.Panel value="search">Search</TabBar.Panel>
        <TabBar.List>
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

/** `TabBar.Accessory` (a mini player), outlined, with its props. */
const AccessoryPart: FunctionComponent = () => {
  const id = 'tab-bar-parts-accessory';
  const [log, addLog] = useLog();
  const [external, externalList] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsAccessory,
    'TabBar.Accessory',
    external,
    true,
    true,
  );
  const [controlList, propsList, stateList] = usePropControl(
    propOptionsList,
    'TabBar.List',
    externalList,
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  return (
    <Component
      center
      inline
      controls={[control, controlList]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state, stateList])}
      title="TabBar.Accessory"
    >
      <TabBar.Root
        key={elementKey}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List {...propsList}>
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
            >
              <TabBar.Icon>
                <Symbol icon={sfMagnifyingglass} />
              </TabBar.Icon>
            </TabBar.Tab>
          </TabBar.Group>
        </TabBar.List>
        <TabBar.Accessory {...props}>
          <span className="tab-bar-demo-accessory-title">Not Playing</span>
          <Symbol icon={sfPlayFill} />
          <Symbol icon={sfForwardFill} />
        </TabBar.Accessory>
      </TabBar.Root>
    </Component>
  );
};

/** `/tab-bar/parts`: the root, the bar, its groups and tabs, the accessory. */
export const TabBarParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: the tabs’ state.</li>
      <li>List: the bar, holding groups (glass capsules).</li>
      <li>
        Group: its indicator (the selection) and tabs (a symbol and a label
        each).
      </li>
      <li>
        The root can also hold the sections’ panels, and an accessory after the
        list.
      </li>
    </ul>
    <ul>
      <li>
        <PartLink part="TabBar.Root" />
        <ul>
          <li>
            <PartLink part="TabBar.Panel" /> (one per tab, optional)
          </li>
          <li>
            <PartLink part="TabBar.List" />
            <ul>
              <li>
                <PartLink part="TabBar.Group" /> (one or more)
                <ul>
                  <li>
                    <PartLink part="TabBar.Indicator" /> (first)
                  </li>
                  <li>
                    <PartLink part="TabBar.Tab" />:{' '}
                    <PartLink part="TabBar.Icon" />,{' '}
                    <PartLink part="TabBar.Label" />
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <PartLink part="TabBar.Accessory" /> (optional)
          </li>
        </ul>
      </li>
    </ul>

    <h2 id="tabbar-root">
      <code>TabBar.Root</code>
    </h2>
    <ul>
      <li>Base UI’s Tabs root.</li>
      <li>
        Holds the active tab’s value (<code>value</code> or{' '}
        <code>defaultValue</code>, <code>onValueChange</code>), shared by tabs
        and panels.
      </li>
      <li>Links the list and its accessory.</li>
      <li>
        Renders a <code>div</code> around them.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarRootRows} />

    <h2 id="tabbar-list">
      <code>TabBar.List</code>
    </h2>
    <ul>
      <li>
        The bar, with the <code>tablist</code> role.
      </li>
      <li>
        <code>size</code>: iPhone’s <code>compact</code>, iPad’s{' '}
        <code>regular</code>.
      </li>
      <li>
        Collapsing: <code>collapsed</code>, <code>collapsedContent</code>,{' '}
        <code>collapsedPosition</code>.
      </li>
      <li>
        The glass’ <code>context</code>.
      </li>
      <li>
        Keyboard focus: <code>activateOnFocus</code>, <code>loopFocus</code>.
      </li>
      <li>Renders the lens shown while a tab is pressed.</li>
    </ul>
    <ListPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarListRows} />

    <h2 id="tabbar-group">
      <code>TabBar.Group</code>
    </h2>
    <ul>
      <li>
        A glass capsule of tabs in the list (here: the sections’, and search’s
        beside it).
      </li>
      <li>
        Remaining while collapsed: <code>visibleWhenCollapsed</code>, how and
        where.
      </li>
      <li>
        Its tabs’ default <code>shape</code>.
      </li>
    </ul>
    <GroupPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarGroupRows} />

    <h2 id="tabbar-indicator">
      <code>TabBar.Indicator</code>
    </h2>
    <ul>
      <li>The selection, first in each group.</li>
      <li>On the group’s active tab, sliding between its tabs.</li>
      <li>Hidden while a tab is pressed (the lens takes over).</li>
    </ul>
    <IndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarIndicatorRows} />

    <h2 id="tabbar-tab">
      <code>TabBar.Tab</code>
    </h2>
    <ul>
      <li>
        A tab, by its <code>value</code>.
      </li>
      <li>
        Can be <code>disabled</code>.
      </li>
      <li>
        Collapsing: <code>visibleWhenCollapsed</code>, its own{' '}
        <code>collapsedContent</code> and <code>shape</code>.
      </li>
      <li>
        Secondary clicks: <code>onSecondaryClick</code>.
      </li>
      <li>
        Without a label: give it an <code>aria-label</code> (as search’s).
      </li>
    </ul>
    <TabPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarTabRows} />

    <h2 id="tabbar-icon">
      <code>TabBar.Icon</code>
    </h2>
    <ul>
      <li>
        A tab’s symbol (e.g. a <code>Symbol</code>, with its badge).
      </li>
      <li>Sized by the list’s size; bolder while active.</li>
    </ul>
    <IconPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarIconRows} />

    <h2 id="tabbar-label">
      <code>TabBar.Label</code>
    </h2>
    <ul>
      <li>A tab’s label, sized by the list’s size.</li>
      <li>
        Width reserved for the active style: tabs don’t shift as the selection
        changes.
      </li>
      <li>Never truncates (a group scrolls instead).</li>
    </ul>
    <LabelPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarLabelRows} />

    <h2 id="tabbar-panel">
      <code>TabBar.Panel</code>
    </h2>
    <ul>
      <li>
        A section’s content (Base UI’s, unstyled), shown while the tab of its{' '}
        <code>value</code> is active.
      </li>
      <li>
        Hidden ones unmount, unless <code>keepMounted</code>.
      </li>
      <li>
        Panels as an app’s pages: <a href="tab-bar/composition">Composition</a>.
      </li>
    </ul>
    <PanelPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarPanelRows} />

    <h2 id="tabbar-accessory">
      <code>TabBar.Accessory</code>
    </h2>
    <ul>
      <li>App content in a glass capsule, after the list.</li>
      <li>
        Above the groups; between them while the bar is collapsed (collapse it
        with <code>TabBar.List</code>’s control).
      </li>
      <li>
        In both states, or one: <code>visibleIn</code>.
      </li>
    </ul>
    <AccessoryPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarAccessoryRows} />
  </>
);
