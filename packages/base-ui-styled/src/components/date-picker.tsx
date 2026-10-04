import { Popover as BasePopover } from '@base-ui/react/popover';
import { styled } from 'goober';
import {
  CSSProperties,
  FocusEvent,
  forwardRef,
  Fragment,
  FunctionComponent,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
  ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Button, ButtonRootProps } from './button.js';
import { glassMedium } from './glass.js';
import { popupTransition } from './menu.js';
import { Roll, RollValue } from './roll.js';
import { textStyle } from './typography.js';
import { css, fontWeight } from './utils.js';

// Source: Apple iOS 26 Figma (“Date and time - Collapsed”: State=Default/
// Selected; “Date and time - Pickers”: Style=Inline/Compact; light and dark
// appearance), with Figma colors mapped to UIKit semantic colors: the
// collapsed buttons `tertiarySystemFill`, text `label` (selected: the tint),
// weekdays `tertiaryLabel`, today and the arrows in the tint, the selected
// day on the tint at 12%, the separator `separator`. Ranges follow
// Framework7 (`calendar-ios.less`): their ends on the tint, the days between
// on the tint at 12%.
//
// A date picker (UIKit `UIDatePicker`): `mode` picks a date, a time or both;
// `pickerStyle` shows them `compact` (collapsed buttons, opening the
// calendar or the time in a popover, a Base UI `Popover`) or `inline` (the
// calendar in place). Names, numerals, the hour cycle and the week's first
// day follow the locale (`Intl`). With `range`, two days are picked: a start
// and an end (Framework7 `rangePicker`; UIKit: none), highlighted with the
// days between.
//
// The calendar is a group of day buttons (one tabbable): arrow keys move by
// a day or week, Page Up/Down by a month, Home/End to the week's ends. Its
// title opens a month and year roll (see `Roll`) over the days (as iOS's),
// the time's button a roll of hours and minutes (both editable: pressing the
// selected row, or typing, enters a number), as the compact time's popover.
//
// Deviations:
// - The rolls take the days' place (iOS: the month and year roll does; the
//   time's opens in a popover).
// - The popover is the menus' glass (`glassMedium`, see `Menu`; Figma: the
//   “Regular” material, blur 50px), its corners 13px, as Figma's.
// - The calendar's width (Figma: 370px) is a minimum: 7 × 44px days, 16px
//   from the sides.
// - The collapsed buttons are capsules (or, `buttonShape`, Figma's 6px
//   corners).

export type DatePickerMode = 'date' | 'dateAndTime' | 'time';

export type DatePickerStyle = 'compact' | 'inline';

/**
 * How a day is highlighted: a dot below its date (default), its date in the
 * tint (`text`), or a circle behind it, the tint at 20% (`circle`); in its
 * own `tint` (default: the date's color for dots, the app's tint
 * otherwise).
 */
export type DayHighlight = {
  style?: 'circle' | 'dot' | 'text';
  tint?: string;
};

/** A day's highlights (see `CalendarProps` `highlighted`). */
export type DayHighlights =
  boolean | DayHighlight | null | readonly DayHighlight[] | undefined;

/** A range of days: its start, and its end (`null` while picking it). */
export type DateRange = { end: Date | null; start: Date };

type SingleValue = {
  /** The initially selected date (uncontrolled). */
  defaultValue?: Date | null;
  /** Called with the newly selected date. */
  onValueChange?: (date: Date) => void;
  /** Picks a single date (default). */
  range?: false;
  /** The selected date (controlled). */
  value?: Date | null;
};

type RangeValue = {
  /** The initially selected range (uncontrolled). */
  defaultValue?: DateRange | null;
  /**
   * Called with the newly selected range: a start (its end `null`), then
   * the range.
   */
  onValueChange?: (range: DateRange) => void;
  /** Picks a range of days: a start, then an end (dates only). */
  range: true;
  /** The selected range (controlled). */
  value?: DateRange | null;
};

/** Props of the calendar (also of `DatePicker`'s). */
export type CalendarProps = {
  /** The week's first day (0: Sunday … 6: Saturday; default: the locale's). */
  firstDayOfWeek?: number;
  /**
   * Rows below the calendar, after a separator (e.g. `CalendarTimeRow`, or
   * `CalendarRow`s of `CalendarButton`s jumping to dates), composed from the
   * calendar's state and actions (see `CalendarFooter`); with a time, by
   * default `CalendarTimeRow` (none: `() => null`).
   */
  footer?: (calendar: CalendarFooter) => ReactNode;
  /**
   * Days highlighted (e.g. with events; Framework7 `events`): `true` (a dot
   * below), how (see `DayHighlight`), or several highlights (dots side by
   * side; the last text or circle highlight); `false`, `null` or
   * `undefined`: not. Not the adjacent months' days.
   */
  highlighted?: (date: Date) => DayHighlights;
  /**
   * Days of the week shown in the secondary label color (0: Sunday … 6:
   * Saturday; e.g. the weekend: `[0, 6]`; Framework7 `weekendDays`).
   */
  highlightedWeekdays?: readonly number[];
  /**
   * Days that can't be selected (e.g. booked ones; besides `min` and
   * `max`), grayed out as those (programmatic highlights still show).
   */
  isDateDisabled?: (date: Date) => boolean;
  /** Locale of names, numerals, the hour cycle and the week's first day. */
  locale?: string;
  /** The latest selectable day. */
  max?: Date;
  /** The earliest selectable day. */
  min?: Date;
  /**
   * Shows the adjacent months' days filling the first and last weeks, grayed
   * out (Framework7 `calendarDayPrev`/`Next`; UIKit: none); pressed, they
   * show their month.
   */
  showAdjacentDays?: boolean;
} & (RangeValue | SingleValue);

/** The calendar's state and actions, for its `footer`. */
export type CalendarFooter = {
  /** The shape of the picker's collapsed buttons (see `DatePicker`). */
  buttonShape?: 'capsule' | 'roundedRectangle';
  /** Whether the picker is disabled. */
  disabled: boolean;
  /**
   * Selects a day (in a range: as pressing it), showing its month; keeping
   * the selected time, or (`withTime`) taking the date's own.
   */
  select: (date: Date, withTime?: boolean) => void;
  /** Shows a day's month (focusing the day; not selecting it). */
  show: (date: Date) => void;
  /** The picker's time (if it has one): its text, and its roll. */
  time?: {
    /** The roll's id (for `aria-controls`). */
    controls: string;
    label: string;
    shown: boolean;
    toggle: () => void;
  };
  /** The selected date or range. */
  value: Date | DateRange | null;
};

/** What's open: the date (the calendar) or the time (the roll). */
export type DatePickerOpen = 'date' | 'time';

/** The time's hour cycle: 12 hours (with AM/PM) or 24. */
export type HourCycle = 'h12' | 'h23';

