/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

export const cursorOptions = [undefined, 'auto', 'pointer', 'copy'] as const;

export const propOptionsRoot = {
  ...commonPropOptions,
  defaultValue: [5, undefined, 0, 10] as const,
  min: [0, undefined, 3] as const,
  max: [10, undefined, 7] as const,
  step: [undefined, 1, 2, 0.5] as const,
  largeStep: [undefined, 5] as const,
  smallStep: [undefined, 0.1] as const,
  snapOnStep: [undefined, false, true] as const,
  allowWheelScrub: [undefined, false, true] as const,
  locale: [undefined, 'en-US', 'de-DE'] as const,
  format: [
    undefined,
    new MappedProp<Intl.NumberFormatOptions>({ style: 'percent' }, '[percent]'),
    new MappedProp({ minimumFractionDigits: 1 }, '[1 fraction digit]'),
  ] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
};

export const propOptionsHalf = {
  ...commonPropOptions,
  cursor: cursorOptions,
  disabled: [undefined, false, true] as const,
};

export const getPropOptionsRoot = (addLog: AddLog) => ({
  ...propOptionsRoot,
  onValueCommitted: [
    undefined,
    new MappedProp(
      (committed: number | null) =>
        addLog(`value committed: ${String(committed)}`),
      '[log commit]',
    ),
  ] as const,
});
