/* eslint-disable @typescript-eslint/explicit-module-boundary-types -- prop control options, typed by inference */

import { styled } from 'goober';
import { FunctionComponent, ReactNode } from 'react';

import {
  CalendarButton,
  CalendarFooter,
  CalendarRow,
  CalendarTimeRow,
  DatePickerMode,
  DatePickerOpen,
  DateRange,
  DayHighlight,
} from '../../components/index.js';
import { AddLog } from '../utils/log.js';
import { MappedProp } from '../utils/main.js';

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

// Footers composed below the calendar (see `CalendarProps` `footer`): the
// Time row, buttons jumping to dates (computed from the selection), or both.
type Footer = (calendar: CalendarFooter) => ReactNode;

/** The date a jump starts from: the selected one, or the range's end. */
const baseOf = (value: CalendarFooter['value']) => {
  if (value instanceof Date) return value;
  return value?.end ?? value?.start ?? new Date();
};

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const jumps = {
  inAWeek: ['In a week', (value) => addDays(baseOf(value), 7)],
  nextMonth: [
    'Next month',
    (value) => {
      const base = baseOf(value);
      return new Date(base.getFullYear(), base.getMonth() + 1, 1);
    },
  ],
  today: ['Today', () => new Date()],
  // With its time, too (see `withTime`).
  now: ['Now', () => new Date()],
} satisfies Record<
  string,
  readonly [string, (value: CalendarFooter['value']) => Date]
>;

/** Jumps taking the date's time, too (others keep the selected time). */
const withTime = new Set<string>(['Now']);

const JumpGroup = styled('span')`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
`;

const JumpButtons: FunctionComponent<{
  calendar: CalendarFooter;
  only?: boolean;
}> = ({ calendar, only = false }) => (
  <CalendarRow>
    <span aria-hidden="true">Jump to</span>
    <JumpGroup>
      {(only ? [jumps.inAWeek] : Object.values(jumps)).map(([label, to]) => (
        <CalendarButton
          key={label}
          disabled={calendar.disabled}
          shape={calendar.buttonShape}
          onClick={() =>
            calendar.select(to(calendar.value), withTime.has(label))
          }
        >
          {label}
        </CalendarButton>
      ))}
    </JumpGroup>
  </CalendarRow>
);

export const footers = {
  none: () => null,
  oneJump: (calendar) => (
    <JumpButtons
      only
      calendar={calendar}
    />
  ),
  severalJumps: (calendar) => <JumpButtons calendar={calendar} />,
  timeRow: (calendar) => <CalendarTimeRow calendar={calendar} />,
  timeRowAndJumps: (calendar) => (
    <>
      <CalendarTimeRow calendar={calendar} />
      <JumpButtons calendar={calendar} />
    </>
  ),
} satisfies Record<string, Footer>;

/** The demo's content: a range (dates only), and the calendar's footer. */
export const getPropOptionsContent = (mode: DatePickerMode) => ({
  ...(mode === 'date' && { range: [false, true] as const }),
  footer: [undefined, ...(Object.keys(footers) as (keyof typeof footers)[])],
});

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
  buttonShape: [undefined, 'capsule', 'roundedRectangle'] as const,
  popover: [undefined, true, false] as const,
  defaultOpen: [undefined, null, 'date', 'time'] as const,
  disabled: [undefined, false, true] as const,
  locale: [undefined, 'en-US', 'de-DE', 'fr-FR', 'ar-EG', 'ko-KR'] as const,
  hourCycle: [undefined, 'h12', 'h23'] as const,
  firstDayOfWeek: weekdayOptions,
  showAdjacentDays: [undefined, false, true] as const,
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
