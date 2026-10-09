/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

export const propOptionsContent = {
  columns: [3, 2] as const,
} as const;

export const propOptionsRoot = {
  ...commonPropOptions,
};

/** A column's options; `defaultSize` first (`undefined`: flexible). */
export const getPropOptionsColumn = (
  name: string,
  defaultSize: number | undefined,
  resizable: boolean,
  addLog: AddLog,
) => ({
  ...commonPropOptions,
  defaultSize: [
    defaultSize,
    ...[undefined, 280, 360].filter((size) => size !== defaultSize),
  ],
  size: [undefined, 320] as const,
  minSize: [undefined, 200, 280] as const,
  maxSize: [undefined, 400, 480] as const,
  resizable: [resizable, !resizable] as const,
  onSizeChange: [
    new MappedProp(
      (size: number) => addLog(`${name} size: ${String(size)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});
