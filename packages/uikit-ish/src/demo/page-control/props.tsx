/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

export const getPropOptionsRoot = (addLog: AddLog) => ({
  ...commonPropOptions,
  count: [5, 1, 3, 7, 8, 12, 30] as const,
  defaultValue: [undefined, 0, 2, 9] as const,
  value: [undefined, 0, 1, 4] as const,
  disabled: [undefined, false, true] as const,
  variant: [undefined, 'glass', 'plain'] as const,
  context: [
    undefined,
    'bright',
    'dim',
    'background-bright',
    'background-dim',
  ] as const,
  momentaryTooltip: [undefined, false, true] as const,
  format: [
    undefined,
    new MappedProp(
      (page: number, count: number) =>
        `Page ${String(page + 1)} of ${String(count)}`,
      '[Page 3 of 8]',
    ),
  ] as const,
  onValueChange: [
    new MappedProp(
      (page: number) => addLog(`page change: ${page}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});
