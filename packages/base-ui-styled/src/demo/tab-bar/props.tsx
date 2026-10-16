/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

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

/** The iPad's list (regular first). */
export const propOptionsListRegular = {
  ...propOptionsList,
  size: ['regular', 'compact', undefined] as const,
};

export const propOptionsGroup = {
  ...commonPropOptions,
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
