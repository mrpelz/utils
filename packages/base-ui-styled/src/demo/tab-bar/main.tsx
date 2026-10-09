import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { sfForwardFill } from '@bradleyhodges/sfsymbols/sfForwardFill';
import { sfPlayFill } from '@bradleyhodges/sfsymbols/sfPlayFill';
import { FunctionComponent, useLayoutEffect, useMemo, useState } from 'react';

import {
  collapsedSelection,
  TabBar,
  useViewportScroll,
  Viewport,
} from '../../components/index.js';
import { useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { SFSymbol } from '../utils/symbol.js';
import {
  createExpansion,
  fallbackTabOptions,
  getPresetOptions,
  getPropOptionsGroup,
  getPropOptionsRoot,
  Preset,
  presetRegular,
  presetSecondary,
  presetTabBar,
  primaryValues,
  propOptionsIndicator,
  propOptionsPanel,
  secondaryValues,
} from './props.js';

// Tabs, groups and their content are all configurable; the presets only set
// what the controls start with.
//
// What the app does (here, the demo): whether the bar is collapsed (unless
// the list's control says), and what remains while it is (see `remaining`).
const TabBarDemoBase: FunctionComponent<{ preset: Preset }> = ({ preset }) => {
  const [log, addLog] = useLog();

  const [
    externalContent,
    externalRoot,
    externalList,
    externalGroup,
    externalIndicator,
    externalTab1,
    externalTab2,
    externalTab3,
    externalTab4,
    externalTab5,
    externalTab6,
    externalTab7,
    externalTab8,
    externalTab9,
    externalSecondaryGroup,
    externalSecondaryIndicator,
    externalSecondaryTab1,
    externalSecondaryTab2,
    externalSecondaryTab3,
    externalIcon,
    externalLabel,
    externalPanel,
  ] = useProvidedState(preset.id);
  const options = useMemo(
    () => getPresetOptions(preset, addLog),
    [addLog, preset],
  );
  const [collapsedState, setCollapsed] = useState(false);
  // Clicks expanding the bar, for the handlers (see `createExpansion`).
  const [expansion] = useState(createExpansion);
  // The active tab's value, since the root's default value (see below).
  const [active, setActive] = useState<{ since: unknown; value: unknown }>({
    since: preset.defaultValue,
    value: preset.defaultValue,
  });

  const [controlContent, content, stateContent] = usePropControl(
    options.content,
    '[content]',
    externalContent,
    true,
  );

  // Collapsing while scrolling down, expanding while scrolling up.
  useViewportScroll(({ atTop, direction }) => {
    if (!content.collapseOnScroll) return;
    setCollapsed(!atTop && direction === 'down');
  });

  const [controlRoot, propsRoot, stateRoot, RemounterRoot] = usePropControl(
    useMemo(
      () => getPropOptionsRoot(preset, addLog, setCollapsed, expansion),
      [addLog, expansion, preset],
    ),
    'root',
    externalRoot,
    true,
  );

  // The value, as the demo's state (also with the control's handler).
  const { onValueChange, ...rootProps } = propsRoot;
  const activeValue =
    active.since === rootProps.defaultValue
      ? active.value
      : rootProps.defaultValue;
  const shownValue = rootProps.value ?? activeValue;

  const [controlList, propsList, stateList] = usePropControl(
    options.list,
    'list',
    externalList,
    true,
  );

  const collapsed = propsList.collapsed ?? collapsedState;
  useLayoutEffect(() => expansion.sync(collapsed));

  const groupOptions = useMemo(
    () => getPropOptionsGroup(setCollapsed, expansion),
    [expansion],
  );

  const [controlGroup, propsGroup, stateGroup] = usePropControl(
    groupOptions,
    'group',
    externalGroup,
  );

  const [controlIndicator, propsIndicator, stateIndicator] = usePropControl(
    propOptionsIndicator,
    'indicator',
    externalIndicator,
  );

  const tab1 = usePropControl(
    options.primary[0] ?? fallbackTabOptions,
    '1st tab',
    externalTab1,
  );
  const tab2 = usePropControl(
    options.primary[1] ?? fallbackTabOptions,
    '2nd tab',
    externalTab2,
  );
  const tab3 = usePropControl(
    options.primary[2] ?? fallbackTabOptions,
    '3rd tab',
    externalTab3,
  );
  const tab4 = usePropControl(
    options.primary[3] ?? fallbackTabOptions,
    '4th tab',
    externalTab4,
  );
  const tab5 = usePropControl(
    options.primary[4] ?? fallbackTabOptions,
    '5th tab',
    externalTab5,
  );
  const tab6 = usePropControl(
    options.primary[5] ?? fallbackTabOptions,
    '6th tab',
    externalTab6,
  );
  const tab7 = usePropControl(
    options.primary[6] ?? fallbackTabOptions,
    '7th tab',
    externalTab7,
  );
  const tab8 = usePropControl(
    options.primary[7] ?? fallbackTabOptions,
    '8th tab',
    externalTab8,
  );
  const tab9 = usePropControl(
    options.primary[8] ?? fallbackTabOptions,
    '9th tab',
    externalTab9,
  );

  const [controlSecondaryGroup, propsSecondaryGroup, stateSecondaryGroup] =
    usePropControl(groupOptions, 'secondary group', externalSecondaryGroup);

  const [
    controlSecondaryIndicator,
    propsSecondaryIndicator,
    stateSecondaryIndicator,
  ] = usePropControl(
    propOptionsIndicator,
    'secondary indicator',
    externalSecondaryIndicator,
  );

  const secondaryTab1 = usePropControl(
    options.secondary[0] ?? fallbackTabOptions,
    '1st secondary tab',
    externalSecondaryTab1,
  );
  const secondaryTab2 = usePropControl(
    options.secondary[1] ?? fallbackTabOptions,
    '2nd secondary tab',
    externalSecondaryTab2,
  );
  const secondaryTab3 = usePropControl(
    options.secondary[2] ?? fallbackTabOptions,
    '3rd secondary tab',
    externalSecondaryTab3,
  );

  const [controlIcon, propsIcon, stateIcon] = usePropControl(
    commonPropOptions,
    'icons',
    externalIcon,
  );

  const [controlLabel, propsLabel, stateLabel] = usePropControl(
    commonPropOptions,
    'labels',
    externalLabel,
  );

  const [controlPanel, propsPanel, statePanel] = usePropControl(
    propOptionsPanel,
    'panels',
    externalPanel,
  );

  const primaryTabs = [tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8, tab9]
    .slice(0, content.tabs)
    .map(([control, props], index) => ({
      control,
      props,
      value: primaryValues[index],
    }));

  const secondaryTabs = [secondaryTab1, secondaryTab2, secondaryTab3]
    .slice(0, content.secondaryTabs)
    .map(([control, props], index) => ({
      control,
      props,
      value: secondaryValues[index],
    }));

  // What remains while collapsed: the groups and tabs marked by their
  // controls, if any are (a group with marked tabs counts as marked); others
  // as iOS (`collapsedSelection`): the active tab and its group.
  const groups = [primaryTabs, secondaryTabs].filter((tabs) => tabs.length);
  const selection = collapsedSelection(
    groups.map((tabs) => tabs.map((tab) => tab.value)),
    shownValue,
  );
  const groupProps = [propsGroup, propsSecondaryGroup];
  const marked = groups.map(
    (tabs, index) =>
      Boolean(groupProps[index]?.visibleWhenCollapsed) ||
      tabs.some((tab) => tab.props.visibleWhenCollapsed),
  );
  const remaining = (group: number, tab?: number) => {
    const tabs = groups[group] ?? [];
    const remains = Boolean(
      marked.some(Boolean) ? marked[group] : selection[group]?.remains,
    );
    if (tab === undefined) return remains;
    if (tabs.some(({ props }) => props.visibleWhenCollapsed)) {
      return Boolean(tabs[tab]?.props.visibleWhenCollapsed);
    }
    return tab === selection[group]?.tab;
  };

  const renderTab = (
    { props: { label, symbol, ...props }, value }: (typeof primaryTabs)[number],
    group: number,
    index: number,
  ) => (
    <TabBar.Tab
      key={value}
      value={value}
      {...props}
      visibleWhenCollapsed={remaining(group, index)}
    >
      {symbol === undefined ? null : (
        <TabBar.Icon {...propsIcon}>{symbol}</TabBar.Icon>
      )}
      {label === undefined ? null : (
        <TabBar.Label {...propsLabel}>{label}</TabBar.Label>
      )}
    </TabBar.Tab>
  );

  const panelValues = [...primaryTabs, ...secondaryTabs].map(
    ({ value }) => value,
  );

  return (
    <Component
      center
      baseUiId="tabs"
      id={preset.id}
      log={log}
      title={preset.title}
      controls={[
        controlContent,
        controlRoot,
        controlList,
        controlGroup,
        controlIndicator,
        ...primaryTabs.map(({ control }) => control),
        ...(secondaryTabs.length > 0
          ? [
              controlSecondaryGroup,
              controlSecondaryIndicator,
              ...secondaryTabs.map(({ control }) => control),
            ]
          : []),
        controlIcon,
        controlLabel,
        controlPanel,
      ]}
      stateUrl={useCreateStateUrl(preset.id, [
        stateContent,
        stateRoot,
        stateList,
        stateGroup,
        stateIndicator,
        tab1[2],
        tab2[2],
        tab3[2],
        tab4[2],
        tab5[2],
        tab6[2],
        tab7[2],
        tab8[2],
        tab9[2],
        stateSecondaryGroup,
        stateSecondaryIndicator,
        secondaryTab1[2],
        secondaryTab2[2],
        secondaryTab3[2],
        stateIcon,
        stateLabel,
        statePanel,
      ])}
    >
      <RemounterRoot>
        <TabBar.Root
          {...rootProps}
          onValueChange={(
            next: unknown,
            details: BaseTabs.Root.ChangeEventDetails,
          ) => {
            setActive({ since: rootProps.defaultValue, value: next });
            onValueChange?.(next, details);
          }}
        >
          {content.panels
            ? panelValues.map((value) => (
                <TabBar.Panel
                  key={value}
                  {...propsPanel}
                  value={value}
                >
                  Panel: {value}
                </TabBar.Panel>
              ))
            : null}
          <TabBar.List
            {...propsList}
            collapsed={collapsed}
          >
            <TabBar.Group
              {...propsGroup}
              visibleWhenCollapsed={remaining(0)}
            >
              <TabBar.Indicator {...propsIndicator} />
              {primaryTabs.map((tab, index) => renderTab(tab, 0, index))}
            </TabBar.Group>
            {secondaryTabs.length > 0 ? (
              <TabBar.Group
                {...propsSecondaryGroup}
                visibleWhenCollapsed={remaining(1)}
              >
                <TabBar.Indicator {...propsSecondaryIndicator} />
                {secondaryTabs.map((tab, index) => renderTab(tab, 1, index))}
              </TabBar.Group>
            ) : null}
          </TabBar.List>
          {content.accessory ? (
            // A mini player, as in Music.
            <TabBar.Accessory visibleIn={content.accessory}>
              <span style={{ flex: 1 }}>Not Playing</span>
              <SFSymbol icon={sfPlayFill} />
              <SFSymbol icon={sfForwardFill} />
            </TabBar.Accessory>
          ) : null}
        </TabBar.Root>
      </RemounterRoot>
    </Component>
  );
};

// The page's scroll, for `collapseOnScroll`.
export const TabBarDemo: FunctionComponent = () => (
  <Viewport.Provider>
    <TabBarDemoBase preset={presetTabBar} />
  </Viewport.Provider>
);

export const TabBarSecondaryDemo: FunctionComponent = () => (
  <Viewport.Provider>
    <TabBarDemoBase preset={presetSecondary} />
  </Viewport.Provider>
);

export const TabBarRegularDemo: FunctionComponent = () => (
  <Viewport.Provider>
    <TabBarDemoBase preset={presetRegular} />
  </Viewport.Provider>
);
