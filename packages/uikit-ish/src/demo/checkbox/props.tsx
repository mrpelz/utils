/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

export const getPropOptionsCheckbox = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultChecked: [undefined, false, true] as const,
  checked: [undefined, false, true] as const,
  indeterminate: [undefined, false, true] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  onCheckedChange: [
    new MappedProp(
      (checked: boolean, { reason }: BaseCheckbox.Root.ChangeEventDetails) =>
        addLog(`checked change: ${String(checked)}/${reason}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const getPropOptionsRadioGroup = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultValue: ['email', undefined, 'phone'] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
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
  disabled: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
};
