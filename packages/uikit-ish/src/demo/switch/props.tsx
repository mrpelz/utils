/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Switch as BaseSwitch } from '@base-ui/react/switch';

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

const propOptionsRoot = {
  ...commonPropOptions,
  defaultChecked: [undefined, false, true] as const,
  checked: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  indeterminate: [undefined, false, true] as const,
  onOffLabels: [undefined, false, true] as const,
  tint: [
    undefined,
    'var(--color-ios-system-blue)',
    'var(--color-ios-system-orange)',
    '#000',
  ] as const,
};

export const propOptionsThumb = {
  ...commonPropOptions,
};

/**
 * The root's options; `setPending` makes it indeterminate for a while after
 * each change (e.g. while an app saves the new state).
 */
export const getPropOptionsRoot = (
  addLog: AddLog,
  setPending: (pending: boolean) => void,
) => {
  const timer: { timeout?: ReturnType<typeof setTimeout> } = {};

  return {
    ...propOptionsRoot,
    onCheckedChange: [
      new MappedProp(
        (checked: boolean, { reason }: BaseSwitch.Root.ChangeEventDetails) =>
          addLog(`checked change: ${checked}/${reason}`),
        '[log change]',
      ),
      new MappedProp(
        (checked: boolean, { reason }: BaseSwitch.Root.ChangeEventDetails) => {
          addLog(`checked change: ${checked}/${reason}, indeterminate`);
          setPending(true);
          clearTimeout(timer.timeout);
          timer.timeout = setTimeout(() => {
            addLog('indeterminate: false');
            setPending(false);
          }, 2000);
        },
        '[indeterminate for 2s]',
      ),
      undefined,
    ] as const,
    inputRef: [
      undefined,
      new MappedProp(
        (element: HTMLInputElement | null) =>
          addLog(`input ref: ${element?.type ?? 'null'}`),
        '[log ref]',
      ),
    ] as const,
  };
};
