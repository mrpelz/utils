/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

export const getPropOptionsRoot = (addLog: AddLog) => ({
  defaultOpen: [undefined, false, true] as const,
  disablePointerDismissal: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (open: boolean) => addLog(`open change: ${String(open)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsPopup = {
  ...commonPropOptions,
  detent: [undefined, 'large', 'medium'] as const,
};
