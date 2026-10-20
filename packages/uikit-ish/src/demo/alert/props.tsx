/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../frame/log.js';
import { MappedProp } from '../frame/prop-control.js';

export const getPropOptionsRoot = (addLog: AddLog) => ({
  defaultOpen: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (open: boolean) => addLog(`open change: ${String(open)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsContent = {
  // Its buttons: Cancel and OK, or also a destructive one.
  actions: ['two', 'three'] as const,
  fields: [false, true] as const,
  stacked: [undefined, false, true] as const,
};
