/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { sfHeartFill } from '@bradleyhodges/sfsymbols/sfHeartFill';
import { sfHouseFill } from '@bradleyhodges/sfsymbols/sfHouseFill';
import { sfListBullet } from '@bradleyhodges/sfsymbols/sfListBullet';
import { sfMagnifyingglass } from '@bradleyhodges/sfsymbols/sfMagnifyingglass';
import { sfPlus } from '@bradleyhodges/sfsymbols/sfPlus';
import { Dispatch, MouseEvent, ReactNode, SetStateAction } from 'react';

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';
import { SFSymbol } from '../utils/symbol.js';

// The catalogue has neither `star.fill` nor `sidebar.left` (Figma), so
// `heart.fill` and `list.bullet` stand in.
export const symbols = {
  'heart.fill': <SFSymbol icon={sfHeartFill} />,
  'house.fill': <SFSymbol icon={sfHouseFill} />,
  'list.bullet': <SFSymbol icon={sfListBullet} />,
  magnifyingglass: <SFSymbol icon={sfMagnifyingglass} />,
  plus: <SFSymbol icon={sfPlus} />,
} satisfies Record<string, ReactNode>;

export type SymbolName = keyof typeof symbols;

export const symbolNames = Object.keys(symbols) as SymbolName[];

export const labels = ['Label', 'Long tab label', 'Search'];

/** Content of a tab: a symbol, a label, or both. */
export type TabPreset = { label?: string; symbol?: SymbolName };

export const symbolProp = (name: SymbolName) =>
  new MappedProp(symbols[name], `[${name}]`);

// Options with the preset's content first, and “none” (`undefined`) last
// unless it's the preset's.
export const symbolOptions = (initial?: SymbolName) => [
  ...(initial ? [symbolProp(initial)] : [undefined]),
  ...symbolNames
    .filter((name) => name !== initial)
    .map((name) => symbolProp(name)),
  ...(initial ? [undefined] : []),
];

export const labelOptions = (initial?: string) => [
  initial,
  ...labels.filter((label) => label !== initial),
  ...(initial ? [undefined] : []),
];

export const getPropOptionsTab = ({ label, symbol }: TabPreset) => ({
  ...commonPropOptions,
  // Content, not `TabBar.Tab` props.
  symbol: symbolOptions(symbol),
  label: labelOptions(label),
  shape: [undefined, 'capsule', 'circle'] as const,
  collapsedContent: [undefined, 'symbol', 'label', 'symbolAndLabel'] as const,
  visibleWhenCollapsed: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
});

export const propOptionsList = {
  ...commonPropOptions,
  collapsed: [undefined, false, true] as const,
  collapsedContent: [undefined, 'symbol', 'label', 'symbolAndLabel'] as const,
  collapsedPosition: [undefined, 'start', 'center', 'end'] as const,
  activateOnFocus: [undefined, false, true] as const,
  loopFocus: [undefined, false, true] as const,
  context: [undefined, 'bright', 'dim'] as const,
};

export const propOptionsGroup = {
  ...commonPropOptions,
  shape: [undefined, 'capsule', 'circle'] as const,
  collapsedContent: [undefined, 'symbol', 'label', 'symbolAndLabel'] as const,
  collapsedPosition: [undefined, 'start', 'center', 'end'] as const,
  // Marked (see `remaining`); otherwise, the demo decides.
  visibleWhenCollapsed: [undefined, false, true] as const,
};

/** Collapses (or expands) the bar (the demo's state, see `TabBarDemoBase`). */
export type SetCollapsed = Dispatch<SetStateAction<boolean>>;

/** Whether a click is on the active tab (re-clicked: no value change). */
export const onActiveTab = ({ target }: MouseEvent<HTMLElement>) =>
  target instanceof Element &&
  Boolean(target.closest('[role=tab]')?.hasAttribute('data-active'));

/**
 * Clicks expanding the collapsed bar (see `getPropOptionsGroup`), so the
 * value change of the same click doesn't collapse it again (see
 * `getPropOptionsRoot`): marked by a group's handler, taken by the root's.
 */
export const createExpansion = () => {
  let collapsed = false;
  let expanded = false;

  return {
    /** Whether the bar is collapsed (as last rendered, see `sync`). */
    isCollapsed: () => collapsed,
    /** Marks the click expanding the bar (until it has been handled). */
    mark: () => {
      expanded = true;
      setTimeout(() => {
        expanded = false;
      });
    },
    /** Keeps whether the bar is collapsed. */
    sync: (next: boolean) => {
      collapsed = next;
    },
    /** Whether the current click expanded the bar. */
    take: () => {
      const was = expanded;
      expanded = false;
      return was;
    },
  };
};

