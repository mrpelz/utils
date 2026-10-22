/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Button } from '../../components/index.js';
import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

export const getPropOptionsRoot = (addLog: AddLog) => ({
  defaultOpen: [undefined, false, true] as const,
  modal: [undefined, true, false, 'trap-focus'] as const,
  onOpenChange: [
    new MappedProp(
      (open: boolean, { reason }: { reason: string }) =>
        addLog(`open change: ${String(open)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

/** `ActionSheet.Root` (the parts page's): its state, its changes logged. */
export const getPropOptionsGuideRoot = (addLog: AddLog) => ({
  ...getPropOptionsRoot(addLog),
  open: [undefined, false, true] as const,
  onOpenChangeComplete: [
    undefined,
    new MappedProp(
      (open: boolean) => addLog(`open complete: ${String(open)}`),
      '[log change]',
    ),
  ] as const,
});

/** The overview's few: its parts. */
export const propOptionsOverviewContent = {
  header: [true, false] as const,
};

/** `ActionSheet.Trigger`: a button. */
export const propOptionsTrigger = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  render: [
    new MappedProp(
      <Button.Root
        size="large"
        variant="bordered"
      />,
      '[<Button.Root size="large" variant="bordered" />]',
    ),
    undefined,
  ] as const,
  nativeButton: [undefined, true] as const,
};

export const propOptionsPopup = {
  ...commonPropOptions,
  initialFocus: [undefined, false, true] as const,
  finalFocus: [undefined, false, true] as const,
};

/** `ActionSheet.Header`, `ActionSheet.Actions`: their own elements. */
export const propOptionsElement = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const propOptionsAction = {
  ...commonPropOptions,
  variant: ['destructive', 'secondary', undefined] as const,
  nativeButton: [undefined, true] as const,
};

/** An action sheet or a popover: unset, by the window's size class. */
export const propOptionsPresentation = {
  presentation: [undefined, 'popover', 'sheet'] as const,
};

export { commonPropOptions as propOptionsPart } from '../frame/prop-control.js';