export type DatePickerProps = CalendarProps & {
  /**
   * The collapsed buttons' shape (default: `capsule`; `roundedRectangle`:
   * Figma's 6px corners).
   */
  buttonShape?: 'capsule' | 'roundedRectangle';
  /** The initially open popover (uncontrolled). */
  defaultOpen?: DatePickerOpen | null;
  /** Disables all of it. */
  disabled?: boolean;
  /** 12 or 24 hours (default: the locale's). */
  hourCycle?: HourCycle;
  /**
   * Date, time, or both (UIKit `UIDatePicker.Mode`; default: `date`); a
   * `range` is of dates only.
   */
  mode?: DatePickerMode;
  /** Called when the compact style's buttons open or close a picker. */
  onOpenChange?: (open: DatePickerOpen | null) => void;
  /** The open picker of the compact style (controlled). */
  open?: DatePickerOpen | null;
  /** UIKit `UIDatePickerStyle` (default: `compact`). */
  pickerStyle?: DatePickerStyle;
  /**
   * The compact style's buttons open their pickers in popovers (default);
   * without, they only toggle `open`, for the app to show them (e.g. in an
   * expandable list row: `Calendar`, `TimeRoll`).
   */
  popover?: boolean;
};

// Dates (local time).

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const addDays = (date: Date, days: number) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

const addMonths = (date: Date, months: number) => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();
  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(date.getDate(), lastDay),
  );
};

const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  Boolean(a && b) &&
  a?.getFullYear() === b?.getFullYear() &&
  a?.getMonth() === b?.getMonth() &&
  a?.getDate() === b?.getDate();

const clampDay = (date: Date, min?: Date, max?: Date) => {
  if (min && date < startOfDay(min)) return startOfDay(min);
  if (max && date > startOfDay(max)) return startOfDay(max);
  return date;
};

const isSelectable = (date: Date, min?: Date, max?: Date) =>
  (!min || date >= startOfDay(min)) && (!max || date <= startOfDay(max));

// The week's first day (0: Sunday) in a locale, where `Intl` knows it.
const firstDayOfWeek = (locale?: string) => {
  try {
    const intlLocale = new Intl.Locale(
      locale ?? new Intl.DateTimeFormat().resolvedOptions().locale,
    ) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const info = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
    return info ? info.firstDay % 7 : 0;
  } catch {
    return 0;
  }
};

// The month's days, by week (`null`: another month's).
// The weeks of the month's days (and the adjacent months' days filling
// them).
const monthWeeks = (month: Date, weekStart: number) => {
  const first = startOfMonth(month);
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const offset = (first.getDay() - weekStart + 7) % 7;
  const count = Math.ceil((offset + days) / 7) * 7;

  return Array.from({ length: count / 7 }, (_, week) =>
    Array.from({ length: 7 }, (__, day) =>
      addDays(first, week * 7 + day - offset),
    ),
  );
};

/**
 * A day's highlights (see `DayHighlights`): its dots' tints (`undefined`:
 * the date's color), and its button's attributes for a text and a circle
 * highlight (the last of each).
 */
const highlightsOf = (highlights: DayHighlights) => {
  if (!highlights) return { attributes: {}, dots: [] };
  const list: readonly DayHighlight[] =
    highlights === true ? [{}] : [highlights].flat();

  const dots = list
    .filter(({ style = 'dot' }) => style === 'dot')
    .map(({ tint }) => tint);
  const text = list.findLast(({ style }) => style === 'text');
  const circle = list.findLast(({ style }) => style === 'circle');

  return {
    attributes: {
      'data-highlight-circle': circle ? '' : undefined,
      'data-highlight-text': text ? '' : undefined,
      style: {
        '--styled-date-picker-circle': circle?.tint,
        '--styled-date-picker-text': text?.tint,
      } as CSSProperties,
    },
    dots,
  };
};

/** A day's place in a range (or none). */
const rangePlace = (day: Date, range: DateRange | null) => {
  if (!range) return undefined;
  const { end, start } = range;
  const isStart = isSameDay(day, start);
  const isEnd = isSameDay(day, end);
  if (isStart && (isEnd || !end)) return 'single';
  if (isStart) return 'start';
  if (isEnd) return 'end';
  if (end && day > start && day < end) return 'middle';
  return undefined;
};

/** Controlled or uncontrolled state (as Base UI's components). */
const useControlled = <T,>(
  value: T | undefined,
  defaultValue: T,
): [T, (next: T) => void] => {
  const [state, setState] = useState(defaultValue);
  return [value === undefined ? state : value, setState];
};

// Figma “Date and time - Collapsed”: a `Button` (bordered, secondary), 34px,
// padding 6px 11px, corners 6px (or a capsule), the text in Body; selected
// (open), in the tint. (Doubled: over the button's own styles.)
// eslint-disable-next-line prettier/prettier
const StyledCollapsedButton = styled<typeof Button.Root, ButtonRootProps>(Button.Root, forwardRef)`
  && {
    padding: 6px 11px;
    ${textStyle('body')}
    font-variant-numeric: tabular-nums;
    -webkit-tap-highlight-color: transparent;
  }

  &&[data-popup-open],
  &&[aria-expanded='true'] {
    --styled-button-color: var(--color-ios-primary);
  }
`;

const CollapsedButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonRootProps, 'shape'> & {
    shape?: DatePickerProps['buttonShape'];
  }
>(({ shape, ...props }, ref) => (
  <StyledCollapsedButton
    ref={ref}
    shape={shape === 'roundedRectangle' ? 'roundedRectangle' : 'capsule'}
    type="button"
    variant="bordered-secondary"
    {...props}
  />
));

// Figma “Style=Inline”: the calendar, a separator, the time row.
const Panel = styled('div', forwardRef)`
  display: flex;
  min-width: calc(7 * 44px + 2 * 16px);
  flex-direction: column;
  color: var(--color-ios-label);
  padding-block: 6px;
`;

// Figma “Header”: 40px, the month and year (Body Emphasized) 16px from the
// start, the arrows (20px, 510, the tint) 16px from the end, 28px apart.
const Header = styled('div', forwardRef)`
  position: relative;
  display: flex;
  min-height: 40px;
  align-items: center;
  justify-content: space-between;
  padding-inline: 16px;
`;

const MonthTitle = styled('h2', forwardRef)`
  margin: 0;
  ${textStyle('body')}
  ${fontWeight(590)}
`;

// The title opens the month and year roll: its chevron (iOS: 􀆊, 590, in the
// tint) turned down while open, the title in the tint.
const TitleButton = styled('button', forwardRef)`
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: 0;
  margin: 0;
  appearance: none;
  background: none;
  color: inherit;
  font: inherit;
  gap: 6px;
  letter-spacing: inherit;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    cursor: pointer;
  }

  & > svg {
    color: var(--color-ios-primary);
    transition: rotate 200ms;
  }

  &:dir(rtl) > svg {
    scale: -1 1;
  }

  &[aria-expanded='true'] {
    color: var(--color-ios-primary);

    & > svg {
      rotate: 90deg;
    }
  }

  &[aria-expanded='true']:dir(rtl) > svg {
    rotate: -90deg;
  }
`;

const Arrows = styled('div', forwardRef)`
  display: flex;
  align-items: center;
  margin-inline-end: -4px;

  &[hidden] {
    display: flex;
    visibility: hidden;
  }
`;

