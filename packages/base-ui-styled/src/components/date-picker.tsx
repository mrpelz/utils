import { Popover as BasePopover } from '@base-ui/react/popover';
import { styled } from 'goober';
import {
  ChangeEvent,
  forwardRef,
  FunctionComponent,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { glassMedium } from './glass.js';
import { popupTransition } from './menu.js';
import { textStyle } from './typography.js';
import { css, fontWeight } from './utils.js';

// Source: Apple iOS 26 Figma (“Date and time - Collapsed”: State=Default/
// Selected; “Date and time - Pickers”: Style=Inline/Compact; light and dark
// appearance), with Figma colors mapped to UIKit semantic colors: the
// collapsed buttons `tertiarySystemFill`, text `label` (selected: the tint),
// weekdays `tertiaryLabel`, today and the arrows in the tint, the selected
// day on the tint at 12%, the separator `separator`.
//
// A date picker (UIKit `UIDatePicker`): `mode` picks a date, a time or both;
// `pickerStyle` shows them `compact` (collapsed buttons, the calendar in a
// popover, a Base UI `Popover`) or `inline` (the calendar in place). Names
// and the week's first day follow the locale (`Intl`).
//
// The calendar is a group of day buttons (one tabbable): arrow keys move by
// a day or week, Page Up/Down by a month, Home/End to the week's ends.
//
// Deviations:
// - The time is a native time input, styled as Figma's collapsed button: on
//   iOS, it opens the system's time wheel (Figma: none given); elsewhere,
//   it's edited in place.
// - The month and year title has no disclosure (Figma: a month and year
//   wheel, not given).
// - The popover is the menus' glass (`glassMedium`, see `Menu`; Figma: the
//   “Regular” material, blur 50px), its corners 13px, as Figma's.
// - The calendar's width (Figma: 370px) is a minimum: 7 × 44px days, 16px
//   from the sides.

export type DatePickerMode = 'date' | 'dateAndTime' | 'time';

export type DatePickerStyle = 'compact' | 'inline';

/** Props of the calendar (also of `DatePicker`'s). */
export type CalendarProps = {
  /** The initially selected date (uncontrolled). */
  defaultValue?: Date | null;
  /** Locale of names and the week's first day (default: the browser's). */
  locale?: string;
  /** The latest selectable day. */
  max?: Date;
  /** The earliest selectable day. */
  min?: Date;
  /** Called with the newly selected date. */
  onValueChange?: (date: Date) => void;
  /** The selected date (controlled). */
  value?: Date | null;
};

export type DatePickerProps = CalendarProps & {
  /** Disables all of it. */
  disabled?: boolean;
  /** Date, time, or both (UIKit `UIDatePicker.Mode`; default: `date`). */
  mode?: DatePickerMode;
  /** UIKit `UIDatePickerStyle` (default: `compact`). */
  pickerStyle?: DatePickerStyle;
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
const monthWeeks = (month: Date, weekStart: number) => {
  const first = startOfMonth(month);
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const offset = (first.getDay() - weekStart + 7) % 7;
  const cells: (Date | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from(
      { length: days },
      (_, index) => new Date(first.getFullYear(), first.getMonth(), index + 1),
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return Array.from({ length: cells.length / 7 }, (_, week) =>
    cells.slice(week * 7, week * 7 + 7),
  );
};

const pad = (value: number) => String(value).padStart(2, '0');

/** A date's time as a time input's value (`HH:MM`). */
const timeValue = (date: Date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

/** Controlled or uncontrolled state (as Base UI's components). */
const useControlled = <T,>(
  value: T | undefined,
  defaultValue: T,
): [T, (next: T) => void] => {
  const [state, setState] = useState(defaultValue);
  return [value === undefined ? state : value, setState];
};

// Figma “Date and time - Collapsed”: 34px, padding 6px 11px, corners 6px, the
// text in Body; selected (open, or editing), in the tint.
const collapsed = css`
  display: inline-flex;
  min-height: 34px;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 6px 11px;
  border: 0;
  border-radius: 6px;
  margin: 0;
  appearance: none;
  background-color: var(--color-ios-tertiary-system-fill);
  color: var(--color-ios-label);
  font-family: inherit;
  ${textStyle('body')}
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;

  @media (hover: hover) {
    cursor: pointer;
  }

  &:disabled {
    opacity: 0.55;

    @media (hover: hover) {
      cursor: not-allowed;
    }
  }
`;

const DateButton = styled('button', forwardRef)`
  ${collapsed}

  &[data-popup-open] {
    color: var(--color-ios-primary);
  }
`;

// A native time input as a collapsed button (see Deviations).
const TimeInput = styled('input', forwardRef)`
  ${collapsed}

  min-width: 0;
  outline-offset: 2px;

  &:focus {
    color: var(--color-ios-primary);
  }

  &::-webkit-calendar-picker-indicator {
    display: none;
  }

  &::-webkit-date-and-time-value {
    text-align: center;
  }
`;

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

const Arrows = styled('div', forwardRef)`
  display: flex;
  align-items: center;
  margin-inline-end: -6px;
`;

// 15px glyphs, as buttons 28px apart: 27px wide hit areas.
const Arrow = styled('button', forwardRef)`
  display: grid;
  width: 43px;
  height: 40px;
  padding: 0;
  border: 0;
  margin: 0;
  appearance: none;
  background: none;
  color: var(--color-ios-primary);
  place-items: center;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    cursor: pointer;
  }

  &:disabled {
    color: var(--color-ios-tertiary-label);

    @media (hover: hover) {
      cursor: not-allowed;
    }
  }

  &:dir(rtl) > svg {
    scale: -1 1;
  }
`;

// Figma “Date Header” and “_Week”: seven 44px columns, 16px from the sides.
const columns = css`
  display: grid;
  grid-template-columns: repeat(7, minmax(44px, 1fr));
  justify-items: center;
  padding-inline: 16px;
`;

const Weekdays = styled('div', forwardRef)`
  ${columns}

  min-height: 20px;
  align-items: center;
  color: var(--color-ios-tertiary-label);
  font-size: 13px;
  ${fontWeight(590)}
  line-height: 18px;
  text-transform: uppercase;

  & > abbr {
    text-decoration: none;
  }
`;

// Figma “Calendar”: 3px above, weeks 7px apart.
const Weeks = styled('div', forwardRef)`
  ${columns}

  padding-block-start: 3px;
  row-gap: 7px;
`;

// Figma “Day”: a 44px circle, its date in Title 3; today in the tint; the
// selected day on the tint at 12%, its date 24px at 510, in the tint.
const Day = styled('button', forwardRef)`
  display: grid;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  margin: 0;
  appearance: none;
  background: none;
  color: var(--color-ios-label);
  font-family: inherit;
  ${textStyle('title3')}
  font-variant-numeric: tabular-nums;
  place-items: center;
  -webkit-tap-highlight-color: transparent;

  @media (hover: hover) {
    cursor: pointer;
  }

  &[aria-current='date'] {
    color: var(--color-ios-primary);
  }

  &[aria-pressed='true'] {
    background-color: color-mix(
      in srgb,
      var(--color-ios-primary) 12%,
      transparent
    );
    color: var(--color-ios-primary);
    font-size: 24px;
    ${fontWeight(510)}
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

/** The calendar (Figma “Style=Inline”, without the time). */
const Calendar: FunctionComponent<
  CalendarProps & { children?: ReactNode; label?: string }
> = ({
  children,
  defaultValue = null,
  label,
  locale,
  max,
  min,
  onValueChange,
  value: valueProp,
}) => {
  const [value, setValue] = useControlled(valueProp, defaultValue);
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(() => startOfMonth(value ?? today));
  const [focused, setFocused] = useState(() =>
    clampDay(startOfDay(value ?? today), min, max),
  );
  const daysRef = useRef<HTMLDivElement>(null);
  const focusNext = useRef(false);
  const titleId = useId();

  const formats = useMemo(
    () => ({
      day: new Intl.DateTimeFormat(locale, { day: 'numeric' }),
      full: new Intl.DateTimeFormat(locale, { dateStyle: 'full' }),
      month: new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
      }),
      weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }),
      weekdayLong: new Intl.DateTimeFormat(locale, { weekday: 'long' }),
    }),
    [locale],
  );
  const weekStart = useMemo(() => firstDayOfWeek(locale), [locale]);
  const weeks = monthWeeks(month, weekStart);
  // A week of days (any), for the weekday names.
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    addDays(new Date(2024, 0, 7), (weekStart + index) % 7),
  );

  // Keyboard moves focus to the day it moved to (once rendered).
  useEffect(() => {
    if (!focusNext.current) return;
    focusNext.current = false;
    daysRef.current
      ?.querySelector<HTMLButtonElement>('[tabindex="0"]')
      ?.focus();
  });

  const moveTo = (date: Date) => {
    const target = clampDay(date, min, max);
    setFocused(target);
    setMonth(startOfMonth(target));
    focusNext.current = true;
  };

  const select = (date: Date) => {
    setValue(date);
    setFocused(date);
    // Keeps the time of an earlier value.
    const next = new Date(date);
    if (value) next.setHours(value.getHours(), value.getMinutes(), 0, 0);
    onValueChange?.(next);
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

  const showMonth = (months: number) => {
    const next = addMonths(month, months);
    setMonth(next);
    setFocused(clampDay(next, min, max));
  };

  const previousDisabled = Boolean(
    min && addDays(startOfMonth(month), -1) < startOfDay(min),
  );
  const nextDisabled = Boolean(
    max && startOfMonth(addMonths(month, 1)) > startOfDay(max),
  );

  return (
    <Panel data-date-picker-part="calendar">
      <Header>
        <MonthTitle
          aria-live="polite"
          id={titleId}
        >
          {formats.month.format(month)}
        </MonthTitle>
        <Arrows>
          <Arrow
            aria-label="Previous month"
            disabled={previousDisabled}
            type="button"
            onClick={() => showMonth(-1)}
          >
            <Chevron next={false} />
          </Arrow>
          <Arrow
            aria-label="Next month"
            disabled={nextDisabled}
            type="button"
            onClick={() => showMonth(1)}
          >
            <Chevron next />
          </Arrow>
        </Arrows>
      </Header>
      <Weekdays aria-hidden="true">
        {weekdays.map((day) => (
          <abbr
            key={day.getDay()}
            title={formats.weekdayLong.format(day)}
          >
            {formats.weekday.format(day)}
          </abbr>
        ))}
      </Weekdays>
      <Weeks
        ref={daysRef}
        aria-label={label}
        aria-labelledby={label ? undefined : titleId}
        role="group"
        onKeyDown={onKeyDown}
      >
        {weeks.flat().map((day, index) =>
          day ? (
            <Day
              key={day.getTime()}
              aria-current={isSameDay(day, today) ? 'date' : undefined}
              aria-label={formats.full.format(day)}
              aria-pressed={isSameDay(day, value)}
              disabled={!isSelectable(day, min, max)}
              tabIndex={isSameDay(day, focused) ? 0 : -1}
              type="button"
              onClick={() => select(day)}
            >
              {formats.day.format(day)}
            </Day>
          ) : (
            <span key={`blank-${index}`} />
          ),
        )}
      </Weeks>
      {children}
    </Panel>
  );
};

/** The time, as a native time input (see Deviations). */
const Time: FunctionComponent<{
  disabled?: boolean;
  label: string;
  onChange: (date: Date) => void;
  value: Date | null;
}> = ({ disabled, label, onChange, value }) => (
  <TimeInput
    aria-label={label}
    disabled={disabled}
    type="time"
    value={value ? timeValue(value) : ''}
    onChange={(event: ChangeEvent<HTMLInputElement>) => {
      const [hours = 0, minutes = 0] = event.currentTarget.value
        .split(':')
        .map(Number);
      const next = new Date(value ?? new Date());
      next.setHours(hours, minutes, 0, 0);
      onChange(next);
    }}
  />
);

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

/**
 * A date picker (UIKit `UIDatePicker`): a date, a time or both (`mode`),
 * collapsed buttons opening the calendar in a popover, or the calendar in
 * place (`pickerStyle`).
 */
const DatePicker: FunctionComponent<DatePickerProps> = ({
  defaultValue = null,
  disabled = false,
  locale,
  max,
  min,
  mode = 'date',
  onValueChange,
  pickerStyle = 'compact',
  value: valueProp,
}) => {
  const [value, setValue] = useControlled(valueProp, defaultValue);
  const change = (next: Date) => {
    setValue(next);
    onValueChange?.(next);
  };

  const dateFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }),
    [locale],
  );

  const hasDate = mode !== 'time';
  const hasTime = mode !== 'date';

  const time = (
    <Time
      disabled={disabled}
      label="Time"
      value={value}
      onChange={change}
    />
  );

  const calendar = (withTime: boolean) => (
    <Calendar
      locale={locale}
      max={max}
      min={min}
      value={value}
      onValueChange={change}
    >
      {withTime ? (
        <>
          <Separator />
          <TimeRow>
            <span aria-hidden="true">Time</span>
            {time}
          </TimeRow>
        </>
      ) : null}
    </Calendar>
  );

  if (pickerStyle === 'inline' && hasDate) return calendar(hasTime);

  return (
    <Collapsed>
      {hasDate ? (
        <BasePopover.Root>
          <BasePopover.Trigger
            disabled={disabled}
            render={<DateButton type="button" />}
          >
            {value ? dateFormat.format(value) : '–'}
          </BasePopover.Trigger>
          <BasePopover.Portal>
            <BasePopover.Positioner
              collisionPadding={8}
              sideOffset={8}
            >
              <Popup aria-label="Date">{calendar(false)}</Popup>
            </BasePopover.Positioner>
          </BasePopover.Portal>
        </BasePopover.Root>
      ) : null}
      {hasTime ? time : null}
    </Collapsed>
  );
};

export { Calendar, DatePicker };
