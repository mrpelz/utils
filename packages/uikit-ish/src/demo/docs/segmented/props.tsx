/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';

import { AddLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  MappedProp,
} from '../../tooling/frame/prop-control.js';

export const propOptionsContent = {
  count: [3, 2, 4, 5] as const,
} as const;

/** The root's options, its values by the items' (first, second, third). */
const propOptionsRoot = (values: readonly [string, string, string]) => ({
  ...commonPropOptions,
  defaultValue: [values[0], undefined, values[1]] as const,
  value: [undefined, ...values] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  required: [undefined, false, true] as const,
  name: [undefined, 'period'] as const,
  hideSeparators: [undefined, false, true] as const,
});

/** The overview's few: its look and states, not its plumbing. */
export const propOptionsOverviewRoot = {
  defaultValue: ['day', 'week', undefined] as const,
  disabled: [undefined, true] as const,
  hideSeparators: [undefined, true] as const,
};

/** The guide pages' content: how many periods (see content.ts). */
export const propOptionsPeriodsContent = {
  count: [3, 2, 4, 5] as const,
};

export const propOptionsHighlight = {
  // (Its own element: no `render`.)
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const propOptionsIndicator = {
  ...commonPropOptions,
  keepMounted: [undefined, false, true] as const,
};

export const getPropOptionsItem = (
  value: string,
  addLog: (message: string) => void,
) => ({
  ...commonPropOptions,
  // (Its own, or another's.)
  value: [value, 'year'] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  required: [undefined, false, true] as const,
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

export const getPropOptionsRoot = (
  addLog: AddLog,
  values: readonly [string, string, string] = ['first', 'second', 'third'],
) => ({
  ...propOptionsRoot(values),
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

/** The composition's anchor: the control at the screen's top or bottom. */
export const propOptionsContentAnchor = {
  edge: ['block-start', 'block-end'] as const,
};
