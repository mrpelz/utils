/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Button } from '../../../components/index.js';
import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

export const getPropOptionsRoot = (addLog: AddLog) => ({
  defaultOpen: [undefined, false, true] as const,
  onOpenChange: [
    new MappedProp(
      (isOpen: boolean, { reason }: { reason: string }) =>
        addLog(`open change: ${String(isOpen)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

/** `Alert.Root` (the parts page's): its state, its changes logged. */
export const getPropOptionsGuideRoot = (addLog: AddLog) => ({
  ...getPropOptionsRoot(addLog),
  open: [undefined, false, true] as const,
  onOpenChangeComplete: [
    undefined,
    new MappedProp(
      (isOpen: boolean) => addLog(`open complete: ${String(isOpen)}`),
      '[log change]',
    ),
  ] as const,
});

export const propOptionsContent = {
  // Its buttons: Cancel and OK, or also a destructive one.
  actions: ['two', 'three'] as const,
  fields: [false, true] as const,
  stacked: [undefined, false, true] as const,
};

/** The overview's few: its parts. */
export const propOptionsOverviewContent = {
  description: [true, false] as const,
  field: [false, true] as const,
};

/** `Alert.Trigger`: a button. */
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

/** `Alert.Header`, `Alert.Fields`: their own elements (no `render`). */
export const propOptionsElement = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const getPropOptionsField = (addLog: AddLog) => ({
  ...commonPropOptions,
  placeholder: ['Name', undefined] as const,
  defaultValue: ['Recipes', undefined, ''] as const,
  onValueChange: [
    new MappedProp((value: string) => addLog(`name: ${value}`), '[log change]'),
    undefined,
  ] as const,
});

export const propOptionsActions = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
  stacked: [undefined, false, true] as const,
};

export const propOptionsAction = {
  ...commonPropOptions,
  variant: ['destructive', 'secondary', 'primary', undefined] as const,
  nativeButton: [undefined, true] as const,
};

export { commonPropOptions as propOptionsPart } from '../../tooling/frame/prop-control.js';