// Borderless round `Button`s, 40px: their chevrons (20px, the tint) 28px
// apart.
// eslint-disable-next-line prettier/prettier
const Arrow = styled<typeof Button.Root, ButtonRootProps>(Button.Root, forwardRef)`
  && {
    width: 40px;
    height: 40px;
    -webkit-tap-highlight-color: transparent;
  }

  &&:dir(rtl) > svg {
    scale: -1 1;
  }
`;

// The weekdays and days, or a roll in their place (keeping their size).
const Body = styled('div', forwardRef)`
  position: relative;
  display: flex;
  flex-direction: column;

  &[data-rolled] > :not([data-date-picker-part='roll']) {
    visibility: hidden;
  }
`;

const Overlay = styled('div', forwardRef)`
  position: absolute;
  display: grid;
  align-content: center;
  inset: 0;
  padding-inline: 8px;
`;

// Figma “Date Header” and “_Week”: seven 44px columns, 16px from the sides.
const columns = css`
  display: grid;
  grid-template-columns: repeat(7, minmax(44px, 1fr));
  padding-inline: 16px;
`;

const Weekdays = styled('div', forwardRef)`
  ${columns}

  min-height: 20px;
  color: var(--color-ios-tertiary-label);
  font-size: 13px;
  ${fontWeight(590)}
  line-height: 18px;
  place-items: center;
  text-transform: uppercase;

  & > abbr {
    text-decoration: none;
  }

  & > [data-weekday-highlighted] {
    color: var(--color-ios-secondary-label);
  }
`;

// The month's days, and, while changing months, the previous one's, sliding
// out (see CalendarPanel).
const Pages = styled('div', forwardRef)`
  position: relative;
`;

const LeavingPage = styled('div', forwardRef)`
  position: absolute;
  top: 0;
  inset-inline: 0;
  pointer-events: none;
`;

// Figma “Calendar”: 3px above, weeks 7px apart.
const Weeks = styled('div', forwardRef)`
  ${columns}

  padding-block-start: 3px;
  row-gap: 7px;

  /* Ranges are dragged (see CalendarPanel), not scrolled. */
  &[data-range-drag] {
    touch-action: none;
  }
`;

const tint = (percent: number) =>
  `color-mix(in srgb, var(--color-ios-primary) ${percent}%, transparent)`;

// Figma “Day”: a 44px circle (behind it), its date in Title 3; today in the
// tint; the selected day on the tint at 12%, its date 24px at 510, in the
// tint. In a range (across its column, see Source), its ends on the tint,
// the days between (and the halves towards them) on the tint at 12%.
const Day = styled('button', forwardRef)`
  position: relative;
  display: grid;
  height: 44px;
  padding: 0;
  border: 0;
  margin: 0;
  appearance: none;
  background: none;
  color: var(--color-ios-label);
  font-family: inherit;
  ${textStyle('title3')}
  font-variant-numeric: tabular-nums;
  isolation: isolate;
  outline: none;
  place-items: center;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    cursor: pointer;
  }

  &::before {
    position: absolute;
    z-index: -1;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    margin: auto;
    content: '';
    inset: 0;
  }

  &:focus-visible::before {
    outline: 2px solid var(--color-ios-primary);
    outline-offset: 2px;
  }

  &[aria-current='date'] {
    color: var(--color-ios-primary);
  }

  &[aria-pressed='true'] {
    color: var(--color-ios-primary);
    font-size: 24px;
    ${fontWeight(510)}

    &::before {
      background-color: ${tint(12)};
    }
  }

  &[data-range='middle'] {
    background-color: ${tint(12)};
    font-size: var(--font-ios-title3-size);
    ${fontWeight(400)}

    &::before {
      background: none;
    }
  }

  &[data-range='start'],
  &[data-range='end'],
  &[data-range='single'] {
    color: #fff;

    &::before {
      background-color: var(--color-ios-primary);
    }
  }

  &[data-range='start'] {
    background: linear-gradient(
      to var(--styled-date-picker-end, right),
      transparent 50%,
      ${tint(12)} 50%
    );
  }

  &[data-range='end'] {
    background: linear-gradient(
      to var(--styled-date-picker-end, right),
      ${tint(12)} 50%,
      transparent 50%
    );
  }

  &:dir(rtl) {
    --styled-date-picker-end: left;
  }

  /* The adjacent months' days (see showAdjacentDays) */
  &[data-outside]:not([aria-pressed='true'], [data-range]) {
    color: var(--color-ios-tertiary-label);
  }

  /* Highlighted weekdays (e.g. the weekend) */
  &[data-weekday-highlighted]:enabled:not([aria-pressed='true']) {
    color: var(--color-ios-secondary-label);
  }

  /* Highlighted days (see DayHighlight): dots below the date (Framework7
     events, side by side), the date in the tint, or a circle behind it; not
     selected ones' text and circles. */
  & > [data-date-picker-part='dots'] {
    position: absolute;
    bottom: 5px;
    display: flex;
    justify-content: center;
    gap: 2px;
    inset-inline: 0;
    pointer-events: none;

    & > * {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: currentcolor;
      opacity: 0.6;
    }
  }

  &[data-highlight-text]:not([aria-pressed='true']) {
    color: var(--styled-date-picker-text, var(--color-ios-primary));
  }

  &[data-highlight-circle]:not([aria-pressed='true']) {
    &::before {
      background-color: color-mix(
        in srgb,
        var(--styled-date-picker-circle, var(--color-ios-primary)) 20%,
        transparent
      );
    }
  }

  &:disabled {
    color: var(--color-ios-tertiary-label);

    @media (hover: hover) {
      cursor: not-allowed;
    }
  }
`;

// Figma “Separator”: 0.5px, 16px from the sides, 11px down.
const Separator = styled('div', forwardRef)`
  height: 11px;
  box-sizing: border-box;
  border-block-end: 0.5px solid var(--color-ios-separator);
  margin-inline: 16px;
`;

// Figma “Time”: a 52px row, the title (Body) and the time.
const TimeRow = styled('div', forwardRef)`
  display: flex;
  min-height: 52px;
  align-items: center;
  justify-content: space-between;
  ${textStyle('body')}
  gap: 16px;
  padding-inline: 16px;
`;

const Chevron = ({ next }: { next: boolean }) => (
  <svg
    aria-hidden="true"
    fill="none"
    height="20"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2.4"
    viewBox="0 0 12 20"
    width="12"
  >
    <path d={next ? 'M3 2l7 8-7 8' : 'M9 2l-7 8 7 8'} />
  </svg>
);

const Disclosure = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="0.75em"
    stroke="currentcolor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 8 14"
    width="0.43em"
  >
    <path d="M1.5 1.5L6.5 7l-5 5.5" />
  </svg>
);

