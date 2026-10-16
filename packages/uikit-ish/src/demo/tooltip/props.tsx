/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

export const getPropOptionsRoot = (addLog: AddLog) => ({
  open: [undefined, true] as const,
  disabled: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (open: boolean) => addLog(`open change: ${String(open)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsTrigger = {
  delay: [undefined, 0, 600, 1000] as const,
};

export const propOptionsPositioner = {
  ...commonPropOptions,
  side: [
    undefined,
    'block-start',
    'block-end',
    'inline-start',
    'inline-end',
  ] as const,
  align: [undefined, 'start', 'center', 'end'] as const,
};

export const propOptionsContent = {
  text: [
    'Share',
    'A longer tooltip, wrapping onto a second line when it gets wide',
  ] as const,
};
