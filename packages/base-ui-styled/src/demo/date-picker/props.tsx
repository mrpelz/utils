/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import {
  DatePickerMode,
  DatePickerOpen,
  DateRange,
} from '../../components/index.js';
import { AddLog } from '../utils/log.js';
import { MappedProp } from '../utils/main.js';

export const propOptionsContent = {
  range: [false, true] as const,
} as const;

export const weekdayOptions = [undefined, 0, 1, 2, 3, 4, 5, 6] as const;

const propOptions = (mode: DatePickerMode) => ({
  mode: [
    mode,
    ...(['date', 'dateAndTime', 'time'] as const).filter(
      (option) => option !== mode,
    ),
    undefined,
  ],
  pickerStyle: [undefined, 'compact', 'inline'] as const,
  buttonShape: [undefined, 'roundedRectangle', 'capsule'] as const,
  popover: [undefined, true, false] as const,
  defaultOpen: [undefined, null, 'date', 'time'] as const,
  disabled: [undefined, false, true] as const,
  locale: [undefined, 'en-US', 'de-DE', 'fr-FR', 'ar-EG', 'ko-KR'] as const,
  hourCycle: [undefined, 'h12', 'h23'] as const,
  firstDayOfWeek: weekdayOptions,
  highlightedWeekdays: [
    undefined,
    new MappedProp([0, 6], '[weekend: 0, 6]'),
    new MappedProp([5], '[Friday: 5]'),
  ] as const,
  highlighted: [
    undefined,
    new MappedProp(
      (date: Date) => [3, 14, 25].includes(date.getDate()),
      '[the 3rd, 14th, 25th]',
    ),
  ] as const,
  min: [
    undefined,
    new MappedProp(new Date(2025, 3, 10), '[April 10, 2025]'),
  ] as const,
  max: [
    undefined,
    new MappedProp(new Date(2025, 4, 15), '[May 15, 2025]'),
  ] as const,
});

/** A value, for the log. */
const describe = (value: Date | DateRange) =>
  value instanceof Date
    ? value.toLocaleString()
    : `${value.start.toLocaleDateString()} – ${value.end?.toLocaleDateString() ?? '…'}`;

export const getPropOptionsDatePicker = (
  mode: DatePickerMode,
  addLog: AddLog,
) => ({
  ...propOptions(mode),
  onValueChange: [
    new MappedProp(
      (value: Date | DateRange) => addLog(`value change: ${describe(value)}`),
      '[log change]',
    ),
    undefined,
  ] as const,
  onOpenChange: [
    new MappedProp(
      (open: DatePickerOpen | null) => addLog(`open change: ${String(open)}`),
      '[log open change]',
    ),
    undefined,
  ] as const,
});