/** The locale's hour cycle, and whether the day period comes first. */
const timeFormat = (locale?: string, cycle?: HourCycle) => {
  const format = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    hourCycle: cycle,
    minute: 'numeric',
  });
  const { hourCycle = 'h23' } = format.resolvedOptions();
  const parts = format.formatToParts(new Date(2000, 0, 1, 21, 41));
  const periodFirst =
    parts.findIndex(({ type }) => type === 'dayPeriod') <
    parts.findIndex(({ type }) => type === 'hour');
  const period = (hour: number) =>
    format
      .formatToParts(new Date(2000, 0, 1, hour))
      .find(({ type }) => type === 'dayPeriod')?.value ?? '';

  return {
    hourCycle,
    periodFirst: periodFirst && parts.some(({ type }) => type === 'dayPeriod'),
    periods: [period(9), period(21)] as const,
    twelve: hourCycle === 'h11' || hourCycle === 'h12',
  };
};

export type TimeRollProps = {
  /** 12 or 24 hours (default: the locale's). */
  hourCycle?: HourCycle;
  /** Locale of numerals, the hour cycle and the day period. */
  locale?: string;
  /** Called with the date at the newly selected time. */
  onValueChange: (date: Date) => void;
  /** The date whose time is shown (default: now). */
  value: Date | null;
};

/**
 * The time as a roll: hours, minutes and (12 hours) the day period, the
 * numbers editable (e.g. in an expandable list row, see `DatePicker`).
 */
const TimeRoll: FunctionComponent<TimeRollProps> = ({
  hourCycle: cycle,
  locale,
  onValueChange: onChange,
  value,
}) => {
  const date = value ?? new Date();
  const { hourCycle, periodFirst, periods, twelve } = useMemo(
    () => timeFormat(locale, cycle),
    [cycle, locale],
  );
  const numbers = useMemo(
    () => ({
      hour: new Intl.NumberFormat(locale, {
        minimumIntegerDigits: twelve ? 1 : 2,
      }),
      minute: new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }),
    }),
    [locale, twelve],
  );

  const hours = date.getHours();
  const pm = hours >= 12;
  const hourValues = twelve
    ? Array.from({ length: 12 }, (_, index) =>
        hourCycle === 'h12' ? index + 1 : index,
      )
    : Array.from({ length: 24 }, (_, index) => index);
  const twelveHour = hourCycle === 'h12' ? hours % 12 || 12 : hours % 12;
  const shownHour = twelve ? twelveHour : hours;

  const set = (hour: number, minute: number) => {
    const next = new Date(date);
    next.setHours(hour, minute, 0, 0);
    onChange(next);
  };

  const period = (
    <Roll.Column
      aria-label="AM/PM"
      value={pm ? 'pm' : 'am'}
      onValueChange={(next: RollValue) => {
        if ((next === 'pm') === pm) return;
        set((hours + 12) % 24, date.getMinutes());
      }}
    >
      <Roll.Item value="am">{periods[0]}</Roll.Item>
      <Roll.Item value="pm">{periods[1]}</Roll.Item>
    </Roll.Column>
  );

  return (
    <Roll.Root>
      {twelve && periodFirst ? period : null}
      <Roll.Column
        editable
        align="end"
        aria-label="Hours"
        value={shownHour}
        onValueChange={(next: RollValue) => {
          const hour = Number(next);
          set(twelve ? (hour % 12) + (pm ? 12 : 0) : hour, date.getMinutes());
        }}
      >
        {hourValues.map((hour) => (
          <Roll.Item
            key={hour}
            value={hour}
          >
            {numbers.hour.format(hour)}
          </Roll.Item>
        ))}
      </Roll.Column>
      <Roll.Column
        editable
        align="start"
        aria-label="Minutes"
        value={date.getMinutes()}
        onValueChange={(next: RollValue) => set(hours, Number(next))}
      >
        {Array.from({ length: 60 }, (_, minute) => (
          <Roll.Item
            key={minute}
            value={minute}
          >
            {numbers.minute.format(minute)}
          </Roll.Item>
        ))}
      </Roll.Column>
      {twelve && !periodFirst ? period : null}
    </Roll.Root>
  );
};

const clampMonth = (month: Date, min?: Date, max?: Date) => {
  if (min && month < startOfMonth(min)) return startOfMonth(min);
  if (max && month > startOfMonth(max)) return startOfMonth(max);
  return month;
};

/** The shown month as a roll: months and years (within the limits). */
const MonthYearRoll: FunctionComponent<{
  locale?: string;
  max?: Date;
  min?: Date;
  month: Date;
  onChange: (month: Date) => void;
}> = ({ locale, max, min, month, onChange }) => {
  const names = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { month: 'long' });
    return Array.from({ length: 12 }, (_, index) =>
      format.format(new Date(2000, index, 1)),
    );
  }, [locale]);
  const yearFormat = useMemo(
    () => new Intl.NumberFormat(locale, { useGrouping: false }),
    [locale],
  );

  // Its years: within the limits, or a century around the first shown
  // (fixed: changing with the selection, they'd move under the roll).
  const year = month.getFullYear();
  const [around] = useState(year);
  const first = min?.getFullYear() ?? Math.min(around - 100, year);
  const last = max?.getFullYear() ?? Math.max(around + 100, year);
  const inLimits = (candidate: Date) =>
    (!min || candidate >= startOfMonth(min)) &&
    (!max || candidate <= startOfMonth(max));

  return (
    <Roll.Root>
      <Roll.Column
        align="end"
        aria-label="Month"
        value={month.getMonth()}
        onValueChange={(next: RollValue) =>
          onChange(new Date(year, Number(next), 1))
        }
      >
        {names.map((name, index) => (
          <Roll.Item
            key={name}
            disabled={!inLimits(new Date(year, index, 1))}
            value={index}
          >
            {name}
          </Roll.Item>
        ))}
      </Roll.Column>
      <Roll.Column
        editable
        align="start"
        aria-label="Year"
        value={year}
        onValueChange={(next: RollValue) =>
          onChange(
            clampMonth(new Date(Number(next), month.getMonth(), 1), min, max),
          )
        }
      >
        {Array.from({ length: last - first + 1 }, (_, index) => (
          <Roll.Item
            key={first + index}
            value={first + index}
          >
            {yearFormat.format(first + index)}
          </Roll.Item>
        ))}
      </Roll.Column>
    </Roll.Root>
  );
};

type CalendarInternalProps = CalendarProps & {
  hourCycle?: HourCycle;
  /** The roll shown at first (internal, see `DatePicker`). */
  initialRoll?: 'monthYear' | 'time';
  label?: string;
  /** The picker's time (internal, see `DatePicker`): for the footer. */
  time?: {
    disabled: boolean;
    shape?: DatePickerProps['buttonShape'];
  };
};

/**
 * The calendar's value: a date or a range (shown, while one is dragged,
 * as dragged; see `CalendarPanel`).
 */
const useCalendarValue = (props: CalendarInternalProps) => {
  const [value, setValue] = useControlled<Date | DateRange | null>(
    props.value,
    props.defaultValue ?? null,
  );
  const [dragged, setDragged] = useState<DateRange | null>(null);
  const range = props.range
    ? (dragged ?? (value as DateRange | null) ?? null)
    : null;
  const single = props.range ? null : ((value as Date | null) ?? null);

  return { dragged, range, setDragged, setValue, single };
};

