import {
  code,
  elementRows,
  PropRow,
  union,
} from '../../tooling/guide/props-table.js';
import { PartLink } from '../../tooling/guide/sections.js';

// Every part's props, for the parts page (all) and the overview (its key
// ones).

const valueRows: readonly PropRow[] = [
  [
    'value',
    'Date | DateRange | null',
    undefined,
    <>
      The selected date (with <code>range</code>:{' '}
      <code>{'{ start, end }'}</code>, its <code>end</code> <code>null</code>{' '}
      while it’s picked; controlled). To render an uncontrolled picker, use the{' '}
      <code>defaultValue</code> prop instead.
    </>,
  ],
  [
    'defaultValue',
    'Date | DateRange | null',
    undefined,
    <>
      The initially selected date or range (uncontrolled). To render a
      controlled picker, use the <code>value</code> prop instead.
    </>,
  ],
  [
    'onValueChange',
    '(value: Date | DateRange, eventDetails) => void',
    undefined,
    <>
      Called with the newly selected date (a range: its start, then the range),
      and why (<code>reason</code>): <code>day-press</code> (also by keyboard),{' '}
      <code>drag</code> (a range), <code>time</code> (the time’s roll), or{' '}
      <code>footer</code> (its <code>select</code>).
    </>,
  ],
  [
    'range',
    'boolean',
    code('false'),
    'Picks a range of days: a start, then an end (pressed, or dragged across). Dates only.',
  ],
  [
    'isRangeDisabled',
    '(start: Date, end: Date) => boolean',
    undefined,
    <>
      With <code>range</code>: ranges that can’t be selected (besides those over
      disabled days, which never can). While an end is picked, the days it’s{' '}
      <code>true</code> for are disabled.
    </>,
  ],
];

