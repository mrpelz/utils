import type { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { Properties } from 'csstype';
import type { ComponentProps } from 'react';

import type { GlassContext } from '../glass/main.js';
import type { SecondaryClickProps } from '../utils/main.js';

export type Size = 'compact' | 'regular';

export type CollapsedContent = 'label' | 'symbol' | 'symbolAndLabel';

/** Whether a group remains while collapsed, and which of its tabs does. */
export type CollapsedGroupSelection = { remains: boolean; tab: number };

export type CollapsedPosition = 'center' | 'inline-end' | 'inline-start';

/** Whether a group or a tab remains while collapsed, if marks decide it. */
export type CollapsedVisibility = 'away' | 'shown';

export type Box = { height: number; left: number; right: number; top: number };

/**
 * The accessory's morph to its place above the groups (`collapsed` false) or
 * between them, from where it was (relative to the list), along with the
 * groups' transitions: straight to its place as they'll have ended (see
 * `atTransitionsEnd`), not following them on their way (e.g. towards a
 * collapsing group's far edge, narrowing meanwhile); expanding, the same
 * way back. Also the groups remaining while collapsed (all groups take
 * pointer events again while expanding).
 */
export type AccessoryMorph = {
  collapsed: boolean;
  frame?: number;
  from?: Box;
  remaining: HTMLElement[];
  // Its place as the groups will be, as last measured (in a frame, by
  // `document.timeline`'s time, as it's placed several times a frame).
  target?: { box: Box; time: CSSNumberish | null };
  // The transitions it morphs along (those running as it started, not
  // later ones, e.g. once the groups have settled).
  transitions?: CSSTransition[];
};

export type TabBarRootProps = Omit<BaseTabs.Root.Props, 'ref'>;

/** The list's state, for its groups and tabs (internal). */
export type ListState = {
  collapsed: boolean;
  collapsedPosition: CollapsedPosition;
  markGroup?: () => () => void;
  markedGroups: number;
};

export type TabBarListProps = BaseTabs.List.Props & {
  /**
   * Minimized (UIKit `tabBarMinimizeBehavior`): only the groups and tabs
   * marked `visibleWhenCollapsed` remain, by default as symbols in circles.
   */
  collapsed?: boolean;
  /**
   * What the collapsed bar's tab shows: its symbol in a circle, its label,
   * or both side by side in a capsule.
   * @default its symbol, or, without one, its label
   */
  collapsedContent?: CollapsedContent;
  /**
   * Where the collapsed bar's tab is, along the bar.
   * @default 'inline-start'
   */
  collapsedPosition?: CollapsedPosition;
  /**
   * Brightness of the content behind the glass.
   * @default 'bright', or 'dim' in dark mode
   */
  context?: GlassContext;
  /**
   * UIKit size class: `compact` is the iPhone tab bar (content stacked),
   * `regular` the iPad tab bar (content in a row).
   * @default 'compact'
   */
  size?: Size;
};

export type Shape = 'capsule' | 'circle';

/** The group's state, for its tabs (internal). */
export type GroupState = {
  away: boolean;
  markTab?: () => () => void;
  markedTabs: number;
  shape?: Shape;
};

export type TabBarGroupProps = ComponentProps<'div'> & {
  /**
   * What the collapsed bar's tabs in the group show.
   * @default the list's `collapsedContent`
   */
  collapsedContent?: CollapsedContent;
  /**
   * Where the group is, along the collapsed bar.
   * @default the list's `collapsedPosition`
   */
  collapsedPosition?: CollapsedPosition;
  /**
   * Default shape of the contained tabs.
   * @default by their content
   */
  shape?: Shape;
  /**
   * Remains while the bar is collapsed, with its tabs marked so; groups not
   * marked collapse away (see `collapsedSelection`).
   */
  visibleWhenCollapsed?: boolean;
};

export type TabBarTabProps = BaseTabs.Tab.Props &
  SecondaryClickProps & {
    /**
     * What the tab shows while its bar is collapsed. Never nothing: a tab with
     * only a label shows its label, one with only a symbol its symbol.
     * @default the group's `collapsedContent`, or the list's
     */
    collapsedContent?: CollapsedContent;
    /**
     * The cursor (where the pointer hovers).
     * @default 'pointer' (disabled: 'not-allowed')
     */
    cursor?: Properties['cursor'];
    /**
     * `circle`: sized like a symbol-only tab; `capsule`: like a stacked tab.
     * @default the group's shape, or by the tab's content
     */
    shape?: Shape;
    /**
     * Remains while the bar is collapsed, in its group (if the group does);
     * tabs not marked collapse away. Several remaining tabs show the
     * selection on the active one.
     */
    visibleWhenCollapsed?: boolean;
  };

/**
 * The bar's states the accessory shows in: `both` (morphing between its
 * places), only `expanded` (above the groups), or only `collapsed` (between
 * the remaining groups).
 */
export type AccessoryVisibility = 'both' | 'collapsed' | 'expanded';

export type TabBarAccessoryProps = ComponentProps<'div'> & {
  /**
   * Brightness of the content behind the glass (as the list's).
   * @default 'bright', or 'dim' in dark mode
   */
  context?: GlassContext;
  /**
   * The bar's states it shows in; fading out and in as the bar collapses
   * and expands, unless `both`.
   * @default 'both'
   */
  visibleIn?: AccessoryVisibility;
};
