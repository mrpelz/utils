/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { propOptionsRoot as propOptionsButtonRoot } from '../button/props.js';
import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

export const cursorOptions = [undefined, 'auto', 'pointer', 'copy'] as const;

/**
 * The demos' layouts (Figma “Toolbar - Bottom” types): buttons at both
 * sides; with page dots between; one capsule of symbols; text buttons.
 */
export type Layout = 'buttons' | 'pageDots' | 'symbols' | 'text';

/** Each layout's content (only what it shows). */
export const propOptionsContent = {
  buttons: {},
  pageDots: { pages: [5, 3, 12] as const },
  symbols: { symbols: [3, 2, 4, 5, 6] as const },
  text: {},
} as const satisfies Record<Layout, object>;

export const propOptionsRoot = {
  ...commonPropOptions,
  placement: [undefined, 'bottom', 'top'] as const,
  context: [undefined, 'bright', 'dim'] as const,
  disabled: [undefined, false, true] as const,
  loopFocus: [undefined, false, true] as const,
};

export const propOptionsGroup = {
  ...commonPropOptions,
  prominent: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
};

// A button of its own: a `Button` (its demo's options), also `prominent`
// (tinted glass); in a group, what applies there.
const propOptionsOwnButton = {
  ...propOptionsButtonRoot,
  prominent: [undefined, false, true] as const,
};

// (Not `size`, `context`, nor glass variants: the capsule's.)
const propOptionsGroupButton = {
  disabled: propOptionsButtonRoot.disabled,
  focusableWhenDisabled: propOptionsButtonRoot.focusableWhenDisabled,
  variant: [
    undefined,
    'borderless',
    'bordered',
    'bordered-secondary',
    'bordered-prominent',
  ] as const,
  shape: [undefined, 'capsule', 'circle'] as const,
  destructive: propOptionsButtonRoot.destructive,
  fill: propOptionsButtonRoot.fill,
  tint: propOptionsButtonRoot.tint,
};

/** A button's options; of its own (not in a group), a `Button`'s. */
export const getPropOptionsButton = (addLog: AddLog, own: boolean) => ({
  ...commonPropOptions,
  ...(own ? propOptionsOwnButton : propOptionsGroupButton),
  cursor: cursorOptions,
  onClick: [
    new MappedProp(() => addLog('button clicked'), '[log click]'),
    undefined,
  ] as const,
  onSecondaryClick: [
    undefined,
    new MappedProp(
      () => addLog('button secondary click'),
      '[log secondary click]',
    ),
  ] as const,
});

export const getPropOptionsPageControl = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultValue: [undefined, 0, 2] as const,
  value: [undefined, 0, 1, 4] as const,
  disabled: [undefined, false, true] as const,
  context: [undefined, 'bright', 'dim'] as const,
  onValueChange: [
    new MappedProp(
      (page: number) => addLog(`page change: ${page}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});
