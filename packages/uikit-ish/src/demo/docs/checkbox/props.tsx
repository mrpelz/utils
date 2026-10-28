/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';

import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

export const getPropOptionsCheckbox = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultChecked: [undefined, false, true] as const,
  checked: [undefined, false, true] as const,
  indeterminate: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  required: [undefined, false, true] as const,
  value: [undefined, 'subscribe'] as const,
  uncheckedValue: [undefined, 'unsubscribed'] as const,
  parent: [undefined, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  onCheckedChange: [
    new MappedProp(
      (isChecked: boolean, { reason }: BaseCheckbox.Root.ChangeEventDetails) =>
        addLog(`checked change: ${String(isChecked)}/${reason}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsRadioGroup = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultValue: ['email', undefined, 'phone'] as const,
  value: [undefined, 'phone'] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  required: [undefined, false, true] as const,
  onValueChange: [
    new MappedProp(
      (value: unknown, { reason }: BaseRadioGroup.ChangeEventDetails) =>
        addLog(`value change: ${String(value)}/${reason}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsRadio = {
  ...commonPropOptions,
  // (The first option's: its own, or another.)
  value: ['email', 'fax'] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  required: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
};

/** The overview's few: a selection circle's states. */
export const propOptionsOverview = {
  defaultChecked: [true, false] as const,
  indeterminate: [undefined, true] as const,
  disabled: [undefined, true] as const,
};

/** `Checkbox.Indicator`, `Radio.Indicator`. */
export const propOptionsIndicator = {
  ...commonPropOptions,
  keepMounted: [undefined, false, true] as const,
};

export const getPropOptionsCheckboxGroup = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultValue: [['email'] as string[], undefined, [] as string[]] as const,
  value: [undefined, ['email', 'phone'] as string[]] as const,
  allValues: [
    ['email', 'phone', 'mail'] as string[],
    ['email', 'phone'] as string[],
  ] as const,
  disabled: [undefined, false, true] as const,
  onValueChange: [
    new MappedProp(
      (value: string[]) => addLog(`value change: ${value.join(', ')}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});
