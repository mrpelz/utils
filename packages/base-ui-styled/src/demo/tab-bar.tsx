import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { sfHouseFill } from '@bradleyhodges/sfsymbols/sfHouseFill';
import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfPlus } from '@bradleyhodges/sfsymbols/sfPlus';
import { FunctionComponent, ReactNode, useMemo } from 'react';

import { TabBar } from '../components/index.js';
import {
  commonPropOptions,
  Component,
  MappedProp,
  useLog,
  usePropControl,
} from './utils/main.js';
import { SFSymbol } from './utils/symbol.js';

// The catalogue has neither `star.fill` nor `sidebar.left` (Figma), so
// `heart.fill` and `list.bullet` stand in.
const symbols = {
  'heart.fill': <SFSymbol icon={sfHeartFill} />,
  'house.fill': <SFSymbol icon={sfHouseFill} />,
  'list.bullet': <SFSymbol icon={sfListBullet} />,
  magnifyingglass: <SFSymbol icon={sfMagnifyingglass} />,
  plus: <SFSymbol icon={sfPlus} />,
} satisfies Record<string, ReactNode>;

type SymbolName = keyof typeof symbols;

const symbolNames = Object.keys(symbols) as SymbolName[];

const labels = ['Label', 'Long tab label', 'Search'];

/** Content of a tab: a symbol, a label, or both. */
type TabPreset = { label?: string; symbol?: SymbolName };

const symbolProp = (name: SymbolName) =>
  new MappedProp(symbols[name], `[${name}]`);

// Options with the preset's content first, and “none” (`undefined`) last
// unless it's the preset's.
const symbolOptions = (initial?: SymbolName) => [
  ...(initial ? [symbolProp(initial)] : [undefined]),
  ...symbolNames
    .filter((name) => name !== initial)
    .map((name) => symbolProp(name)),
  ...(initial ? [undefined] : []),
];

const labelOptions = (initial?: string) => [
  initial,
  ...labels.filter((label) => label !== initial),
  ...(initial ? [undefined] : []),
];

const getPropOptionsTab = ({ label, symbol }: TabPreset) => ({
  ...commonPropOptions,
  // Content, not `TabBar.Tab` props.
  symbol: symbolOptions(symbol),
  label: labelOptions(label),
  shape: [undefined, 'capsule', 'circle'] as const,
  collapsedContent: [undefined, 'symbol', 'label', 'symbolAndLabel'] as const,
  disabled: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
});

const propOptionsList = {
  ...commonPropOptions,
  collapsed: [undefined, false, true] as const,
  collapsedContent: [undefined, 'symbol', 'label', 'symbolAndLabel'] as const,
  collapsedPosition: [undefined, 'start', 'center', 'end'] as const,
  activateOnFocus: [undefined, false, true] as const,
  loopFocus: [undefined, false, true] as const,
  context: [undefined, 'bright', 'dim'] as const,
};

const propOptionsGroup = {
  ...commonPropOptions,
  shape: [undefined, 'capsule', 'circle'] as const,
};

const propOptionsIndicator = {
  ...commonPropOptions,
};

const propOptionsPanel = {
  ...commonPropOptions,
};

const defaultTab: TabPreset = { label: 'Label', symbol: 'heart.fill' };

// Only there to type unused slots; every slot has options.
const fallbackTabOptions = getPropOptionsTab(defaultTab);
const defaultSecondaryTab: TabPreset = { symbol: 'magnifyingglass' };

const primaryValues = Array.from(
  { length: 9 },
  (_, index) => `tab-${index + 1}`,
);
const secondaryValues = Array.from(
  { length: 3 },
  (_, index) => `secondary-${index + 1}`,
);

type Preset = {
  defaultValue: string;
  id: string;
  /** Tabs of the first group (up to 9). */
  primary: TabPreset[];
  /** Tabs of a second group (up to 3). */
  secondary?: TabPreset[];
  /** The list's size (iPhone: compact, iPad: regular). */
  size?: 'compact' | 'regular';
  title: string;
};

const usePreset = (preset: Preset) =>
  useMemo(
    () => ({
      content: {
        tabs: [
          preset.primary.length,
          ...[1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
            (count) => count !== preset.primary.length,
          ),
        ],
        secondaryTabs: [
          preset.secondary?.length ?? 0,
          ...[0, 1, 2, 3].filter(
            (count) => count !== (preset.secondary?.length ?? 0),
          ),
        ],
        panels: [false, true] as const,
      },
      list: {
        ...propOptionsList,
        size: [
          preset.size,
          ...([undefined, 'compact', 'regular'] as const).filter(
            (size) => size !== preset.size,
          ),
        ],
      },
      primary: primaryValues.map((_, index) =>
        getPropOptionsTab(preset.primary[index] ?? defaultTab),
      ),
      secondary: secondaryValues.map((_, index) =>
        getPropOptionsTab(preset.secondary?.[index] ?? defaultSecondaryTab),
      ),
    }),
    [preset],
  );