/** The footer's state and actions (see `CalendarFooter`). */
const footerOf = ({
  time,
  ...footer
}: Pick<CalendarFooter, 'select' | 'show' | 'value'> & {
  time?: NonNullable<CalendarFooter['time']> & {
    disabled: boolean;
    shape?: DatePickerProps['buttonShape'];
  };
}): CalendarFooter => {
  if (!time) return { ...footer, disabled: false };
  const { disabled, shape, ...rest } = time;
  return { ...footer, buttonShape: shape, disabled, time: rest };
};

/** A day's button's date (see `CalendarPanel`). */
const dayOf = (target: EventTarget | null) => {
  const element =
    target instanceof Element
      ? target.closest<HTMLElement>('[data-date]')
      : null;
  const time = Number(element?.dataset.date);
  return element && Number.isFinite(time) ? new Date(time) : undefined;
};

/** A range from two days, in either order. */
const between = (a: Date, b: Date): DateRange =>
  a <= b ? { end: b, start: a } : { end: a, start: b };

/** The calendar (Figma “Style=Inline”), with an optional time row. */
const CalendarPanel: FunctionComponent<CalendarInternalProps> = (props) => {
  const {
    firstDayOfWeek: weekStartProp,
    highlighted,
    highlightedWeekdays = [],
    hourCycle,
    isDateDisabled,
    label,
    locale,
    max,
    min,
    showAdjacentDays,
    time,
  } = props;
  const { dragged, range, setDragged, setValue, single } =
    useCalendarValue(props);

  const today = startOfDay(new Date());
  const [month, setMonth] = useState(() =>
    startOfMonth(range?.start ?? single ?? today),
  );
  const [focused, setFocused] = useState(() =>
    clampDay(startOfDay(range?.start ?? single ?? today), min, max),
  );
  const [rolled, setRolled] = useState<'monthYear' | 'time' | undefined>(
    props.initialRoll,
  );
  // The month slid out while another slides in (see below).
  const [leaving, setLeaving] = useState<
    { direction: number; month: Date } | undefined
  >(undefined);
  const leavingRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);
  const focusNext = useRef<Date | undefined>(undefined);
  const drag = useRef<
    | {
        /** Moving on to other months, while held beyond the days. */
        edge: number;
        from: Date;
        moved: boolean;
        timer?: ReturnType<typeof setTimeout>;
        x: number;
        y: number;
      }
    | undefined
  >(undefined);
  // The shown month, for the drag's timers.
  const monthRef = useRef(month);
  useLayoutEffect(() => {
    monthRef.current = month;
  });
  const suppressClick = useRef(false);
  const height = useRef<number | undefined>(undefined);
  const titleId = useId();
  const rollId = useId();

  const formats = useMemo(
    () => ({
      day: new Intl.DateTimeFormat(locale, { day: 'numeric' }),
      full: new Intl.DateTimeFormat(locale, { dateStyle: 'full' }),
      month: new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
      }),
      time: new Intl.DateTimeFormat(locale, { hourCycle, timeStyle: 'short' }),
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
      weekdayLong: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
    }),
    [hourCycle, locale],
  );
  const weekStart = useMemo(
    () => (weekStartProp ?? firstDayOfWeek(locale)) % 7,
    [locale, weekStartProp],
  );
  const weeks = monthWeeks(month, weekStart);
  // Within the limits, and not disabled.
  const selectable = (day: Date) =>
    isSelectable(day, min, max) && !isDateDisabled?.(day);
  // A week of days (any), for the weekday names.
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    addDays(new Date(2024, 0, 7), (weekStart + index) % 7),
  );

  // Keyboard moves focus to the day it moved to, once rendered (an effect
  // of an earlier render may run first).
  useEffect(() => {
    const { current: target } = focusNext;
    if (!target) return;
    const day = daysRef.current?.querySelector<HTMLButtonElement>(
      `[data-date="${CSS.escape(String(target.getTime()))}"]`,
    );
    if (!day) return;
    focusNext.current = undefined;
    day.focus();
  });

  // Months of more or fewer weeks: the days' height transitions.
  useLayoutEffect(() => {
    const { current: days } = daysRef;
    if (!days) return;
    const next = days.offsetHeight;
    const previous = height.current;
    height.current = next;
    if (previous === undefined || previous === next) return;

    // Clipped meanwhile (not at rest: it'd clip the focus rings).
    days.style.overflow = 'clip';
    const animation = days.animate(
      [{ height: `${String(previous)}px` }, { height: `${String(next)}px` }],
      { duration: 300, easing: 'ease' },
    );
    animation.finished
      .then(() => days.style.removeProperty('overflow'))
      .catch(() => days.style.removeProperty('overflow'));
  }, [month, weekStart]);

  // Months slide in from the side they're in (next: the inline end), the
  // previous one sliding out (as iOS's).
  const goTo = (next: Date) => {
    const target = startOfMonth(next);
    const direction = Math.sign(target.getTime() - month.getTime());
    if (direction === 0) return;
    setLeaving({ direction, month });
    setMonth(target);
  };

  useLayoutEffect(() => {
    const { current: days } = daysRef;
    const { current: pages } = pagesRef;
    const { current: page } = leavingRef;
    if (!leaving || !days || !pages || !page) return undefined;

    const rtl = getComputedStyle(pages).direction === 'rtl' ? -1 : 1;
    const shift = (fraction: number) =>
      `translateX(${String(fraction * leaving.direction * rtl * 100)}%)`;
    const options = { duration: 300, easing: 'ease' };
    pages.style.overflow = 'clip';
    const animations = [
      days.animate([{ transform: shift(1) }, { transform: 'none' }], options),
      page.animate([{ transform: 'none' }, { transform: shift(-1) }], options),
    ];
    const [incoming] = animations;
    incoming?.finished
      .then(() => {
        pages.style.removeProperty('overflow');
        setLeaving(undefined);
      })
      .catch(() => undefined);

    return () => {
      for (const animation of animations) animation.cancel();
      pages.style.removeProperty('overflow');
    };
  }, [leaving]);

  // Moved by keyboard: on past disabled days (in the direction moved), to
  // one that can be focused.
  const moveTo = (date: Date) => {
    const direction = Math.sign(date.getTime() - focused.getTime()) || 1;
    let target = clampDay(date, min, max);
    for (let step = 0; step < 366 && !selectable(target); step += 1) {
      const next = addDays(target, direction);
      if (!isSelectable(next, min, max)) return;
      target = next;
    }
    if (!selectable(target)) return;
    setFocused(target);
    goTo(target);
    focusNext.current = target;
  };

  const changeTime = (date: Date) => {
    setValue(date);
    if (!props.range) props.onValueChange?.(date);
  };

  const commitRange = (next: DateRange) => {
    if (!props.range) return;
    setValue(next);
    props.onValueChange?.(next);
  };

  const select = (date: Date, withTime = false) => {
    setFocused(startOfDay(date));

    if (props.range) {
      // A new range, or its end (before its start: the other way round).
      commitRange(
        !range || range.end
          ? { end: null, start: date }
          : between(range.start, date),
      );
      return;
    }

    // Keeps the time of an earlier value (unless taking the date's).
    const next = new Date(date);
    if (single && !withTime) {
      next.setHours(single.getHours(), single.getMinutes(), 0, 0);
    }
    setValue(next);
    props.onValueChange?.(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const column = (focused.getDay() - weekStart + 7) % 7;
    const moves: Record<string, () => Date> = {
      ArrowDown: () => addDays(focused, 7),
      ArrowLeft: () => addDays(focused, rtl ? 1 : -1),
      ArrowRight: () => addDays(focused, rtl ? -1 : 1),
      ArrowUp: () => addDays(focused, -7),
      End: () => addDays(focused, 6 - column),
      Home: () => addDays(focused, -column),
      PageDown: () => addMonths(focused, 1),
      PageUp: () => addMonths(focused, -1),
    };
    const move = moves[event.key];
    if (!move) return;

    event.preventDefault();
    moveTo(move());
  };

  // Ranges are also dragged into existence: from the day pressed to the day
  // under the pointer, picked on release (taps pick start and end).
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!props.range || event.button !== 0) return;
    const from = dayOf(event.target);
    if (!from || !selectable(from)) return;
    drag.current = {
      edge: 0,
      from,
      moved: false,
      x: event.clientX,
      y: event.clientY,
    };
  };

  // Held below (or above) the days, the drag moves on to the next (or
  // previous) month, and on, the range following to its first (last) day.
  const turnPage = (edge: number) => {
    const { current: dragging } = drag;
    if (!dragging) return;
    if (edge === dragging.edge) return;
    clearTimeout(dragging.timer);
    dragging.edge = edge;
    if (edge === 0) return;

    const step = () => {
      const next = startOfMonth(addMonths(monthRef.current, edge));
      const edgeDay =
        edge > 0 ? next : new Date(next.getFullYear(), next.getMonth() + 1, 0);
      const day = clampDay(edgeDay, min, max);
      // Not beyond the limits.
      if (day.getMonth() !== next.getMonth()) return;
      monthRef.current = next;
      goTo(next);
      setDragged(between(dragging.from, day));
      dragging.timer = setTimeout(step, 700);
    };
    dragging.timer = setTimeout(step, 500);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const { current: dragging } = drag;
    if (!dragging) return;
    if (!dragging.moved) {
      if (
        Math.hypot(event.clientX - dragging.x, event.clientY - dragging.y) < 6
      ) {
        return;
      }
      // Moves beyond the days are its own, too (the edges, see turnPage).
      dragging.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragged(between(dragging.from, dragging.from));
    }

    // Past the month's last day (on a day or blank after it, below the
    // days, or beyond their inline end): on to the next month; before its
    // first: back.
    const { bottom, left, right, top } =
      event.currentTarget.getBoundingClientRect();
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const under = document.elementFromPoint(event.clientX, event.clientY);
    const outside =
      under instanceof Element
        ? under.closest<HTMLElement>('[data-outside]')?.dataset.outside
        : undefined;
    const beyondEnd = rtl ? event.clientX < left : event.clientX > right;
    const beyondStart = rtl ? event.clientX > right : event.clientX < left;
    const after = event.clientY > bottom || beyondEnd || outside === 'after';
    const before = event.clientY < top || beyondStart || outside === 'before';
    turnPage(Number(after) - Number(before));

    const over = dayOf(under);
    if (!over || !selectable(over)) return;
    setDragged(between(dragging.from, over));
    setFocused(over);
  };

  const onPointerEnd = () => {
    const { current: dragging } = drag;
    clearTimeout(dragging?.timer);
    drag.current = undefined;
    if (!dragging?.moved || !dragged) {
      setDragged(null);
      return;
    }
    // Not also the click on the day released on (or pressed).
    suppressClick.current = true;
    setTimeout(() => {
      suppressClick.current = false;
    });
    setDragged(null);
    commitRange(dragged);
  };

  const showMonth = (next: Date) => {
    goTo(next);
    setFocused(clampDay(next, min, max));
  };

  const previousDisabled = Boolean(
    min && addDays(startOfMonth(month), -1) < startOfDay(min),
  );
  const nextDisabled = Boolean(
    max && startOfMonth(addMonths(month, 1)) > startOfDay(max),
  );

  const toggle = (roll: 'monthYear' | 'time') =>
    setRolled(rolled === roll ? undefined : roll);

  // A day of the grid of `shown` (the month, or the one sliding out, not
  // `interactive`): another month's is blank, or grayed out (see
  // `showAdjacentDays`); either is marked `data-outside`, for drags.
  const cell = (day: Date, shown: Date, interactive: boolean) => {
    const outsideOf = day < shown ? 'before' : ('after' as 'after' | 'before');
    const outside = day.getMonth() === shown.getMonth() ? undefined : outsideOf;
    if (outside && !showAdjacentDays) {
      return (
        <span
          key={day.getTime()}
          data-outside={outside}
        />
      );
    }

    // Not the adjacent months' days (nor their weekdays, see below).
    const { attributes, dots } = highlightsOf(
      outside ? undefined : highlighted?.(day),
    );

    return (
      <Day
        key={day.getTime()}
        aria-current={isSameDay(day, today) ? 'date' : undefined}
        aria-label={interactive ? formats.full.format(day) : undefined}
        data-date={interactive ? day.getTime() : undefined}
        {...attributes}
        data-outside={outside}
        data-range={rangePlace(day, range)}
        disabled={!selectable(day)}
        tabIndex={interactive && !outside && isSameDay(day, focused) ? 0 : -1}
        type="button"
        aria-pressed={
          range ? rangePlace(day, range) !== undefined : isSameDay(day, single)
        }
        data-weekday-highlighted={
          (!outside && highlightedWeekdays.includes(day.getDay())) || undefined
        }
        onClick={
          interactive
            ? () => {
                // Another month's day: shows its month (not selected).
                if (outside) {
                  showMonth(day);
                  return;
                }
                select(day);
              }
            : undefined
        }
      >
        {formats.day.format(day)}
        {dots.length > 0 ? (
          <span data-date-picker-part="dots">
            {dots.map((dot, index) => (
              <span
                // By place: dots don't move.
                key={index}
                style={dot ? { backgroundColor: dot } : undefined}
              />
            ))}
          </span>
        ) : null}
      </Day>
    );
  };

  const footerContent = props.footer?.(
    footerOf({
      select: (date, withTime) => {
        goTo(date);
        select(withTime ? date : startOfDay(date), withTime);
      },
      show: (date) => {
        goTo(date);
        setFocused(clampDay(startOfDay(date), min, max));
      },
      time: time && {
        ...time,
        controls: rollId,
        label: single ? formats.time.format(single) : '–',
        shown: rolled === 'time',
        toggle: () => toggle('time'),
      },
      value: range ?? single,
    }),
  );

  return (
    <Panel data-date-picker-part="calendar">
      <Header>
        <MonthTitle
          aria-live="polite"
          id={titleId}
        >
          <TitleButton
            aria-controls={rollId}
            aria-expanded={rolled === 'monthYear'}
            type="button"
            onClick={() => toggle('monthYear')}
          >
            {formats.month.format(month)}
            <Disclosure />
          </TitleButton>
        </MonthTitle>
        <Arrows hidden={rolled === 'monthYear'}>
          <Arrow
            aria-label="Previous month"
            disabled={previousDisabled}
            shape="circle"
            onClick={() => showMonth(addMonths(month, -1))}
          >
            <Chevron next={false} />
          </Arrow>
          <Arrow
            aria-label="Next month"
            disabled={nextDisabled}
            shape="circle"
            onClick={() => showMonth(addMonths(month, 1))}
          >
            <Chevron next />
          </Arrow>
        </Arrows>
      </Header>
      <Body data-rolled={rolled === undefined ? undefined : ''}>
        <Weekdays aria-hidden="true">
          {weekdays.map((day) => (
            <abbr
              key={day.getDay()}
              title={formats.weekdayLong.format(day)}
              data-weekday-highlighted={
                highlightedWeekdays.includes(day.getDay()) || undefined
              }
            >
              {formats.weekday.format(day)}
            </abbr>
          ))}
        </Weekdays>
        <Pages ref={pagesRef}>
          {leaving ? (
            <LeavingPage
              ref={leavingRef}
              inert
              aria-hidden="true"
            >
              <Weeks>
                {monthWeeks(leaving.month, weekStart)
                  .flat()
                  .map((day) => cell(day, leaving.month, false))}
              </Weeks>
            </LeavingPage>
          ) : null}
          <Weeks
            ref={daysRef}
            aria-label={label}
            aria-labelledby={label ? undefined : titleId}
            data-range-drag={props.range ? '' : undefined}
            role="group"
            onKeyDown={onKeyDown}
            onPointerCancel={onPointerEnd}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onClickCapture={(event: MouseEvent<HTMLDivElement>) => {
              if (!suppressClick.current) return;
              suppressClick.current = false;
              event.stopPropagation();
            }}
            onFocus={(event: FocusEvent<HTMLDivElement>) => {
              // The day focused (e.g. pressed): keys move on from it.
              const day = dayOf(event.target);
              if (day && !isSameDay(day, focused)) setFocused(day);
            }}
          >
            {weeks.flat().map((day) => cell(day, month, true))}
          </Weeks>
        </Pages>
        {rolled === undefined ? null : (
          <Overlay
            data-date-picker-part="roll"
            id={rollId}
          >
            {rolled === 'monthYear' ? (
              <MonthYearRoll
                locale={locale}
                max={max}
                min={min}
                month={month}
                onChange={showMonth}
              />
            ) : (
              <TimeRoll
                hourCycle={hourCycle}
                locale={locale}
                value={single}
                onValueChange={changeTime}
              />
            )}
          </Overlay>
        )}
      </Body>
      {footerContent === null || footerContent === undefined ? null : (
        <>
          <Separator />
          {footerContent}
        </>
      )}
    </Panel>
  );
};

