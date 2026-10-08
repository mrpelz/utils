/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

export const getPropOptionsRoot = (addLog: AddLog) => ({
  ...commonPropOptions,
  count: [5, 1, 3, 7, 8, 12, 30] as const,
  defaultValue: [undefined, 0, 2, 9] as const,
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
