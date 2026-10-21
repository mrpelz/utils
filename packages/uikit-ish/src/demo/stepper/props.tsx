/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { NumberField as BaseNumberField } from '@base-ui/react/number-field';

import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

export const cursorOptions = [undefined, 'auto', 'pointer', 'copy'] as const;

export const propOptionsRoot = {
  ...commonPropOptions,
  defaultValue: [5, undefined, 0, 10] as const,
  value: [undefined, 3, null] as const,
  min: [0, undefined, 3] as const,
  max: [10, undefined, 7] as const,
  step: [undefined, 1, 2, 0.5, 'any'] as const,
  largeStep: [undefined, 5] as const,
  smallStep: [undefined, 0.1] as const,
  snapOnStep: [undefined, false, true] as const,
  allowOutOfRange: [undefined, false, true] as const,
  allowWheelScrub: [undefined, false, true] as const,
  locale: [undefined, 'en-US', 'de-DE'] as const,
  format: [
    undefined,
    new MappedProp<Intl.NumberFormatOptions>({ style: 'percent' }, '[percent]'),
    new MappedProp({ minimumFractionDigits: 1 }, '[1 fraction digit]'),
  ] as const,
  disabled: [undefined, false, true] as const,
  readOnly: [undefined, false, true] as const,
  required: [undefined, false, true] as const,
  name: [undefined, 'quantity'] as const,
};

/** The overview's few (its value the demo's): its range, step, state. */
export const propOptionsOverview = {
  min: [0, undefined] as const,
  max: [10, undefined] as const,
  step: [undefined, 2, 0.5] as const,
  disabled: [undefined, true] as const,
};

export const propOptionsGroup = {
  ...commonPropOptions,
};

export const propOptionsInput = {
  ...commonPropOptions,
  'aria-label': ['Quantity', 'Guests'] as const,
  'aria-roledescription': [undefined, 'Stepper'] as const,
};

export const propOptionsHalf = {
  ...commonPropOptions,
  cursor: cursorOptions,
  disabled: [undefined, false, true] as const,
};

/** The committed value, logged (its change is the demo's own). */
export const getPropOptionsRoot = (addLog: AddLog) => ({
  ...propOptionsRoot,
  onValueCommitted: [
    undefined,
    new MappedProp(
      (committed: number | null) =>
        addLog(`value committed: ${String(committed)}`),
      '[log commit]',
    ),
  ] as const,
});

/** The guide's root: its changes logged too, with their reasons. */
export const getPropOptionsGuideRoot = (addLog: AddLog) => ({
  ...getPropOptionsRoot(addLog),
  onValueChange: [
    new MappedProp(
      (
        value: number | null,
        { reason }: BaseNumberField.Root.ChangeEventDetails,
      ) => addLog(`value change: ${String(value)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});
