/* eslint-disable unicorn/prefer-ternary */
import '../button/style.css';
import '../popover/style.css';
import '../roll/style.css';
import '../typography/style.css';
import './style.css';

import { Field as BaseField } from '@base-ui/react/field';
import type { Popover as BasePopover } from '@base-ui/react/popover';
import {
  ComponentProps,
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
  useSyncExternalStore,
} from 'react';

import { Button, ButtonRootProps } from '../button/main.js';
import { List, useCollapsible, useExpandedOpen } from '../list/main.js';
import { Popover, type PopoverAlign } from '../popover/main.js';
import { Roll, type RollChangeEventDetails, RollValue } from '../roll/main.js';
import { cn } from '../utils/main.js';
import { createHandle } from './handle.js';
import { useMonthPager } from './pager.js';
import type {
  CalendarFooter,
  CalendarInternalProps,
  CalendarMessageProps,
  CalendarProps,
  CalendarSwipe,
  DatePickerChangeEventDetails,
  DatePickerExpandableProps,
  DatePickerMode,
  DatePickerOpen,
  DatePickerOpenChangeEventDetails,
  DatePickerProps,
  DateRange,
  DayHighlight,
  DayHighlights,
  HourCycle,
  RangeDrag,
  TimeRollProps,
} from './props.js';

export type {
  CalendarFooter,
  CalendarMessageProps,
  CalendarProps,
  CalendarSwipe,
  DatePickerChangeEventDetails,
  DatePickerExpandableProps,
  DatePickerMode,
  DatePickerOpen,
  DatePickerOpenChangeEventDetails,
  DatePickerProps,
  DatePickerStyle,
  DateRange,
  DayHighlight,
  DayHighlights,
  HourCycle,
  TimeRollProps,
} from './props.js';

// Collapsed buttons (default and selected) and pickers (inline and
// compact), light and dark, in the semantic colors: the collapsed buttons
// `tertiarySystemFill`, text `label` (selected: the tint), weekdays
// `tertiaryLabel`, today and the arrows in the tint, the selected day on the
// tint at 12%, the separator `separator`. Ranges follow Framework7
// (`calendar-ios.less`): their ends on the tint, the days between on the
// tint at 12%.
//
// A date picker: `mode` picks a date, a time or both; `pickerStyle` shows
// them `compact` (collapsed buttons, opening the calendar or the time in a
// popover, a Base UI `Popover`) or `inline` (the calendar in place). Names,
// numerals, the hour cycle and the week's first day follow the locale
// (`Intl`). With `range`, two days are picked: a start and an end
// (Framework7 `rangePicker`), highlighted with the days between.
//
// The calendar is a group of day buttons (one tabbable): arrow keys move by
// a day or week, Page Up/Down by a month, Home/End to the week's ends. Its
// title opens a month and year roll (see `Roll`) over the days, the time's
// button a roll of hours and minutes (both editable: pressing the selected
// row, or typing, enters a number), as the compact time's popover.
//
// Also:
// - The rolls take the days' place (the time's too).
// - The popover is `Popover`'s (the menus' glass, see there), its corners
//   13px.
// - The calendar's width is a minimum: 7 × 44px days, 16px from the sides.
// - The collapsed buttons are capsules (or, `buttonShape`, 6px corners).

// What swiping the days does (see `swipe`): a range dragged only picking
// one.
const swipeOf = (
  swipe: CalendarSwipe | undefined,
  isRange: boolean,
): CalendarSwipe => {
  const value = swipe ?? (isRange ? 'date-range' : 'month');
  return value === 'date-range' && !isRange ? 'ignore' : value;
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
        '--uikit-date-picker-circle': circle?.tint,
        '--uikit-date-picker-text': text?.tint,
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

/**
 * How long (ms) after a month settled (a swipe's scroll ending) the
 * calendar's height changes (see `CalendarPanel`).
 */
const resizeDelay = 200;

/** Controlled or uncontrolled state (as Base UI's components). */
const useControlled = <T,>(
  value: T | undefined,
  defaultValue: T,
): [T, (next: T) => void] => {
  const [state, setState] = useState(defaultValue);
  return [value === undefined ? state : value, setState];
};

const CollapsedButton = forwardRef<
  HTMLElement,
  Omit<ButtonRootProps, 'ref' | 'shape'> & {
    shape?: DatePickerProps['buttonShape'];
  }
>(({ className, shape, ...props }, ref) => (
  // A collapsed button: a `Button` (bordered, secondary), 34px,
  // padding 6px 11px, corners 6px (or a capsule), the text in Body; selected
  // (open), in the tint. (Doubled: over the button's own styles.)
  <Button.Root
    ref={ref}
    shape={shape === 'roundedRectangle' ? 'roundedRectangle' : 'capsule'}
    type="button"
    variant="bordered-secondary"
    {...props}
    className={cn('uikit-date-picker-collapsed-button', className)}
    data-date-picker-part="collapsed-button"
  />
));

// A time row: a 52px row, the title (Body) and the time.
const TimeRow = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('uikit-date-picker-time-row', className)}
      data-date-picker-part="time-row"
      {...props}
    />
  ),
);

