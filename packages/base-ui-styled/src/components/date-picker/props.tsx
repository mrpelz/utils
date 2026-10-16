import type { ReactNode } from 'react';

import type { PopoverAlign } from '../popover/main.js';

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

export type SingleValue = {
  /** The initially selected date (uncontrolled). */
  defaultValue?: Date | null;
  /** Called with the newly selected date. */
  onValueChange?: (date: Date) => void;
  /** Picks a single date (default). */
  range?: false;
  /** The selected date (controlled). */
  value?: Date | null;
};

export type RangeValue = {
  /** The initially selected range (uncontrolled). */
  defaultValue?: DateRange | null;
  /**
   * Ranges that can't be selected (besides those over disabled days, which
   * never can): while a range's end is picked (or dragged), called with
   * the range to each shown day (again as other months show), from its
   * fixed day, the `start` or (picked backwards) the `end`; days it
   * returns `true` for are disabled.
   */
  isRangeDisabled?: (start: Date, end: Date) => boolean;
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
  showAdjacentMonths?: boolean;
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
  /**
   * How the compact style's popover aligns to its buttons (default: their
   * end in a list row, which they end, otherwise centered).
   */
  popoverAlign?: PopoverAlign;
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

export type CalendarInternalProps = CalendarProps & {
  hourCycle?: HourCycle;
  /** The roll shown at first (internal, see `DatePicker`). */
  initialRoll?: 'monthYear' | 'time';
  label?: string;
  /** Called as the time's roll shows or hides (internal, see `DatePicker`). */
  onTimeShownChange?: (shown: boolean) => void;
  /** The picker's time (internal, see `DatePicker`): for the footer. */
  time?: {
    disabled: boolean;
    shape?: DatePickerProps['buttonShape'];
  };
};

/** A range's drag (see `CalendarPanel`). */
export type RangeDrag = {
  /** Moving on to other months, while held beyond the days. */
  edge: number;
  from: Date;
  moved: boolean;
  /** The days the range can reach (see `rangeReach`). */
  reachable: (day: Date) => boolean;
  timer?: ReturnType<typeof setTimeout>;
  x: number;
  y: number;
};

export type CalendarMessageProps = React.ComponentProps<'p'> & {
  /**
   * `info` (e.g. what can be picked) in the secondary label color, or
   * `error` (e.g. what's still missing) in `systemRed`.
   * @default 'info'
   */
  variant?: 'error' | 'info';
};