const calendarRows: readonly PropRow[] = [
  [
    'min',
    'Date',
    undefined,
    'The earliest selectable day; earlier ones grayed out.',
  ],
  [
    'max',
    'Date',
    undefined,
    'The latest selectable day; later ones grayed out.',
  ],
  [
    'isDateDisabled',
    '(date: Date) => boolean',
    undefined,
    <>
      Days that can’t be selected (e.g. booked ones; besides <code>min</code>{' '}
      and <code>max</code>), grayed out as those.
    </>,
  ],
  [
    'highlighted',
    '(date: Date) => DayHighlights',
    undefined,
    <>
      Days highlighted (e.g. with events): <code>true</code> (a dot below), how
      (<code>{`{ style: ${union('dot', 'text', 'circle')}, tint }`}</code>), or
      several (dots side by side). Not the adjacent months’ days.
    </>,
  ],
  [
    'highlightedWeekdays',
    'readonly number[]',
    undefined,
    'Days of the week in the secondary label color (0: Sunday … 6: Saturday; e.g. the weekend: [0, 6]).',
  ],
  [
    'firstDayOfWeek',
    'number',
    'the locale’s',
    'The week’s first day (0: Sunday … 6: Saturday).',
  ],
  [
    'showAdjacentMonths',
    'boolean',
    code('false'),
    'Shows the adjacent months’ days filling the first and last weeks, grayed out; pressed, they show their month.',
  ],
  [
    'swipe',
    union('month', 'date-range', 'ignore'),
    <>
      <code>date-range</code> picking a range, otherwise <code>month</code>
    </>,
    <>
      What swiping the days sideways does: <code>month</code> turns the month
      (following the finger); <code>date-range</code> drags a range (picking a
      range; otherwise as <code>ignore</code>); <code>ignore</code>: neither.
      Scrolling sideways (e.g. a trackpad’s) turns the month, but with{' '}
      <code>ignore</code>.
    </>,
  ],
  [
    'locale',
    'string',
    'the user’s',
    'Locale of names, numerals, the hour cycle and the week’s first day.',
  ],
  [
    'name',
    'string',
    undefined,
    <>
      Its value’s name in a form, submitted by a hidden control as an input’s (a
      date <code>YYYY-MM-DD</code>, a time <code>HH:MM</code>, both{' '}
      <code>YYYY-MM-DDTHH:MM</code>, a range <code>start/end</code>, empty until
      its end is picked). In Base UI’s <code>Field</code>, the field’s name
      applies.{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Root"
      />{' '}
      and{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Calendar"
      />{' '}
      are alternatives, never nested (the picker renders its own calendar): name
      the one that holds the value (with <code>{'popover={false}'}</code>, the
      picker, not the calendar the app shows below it).
    </>,
  ],
  [
    'form',
    'string',
    undefined,
    'Identifies the form that owns its hidden control, when it’s outside the form.',
  ],
  [
    'footer',
    '(calendar: CalendarFooter) => ReactNode',
    <>
      with a time: a{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.CalendarTimeRow"
      />
    </>,
    <>
      Rows below the calendar, after a separator, from its state and actions (
      <code>value</code>, <code>select</code>, <code>show</code>,{' '}
      <code>time</code>): e.g. rows of buttons jumping to dates. None:{' '}
      <code>{'() => null'}</code>.
    </>,
  ],
];

export const datePickerRootRows: readonly PropRow[] = [
  [
    'mode',
    union('date', 'dateAndTime', 'time'),
    code('date'),
    'A date, a time, or both (UIKit UIDatePicker.Mode).',
  ],
  [
    'pickerStyle',
    union('compact', 'inline'),
    code('compact'),
    <>
      <code>compact</code>: buttons showing the value, opening the calendar (or
      the time) in a popover; <code>inline</code>: the calendar in place.
    </>,
  ],
  ...valueRows,
  [
    'open',
    `${union('date', 'time')} | null`,
    undefined,
    <>
      The compact style’s open picker (controlled). To render it uncontrolled,
      use the <code>defaultOpen</code> prop instead.
    </>,
  ],
  [
    'defaultOpen',
    `${union('date', 'time')} | null`,
    code('null'),
    'The initially open picker (uncontrolled).',
  ],
  [
    'onOpenChange',
    `(open: ${union('date', 'time')} | null, eventDetails) => void`,
    undefined,
    <>
      Called when the compact style’s picker opens or closes, and why (Base UI’s
      popover’s <code>reason</code>, e.g. <code>trigger-press</code>,{' '}
      <code>outside-press</code>, <code>escape-key</code>).
    </>,
  ],
  [
    'popover',
    'boolean',
    code('true'),
    <>
      The compact style’s buttons open popovers; without, they only toggle{' '}
      <code>open</code>, for the app to show the pickers (e.g. below a list row:{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Calendar"
      />
      ,{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.TimeRoll"
      />
      ).
    </>,
  ],
  [
    'handle',
    'DatePickerHandle',
    undefined,
    <>
      Its pickers’ handle (
      <PartLink
        component="date-picker"
        part="DatePicker.createHandle"
      />
      ): the compact style’s buttons toggle them (no popovers), shown in place
      by a{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Expandable"
      />{' '}
      given it (e.g. after the picker’s list row).
    </>,
  ],
  [
    'popoverAlign',
    union('start', 'center', 'end'),
    code(union('center')),
    'How the compact style’s popover aligns to its buttons (in a list row, which they end, iOS aligns it with their end: end).',
  ],
  [
    'buttonShape',
    union('capsule', 'roundedRectangle'),
    code('capsule'),
    'The compact style’s buttons’ shape (roundedRectangle: Figma’s 6px corners).',
  ],
  [
    'hourCycle',
    union('h12', 'h23'),
    'the locale’s',
    '12 hours (with AM/PM) or 24.',
  ],
  ['disabled', 'boolean', code('false'), 'Disables all of it.'],
  ...calendarRows,
];

export const datePickerCalendarRows: readonly PropRow[] = [
  ...valueRows,
  ...calendarRows,
  [
    'label',
    'string',
    'its month’s title',
    'The days’ accessible name (a group).',
  ],
];

export const datePickerExpandableRows: readonly PropRow[] = [
  [
    'handle',
    'DatePickerHandle',
    undefined,
    <>
      The pickers’ handle (required), given to their{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Root"
      />{' '}
      too.
    </>,
  ],
];

/**
 * `DatePicker.createHandle()`, `useCreateDatePickerHandle()`: what they
 * return.
 */
export const datePickerHandleRows: readonly PropRow[] = [
  [
    '(return)',
    'DatePickerHandle',
    undefined,
    <>
      A handle: passed to a{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Root"
      />{' '}
      and to the{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Expandable"
      />{' '}
      showing its pickers (their <code>handle</code>); from the hook, the same
      for the component’s lifetime.
    </>,
  ],
  [
    '.open',
    `${union('date', 'time')} | null`,
    undefined,
    'The open picker (null while none is, or no picker is given the handle).',
  ],
];

export const datePickerTimeRollRows: readonly PropRow[] = [
  [
    'value',
    'Date | null',
    undefined,
    'The date whose time is shown (controlled; null: now; required).',
  ],
  [
    'onValueChange',
    '(date: Date, eventDetails) => void',
    undefined,
    <>
      Called with the date at the newly selected time (<code>reason</code>:{' '}
      <code>time</code>; required).
    </>,
  ],
  [
    'hourCycle',
    union('h12', 'h23'),
    'the locale’s',
    '12 hours (with an AM/PM column) or 24.',
  ],
  [
    'locale',
    'string',
    'the user’s',
    'Locale of numerals, the hour cycle and the day period.',
  ],
];

export const datePickerCalendarRowRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its content: a title and buttons (e.g. Figma’s Time row).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const datePickerCalendarButtonRows: readonly PropRow[] = [
  [
    'shape',
    union('capsule', 'roundedRectangle'),
    code('capsule'),
    <>
      Its shape (as the picker’s <code>buttonShape</code>).
    </>,
  ],
  [
    '…',
    'ButtonRootProps',
    undefined,
    <>
      A{' '}
      <PartLink
        component="button"
        part="Button.Root"
      />{' '}
      (bordered, secondary): its props.
    </>,
  ],
];

export const datePickerCalendarTimeRowRows: readonly PropRow[] = [
  [
    'calendar',
    'CalendarFooter',
    undefined,
    <>
      The calendar’s state and actions (the <code>footer</code>’s argument;
      required).
    </>,
  ],
  ['label', 'ReactNode', code('Time'), 'The row’s title.'],
];

export const datePickerCalendarMessageRows: readonly PropRow[] = [
  [
    'variant',
    union('info', 'error'),
    code('info'),
    <>
      <code>info</code> (e.g. what can be picked), in the secondary label color;{' '}
      <code>error</code> (e.g. what’s still missing), in red, announced.
    </>,
  ],
  ...elementRows('p', 'HTMLParagraphElement'),
];