/** A footer row (see `CalendarProps` `footer`): Figma “Time”'s, 52px. */
const CalendarRow = TimeRow;

/** A footer button (see `CalendarProps` `footer`): a collapsed button. */
const CalendarButton = CollapsedButton;

/**
 * The footer's Time row (Figma “Time”): the time's button, showing its
 * roll; the picker's default footer, with a time.
 */
const CalendarTimeRow: FunctionComponent<{
  calendar: CalendarFooter;
  /** The row's title (default: “Time”). */
  label?: ReactNode;
}> = ({ calendar, label = 'Time' }) =>
  calendar.time ? (
    <CalendarRow>
      <span aria-hidden="true">{label}</span>
      <CalendarButton
        aria-controls={calendar.time.controls}
        aria-expanded={calendar.time.shown}
        aria-label="Time"
        disabled={calendar.disabled}
        shape={calendar.buttonShape}
        onClick={calendar.time.toggle}
      >
        {calendar.time.label}
      </CalendarButton>
    </CalendarRow>
  ) : null;

/** The calendar (Figma “Style=Inline”, without the time). */
const Calendar: FunctionComponent<CalendarProps & { label?: string }> = (
  props,
) => <CalendarPanel {...props} />;

// The compact style's buttons, 6px apart, aligned to the end.
const Collapsed = styled('div', forwardRef)`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  vertical-align: middle;
`;

