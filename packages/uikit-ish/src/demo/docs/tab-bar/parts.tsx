import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { FunctionComponent, useMemo, useState } from 'react';

import {
  collapsedSelection,
  Symbol,
  TabBar,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import {
  sfForwardFill,
  sfMagnifyingglass,
  sfPlayFill,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  collapsedSelectionRows,
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
  getPropOptionsGuideTab,
  propOptionsAccessory,
  propOptionsGroup,
  propOptionsGuideIndicator,
  propOptionsGuidePanel,
  propOptionsList,
  propOptionsRoot,
  propOptionsStyling,
} from './props.js';
import { phoneTabs, phoneTabValues } from './tabs.js';

// Every view writes out its tab bar (Phone's, see tabs.ts), the part's
// props on it (on the first group, its indicator, its first tab and that
// tab's symbol and label), so its code shows as it'd be used.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in a code sample, not interpolations */
const collapsedSelectionCode = `const [sections, search] = collapsedSelection(
  [['favorites', 'recents', 'contacts'], ['search']],
  value,
);

<TabBar.Group visibleWhenCollapsed={sections.remains}>
  {['favorites', 'recents', 'contacts'].map((tab, index) => (
    <TabBar.Tab
      key={tab}
      value={tab}
      visibleWhenCollapsed={sections.tab === index}
    >
      …
    </TabBar.Tab>
  ))}
</TabBar.Group>
<TabBar.Group visibleWhenCollapsed={search.remains}>…</TabBar.Group>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

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
  const [control, props, state, elementKey] = usePropControl(propOptionsRoot, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'TabBar.Root',
  });
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

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
            'TabBar.List': [],
            'TabBar.Tab': ['aria-label', 'value', 'visibleWhenCollapsed'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="TabBar.Root"
    >
      <TabBar.Root
        key={elementKey}
        {...props}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List {...partProps['TabBar.List']}>
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
      </TabBar.Root>
    </Component>
  );
};

/** `TabBar.List`, outlined, with its props. */
const ListPart: FunctionComponent = () => {
  const id = 'tab-bar-parts-list';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(propOptionsList, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'TabBar.List',
  });
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

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
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="TabBar.List"
    >
      <TabBar.Root
        key={elementKey}
        {...partProps['TabBar.Root']}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List {...props}>
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
      </TabBar.Root>
    </Component>
  );
};

/** `TabBar.Group` (the sections'), outlined, with its props. */
const GroupPart: FunctionComponent = () => {
  const id = 'tab-bar-parts-group';
  const [log, addLog] = useLog();
  const [external, externalList] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(propOptionsGroup, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'TabBar.Group',
  });
  const [controlList, propsList, stateList] = usePropControl(propOptionsList, {
    external: externalList,
    title: 'TabBar.List',
  });
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Group (others)': ['visibleWhenCollapsed'],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': ['aria-label', 'value', 'visibleWhenCollapsed'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, controlList, partControls]}
      id={id}
      log={log}
      state={[state, stateList, partState]}
      title="TabBar.Group"
    >
      <TabBar.Root
        key={elementKey}
        {...partProps['TabBar.Root']}
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
            {...partProps['TabBar.Group (others)']}
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
    propOptionsGuideIndicator,
    { external, isOpen: true, emphasize: 'outline', title: 'TabBar.Indicator' },
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Indicator (others)': [],
            'TabBar.Group': ['visibleWhenCollapsed'],
            'TabBar.Icon': [],
            'TabBar.Label': [],
            'TabBar.List': [],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': ['aria-label', 'value', 'visibleWhenCollapsed'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="TabBar.Indicator"
    >
      <TabBar.Root
        key={elementKey}
        {...partProps['TabBar.Root']}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List {...partProps['TabBar.List']}>
          <TabBar.Group
            {...partProps['TabBar.Group']}
            visibleWhenCollapsed={sections?.remains}
          >
            <TabBar.Indicator {...props} />
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
            <TabBar.Indicator {...partProps['TabBar.Indicator (others)']} />
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
    useMemo(() => getPropOptionsGuideTab(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'TabBar.Tab' },
  );
  const [controlList, propsList, stateList] = usePropControl(propOptionsList, {
    external: externalList,
    title: 'TabBar.List',
  });
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Tab (others)': [
              'aria-label',
              'value',
              'visibleWhenCollapsed',
            ],
            'TabBar.Group': ['visibleWhenCollapsed'],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.Root': ['onValueChange', 'value'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, controlList, partControls]}
      id={id}
      log={log}
      state={[state, stateList, partState]}
      title="TabBar.Tab"
    >
      <TabBar.Root
        key={elementKey}
        {...partProps['TabBar.Root']}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List {...propsList}>
          <TabBar.Group
            {...partProps['TabBar.Group']}
            visibleWhenCollapsed={sections?.remains}
          >
            <TabBar.Indicator {...partProps['TabBar.Indicator']} />
            {phoneTabs.map(([tab, label, icon], index) => (
              <TabBar.Tab
                key={tab}
                value={tab}
                visibleWhenCollapsed={sections?.tab === index}
                {...(index === 0 ? props : partProps['TabBar.Tab (others)'])}
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
              {...partProps['TabBar.Tab (others)']}
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
    { external, isOpen: true, emphasize: 'outline', title: 'TabBar.Icon' },
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Icon (others)': [],
            'TabBar.Group': ['visibleWhenCollapsed'],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.List': [],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': ['aria-label', 'value', 'visibleWhenCollapsed'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="TabBar.Icon"
    >
      <TabBar.Root
        key={elementKey}
        {...partProps['TabBar.Root']}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List {...partProps['TabBar.List']}>
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
                <TabBar.Icon
                  {...(index === 0 ? props : partProps['TabBar.Icon (others)'])}
                >
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
            >
              <TabBar.Icon {...partProps['TabBar.Icon (others)']}>
                <Symbol
                  {...partProps.Symbol}
                  icon={sfMagnifyingglass}
                />
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
    { external, isOpen: true, emphasize: 'outline', title: 'TabBar.Label' },
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Label (others)': [],
            'TabBar.Group': ['visibleWhenCollapsed'],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.List': [],
            'TabBar.Root': ['onValueChange', 'value'],
            'TabBar.Tab': ['aria-label', 'value', 'visibleWhenCollapsed'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="TabBar.Label"
    >
      <TabBar.Root
        key={elementKey}
        {...partProps['TabBar.Root']}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List {...partProps['TabBar.List']}>
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
                <TabBar.Label
                  {...(index === 0
                    ? props
                    : partProps['TabBar.Label (others)'])}
                >
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
    propOptionsGuidePanel,
    { external, isOpen: true, emphasize: 'outline', title: 'TabBar.Panel' },
  );
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'TabBar.Panel (others)': ['value'],
            'TabBar.Group': ['visibleWhenCollapsed'],
            'TabBar.Icon': [],
            'TabBar.Indicator': [],
            'TabBar.Label': [],
            'TabBar.List': [],
            'TabBar.Root': ['className', 'onValueChange', 'value'],
            'TabBar.Tab': ['aria-label', 'value', 'visibleWhenCollapsed'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="TabBar.Panel"
    >
      <TabBar.Root
        key={elementKey}
        {...partProps['TabBar.Root']}
        className="tab-bar-demo-panels"
        value={value}
        onValueChange={onValueChange}
      >
        {phoneTabs.map(([tab, label], index) => (
          <TabBar.Panel
            key={tab}
            value={tab}
            {...(index === 0 ? props : partProps['TabBar.Panel (others)'])}
          >
            {label}
          </TabBar.Panel>
        ))}
        <TabBar.Panel
          {...partProps['TabBar.Panel (others)']}
          value="search"
        >
          Search
        </TabBar.Panel>
        <TabBar.List {...partProps['TabBar.List']}>
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
    { external, isOpen: true, emphasize: 'outline', title: 'TabBar.Accessory' },
  );
  const [controlList, propsList, stateList] = usePropControl(propOptionsList, {
    external: externalList,
    title: 'TabBar.List',
  });
  const { onValueChange, search, sections, value } = usePhoneState(addLog);

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
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      controls={[control, controlList, partControls]}
      id={id}
      log={log}
      state={[state, stateList, partState]}
      title="TabBar.Accessory"
    >
      <TabBar.Root
        key={elementKey}
        {...partProps['TabBar.Root']}
        value={value}
        onValueChange={onValueChange}
      >
        <TabBar.List {...propsList}>
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
        <TabBar.Accessory {...props}>
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
      </TabBar.Root>
    </Component>
  );
};

/** `/tab-bar/parts`: the root, the bar, its groups and tabs, the accessory. */
export const TabBarParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: holds the tabs’ state.</li>
      <li>List: the bar, holding groups (glass capsules).</li>
      <li>
        Group: holds the indicator (the selection) and the tabs, each with a
        symbol and a label.
      </li>
      <li>
        The root can also hold the sections’ panels, and an accessory after the
        list.
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="viewport"
          part="Viewport.Provider"
        />{' '}
        <span>(around the app)</span>
        <ul>
          <li>
            <PartLink
              component="tab-bar"
              part="TabBar.Root"
            />
            <ul>
              <li className="demo-tree-context">
                <PartLink
                  component="viewport"
                  part="Viewport.Content"
                />
                <ul>
                  <li>
                    <PartLink
                      component="tab-bar"
                      part="TabBar.Panel"
                    />{' '}
                    (optional, one per tab)
                  </li>
                </ul>
              </li>
              <li className="demo-tree-context">
                <PartLink
                  component="viewport"
                  part="Viewport.BlockEnd"
                />
                <ul>
                  <li>
                    <PartLink
                      component="tab-bar"
                      part="TabBar.List"
                    />
                    <ul>
                      <li>
                        <PartLink
                          component="tab-bar"
                          part="TabBar.Group"
                        />{' '}
                        (one or more)
                        <ul>
                          <li>
                            <PartLink
                              component="tab-bar"
                              part="TabBar.Indicator"
                            />{' '}
                            (first)
                          </li>
                          <li>
                            <PartLink
                              component="tab-bar"
                              part="TabBar.Tab"
                            />
                            :{' '}
                            <PartLink
                              component="tab-bar"
                              part="TabBar.Icon"
                            />{' '}
                            and{' '}
                            <PartLink
                              component="tab-bar"
                              part="TabBar.Label"
                            />{' '}
                            (one or both)
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <PartLink
                      component="tab-bar"
                      part="TabBar.Accessory"
                    />{' '}
                    (optional)
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink
          component="tab-bar"
          part="collapsedSelection"
        />{' '}
        (a helper: what remains while collapsed)
      </li>
    </ul>

    <Heading
      id="tabbar-root"
      level={2}
    >
      <code>TabBar.Root</code>
    </Heading>
    <ul>
      <li>Base UI’s Tabs root.</li>
      <li>
        Holds the active tab’s value (<code>value</code> or{' '}
        <code>defaultValue</code>, and <code>onValueChange</code>), shared by
        the tabs and the panels.
      </li>
      <li>Links the list and its accessory.</li>
      <li>
        Renders a <code>div</code> around them.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarRootRows} />

    <Heading
      id="tabbar-list"
      level={2}
    >
      <code>TabBar.List</code>
    </Heading>
    <ul>
      <li>
        The bar, with the <code>tablist</code> role.
      </li>
      <li>
        <code>size</code>: <code>compact</code> for a phone,{' '}
        <code>regular</code> for a tablet.
      </li>
      <li>
        Collapsing: <code>collapsed</code>, <code>collapsedContent</code> and{' '}
        <code>collapsedPosition</code>.
      </li>
      <li>
        The glass’s <code>context</code>.
      </li>
      <li>
        Keyboard focus: <code>activateOnFocus</code> and <code>loopFocus</code>.
      </li>
      <li>Renders the lens that shows while a tab is pressed.</li>
    </ul>
    <ListPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarListRows} />

    <Heading
      id="tabbar-group"
      level={2}
    >
      <code>TabBar.Group</code>
    </Heading>
    <ul>
      <li>
        A glass capsule of tabs inside the list. Here, one holds the sections,
        and another holds search next to it.
      </li>
      <li>
        Whether, how and where it remains while collapsed:{' '}
        <code>visibleWhenCollapsed</code>.
      </li>
      <li>
        The default <code>shape</code> of its tabs.
      </li>
    </ul>
    <GroupPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarGroupRows} />

    <Heading
      id="tabbar-indicator"
      level={2}
    >
      <code>TabBar.Indicator</code>
    </Heading>
    <ul>
      <li>The selection. It comes first in each group.</li>
      <li>It sits on the group’s active tab, and slides between its tabs.</li>
      <li>It hides while a tab is pressed, because the lens takes over.</li>
    </ul>
    <IndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarIndicatorRows} />

    <Heading
      id="tabbar-tab"
      level={2}
    >
      <code>TabBar.Tab</code>
    </Heading>
    <ul>
      <li>
        A tab, identified by its <code>value</code>.
      </li>
      <li>
        It can be <code>disabled</code>.
      </li>
      <li>
        Collapsing: <code>visibleWhenCollapsed</code>, and its own{' '}
        <code>collapsedContent</code> and <code>shape</code>.
      </li>
      <li>
        Secondary clicks: <code>onSecondaryClick</code>.
      </li>
      <li>
        Without a label, give it an <code>aria-label</code>, like the search
        tab.
      </li>
    </ul>
    <TabPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarTabRows} />

    <Heading
      id="tabbar-icon"
      level={2}
    >
      <code>TabBar.Icon</code>
    </Heading>
    <ul>
      <li>
        A tab’s symbol, for example a{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />
        , with its badge.
      </li>
      <li>Sized by the list’s size, and bolder while active.</li>
    </ul>
    <IconPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarIconRows} />

    <Heading
      id="tabbar-label"
      level={2}
    >
      <code>TabBar.Label</code>
    </Heading>
    <ul>
      <li>A tab’s label, sized by the list’s size.</li>
      <li>
        It reserves the width of its active style, so tabs don’t shift as the
        selection changes.
      </li>
      <li>It never truncates; a group scrolls instead.</li>
    </ul>
    <LabelPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarLabelRows} />

    <Heading
      id="tabbar-panel"
      level={2}
    >
      <code>TabBar.Panel</code>
    </Heading>
    <ul>
      <li>
        A section’s content (Base UI’s, unstyled), shown while the tab with its{' '}
        <code>value</code> is active.
      </li>
      <li>
        Hidden panels unmount, unless <code>keepMounted</code> is set.
      </li>
      <li>
        For panels as an app’s pages, see{' '}
        <a href={publicUrl('tab-bar/composition')}>Composition</a>.
      </li>
    </ul>
    <PanelPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarPanelRows} />

    <Heading
      id="tabbar-accessory"
      level={2}
    >
      <code>TabBar.Accessory</code>
    </Heading>
    <ul>
      <li>App content in a glass capsule, after the list.</li>
      <li>
        A{' '}
        <PartLink
          component="text-field"
          part="TextField.Root"
        />{' '}
        inside it (for example a search field) takes its whole width.
      </li>
      <li>
        It sits above the groups and spans the bar’s width, however many groups
        there are. While the bar is collapsed, it sits between them (collapse it
        with the{' '}
        <PartLink
          component="tab-bar"
          part="TabBar.List"
        />
        ’s control).
      </li>
      <li>
        It shows in both states, or in one: <code>visibleIn</code>.
      </li>
    </ul>
    <AccessoryPart />
    <h3>Props</h3>
    <PropsTable rows={tabBarAccessoryRows} />

    <Heading
      id="collapsedselection"
      level={2}
    >
      <code>collapsedSelection</code>
    </Heading>
    <ul>
      <li>
        Works out what remains while the bar is collapsed: the active tab and
        its group (without one, the first group’s first tab). Use it for the
        groups’ and tabs’ <code>visibleWhenCollapsed</code>.
      </li>
      <li>
        It’s the app’s choice, not the bar’s: the app may keep other groups and
        tabs instead, by marking them itself.
      </li>
    </ul>
    <CodeView code={collapsedSelectionCode} />
    <h3>Arguments and Return</h3>
    <PropsTable rows={collapsedSelectionRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const tabBarPartsDemos = [
  RootPart,
  ListPart,
  GroupPart,
  IndicatorPart,
  TabPart,
  IconPart,
  LabelPart,
  PanelPart,
  AccessoryPart,
];
