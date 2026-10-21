/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import type {
  DatePickerChangeEventDetails,
  DatePickerMode,
  DatePickerOpen,
  DatePickerOpenChangeEventDetails,
  DateRange,
  DayHighlight,
} from '../../components/index.js';
import { AddLog } from '../frame/log.js';
import { commonPropOptions, MappedProp } from '../frame/prop-control.js';

// Highlights of some days, each in its own style and tint.
const tintedHighlights = new Map<number, DayHighlight>([
  [3, { tint: 'var(--color-ios-system-red)' }],
  [14, { style: 'text', tint: 'var(--color-ios-system-orange)' }],
  [25, { style: 'circle', tint: 'var(--color-ios-system-green)' }],
]);

// Several highlights on a day: dots side by side, with a text and a circle.
const severalHighlights = new Map<number, readonly DayHighlight[]>([
  [
    14,
    [
      { tint: 'var(--color-ios-system-red)' },
      { tint: 'var(--color-ios-system-blue)' },
      { tint: 'var(--color-ios-system-green)' },
    ],
  ],
  [
    22,
    [
      { tint: 'var(--color-ios-system-orange)' },
      {},
      { style: 'text', tint: 'var(--color-ios-system-purple)' },
      { style: 'circle', tint: 'var(--color-ios-system-teal)' },
    ],
  ],
]);

/** The footer demo's content: the calendar's footer (see main.tsx). */
export const propOptionsFooterContent = {
  footer: [undefined, 'none', 'timeRow', 'jumps', 'timeRowAndJumps'] as const,
};

const day = 24 * 60 * 60 * 1000;

type RangeRule = (start: Date, end: Date) => boolean;
type RangeMessage = { error?: string; info: string };

/** Stays of at most a week. */
const longerThanAWeek = (start: Date, end: Date) =>
  end.getTime() - start.getTime() > 6 * day;

/** Stays of at least two nights. */
const shorterThanThreeDays = (start: Date, end: Date) =>
  end.getTime() - start.getTime() < 2 * day;

/**
 * Messages of range rules (`isRangeDisabled`), for the calendar's footer:
 * what can be picked, and (while a range's end is missing) what's wrong.
 */
export const rangeMessages = new Map<RangeRule, RangeMessage>([
  [longerThanAWeek, { info: 'Your stay can be at most one week long.' }],
  [
    shorterThanThreeDays,
    {
      error: 'Select a stay spanning at least two nights.',
      info: 'Stay at least two nights.',
    },
  ],
]);

export const weekdayOptions = [undefined, 0, 1, 2, 3, 4, 5, 6] as const;