// Tabs, groups and their content are all configurable; the presets only set
// what the controls start with.
const TabBarDemoBase: FunctionComponent<{ preset: Preset }> = ({ preset }) => {
  const [log, addLog] = useLog();
  const options = usePreset(preset);

  const [controlContent, content] = usePropControl(
    options.content,
    '[content]',
    true,
  );

  const [controlRoot, propsRoot, RemounterRoot] = usePropControl(
    useMemo(
      () => ({
        ...commonPropOptions,
        defaultValue: [
          preset.defaultValue,
          ...[...primaryValues.slice(0, 2), 'secondary-1'].filter(
            (value) => value !== preset.defaultValue,
          ),
          undefined,
        ],
        value: [undefined, preset.defaultValue],
        onValueChange: [
          new MappedProp(
            (value: unknown, { reason }: BaseTabs.Root.ChangeEventDetails) =>
              addLog(`value change: ${String(value)}/${reason}`),
            '[log change]',
          ),
          undefined,
        ] as const,
      }),
      [addLog, preset.defaultValue],
    ),
    'root',
    true,
  );

  const [controlList, propsList] = usePropControl(options.list, 'list', true);

  const [controlGroup, propsGroup] = usePropControl(propOptionsGroup, 'group');

  const [controlIndicator, propsIndicator] = usePropControl(
    propOptionsIndicator,
    'indicator',
  );

  const tab1 = usePropControl(
    options.primary[0] ?? fallbackTabOptions,
    '1st tab',
  );
  const tab2 = usePropControl(
    options.primary[1] ?? fallbackTabOptions,
    '2nd tab',
  );
  const tab3 = usePropControl(
    options.primary[2] ?? fallbackTabOptions,
    '3rd tab',
  );
  const tab4 = usePropControl(
    options.primary[3] ?? fallbackTabOptions,
    '4th tab',
  );
  const tab5 = usePropControl(
    options.primary[4] ?? fallbackTabOptions,
    '5th tab',
  );
  const tab6 = usePropControl(
    options.primary[5] ?? fallbackTabOptions,
    '6th tab',
  );
  const tab7 = usePropControl(
    options.primary[6] ?? fallbackTabOptions,
    '7th tab',
  );
  const tab8 = usePropControl(
    options.primary[7] ?? fallbackTabOptions,
    '8th tab',
  );
  const tab9 = usePropControl(
    options.primary[8] ?? fallbackTabOptions,
    '9th tab',
  );

  const [controlSecondaryGroup, propsSecondaryGroup] = usePropControl(
    propOptionsGroup,
    'secondary group',
  );

  const [controlSecondaryIndicator, propsSecondaryIndicator] = usePropControl(
    propOptionsIndicator,
    'secondary indicator',
  );

  const secondaryTab1 = usePropControl(
    options.secondary[0] ?? fallbackTabOptions,
    '1st secondary tab',
  );
  const secondaryTab2 = usePropControl(
    options.secondary[1] ?? fallbackTabOptions,
    '2nd secondary tab',
  );
  const secondaryTab3 = usePropControl(
    options.secondary[2] ?? fallbackTabOptions,
    '3rd secondary tab',
  );

  const [controlIcon, propsIcon] = usePropControl(commonPropOptions, 'icons');

  const [controlLabel, propsLabel] = usePropControl(
    commonPropOptions,
    'labels',
  );

  const [controlPanel, propsPanel] = usePropControl(propOptionsPanel, 'panels');

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

  const renderTab = ({
    props: { label, symbol, ...props },
    value,
  }: (typeof primaryTabs)[number]) => (
    <TabBar.Tab
      key={value}
      value={value}
      {...props}
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
    >
      <RemounterRoot>
        <TabBar.Root {...propsRoot}>
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
          <TabBar.List {...propsList}>
            <TabBar.Group {...propsGroup}>
              <TabBar.Indicator {...propsIndicator} />
              {primaryTabs.map((tab) => renderTab(tab))}
            </TabBar.Group>
            {secondaryTabs.length > 0 ? (
              <TabBar.Group {...propsSecondaryGroup}>
                <TabBar.Indicator {...propsSecondaryIndicator} />
                {secondaryTabs.map((tab) => renderTab(tab))}
              </TabBar.Group>
            ) : null}
          </TabBar.List>
        </TabBar.Root>
      </RemounterRoot>
    </Component>
  );
};

const presetTabBar: Preset = {
  defaultValue: 'tab-1',
  id: 'tab-bar',
  primary: [defaultTab, defaultTab, defaultTab],
  title: 'Tab Bar',
};

const presetSecondary: Preset = {
  defaultValue: 'tab-1',
  id: 'tab-bar-secondary',
  primary: [defaultTab, defaultTab, defaultTab],
  secondary: [defaultSecondaryTab],
  title: 'Tab Bar (Secondary Group)',
};

// Figma “Tab Bar - iPad”: a single group whose tabs only have labels, between
// a sidebar and a search tab that only have symbols.
const presetRegular: Preset = {
  defaultValue: 'tab-2',
  id: 'tab-bar-regular',
  primary: [
    { symbol: 'list.bullet' },
    ...Array.from({ length: 7 }, () => ({ label: 'Label' })),
    { symbol: 'magnifyingglass' },
  ],
  size: 'regular',
  title: 'Tab Bar (iPad)',
};

export const TabBarDemo: FunctionComponent = () => (
  <TabBarDemoBase preset={presetTabBar} />
);

export const TabBarSecondaryDemo: FunctionComponent = () => (
  <TabBarDemoBase preset={presetSecondary} />
);

export const TabBarRegularDemo: FunctionComponent = () => (
  <TabBarDemoBase preset={presetRegular} />
);
