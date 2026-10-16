/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

export const getPropOptionsForm = (addLog: AddLog) => ({
  ...commonPropOptions,
  validationMode: [undefined, 'onSubmit', 'onBlur', 'onChange'] as const,
  // A server's errors, by field name.
  errors: [
    undefined,
    new MappedProp(
      { email: 'This address is taken.' },
      '[email: this address is taken]',
    ),
  ] as const,
  onFormSubmit: [
    new MappedProp(
      (values: Record<string, unknown>) =>
        addLog(`submitted: ${JSON.stringify(values)}`),
      '[log values]',
    ),
    undefined,
  ] as const,
});

export const propOptionsFieldset = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
};

export const propOptionsLegend = {
  ...commonPropOptions,
  prominence: [undefined, 'prominent', 'nested', 'extraProminent'] as const,
};

export const getPropOptionsCheckboxGroup = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultValue: [
    new MappedProp(['messages'], '[messages]'),
    undefined,
    new MappedProp<string[]>([], '[none]'),
  ] as const,
  value: [
    undefined,
    new MappedProp(['messages', 'mentions', 'reminders'], '[all]'),
  ] as const,
  disabled: [undefined, false, true] as const,
  onValueChange: [
    new MappedProp(
      (value: string[]) => addLog(`notifications: ${value.join(', ')}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsCheckbox = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  required: [undefined, false, true] as const,
  indeterminate: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
};

export const getPropOptionsRadioGroup = (addLog: AddLog) => ({
  ...commonPropOptions,
  defaultValue: ['automatic', undefined, 'light'] as const,
  value: [undefined, 'dark'] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  required: [undefined, false, true] as const,
  onValueChange: [
    new MappedProp(
      (value: unknown) => addLog(`appearance: ${String(value)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

export const propOptionsRadio = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
};