const Chevron = ({ isNext }: { isNext: boolean }) => (
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
    <path d={isNext ? 'M3 2l7 8-7 8' : 'M9 2l-7 8 7 8'} />
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
  const isPeriodFirst =
    parts.findIndex(({ type }) => type === 'dayPeriod') <
    parts.findIndex(({ type }) => type === 'hour');
  const period = (hour: number) =>
    format
      .formatToParts(new Date(2000, 0, 1, hour))
      .find(({ type }) => type === 'dayPeriod')?.value ?? '';

  return {
    hourCycle,
    periodFirst:
      isPeriodFirst && parts.some(({ type }) => type === 'dayPeriod'),
    periods: [period(9), period(21)] as const,
    twelve: hourCycle === 'h11' || hourCycle === 'h12',
  };
};

/**
 * The time as a roll: hours, minutes and (12 hours) the day period, the
 * numbers editable (e.g. in an expandable list row, see `DatePicker.Root`).
 */
const TimeRoll: FunctionComponent<TimeRollProps> = ({
  hourCycle: cycle,
  locale,
  max,
  min,
  onValueChange: onChange,
  value,
}) => {
  const date = value ?? new Date();
  // Its day at a time, and whether that's beyond the limits.
  const at = (hour: number, minute: number) => {
    const next = new Date(date);
    next.setHours(hour, minute, 0, 0);
    return next;
  };
  const isBeyond = (time: Date) =>
    (min !== undefined && time < min) || (max !== undefined && time > max);
  // Some of the hours' minutes (from, to) within the limits.
  const isWithin = (from: Date, to: Date) =>
    (min === undefined || to >= min) && (max === undefined || from <= max);
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
  const isPm = hours >= 12;
  const hourValues = twelve
    ? Array.from({ length: 12 }, (_, index) =>
        hourCycle === 'h12' ? index + 1 : index,
      )
    : Array.from({ length: 24 }, (_, index) => index);
  const twelveHour = hourCycle === 'h12' ? hours % 12 || 12 : hours % 12;
  const shownHour = twelve ? twelveHour : hours;

  // Beyond the limits: the nearest within them (the roll moving back).
  const set = (
    hour: number,
    minute: number,
    { event }: RollChangeEventDetails,
  ) => {
    let next = at(hour, minute);
    if (min !== undefined && next < min) next = new Date(min);
    if (max !== undefined && next > max) next = new Date(max);
    onChange(next, { event, reason: 'time' });
  };
  // A shown hour's (of the shown period, with 12 hours), as 0–23.
  const hourOf = (hour: number) =>
    twelve ? (hour % 12) + (isPm ? 12 : 0) : hour;

  const period = (
    <Roll.Column
      aria-label="AM/PM"
      value={isPm ? 'pm' : 'am'}
      onValueChange={(next: RollValue, details: RollChangeEventDetails) => {
        if ((next === 'pm') === isPm) return;
        set((hours + 12) % 24, date.getMinutes(), details);
      }}
    >
      <Roll.Item
        disabled={!isWithin(at(0, 0), at(11, 59))}
        value="am"
      >
        {periods[0]}
      </Roll.Item>
      <Roll.Item
        disabled={!isWithin(at(12, 0), at(23, 59))}
        value="pm"
      >
        {periods[1]}
      </Roll.Item>
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
        onValueChange={(next: RollValue, details: RollChangeEventDetails) => {
          set(hourOf(Number(next)), date.getMinutes(), details);
        }}
      >
        {hourValues.map((hour) => (
          <Roll.Item
            key={hour}
            disabled={!isWithin(at(hourOf(hour), 0), at(hourOf(hour), 59))}
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
        onValueChange={(next: RollValue, details: RollChangeEventDetails) =>
          set(hours, Number(next), details)
        }
      >
        {Array.from({ length: 60 }, (_, minute) => (
          <Roll.Item
            key={minute}
            disabled={isBeyond(at(hours, minute))}
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
  // The day a dragged range is dragged from (see `CalendarPanel`).
  const [draggedFrom, setDraggedFrom] = useState<Date | null>(null);

  return {
    dragged,
    draggedFrom,
    range,
    setDragged,
    setDraggedFrom,
    setValue,
    single,
    // (Either.)
    value: range ?? single,
  };
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
  const { disabled: isDisabled, shape, ...rest } = time;
  return { ...footer, buttonShape: shape, disabled: isDisabled, time: rest };
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

/**
 * The days a range from `fixed` can end on: not over unselectable days (up
 * to the nearest ones, within ten years; only looked for with disabled
 * days, the limits being `selectable`'s), nor `isRangeDisabled`'s ranges.
 */
const rangeReach = (
  fixed: Date,
  selectable: (day: Date) => boolean,
  hasDisabledDays: boolean,
  isRangeDisabled?: (start: Date, end: Date) => boolean,
) => {
  const walk = (direction: number) => {
    if (!hasDisabledDays) return undefined;
    let day = fixed;
    for (let step = 0; step < 3660; step += 1) {
      const next = addDays(day, direction);
      if (!selectable(next)) break;
      day = next;
    }
    return day;
  };
  const first = walk(-1);
  const last = walk(1);

  return (day: Date) =>
    !(first && day < first) &&
    !(last && day > last) &&
    !isRangeDisabled?.(
      ...((day < fixed ? [day, fixed] : [fixed, day]) as [Date, Date]),
    );
};

/** A range from two days, in either order. */
const between = (a: Date, b: Date): DateRange =>
  a <= b ? { end: b, start: a } : { end: a, start: b };

const twoDigits = (value: number) => String(value).padStart(2, '0');
const isoDate = (date: Date) =>
  `${String(date.getFullYear())}-${twoDigits(date.getMonth() + 1)}-${twoDigits(date.getDate())}`;
const isoTime = (date: Date) =>
  `${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`;

/**
 * A value as a form submits it (an input's formats; a range's interval, or
 * nothing until its end is picked).
 */
const formValueOf = (
  value: Date | DateRange | null,
  mode: DatePickerMode = 'date',
) => {
  if (!value) return '';
  if (!(value instanceof Date)) {
    return value.end ? `${isoDate(value.start)}/${isoDate(value.end)}` : '';
  }
  if (mode === 'time') return isoTime(value);
  if (mode === 'dateAndTime') return `${isoDate(value)}T${isoTime(value)}`;
  return isoDate(value);
};

/**
 * Its value's hidden control (Base UI's field control): submitted by its
 * `name`, or, in a Base UI `Field`, as the field's.
 */
const FormValue: FunctionComponent<{
  form?: string;
  /** Not rendered (e.g. by the picker's calendar, the picker's is). */
  isOmitted?: boolean;
  mode?: DatePickerMode;
  name?: string;
  value: Date | DateRange | null;
}> = ({ form, mode, name, isOmitted = false, value }) =>
  isOmitted ? null : (
    <BaseField.Control
      form={form}
      name={name}
      type="hidden"
      value={formValueOf(value, mode)}
    />
  );

/** The calendar (inline), with an optional time row. */
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
    showAdjacentMonths,
    time,
  } = props;
  const {
    dragged,
    draggedFrom,
    range,
    setDragged,
    setDraggedFrom,
    setValue,
    single,
    value,
  } = useCalendarValue(props);

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
  const swipes = swipeOf(props.swipe, Boolean(props.range));
  const pagesRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);
  const focusNext = useRef<Date | undefined>(undefined);
  const drag = useRef<RangeDrag | undefined>(undefined);
  // The shown month, for the drag's timers.
  const monthRef = useRef(month);
  useLayoutEffect(() => {
    monthRef.current = month;
  });
  const suppressClick = useRef(false);
  // The body's height, and its transition running (see below).
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyHeight = useRef<number | undefined>(undefined);
  const transition = useRef<Animation | undefined>(undefined);
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
  const reachOf = (fixed: Date) =>
    rangeReach(
      fixed,
      selectable,
      Boolean(isDateDisabled),
      props.range ? props.isRangeDisabled : undefined,
    );
  // While a range's end is picked: from its start, or the day dragged from.
  const fixed = draggedFrom ?? (range && !range.end ? range.start : null);
  const reachable = fixed ? reachOf(fixed) : () => true;
  // A range's end is also reachable.
  const enabled = (day: Date) => selectable(day) && reachable(day);
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

  // The strip as high as the shown month's days (its neighbours' clipped),
  // as they're laid out (not while hidden, e.g. in a closed row: none).
  // Months of more or fewer weeks: the strip resized at once, the body
  // around it transitioning (its content clipped meanwhile), a moment after
  // the month settled (`resizeDelay`: resized as a swipe settled, it
  // faltered). Under a roll, kept as it was (no shifts mid-roll):
  // transitioning once the roll closes, at once.
  const isRolled = rolled !== undefined;
  const wasRolled = useRef(isRolled);
  useLayoutEffect(() => {
    const { current: days } = daysRef;
    const { current: pages } = pagesRef;
    const { current: body } = bodyRef;
    const isClosing = wasRolled.current && !isRolled;
    wasRolled.current = isRolled;
    if (!days || !pages || !body || isRolled) return undefined;
    let isPending = false;

    const fit = () => {
      if (days.offsetHeight === 0) return false;
      pages.style.height = `${String(days.offsetHeight)}px`;
      return true;
    };
    const resize = () => {
      isPending = false;
      if (!fit()) return;
      const next = body.offsetHeight;
      const previous = bodyHeight.current;
      bodyHeight.current = next;
      if (previous === undefined || previous === next) return;
      transition.current?.cancel();
      body.style.overflow = 'clip';
      const animation = body.animate(
        [{ height: `${String(previous)}px` }, { height: `${String(next)}px` }],
        { duration: 300, easing: 'ease' },
      );
      transition.current = animation;
      const done = () => {
        if (transition.current === animation) {
          body.style.removeProperty('overflow');
        }
      };
      animation.addEventListener('finish', done);
      animation.addEventListener('cancel', done);
    };

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (bodyHeight.current === undefined || isClosing) {
      resize();
    } else {
      isPending = true;
      timer = setTimeout(resize, resizeDelay);
    }

    // Resized otherwise (e.g. the text size): at once, the body's height
    // as it is (not mid-transition: its own then).
    const observer = new ResizeObserver(() => {
      if (isPending) return;
      fit();
      if (transition.current?.playState === 'running') return;
      bodyHeight.current = body.offsetHeight;
    });
    observer.observe(days);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isRolled, month, weekStart]);

  // The months side by side, scrolled sideways (see pager.ts): turned to,
  // by scrolling, its day focused.
  const isPreviousDisabled = Boolean(
    min && addDays(startOfMonth(month), -1) < startOfDay(min),
  );
  const isNextDisabled = Boolean(
    max && startOfMonth(addMonths(month, 1)) > startOfDay(max),
  );
  const pager = useMonthPager({
    // A month's neighbour, not beyond the limits (as the arrows').
    beside: (shown, step) => {
      const at = startOfMonth(addMonths(shown, step));
      const last = addDays(startOfMonth(addMonths(at, 1)), -1);
      if (min && last < startOfDay(min)) return undefined;
      if (max && at > startOfDay(max)) return undefined;
      return at;
    },
    isDraggable: swipes === 'month',
    isInstant: rolled !== undefined,
    month,
    onTurn: (next, isScrolled) => {
      setMonth(next);
      if (isScrolled) setFocused(clampDay(next, min, max));
    },
    pagesRef,
  });
  const { goTo } = pager;

  // Moved by keyboard: on past disabled days (in the direction moved), to
  // one that can be focused.
  const moveTo = (date: Date) => {
    const direction = Math.sign(date.getTime() - focused.getTime()) || 1;
    let target = clampDay(date, min, max);
    for (let step = 0; step < 366 && !enabled(target); step += 1) {
      const next = addDays(target, direction);
      if (!isSelectable(next, min, max)) return;
      target = next;
    }
    if (!enabled(target)) return;
    setFocused(target);
    goTo(target);
    focusNext.current = target;
  };

  const changeTime = (date: Date, details: DatePickerChangeEventDetails) => {
    setValue(date);
    if (!props.range) props.onValueChange?.(date, details);
  };

  const commitRange = (
    next: DateRange,
    details: DatePickerChangeEventDetails,
  ) => {
    if (!props.range) return;
    setValue(next);
    props.onValueChange?.(next, details);
  };

  const select = (
    date: Date,
    hasTime: boolean,
    details: DatePickerChangeEventDetails,
  ) => {
    setFocused(startOfDay(date));

    if (props.range) {
      // A new range, or its end (before its start: the other way round; out
      // of the start's reach, a new range).
      commitRange(
        !range || range.end || !reachable(date)
          ? { end: null, start: date }
          : between(range.start, date),
        details,
      );
      return;
    }

    // Keeps the time of an earlier value (unless taking the date's).
    const next = new Date(date);
    if (single && !hasTime) {
      next.setHours(single.getHours(), single.getMinutes(), 0, 0);
    }
    setValue(next);
    props.onValueChange?.(next, details);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const isRightToLeft =
      getComputedStyle(event.currentTarget).direction === 'rtl';
    const column = (focused.getDay() - weekStart + 7) % 7;
    const moves: Record<string, () => Date> = {
      ArrowDown: () => addDays(focused, 7),
      ArrowLeft: () => addDays(focused, isRightToLeft ? 1 : -1),
      ArrowRight: () => addDays(focused, isRightToLeft ? -1 : 1),
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
    if (swipes !== 'date-range' || event.button !== 0) return;
    const from = dayOf(event.target);
    if (!from || !enabled(from)) return;
    drag.current = {
      edge: 0,
      from,
      isMoved: false,
      reachable: reachOf(from),
      x: event.clientX,
      y: event.clientY,
    };
  };

  // Held below (or above) the days, the drag moves on to the next (or
  // previous) month, and on, the range following to its first (last) day.
  const turnPage = (edge: number) => {
    const { current: dragging } = drag;
    if (!dragging || edge === dragging.edge) return;
    clearTimeout(dragging.timer);
    dragging.edge = edge;
    if (edge === 0) return;

    const step = () => {
      const next = startOfMonth(addMonths(monthRef.current, edge));
      const edgeDay =
        edge > 0 ? next : new Date(next.getFullYear(), next.getMonth() + 1, 0);
      const day = clampDay(edgeDay, min, max);
      // Not beyond the limits, nor over disabled days.
      if (day.getMonth() !== next.getMonth()) return;
      if (!selectable(day) || !dragging.reachable(day)) return;
      monthRef.current = next;
      goTo(next);
      setDragged(between(dragging.from, day));
      dragging.timer = setTimeout(step, 700);
    };
    dragging.timer = setTimeout(step, 500);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (swipes !== 'date-range') return;
    const { current: dragging } = drag;
    if (!dragging) return;
    if (!dragging.isMoved) {
      if (
        Math.hypot(event.clientX - dragging.x, event.clientY - dragging.y) < 6
      ) {
        return;
      }
      // Moves beyond the days are its own, too (the edges, see turnPage).
      dragging.isMoved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDraggedFrom(dragging.from);
      setDragged(between(dragging.from, dragging.from));
    }

    // Past the month's last day (on a day or blank after it, below the
    // days, or beyond their inline end): on to the next month; before its
    // first: back.
    const { bottom, left, right, top } =
      event.currentTarget.getBoundingClientRect();
    const isRightToLeft =
      getComputedStyle(event.currentTarget).direction === 'rtl';
    const under = document.elementFromPoint(event.clientX, event.clientY);
    const outside =
      under instanceof Element
        ? under.closest<HTMLElement>('[data-outside]')?.dataset.outside
        : undefined;
    const isBeyondEnd = isRightToLeft
      ? event.clientX < left
      : event.clientX > right;
    const isBeyondStart = isRightToLeft
      ? event.clientX > right
      : event.clientX < left;
    const isAfter =
      event.clientY > bottom || isBeyondEnd || outside === 'after';
    const isBefore =
      event.clientY < top || isBeyondStart || outside === 'before';
    turnPage(Number(isAfter) - Number(isBefore));

    const over = dayOf(under);
    if (!over || !selectable(over) || !dragging.reachable(over)) return;
    setDragged(between(dragging.from, over));
    setFocused(over);
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (swipes !== 'date-range') return;
    const { current: dragging } = drag;
    clearTimeout(dragging?.timer);
    drag.current = undefined;
    setDraggedFrom(null);
    if (!dragging?.isMoved || !dragged) {
      setDragged(null);
      return;
    }
    // Not also the click on the day released on (or pressed).
    suppressClick.current = true;
    setTimeout(() => {
      suppressClick.current = false;
    });
    setDragged(null);
    commitRange(dragged, { event, reason: 'drag' });
  };

  const showMonth = (next: Date) => {
    goTo(next);
    setFocused(clampDay(next, min, max));
  };

  const toggle = (roll: 'monthYear' | 'time') => {
    const next = rolled === roll ? undefined : roll;
    setRolled(next);
    if ((next === 'time') !== (rolled === 'time')) {
      props.onTimeShownChange?.(next === 'time');
    }
  };

  // A day of the grid of `shown` (the month, or the one sliding out, not
  // `interactive`): another month's is blank, or grayed out (see
  // `showAdjacentMonths`); either is marked `data-outside`, for drags.
  const cell = (day: Date, shown: Date, isInteractive: boolean) => {
    const outsideOf = day < shown ? 'before' : ('after' as 'after' | 'before');
    const outside = day.getMonth() === shown.getMonth() ? undefined : outsideOf;
    if (outside && !showAdjacentMonths) {
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
      // A day: a 44px circle (behind it), its date in Title 3; today in
      // the tint; the selected day on the tint at 12%, its date 24px at 510, in
      // the tint. In a range (across its column, see Source), its ends on the
      // tint, the days between (and the halves towards them) on the tint at
      // 12%.
      <button
        key={day.getTime()}
        aria-current={isSameDay(day, today) ? 'date' : undefined}
        aria-label={isInteractive ? formats.full.format(day) : undefined}
        data-date={isInteractive ? day.getTime() : undefined}
        {...attributes}
        className="uikit-date-picker-day"
        data-date-picker-part="day"
        data-outside={outside}
        data-range={rangePlace(day, range)}
        disabled={!enabled(day)}
        tabIndex={isInteractive && !outside && isSameDay(day, focused) ? 0 : -1}
        type="button"
        aria-pressed={
          range ? rangePlace(day, range) !== undefined : isSameDay(day, single)
        }
        data-weekday-highlighted={
          (!outside && highlightedWeekdays.includes(day.getDay())) || undefined
        }
        onClick={
          isInteractive
            ? (event: MouseEvent<HTMLButtonElement>) => {
                // Another month's day: shows its month (not selected).
                if (outside) {
                  showMonth(day);
                  return;
                }
                select(day, false, { event, reason: 'day-press' });
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
      </button>
    );
  };

  const footerContent = props.footer?.(
    footerOf({
      select: (date, hasTime = false) => {
        goTo(date);
        select(hasTime ? date : startOfDay(date), hasTime, {
          event: new Event('select'),
          reason: 'footer',
        });
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

  // A neighbour's page (see pager.ts): its days, not interactive.
  const neighbour = (shown: Date) => (
    <div
      key={shown.getTime()}
      inert
      aria-hidden="true"
      className="uikit-date-picker-weeks"
      data-date-picker-part="weeks"
    >
      {monthWeeks(shown, weekStart)
        .flat()
        .map((day) => cell(day, shown, false))}
    </div>
  );

  return (
    // Inline: the calendar, a separator, the time row.
    <div
      className="uikit-date-picker-panel"
      data-date-picker-part="calendar"
    >
      {/* The header: 40px, the month and year (Body Emphasized) 16px from
         the start, the arrows (20px, 510, the tint) 16px from the end, 28px
         apart. */}
      <div
        className="uikit-date-picker-header"
        data-date-picker-part="header"
      >
        <h2
          aria-live="polite"
          className="uikit-date-picker-month-title"
          data-date-picker-part="month-title"
          id={titleId}
        >
          {/* The title opens the month and year roll: its chevron (590, in the
             tint) turned down while open, the title in the tint. */}
          <button
            aria-controls={rollId}
            aria-expanded={rolled === 'monthYear'}
            className="uikit-date-picker-title-button"
            data-date-picker-part="title-button"
            type="button"
            onClick={() => toggle('monthYear')}
          >
            {formats.month.format(pager.shown)}
            <Disclosure />
          </button>
        </h2>
        <div
          className="uikit-date-picker-arrows"
          data-date-picker-part="arrows"
          hidden={rolled === 'monthYear'}
        >
          {/* Borderless round `Button`s, 40px: their chevrons (20px, the tint)
             28px apart. */}
          <Button.Root
            aria-label="Previous month"
            className="uikit-date-picker-arrow"
            data-date-picker-part="arrow"
            disabled={isPreviousDisabled}
            shape="circle"
            onClick={() => showMonth(addMonths(pager.shown, -1))}
          >
            <Chevron isNext={false} />
          </Button.Root>
          <Button.Root
            aria-label="Next month"
            className="uikit-date-picker-arrow"
            data-date-picker-part="arrow"
            disabled={isNextDisabled}
            shape="circle"
            onClick={() => showMonth(addMonths(pager.shown, 1))}
          >
            <Chevron isNext />
          </Button.Root>
        </div>
      </div>
      {/* The weekdays and days, or a roll in their place (keeping their size).
       */}
      <div
        ref={bodyRef}
        className="uikit-date-picker-body"
        data-date-picker-part="body"
        data-rolled={rolled === undefined ? undefined : ''}
      >
        <div
          aria-hidden="true"
          className="uikit-date-picker-weekdays"
          data-date-picker-part="weekdays"
        >
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
        </div>
        {/* The month's days between its neighbours', scrolled sideways (see
           pager.ts). */}
        <div
          ref={pagesRef}
          className="uikit-date-picker-pages"
          data-date-picker-part="pages"
          data-swipe={swipes}
        >
          {pager.months.map((shown) =>
            shown.getTime() === month.getTime() ? (
              <div
                key={shown.getTime()}
                ref={daysRef}
                aria-label={label}
                aria-labelledby={label ? undefined : titleId}
                className="uikit-date-picker-weeks"
                data-date-picker-part="weeks"
                data-swipe={swipes}
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
              </div>
            ) : (
              neighbour(shown)
            ),
          )}
        </div>
        {rolled === undefined ? null : (
          <div
            className="uikit-date-picker-overlay"
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
                max={max}
                min={min}
                value={single}
                onValueChange={changeTime}
              />
            )}
          </div>
        )}
      </div>
      {footerContent === null || footerContent === undefined ? null : (
        <>
          {/* A separator: 0.5px, 16px from the sides, 11px down. */}
          <div
            className="uikit-date-picker-separator"
            data-date-picker-part="separator"
          />
          {footerContent}
        </>
      )}
      <FormValue
        form={props.form}
        isOmitted={props.formControl === false}
        name={props.name}
        value={value}
      />
    </div>
  );
};

/** A footer row (see `CalendarProps` `footer`): a time row's, 52px. */
const CalendarRow = TimeRow;

/** A footer button (see `CalendarProps` `footer`): a collapsed button. */
const CalendarButton = CollapsedButton;

/**
 * A footer message (see `CalendarProps` `footer`): information on what
 * can be picked, or an error (announced, e.g. a range's end still
 * missing).
 */
const CalendarMessage = forwardRef<HTMLParagraphElement, CalendarMessageProps>(
  ({ className, variant = 'info', ...props }, ref) => (
    // Footnote, 16px from the sides (as the rows' content), 12px from the
    // rows (a list footer's metrics).
    <p
      ref={ref}
      aria-live="polite"
      data-variant={variant}
      role={variant === 'error' ? 'alert' : undefined}
      {...props}
      className={cn('uikit-date-picker-message', className)}
      data-date-picker-part="message"
    />
  ),
);

/**
 * The footer's time row: the time's button, showing its
 * roll; the picker's default footer, with a time.
 */
const CalendarTimeRow: FunctionComponent<{
  calendar: CalendarFooter;
  /**
   * The row's title.
   * @default “Time”
   */
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

/** The calendar (inline, without the time). */
const Calendar: FunctionComponent<CalendarProps & { label?: string }> = (
  props,
) => <CalendarPanel {...props} />;

/** The calendar's props, of the picker's (its value, and its changes). */
const calendarPropsOf = (
  props: DatePickerProps,
  change: (
    next: Date | DateRange,
    details: DatePickerChangeEventDetails,
  ) => void,
  value: Date | DateRange | null,
): CalendarInternalProps => {
  const shared = {
    // (The picker renders its own.)
    formControl: false,
    firstDayOfWeek: props.firstDayOfWeek,
    highlighted: props.highlighted,
    highlightedWeekdays: props.highlightedWeekdays,
    isDateDisabled: props.isDateDisabled,
    showAdjacentMonths: props.showAdjacentMonths,
    swipe: props.swipe,
    hourCycle: props.hourCycle,
    locale: props.locale,
    max: props.max,
    min: props.min,
  };
  return props.range
    ? {
        ...shared,
        isRangeDisabled: props.isRangeDisabled,
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
  const change = (
    next: Date | DateRange,
    details: DatePickerChangeEventDetails,
  ) => {
    setValue(next);
    (
      props.onValueChange as
        | ((changed: typeof next, eventDetails: typeof details) => void)
        | undefined
    )?.(next, details);
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

  const change = (
    next: DatePickerOpen | null,
    details: DatePickerOpenChangeEventDetails,
  ) => {
    setOpen(next);
    props.onOpenChange?.(next, details);
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
    align?: PopoverAlign;
    isDisabled: boolean;
    isOpen: boolean;
    label: string;
    onOpenChange: (
      isOpen: boolean,
      details: BasePopover.Root.ChangeEventDetails,
    ) => void;
    shape?: DatePickerProps['buttonShape'];
  }
> = ({ align, isDisabled, label, onOpenChange, isOpen, shape, ...props }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <Popover.Trigger
        aria-label="Time"
        disabled={isDisabled}
        render={<CollapsedButton shape={shape} />}
      >
        {label}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner align={align}>
          {/* Compact: the inline style in a popover, its content
             clipped to its corners (not the popup: `overflow: hidden` would
             make it a scroll container, its material reaching beyond it,
             scrolled sideways as a day takes focus; and clip its glow). */}
          <Popover.Popup
            ref={popupRef}
            aria-label="Time"
            className="uikit-date-picker-popup"
            data-date-picker-part="popup"
            // The popup (not the first column: focused while the popup
            // opens, Chrome scrolls it off its selection).
            initialFocus={popupRef}
          >
            {/* The time's popover: the roll, 8px in. */}
            <div
              className="uikit-date-picker-time-popup"
              data-date-picker-part="time-popup"
            >
              <TimeRoll {...props} />
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
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
 * time, from the time's too, with the time's roll shown (one popover for
 * both).
 */
const CalendarPopover: FunctionComponent<{
  align?: PopoverAlign;
  children: (
    initialRoll: 'time' | undefined,
    onTimeShownChange: (isShown: boolean) => void,
  ) => ReactNode;
  dateLabel: string;
  isDisabled: boolean;
  onOpenChange: (
    open: DatePickerOpen | null,
    details: DatePickerOpenChangeEventDetails,
  ) => void;
  open: DatePickerOpen | null;
  shape?: DatePickerProps['buttonShape'];
  timeLabel?: string;
}> = ({
  align,
  children,
  dateLabel,
  isDisabled,
  onOpenChange,
  open,
  shape,
  timeLabel,
}) => {
  const dateTriggerId = useId();
  const timeTriggerId = useId();
  const collapsedRef = useRef<HTMLDivElement>(null);
  const hasTime = timeLabel !== undefined;
  // The time's button is the open one while the time's roll shows (however
  // it was opened, or shown), the date's otherwise.
  const [isTimeShown, setIsTimeShown] = useState(open === 'time');
  const [openBefore, setOpenBefore] = useState(open);
  if (open !== openBefore) {
    setOpenBefore(open);
    setIsTimeShown(open === 'time');
  }

  // Positioned at both buttons together, whichever opened it.
  return (
    // The compact style's buttons, 6px apart, aligned to the end.
    <div
      ref={collapsedRef}
      className="uikit-date-picker-collapsed"
      data-date-picker-part="collapsed"
    >
      <Popover.Root
        open={open === 'date' || (hasTime && open === 'time')}
        triggerId={hasTime && isTimeShown ? timeTriggerId : dateTriggerId}
        onOpenChange={(isOpen: boolean, { event, reason }) => {
          const trigger =
            event.target instanceof Element
              ? event.target.closest<HTMLElement>('[data-date-picker-trigger]')
              : null;
          const picker =
            trigger?.dataset.datePickerTrigger === 'time' ? 'time' : 'date';
          onOpenChange(isOpen ? picker : null, { event, reason });
        }}
      >
        <Popover.Trigger
          data-date-picker-trigger="date"
          disabled={isDisabled}
          id={dateTriggerId}
          render={<CollapsedButton shape={shape} />}
        >
          {dateLabel}
        </Popover.Trigger>
        {hasTime ? (
          <Popover.Trigger
            aria-label="Time"
            data-date-picker-trigger="time"
            disabled={isDisabled}
            id={timeTriggerId}
            render={<CollapsedButton shape={shape} />}
          >
            {timeLabel}
          </Popover.Trigger>
        ) : null}
        <Popover.Portal>
          <Popover.Positioner
            align={align}
            anchor={collapsedRef}
          >
            <Popover.Popup
              aria-label={hasTime ? 'Date and time' : 'Date'}
              className="uikit-date-picker-popup"
              data-date-picker-part="popup"
            >
              <Fragment key={open ?? 'closed'}>
                {children(open === 'time' ? 'time' : undefined, setIsTimeShown)}
              </Fragment>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
};

/** The compact style's buttons, toggling `open` (without popovers). */
const ToggleButtons: FunctionComponent<{
  dateLabel?: string;
  isDisabled: boolean;
  onOpenChange: (
    open: DatePickerOpen | null,
    details: DatePickerOpenChangeEventDetails,
  ) => void;
  open: DatePickerOpen | null;
  shape?: DatePickerProps['buttonShape'];
  timeLabel?: string;
}> = ({ dateLabel, isDisabled, onOpenChange, open, shape, timeLabel }) => {
  const toggle = (picker: DatePickerOpen, event: Event) =>
    onOpenChange(open === picker ? null : picker, {
      event,
      reason: 'trigger-press',
    });

  // Disabled while open (`isDisabled`, or from around it: e.g. a disabled
  // fieldset's): closed (with a handle, its rows).
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (open === null) return;
    const button = ref.current?.querySelector('button');
    if (!isDisabled && !button?.matches(':disabled')) return;
    onOpenChange(null, { event: new Event('disable'), reason: 'none' });
  });

  return (
    <div
      ref={ref}
      className="uikit-date-picker-collapsed"
      data-date-picker-part="collapsed"
    >
      {dateLabel === undefined ? null : (
        <CollapsedButton
          aria-expanded={open === 'date'}
          disabled={isDisabled}
          shape={shape}
          onClick={(event: MouseEvent<HTMLButtonElement>) =>
            toggle('date', event)
          }
        >
          {dateLabel}
        </CollapsedButton>
      )}
      {timeLabel === undefined ? null : (
        <CollapsedButton
          aria-expanded={open === 'time'}
          aria-label="Time"
          disabled={isDisabled}
          shape={shape}
          onClick={(event: MouseEvent<HTMLButtonElement>) =>
            toggle('time', event)
          }
        >
          {timeLabel}
        </CollapsedButton>
      )}
    </div>
  );
};

/**
 * A picker in collapsible list rows (see `List.CollapsiblePanel`): closed
 * with them. With a handle, in a collapsible (e.g. a `List.AccordionItem`,
 * with its row and `Expandable`): open with it, opening it, closed with it
 * (e.g. another item opening).
 */
const useListSync = (
  handle: DatePickerProps['handle'],
  open: DatePickerOpen | null,
  changeOpen: ReturnType<typeof usePickerOpen>[1],
) => {
  const isShown = useExpandedOpen();
  const collapsible = useCollapsible();
  const item = handle ? collapsible : undefined;
  const isPickerOpen = open !== null;
  const syncRef = useRef({
    close: () => undefined as void,
    toggleItem: () => undefined as void,
  });
  useLayoutEffect(() => {
    syncRef.current = {
      close: () => {
        if (open === null) return;
        changeOpen(null, { event: new Event('close'), reason: 'none' });
      },
      toggleItem: () => {
        if (!item || item.isOpen === isPickerOpen) return;
        item.setOpen(isPickerOpen, {
          event: new Event('toggle'),
          reason: 'none',
        });
      },
    };
  });
  useEffect(() => {
    if (isShown === false || item?.isOpen === false) syncRef.current.close();
  }, [isShown, item?.isOpen]);
  useEffect(() => {
    syncRef.current.toggleItem();
  }, [isPickerOpen]);
};

/**
 * A date picker: a date, a time or both (`mode`), or
 * a range of dates (`range`); collapsed buttons opening the calendar or the
 * time in a popover (or toggling `open`, without `popover`), or the
 * calendar in place (`pickerStyle`).
 */
const Root: FunctionComponent<DatePickerProps> = (props) => {
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

  useListSync(props.handle, open, changeOpen);

  // With a handle: its pickers, for its `Expandable`.
  const { handle } = props;
  useLayoutEffect(() => {
    handle?.publish({
      calendar: hasDate ? <CalendarPanel {...calendarProps} /> : undefined,
      open,
      time: hasTime ? (
        <TimeRoll
          hourCycle={hourCycle}
          locale={locale}
          max={props.max}
          min={props.min}
          value={single}
          onValueChange={change}
        />
      ) : undefined,
    });
  });
  useLayoutEffect(() => () => handle?.publish(undefined), [handle]);

  // With a time, by default the Time row below.
  const calendar = (
    initialRoll?: 'time',
    onTimeShownChange?: (isShown: boolean) => void,
  ) => (
    <CalendarPanel
      {...calendarProps}
      footer={props.footer ?? (hasTime ? defaultFooter : undefined)}
      initialRoll={initialRoll}
      time={hasTime ? { disabled, shape: buttonShape } : undefined}
      onTimeShownChange={onTimeShownChange}
    />
  );

  // Its value's hidden control (see `name`), beside what it shows.
  const formValue = (
    <FormValue
      form={props.form}
      mode={props.range ? 'date' : mode}
      name={props.name}
      value={range ?? single}
    />
  );

  if (pickerStyle === 'inline' && hasDate) {
    return (
      <>
        {calendar()}
        {formValue}
      </>
    );
  }

  const dateLabel = dateLabelOf(formats.date, range, single);
  const timeLabel = single ? formats.time.format(single) : '–';

  // Without popovers: buttons toggling `open` (for the app to show them,
  // or, with a handle, its `Expandable`).
  if (!popover || props.handle) {
    return (
      <>
        <ToggleButtons
          dateLabel={hasDate ? dateLabel : undefined}
          isDisabled={disabled}
          open={open}
          shape={buttonShape}
          timeLabel={hasTime ? timeLabel : undefined}
          onOpenChange={changeOpen}
        />
        {formValue}
      </>
    );
  }

  if (!hasDate) {
    return (
      <div
        className="uikit-date-picker-collapsed"
        data-date-picker-part="collapsed"
      >
        {formValue}
        <TimePopover
          align={props.popoverAlign}
          hourCycle={hourCycle}
          isDisabled={disabled}
          isOpen={open === 'time'}
          label={timeLabel}
          locale={locale}
          max={props.max}
          min={props.min}
          shape={buttonShape}
          value={single}
          onValueChange={change}
          onOpenChange={(isOpen, { event, reason }) =>
            changeOpen(isOpen ? 'time' : null, { event, reason })
          }
        />
      </div>
    );
  }

  return (
    <>
      <CalendarPopover
        align={props.popoverAlign}
        dateLabel={dateLabel}
        isDisabled={disabled}
        open={open}
        shape={buttonShape}
        timeLabel={hasTime ? timeLabel : undefined}
        onOpenChange={changeOpen}
      >
        {(initialRoll, onTimeShownChange) =>
          calendar(initialRoll, onTimeShownChange)
        }
      </CalendarPopover>
      {formValue}
    </>
  );
};

/**
 * A date picker's pickers in place (see `Root` `handle`): its calendar and
 * time roll, each in collapsible list rows (`List.CollapsiblePanel`),
 * opened by its buttons; placed after the picker's row. In an `List.AccordionItem` (with its row), one of its items.
 */
const Expandable: FunctionComponent<DatePickerExpandableProps> = ({
  handle,
}) => {
  const { calendar, open, time } = useSyncExternalStore(
    handle.subscribe,
    handle.getSnapshot,
  );

  return (
    <>
      {calendar === undefined ? null : (
        <List.CollapsibleRoot open={open === 'date'}>
          <List.CollapsiblePanel>
            <List.Item>
              <List.Span>{calendar}</List.Span>
            </List.Item>
          </List.CollapsiblePanel>
        </List.CollapsibleRoot>
      )}
      {time === undefined ? null : (
        <List.CollapsibleRoot open={open === 'time'}>
          <List.CollapsiblePanel>
            <List.Item>
              <List.Span>{time}</List.Span>
            </List.Item>
          </List.CollapsiblePanel>
        </List.CollapsibleRoot>
      )}
    </>
  );
};

export { DatePickerHandle, useCreateDatePickerHandle } from './handle.js';

export const DatePicker = {
  Root,
  Expandable,
  createHandle,
  Calendar,
  CalendarRow,
  CalendarButton,
  CalendarTimeRow,
  CalendarMessage,
  TimeRoll,
};