// Figma “Style=Compact”: the inline style on glass, its corners 13px.
const Popup = styled(BasePopover.Popup, forwardRef)`
  ${glassMedium()}
  ${popupTransition}

  overflow: hidden;
  border-radius: 13px;
  outline: none;
`;

// The time's popover: the roll, 8px in.
const TimePopup = styled('div', forwardRef)`
  min-width: 200px;
  padding: 8px;
`;

/** The calendar's props, of the picker's (its value, and its changes). */
const calendarPropsOf = (
  props: DatePickerProps,
  change: (next: Date | DateRange) => void,
  value: Date | DateRange | null,
): CalendarInternalProps => {
  const shared = {
    firstDayOfWeek: props.firstDayOfWeek,
    highlighted: props.highlighted,
    highlightedWeekdays: props.highlightedWeekdays,
    isDateDisabled: props.isDateDisabled,
    showAdjacentDays: props.showAdjacentDays,
    hourCycle: props.hourCycle,
    locale: props.locale,
    max: props.max,
    min: props.min,
  };
  return props.range
    ? {
        ...shared,
        onValueChange: change,
        range: true,
        value: value as DateRange | null,
      }
    : { ...shared, onValueChange: change, value: value as Date | null };
};

/** The picker's value: a date or a range, and its changes. */
const usePickerValue = (props: DatePickerProps) => {
  const [value, setValue] = useControlled<Date | DateRange | null>(
    props.value,
    props.defaultValue ?? null,
  );

  // Only changed to the kind of value it has (a date or a range).
  const change = (next: Date | DateRange) => {
    setValue(next);
    (props.onValueChange as ((changed: typeof next) => void) | undefined)?.(
      next,
    );
  };

  return {
    change,
    range: props.range ? ((value as DateRange | null) ?? null) : null,
    single: props.range ? null : ((value as Date | null) ?? null),
  };
};

/** The open picker of the compact style, and its changes. */
const usePickerOpen = (props: DatePickerProps) => {
  const [open, setOpen] = useControlled<DatePickerOpen | null>(
    props.open,
    props.defaultOpen ?? null,
  );

  const change = (next: DatePickerOpen | null) => {
    setOpen(next);
    props.onOpenChange?.(next);
  };

  return [open, change] as const;
};

/** The picker's default footer, with a time. */
const defaultFooter = (calendar: CalendarFooter) => (
  <CalendarTimeRow calendar={calendar} />
);

/** The compact style's time: its button, the roll in a popover. */
const TimePopover: FunctionComponent<
  TimeRollProps & {
    disabled: boolean;
    label: string;
    onOpenChange: (open: boolean) => void;
    open: boolean;
    shape?: DatePickerProps['buttonShape'];
  }
