/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';

import { AddLog } from '../utils/log.js';
import { commonPropOptions, MappedProp } from '../utils/main.js';

export const propOptionsContent = {
  count: [3, 2, 4, 5] as const,
  label1: ['Day'] as const,
  label2: ['Week'] as const,
  label3: ['Month'] as const,
  label4: ['Year'] as const,
  label5: ['All Time'] as const,
} as const;

export const propOptionsRoot = {
  ...commonPropOptions,
  defaultValue: ['first', undefined, 'second'] as const,
  value: [undefined, 'first', 'second', 'third'] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  hideSeparators: [undefined, false, true] as const,
};

export const getPropOptionsItem = (
  value: string,
  addLog: (message: string) => void,
) => ({
  ...commonPropOptions,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  cursor: [undefined, 'auto', 'pointer', 'copy'] as const,
  inputRef: [
    undefined,
    new MappedProp(
      (element: HTMLInputElement | null) =>
        addLog(`${value} input ref: ${element?.type ?? 'null'}`),
      '[log ref]',
    ),
  ] as const,
  onSecondaryClick: [
    undefined,
    new MappedProp(
      () => addLog(`${value} secondary click`),
      '[log secondary click]',
    ),
  ] as const,
});

export const getPropOptionsRoot = (addLog: AddLog) => ({
  ...propOptionsRoot,
  onValueChange: [
    new MappedProp(
      (value: unknown, { reason }: BaseRadioGroup.ChangeEventDetails) =>
        addLog(`root value: ${String(value)}/${reason}`),
      '[log change]',
    ),
    undefined,
  ] as const,
  inputRef: [
    undefined,
    new MappedProp(
      (element: HTMLInputElement | null) =>
        addLog(`root input ref: ${element?.type ?? 'null'}`),
      '[log ref]',
    ),
  ] as const,
});