/** The calendar's own (also the picker's). */
export const propOptionsCalendar = {
  locale: [undefined, 'en-US', 'de-DE', 'fr-FR', 'ar-EG', 'ko-KR'] as const,
  firstDayOfWeek: weekdayOptions,
  showAdjacentMonths: [undefined, false, true] as const,
  highlightedWeekdays: [
    undefined,
    new MappedProp([0, 6], '[weekend: 0, 6]'),
    new MappedProp([5], '[Friday: 5]'),
  ] as const,
  highlighted: [
    undefined,
    new MappedProp(
      (date: Date) => [3, 14, 25].includes(date.getDate()),
      '[the 3rd, 14th, 25th: dots]',
    ),
    new MappedProp(
      (date: Date) => tintedHighlights.get(date.getDate()),
      '[3rd: red dot, 14th: orange text, 25th: green circle]',
    ),
    new MappedProp(
      (date: Date) => severalHighlights.get(date.getDate()),
      '[several: 14th three dots, 22nd dots, text and a circle]',
    ),
    new MappedProp(
      (date: Date): DayHighlight | undefined =>
        date.getDay() === 1 ? { style: 'circle' } : undefined,
      '[Mondays: circles]',
    ),
    new MappedProp(
      (date: Date): DayHighlight | undefined =>
        date.getDate() >= 10 && date.getDate() <= 12
          ? { style: 'text', tint: 'var(--color-ios-system-purple)' }
          : undefined,
      '[10th to 12th: purple text]',
    ),
  ] as const,
  isDateDisabled: [
    undefined,
    new MappedProp(
      (date: Date) => date.getDay() === 0 || date.getDay() === 6,
      '[weekends]',
    ),
    new MappedProp(
      (date: Date) => date.getDate() >= 15 && date.getDate() <= 18,
      '[the 15th to 18th]',
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
};

const propOptions = (mode: DatePickerMode) => ({
  mode: [
    mode,
    ...(['date', 'dateAndTime', 'time'] as const).filter(
      (option) => option !== mode,
    ),
    undefined,
  ],
  pickerStyle: [undefined, 'compact', 'inline'] as const,
  buttonShape: [undefined, 'capsule', 'roundedRectangle'] as const,
  popover: [undefined, true, false] as const,
  popoverAlign: [undefined, 'start', 'center', 'end'] as const,
  defaultOpen: [undefined, null, 'date', 'time'] as const,
  open: [undefined, null, 'date', 'time'] as const,
  disabled: [undefined, false, true] as const,
  hourCycle: [undefined, 'h12', 'h23'] as const,
  ...propOptionsCalendar,
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
  value: [
    undefined,
    new MappedProp(new Date(2025, 3, 22, 15, 30), '[April 22, 2025, 15:30]'),
  ] as const,
  onValueChange: [
    new MappedProp(
      (value: Date | DateRange, { reason }: DatePickerChangeEventDetails) =>
        addLog(`value change: ${describe(value)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
  onOpenChange: [
    new MappedProp(
      (
        open: DatePickerOpen | null,
        { reason }: DatePickerOpenChangeEventDetails,
      ) => addLog(`open change: ${String(open)} (${reason})`),
      '[log open change]',
    ),
    undefined,
  ] as const,
});

/** A range picker's (dates only): its rules, too. */
export const getPropOptionsRangePicker = (addLog: AddLog) => ({
  ...getPropOptionsDatePicker('date', addLog),
  value: [
    undefined,
    new MappedProp<DateRange>(
      { end: new Date(2025, 3, 26), start: new Date(2025, 3, 22) },
      '[April 22 to 26, 2025]',
    ),
  ] as const,
  isRangeDisabled: [
    undefined,
    new MappedProp(longerThanAWeek, '[longer than a week]'),
    new MappedProp(shorterThanThreeDays, '[at least three days]'),
    new MappedProp(
      (start: Date, end: Date) => start.getMonth() !== end.getMonth(),
      '[across months]',
    ),
  ] as const,
});

/** `DatePicker.Calendar`: its own, its value (a date, or a range), why. */
export const getPropOptionsCalendar = (addLog: AddLog) => ({
  ...propOptionsCalendar,
  range: [undefined, true] as const,
  value: [
    undefined,
    new MappedProp<Date | DateRange>(new Date(2025, 3, 22), '[April 22, 2025]'),
    new MappedProp<Date | DateRange>(
      { end: new Date(2025, 3, 26), start: new Date(2025, 3, 22) },
      '[April 22 to 26 (with range)]',
    ),
  ] as const,
  isRangeDisabled: [
    undefined,
    new MappedProp(longerThanAWeek, '[longer than a week]'),
  ] as const,
  label: [undefined, 'Check-in'] as const,
  onValueChange: [
    new MappedProp(
      (value: Date | DateRange, { reason }: DatePickerChangeEventDetails) =>
        addLog(`value change: ${describe(value)} (${reason})`),
      '[log change]',
    ),
    undefined,
  ] as const,
});

/** `DatePicker.TimeRoll` (its value the demo's). */
export const propOptionsTimeRoll = {
  hourCycle: [undefined, 'h12', 'h23'] as const,
  locale: [undefined, 'en-US', 'de-DE', 'ko-KR'] as const,
};

/** `DatePicker.CalendarRow`, `DatePicker.CalendarMessage`: elements. */
const propOptionsElement = {
  className: commonPropOptions.className,
  style: commonPropOptions.style,
};

export const propOptionsCalendarRow = propOptionsElement;

export const propOptionsCalendarButton = {
  ...commonPropOptions,
  shape: [undefined, 'capsule', 'roundedRectangle'] as const,
  disabled: [undefined, false, true] as const,
};

export const propOptionsCalendarTimeRow = {
  label: [undefined, 'Starts'] as const,
};

export const propOptionsCalendarMessage = {
  ...propOptionsElement,
  variant: [undefined, 'info', 'error'] as const,
};

/** The overview's few: what it picks, and how it shows. */
export const propOptionsOverview = {
  mode: [undefined, 'date', 'time', 'dateAndTime'] as const,
  pickerStyle: [undefined, 'compact', 'inline'] as const,
  buttonShape: [undefined, 'roundedRectangle'] as const,
  disabled: [undefined, true] as const,
};