> = ({ disabled, label, onOpenChange, open, shape, ...props }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  return (
    <BasePopover.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <BasePopover.Trigger
        aria-label="Time"
        disabled={disabled}
        render={<CollapsedButton shape={shape} />}
      >
        {label}
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner
          collisionPadding={8}
          sideOffset={8}
        >
          <Popup
            ref={popupRef}
            aria-label="Time"
            // The popup (not the first column: focused while the popup
            // opens, Chrome scrolls it off its selection).
            initialFocus={popupRef}
          >
            <TimePopup>
              <TimeRoll {...props} />
            </TimePopup>
          </Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
};

/** The collapsed date button's text: a date, a range, or none. */
const dateLabelOf = (
  format: Intl.DateTimeFormat,
  range: DateRange | null,
  single: Date | null,
) => {
  if (range) {
    return range.end
      ? format.formatRange(range.start, range.end)
      : format.format(range.start);
  }
  return single ? format.format(single) : '–';
};

/**
 * The compact style's calendar popover: from the date's button, or, with a
 * time, from the time's too, with the time's roll shown (as iOS's; one
 * popover for both).
 */
const CalendarPopover: FunctionComponent<{
  children: (initialRoll?: 'time') => ReactNode;
  dateLabel: string;
  disabled: boolean;
  onOpenChange: (open: DatePickerOpen | null) => void;
  open: DatePickerOpen | null;
  shape?: DatePickerProps['buttonShape'];
  timeLabel?: string;
}> = ({
  children,
  dateLabel,
  disabled,
  onOpenChange,
  open,
  shape,
  timeLabel,
}) => {
  const dateTriggerId = useId();
  const timeTriggerId = useId();
  const collapsedRef = useRef<HTMLDivElement>(null);
  const hasTime = timeLabel !== undefined;

  // Positioned at both buttons together, whichever opened it.
  return (
    <Collapsed ref={collapsedRef}>
      <BasePopover.Root
        open={open === 'date' || (hasTime && open === 'time')}
        triggerId={open === 'time' ? timeTriggerId : dateTriggerId}
        onOpenChange={(next: boolean, { event }) => {
          const trigger =
            event.target instanceof Element
              ? event.target.closest<HTMLElement>('[data-date-picker-trigger]')
              : null;
          const picker =
            trigger?.dataset.datePickerTrigger === 'time' ? 'time' : 'date';
          onOpenChange(next ? picker : null);
        }}
      >
        <BasePopover.Trigger
          data-date-picker-trigger="date"
          disabled={disabled}
          id={dateTriggerId}
          render={<CollapsedButton shape={shape} />}
        >
          {dateLabel}
        </BasePopover.Trigger>
        {hasTime ? (
          <BasePopover.Trigger
            aria-label="Time"
            data-date-picker-trigger="time"
            disabled={disabled}
            id={timeTriggerId}
            render={<CollapsedButton shape={shape} />}
          >
            {timeLabel}
          </BasePopover.Trigger>
        ) : null}
        <BasePopover.Portal>
          <BasePopover.Positioner
            anchor={collapsedRef}
            collisionPadding={8}
            sideOffset={8}
          >
            <Popup aria-label={hasTime ? 'Date and time' : 'Date'}>
              <Fragment key={open ?? 'closed'}>
                {children(open === 'time' ? 'time' : undefined)}
              </Fragment>
            </Popup>
          </BasePopover.Positioner>
        </BasePopover.Portal>
      </BasePopover.Root>
    </Collapsed>
  );
};

/** The compact style's buttons, toggling `open` (without popovers). */
const ToggleButtons: FunctionComponent<{
  dateLabel?: string;
  disabled: boolean;
  onOpenChange: (open: DatePickerOpen | null) => void;
  open: DatePickerOpen | null;
  shape?: DatePickerProps['buttonShape'];
  timeLabel?: string;
}> = ({ dateLabel, disabled, onOpenChange, open, shape, timeLabel }) => {
  const toggle = (picker: DatePickerOpen) =>
    onOpenChange(open === picker ? null : picker);

  return (
    <Collapsed>
      {dateLabel === undefined ? null : (
        <CollapsedButton
          aria-expanded={open === 'date'}
          disabled={disabled}
          shape={shape}
          onClick={() => toggle('date')}
        >
          {dateLabel}
        </CollapsedButton>
      )}
      {timeLabel === undefined ? null : (
        <CollapsedButton
          aria-expanded={open === 'time'}
          aria-label="Time"
          disabled={disabled}
          shape={shape}
          onClick={() => toggle('time')}
        >
          {timeLabel}
        </CollapsedButton>
      )}
    </Collapsed>
  );
};

/**
 * A date picker (UIKit `UIDatePicker`): a date, a time or both (`mode`), or
 * a range of dates (`range`); collapsed buttons opening the calendar or the
 * time in a popover (or toggling `open`, without `popover`), or the
 * calendar in place (`pickerStyle`).
 */
const DatePicker: FunctionComponent<DatePickerProps> = (props) => {
  const {
    buttonShape,
    disabled = false,
    hourCycle,
    locale,
    mode = 'date',
    pickerStyle = 'compact',
    popover = true,
  } = props;
  const { change, range, single } = usePickerValue(props);
  const [open, changeOpen] = usePickerOpen(props);

  const formats = useMemo(
    () => ({
      date: new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
      time: new Intl.DateTimeFormat(locale, { hourCycle, timeStyle: 'short' }),
    }),
    [hourCycle, locale],
  );

  const hasDate = props.range || mode !== 'time';
  const hasTime = !props.range && mode !== 'date';

  const calendarProps = calendarPropsOf(props, change, range ?? single);

  // With a time, by default the Time row below.
  const calendar = (initialRoll?: 'time') => (
    <CalendarPanel
      {...calendarProps}
      footer={props.footer ?? (hasTime ? defaultFooter : undefined)}
      initialRoll={initialRoll}
      time={hasTime ? { disabled, shape: buttonShape } : undefined}
    />
  );

  if (pickerStyle === 'inline' && hasDate) return calendar();

  const dateLabel = dateLabelOf(formats.date, range, single);
  const timeLabel = single ? formats.time.format(single) : '–';

  // Without popovers: buttons toggling `open` (for the app to show them).
  if (!popover) {
    return (
      <ToggleButtons
        dateLabel={hasDate ? dateLabel : undefined}
        disabled={disabled}
        open={open}
        shape={buttonShape}
        timeLabel={hasTime ? timeLabel : undefined}
        onOpenChange={changeOpen}
      />
    );
  }

  if (!hasDate) {
    return (
      <Collapsed>
        <TimePopover
          disabled={disabled}
          hourCycle={hourCycle}
          label={timeLabel}
          locale={locale}
          open={open === 'time'}
          shape={buttonShape}
          value={single}
          onOpenChange={(next) => changeOpen(next ? 'time' : null)}
          onValueChange={change}
        />
      </Collapsed>
    );
  }

  return (
    <CalendarPopover
      dateLabel={dateLabel}
      disabled={disabled}
      open={open}
      shape={buttonShape}
      timeLabel={hasTime ? timeLabel : undefined}
      onOpenChange={changeOpen}
    >
      {(initialRoll) => calendar(initialRoll)}
    </CalendarPopover>
  );
};

export {
  Calendar,
  CalendarButton,
  CalendarRow,
  CalendarTimeRow,
  DatePicker,
  TimeRoll,
};
