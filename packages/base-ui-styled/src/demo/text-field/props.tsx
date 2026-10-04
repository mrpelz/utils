/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

export const propOptionsRoot = {
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  invalid: [undefined, false, true] as const,
  validationMode: [undefined, 'onSubmit', 'onBlur', 'onChange'] as const,
  validationDebounceTime: [undefined, 0, 500] as const,
  validate: [
    undefined,
    new MappedProp(
      (value: unknown) =>
        String(value ?? '').length >= 3 ? null : 'At least 3 characters.',
      '[at least 3 characters]',
    ),
  ] as const,
};

export const propOptionsControl = {
  ...commonPropOptions,
  placeholder: ['Name', undefined, 'A longer placeholder'] as const,
  defaultValue: [undefined, 'Kate Bell'] as const,
  value: [undefined, 'Kate Bell'] as const,
  type: [undefined, 'text', 'email', 'password', 'number'] as const,
  required: [undefined, false, true] as const,
  render: [undefined, new MappedProp(<textarea />, '[<textarea />]')] as const,
};

export const getPropOptionsControl = (addLog: AddLog) => ({
  ...propOptionsControl,
  onValueChange: [
    undefined,
    new MappedProp(
      (value: string) => addLog(`value change: ${value}`),
      '[log change]',
    ),
  ] as const,
});

export const propOptionsError = {
  ...commonPropOptions,
  match: [
    undefined,
    true,
    'valueMissing',
    'typeMismatch',
    'tooShort',
    'customError',
  ] as const,
};

export const getPropOptionsClear = (addLog: AddLog) => ({
  ...commonPropOptions,
  onClick: [
    undefined,
    new MappedProp(() => addLog('clear clicked'), '[log click]'),
  ] as const,
});
