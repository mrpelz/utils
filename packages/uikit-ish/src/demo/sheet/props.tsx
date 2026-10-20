/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

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

/** The overview's screen: a phone's (compact), or a tablet's. */
export const propOptionsOverviewContent = {
  layout: ['phone', 'tablet'] as const,
};

/** The overview's few: its detent, its dismissal. */
export const propOptionsOverviewPopup = {
  detent: [undefined, 'large', 'medium'] as const,
};

export const propOptionsGuideRoot = {
  modal: [undefined, false, 'trap-focus'] as const,
  disablePointerDismissal: [undefined, false, true] as const,
};

export const propOptionsGuidePopup = {
  ...commonPropOptions,
  detent: [undefined, 'large', 'medium'] as const,
  compact: [true, false, undefined] as const,
};

export const propOptionsPart = {
  ...commonPropOptions,
};
