/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import type { PageControlChangeEventDetails } from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

export const getPropOptionsRoot = (addLog: AddLog) => ({
  // (Its own element: no `render`.)
  className: commonPropOptions.className,
  style: commonPropOptions.style,
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
    'adaptive',
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
  'aria-label': [undefined, 'Cities'] as const,
  onValueChange: [
    new MappedProp(
      (page: number, { reason }: PageControlChangeEventDetails) =>
        addLog(`page change: ${page} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

/** The overview's few: its pages, its look, its tooltip. */
export const propOptionsOverview = {
  count: [5, 3, 12] as const,
  variant: [undefined, 'plain'] as const,
  momentaryTooltip: [undefined, true] as const,
  disabled: [undefined, true] as const,
};
