/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import type { PagerChangeEventDetails } from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

/** `Pager.Root`: all of its props. */
export const getPropOptionsRoot = (addLog: AddLog) => ({
  ...commonPropOptions,
  orientation: [undefined, 'horizontal', 'vertical'] as const,
  defaultValue: [undefined, 0, 2, 4] as const,
  value: [undefined, 0, 1, 3] as const,
  'aria-label': [undefined, 'Onboarding'] as const,
  onValueChange: [
    new MappedProp(
      (page: number, { reason }: PagerChangeEventDetails) =>
        addLog(`page change: ${String(page)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

/** `Pager.Page`: all of its props. */
export const propOptionsPage = {
  ...commonPropOptions,
  'aria-label': [undefined, 'Step'] as const,
};

/** The overview's few: its direction, its first page. */
export const propOptionsOverview = {
  orientation: [undefined, 'vertical'] as const,
  defaultValue: [undefined, 2] as const,
};

/** Its pages: how many. */
export const propOptionsContent = {
  count: [5, 2, 3] as const,
};