export type Expansion = ReturnType<typeof createExpansion>;

// A group's click (also on its active tab, which doesn't change the value)
// expands the collapsed bar; the tab is selected all the same. Captured,
// before the tab's value changes (which may collapse it again, see
// `secondaryCollapses`).
//
// Re-clicking the active tab changes no value, so nothing collapses the bar
// again, unless a group's click handler does (“collapse on the active tab”).
export const getPropOptionsGroup = (
  setCollapsed: SetCollapsed,
  expansion: Expansion,
) => {
  const expand = new MappedProp(() => {
    if (expansion.isCollapsed()) expansion.mark();
    setCollapsed(false);
  }, '[expand when collapsed]');
  const toggleOnActive = new MappedProp((event: MouseEvent<HTMLElement>) => {
    const collapsed = expansion.isCollapsed();
    if (collapsed) expansion.mark();
    setCollapsed(collapsed ? false : onActiveTab(event));
  }, '[expand when collapsed, collapse on the active tab]');
  const toggle = new MappedProp(
    () => setCollapsed((collapsed) => !collapsed),
    '[toggle collapsed]',
  );

  return {
    ...propOptionsGroup,
    onClickCapture: [expand, toggleOnActive, toggle, undefined] as const,
  };
};

export const propOptionsIndicator = {
  ...commonPropOptions,
};

export const propOptionsPanel = {
  ...commonPropOptions,
};

export const defaultTab: TabPreset = { label: 'Label', symbol: 'heart.fill' };

// Only there to type unused slots; every slot has options.
export const fallbackTabOptions = getPropOptionsTab(defaultTab);
export const defaultSecondaryTab: TabPreset = { symbol: 'magnifyingglass' };

export const primaryValues = Array.from(
  { length: 9 },
  (_, index) => `tab-${index + 1}`,
);
export const secondaryValues = Array.from(
  { length: 3 },
  (_, index) => `secondary-${index + 1}`,
);

export type Preset = {
  defaultValue: string;
  id: string;
  /** Tabs of the first group (up to 9). */
  primary: TabPreset[];
  /** Tabs of a second group (up to 3). */
  secondary?: TabPreset[];
  /** Selecting a secondary tab (e.g. search) collapses the bar. */
  secondaryCollapses?: boolean;
  /** The list's size (iPhone: compact, iPad: regular). */
  size?: 'compact' | 'regular';
  title: string;
};

/** The demo's options, as a preset starts them. */
export const getPresetOptions = (preset: Preset) => ({
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
    // The accessory, shown in these states (`visibleIn`).
    accessory: [false, 'both', 'expanded', 'collapsed'] as const,
    // The bar collapses while the page scrolls down, expands while it
    // scrolls up (see `useViewportScroll`).
    collapseOnScroll: [false, true] as const,
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
});

/** The root's options: the preset's value, and handlers (see `Preset`). */
export const getPropOptionsRoot = (
  preset: Preset,
  addLog: AddLog,
  setCollapsed: SetCollapsed,
  expansion: Expansion,
) => ({
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
    ...(preset.secondaryCollapses
      ? [
          new MappedProp(
            (next: unknown, { reason }: BaseTabs.Root.ChangeEventDetails) => {
              addLog(`value change: ${String(next)}/${reason}`);
              if (String(next).startsWith('secondary')) {
                setCollapsed(true);
              }
            },
            '[log change, collapse on secondary]',
          ),
        ]
      : []),
    new MappedProp(
      (next: unknown, { reason }: BaseTabs.Root.ChangeEventDetails) =>
        addLog(`value change: ${String(next)}/${reason}`),
      '[log change]',
    ),
    new MappedProp(
      (next: unknown, { reason }: BaseTabs.Root.ChangeEventDetails) => {
        addLog(`value change: ${String(next)}/${reason}`);
        // Not by the click that expanded the bar.
        if (!expansion.take()) setCollapsed(true);
      },
      '[log change, collapse on any change]',
    ),
    undefined,
  ] as const,
});

export const presetTabBar: Preset = {
  defaultValue: 'tab-1',
  id: 'tab-bar',
  primary: [defaultTab, defaultTab, defaultTab],
  title: 'Tab Bar',
};

export const presetSecondary: Preset = {
  defaultValue: 'tab-1',
  id: 'tab-bar-secondary',
  primary: [defaultTab, defaultTab, defaultTab],
  secondary: [defaultSecondaryTab],
  secondaryCollapses: true,
  title: 'Tab Bar (Secondary Group)',
};

// Figma “Tab Bar - iPad”: a single group whose tabs only have labels, between
// a sidebar and a search tab that only have symbols.
export const presetRegular: Preset = {
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
