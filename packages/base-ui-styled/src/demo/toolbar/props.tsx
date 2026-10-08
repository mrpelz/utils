/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

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

// A button of its own: also tinted (a group's are by their group).
const propOptionsOwnButton = {
  prominent: [undefined, false, true] as const,
};

/** A button's options; of its own (not in a group), also `prominent`. */
export const getPropOptionsButton = (addLog: AddLog, own: boolean) => ({
  ...commonPropOptions,
  ...(own && propOptionsOwnButton),
  disabled: [undefined, false, true] as const,
  focusableWhenDisabled: [undefined, false, true] as const,
  destructive: [undefined, false, true] as const,
  cursor: cursorOptions,
  onClick: [
    new MappedProp(() => addLog('button clicked'), '[log click]'),
    undefined,
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
