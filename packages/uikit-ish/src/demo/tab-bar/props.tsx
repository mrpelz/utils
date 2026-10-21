/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

/** The demos' content: how many tabs the (first) group has. */
export const propOptionsContent = {
  tabs: [3, 2, 4, 5] as const,
};

/** The accessory demo's content: the states the accessory shows in. */
export const propOptionsAccessoryContent = {
  accessory: ['both', 'expanded', 'collapsed', false] as const,
};

export const propOptionsRoot = {
  ...commonPropOptions,
  orientation: [undefined, 'horizontal', 'vertical'] as const,
};

export const propOptionsList = {
  ...commonPropOptions,
  collapsed: [undefined, false, true] as const,
  collapsedContent: [undefined, 'symbol', 'label', 'symbolAndLabel'] as const,
  collapsedPosition: [
    undefined,
    'inline-start',
    'center',
    'inline-end',
  ] as const,
  size: [undefined, 'compact', 'regular'] as const,
  activateOnFocus: [undefined, false, true] as const,
  loopFocus: [undefined, false, true] as const,
  context: [
    undefined,
    'bright',
    'dim',
    'background-bright',
    'background-dim',
  ] as const,
};

/** The guide pages' content: how many of Phone's tabs (see phone.tsx). */
export const propOptionsPhoneContent = {
  tabs: [4, 2, 3] as const,
};

/** The overview's few: its look and states, not its plumbing. */
export const propOptionsOverviewList = {
  collapsed: [false, true] as const,
  collapsedContent: [undefined, 'symbol', 'label', 'symbolAndLabel'] as const,
  collapsedPosition: [
    undefined,
    'inline-start',
    'center',
    'inline-end',
  ] as const,
  size: [undefined, 'regular'] as const,
};

/** The iPad's list (regular first). */
export const propOptionsListRegular = {
  ...propOptionsList,
  size: ['regular', 'compact', undefined] as const,
};

export const propOptionsGroup = {
  // (Its own element: no `render`.)
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  shape: [undefined, 'capsule', 'circle'] as const,
  collapsedContent: [undefined, 'symbol', 'label', 'symbolAndLabel'] as const,
  collapsedPosition: [
    undefined,
    'inline-start',
    'center',
    'inline-end',
  ] as const,
  // Marked to remain while collapsed (otherwise, as iOS: see the demos).
  visibleWhenCollapsed: [undefined, false, true] as const,
};

export const getPropOptionsTab = (addLog: AddLog) => ({
  ...commonPropOptions,
  shape: [undefined, 'capsule', 'circle'] as const,
  collapsedContent: [undefined, 'symbol', 'label', 'symbolAndLabel'] as const,
  visibleWhenCollapsed: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  onSecondaryClick: [
    undefined,
    new MappedProp(
      () => addLog('tab secondary click'),
      '[log secondary click]',
    ),
  ] as const,
});

/** Parts taking only styling (`TabBar.Indicator`, `.Icon`, `.Label`). */
export const propOptionsStyling = {
  // (Its own element: no `render`.)
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const propOptionsPanel = {
  ...commonPropOptions,
  keepMounted: [undefined, false, true] as const,
};

// The guide's views (see parts.tsx): the first tab's (or its panel's) value
// (its own, or another, unselecting it), the indicator's hydration.

export const getPropOptionsGuideTab = (addLog: AddLog) => ({
  ...getPropOptionsTab(addLog),
  value: ['favorites', 'starred'] as const,
});

export const propOptionsGuidePanel = {
  ...propOptionsPanel,
  value: ['favorites', 'starred'] as const,
};

export const propOptionsGuideIndicator = {
  ...commonPropOptions,
  renderBeforeHydration: [undefined, false, true] as const,
};

export const propOptionsAccessory = {
  // (Its own element: no `render`.)
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  visibleIn: [undefined, 'both', 'expanded', 'collapsed'] as const,
  context: [
    undefined,
    'bright',
    'dim',
    'background-bright',
    'background-dim',
  ] as const,
};
