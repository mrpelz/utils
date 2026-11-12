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
      The selected date (controlled). With <code>range</code>, it’s{' '}
      <code>{'{ start, end }'}</code>, with <code>end</code> as{' '}
      <code>null</code> while it’s being picked. To render an uncontrolled
      picker, use the <code>defaultValue</code> prop instead.
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
      Called with the newly selected date (for a range, its start, then the
      range), and why (<code>reason</code>): <code>day-press</code> (also by
      keyboard), <code>drag</code> (a range), <code>time</code> (the time’s
      roll), or <code>footer</code> (its <code>select</code>).
    </>,
  ],
  [
    'range',
    'boolean',
    code('false'),
    'Picks a range of days: a start, then an end (pressed, or dragged across). Only for dates.',
  ],
  [
    'isRangeDisabled',
    '(start: Date, end: Date) => boolean',
    undefined,
    <>
      With <code>range</code>, the ranges that can’t be selected (besides those
      over disabled days, which never can be). While an end is being picked, the
      days it returns <code>true</code> for are disabled.
    </>,
  ],
];

const calendarRows: readonly PropRow[] = [
  [
    'min',
    'Date',
    undefined,
    'The earliest selectable day. Earlier ones are grayed out.',
  ],
  [
    'max',
    'Date',
    undefined,
    'The latest selectable day. Later ones are grayed out.',
  ],
  [
    'isDateDisabled',
    '(date: Date) => boolean',
    undefined,
    <>
      Days that can’t be selected (for example booked ones), besides{' '}
      <code>min</code> and <code>max</code>, and grayed out like them.
    </>,
  ],
  [
    'highlighted',
    '(date: Date) => DayHighlights',
    undefined,
    <>
      Highlighted days (for example with events): <code>true</code> (a dot
      below), how (
      <code>{`{ style: ${union('dot', 'text', 'circle')}, tint }`}</code>
      ), or several (dots side by side). The adjacent months’ days aren’t
      highlighted.
    </>,
  ],
  [
    'highlightedWeekdays',
    'readonly number[]',
    undefined,
    'Days of the week in the secondary label color (0 for Sunday to 6 for Saturday; for example [0, 6] for the weekend).',
  ],
  [
    'firstDayOfWeek',
    'number',
    'the locale’s',
    'The week’s first day (0 for Sunday to 6 for Saturday).',
  ],
  [
    'showAdjacentMonths',
    'boolean',
    code('false'),
    'Shows the adjacent months’ days in the first and last weeks, grayed out. Pressing one shows its month.',
  ],
  [
    'swipe',
    union('month', 'date-range', 'ignore'),
    <>
      <code>date-range</code> picking a range, otherwise <code>month</code>
    </>,
    <>
      What swiping the days sideways does. <code>month</code> turns the month,
      following the finger. <code>date-range</code> drags a range (when picking
      a range; otherwise, it acts like <code>ignore</code>). <code>ignore</code>{' '}
      does neither. Scrolling sideways (for example on a trackpad) turns the
      month, except with <code>ignore</code>.
    </>,
  ],
  [
    'locale',
    'string',
    'the user’s',
    'The locale for names, numerals, the hour cycle and the week’s first day.',
  ],
  [
    'name',
    'string',
    undefined,
    <>
      Its value’s name in a form. A hidden control submits it like an input’s (a
      date as <code>YYYY-MM-DD</code>, a time as <code>HH:MM</code>, both as{' '}
      <code>YYYY-MM-DDTHH:MM</code>, and a range as <code>start/end</code>,
      empty until its end is picked). In Base UI’s <code>Field</code>, the
      field’s name applies.{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Root"
      />{' '}
      and{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Calendar"
      />{' '}
      are alternatives, never nested (the picker renders its own calendar). Name
      the one that holds the value (with <code>{'popover={false}'}</code>,
      that’s the picker, not the calendar the app shows below it).
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
      Rows below the calendar, after a separator, built from its state and
      actions (<code>value</code>, <code>select</code>, <code>show</code>,{' '}
      <code>time</code>), for example rows of buttons that jump to dates. For
      none, pass <code>{'() => null'}</code>.
    </>,
  ],
];

export const datePickerRootRows: readonly PropRow[] = [
  [
    'mode',
    union('date', 'dateAndTime', 'time'),
    code('date'),
    'A date, a time, or both.',
  ],
  [
    'pickerStyle',
    union('compact', 'inline'),
    code('compact'),
    <>
      <code>compact</code>: buttons that show the value and open the calendar
      (or the time) in a popover. <code>inline</code>: the calendar in place.
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
      popover’s <code>reason</code>, for example <code>trigger-press</code>,{' '}
      <code>outside-press</code> or <code>escape-key</code>).
    </>,
  ],
  [
    'popover',
    'boolean',
    code('true'),
    <>
      Whether the compact style’s buttons open popovers. Without them, they only
      toggle <code>open</code>, and the app shows the pickers (for example below
      a list row, with{' '}
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
      ). The compact style’s buttons then toggle them (without popovers), and a{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Expandable"
      />{' '}
      given the same handle shows them in place (for example after the picker’s
      list row).
    </>,
  ],
  [
    'popoverAlign',
    union('start', 'center', 'end'),
    code(union('center')),
    'How the compact style’s popover aligns with its buttons. In a list row, which they end, use end.',
  ],
  [
    'buttonShape',
    union('capsule', 'roundedRectangle'),
    code('capsule'),
    'The shape of the compact style’s buttons (roundedRectangle has 6px corners).',
  ],
  [
    'hourCycle',
    union('h12', 'h23'),
    'the locale’s',
    '12 hours (with AM/PM) or 24.',
  ],
  ['disabled', 'boolean', code('false'), 'Disables the whole picker.'],
  ...calendarRows,
];

export const datePickerCalendarRows: readonly PropRow[] = [
  ...valueRows,
  ...calendarRows,
  [
    'label',
    'string',
    'its month’s title',
    'The accessible name of the days (a group).',
  ],
];

export const datePickerExpandableRows: readonly PropRow[] = [
  [
    'handle',
    'DatePickerHandle',
    undefined,
    <>
      The pickers’ handle (required), which their{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Root"
      />{' '}
      gets too.
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
      A handle. Pass it to a{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Root"
      />{' '}
      and to the{' '}
      <PartLink
        component="date-picker"
        part="DatePicker.Expandable"
      />{' '}
      that shows its pickers (their <code>handle</code>). The hook returns the
      same one for the component’s lifetime.
    </>,
  ],
  [
    '.open',
    `${union('date', 'time')} | null`,
    undefined,
    'The open picker (null while none is open, or while no picker has the handle).',
  ],
];

export const datePickerTimeRollRows: readonly PropRow[] = [
  [
    'value',
    'Date | null',
    undefined,
    'The date whose time is shown (required, controlled; null means now).',
  ],
  [
    'onValueChange',
    '(date: Date, eventDetails) => void',
    undefined,
    <>
      Called with the date at the newly selected time (required; the{' '}
      <code>reason</code> is <code>time</code>).
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
    'The locale for numerals, the hour cycle and the day period.',
  ],
];

export const datePickerCalendarRowRows: readonly PropRow[] = [
  [
    'children',
    'ReactNode',
    undefined,
    'Its content: a title and buttons (for example a time row).',
  ],
  ...elementRows('div', 'HTMLDivElement'),
];

export const datePickerCalendarButtonRows: readonly PropRow[] = [
  [
    'shape',
    union('capsule', 'roundedRectangle'),
    code('capsule'),
    <>
      Its shape (like the picker’s <code>buttonShape</code>).
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
      (bordered, secondary), with its props.
    </>,
  ],
];

export const datePickerCalendarTimeRowRows: readonly PropRow[] = [
  [
    'calendar',
    'CalendarFooter',
    undefined,
    <>
      The calendar’s state and actions (required; the <code>footer</code>’s
      argument).
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
      <code>info</code> (for example what can be picked), in the secondary label
      color, or <code>error</code> (for example what’s still missing), in red
      and announced.
    </>,
  ],
  ...elementRows('p', 'HTMLParagraphElement'),
];
