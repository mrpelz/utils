import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  type CalendarFooter,
  type CalendarProps,
  DatePicker,
  type DateRange,
} from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import {
  datePickerCalendarButtonRows,
  datePickerCalendarMessageRows,
  datePickerCalendarRowRows,
  datePickerCalendarRows,
  datePickerCalendarTimeRowRows,
  datePickerRootRows,
  datePickerTimeRollRows,
} from './docs.js';
import {
  getPropOptionsCalendar,
  getPropOptionsDatePicker,
  getPropOptionsFormValue,
  propOptionsCalendarButton,
  propOptionsCalendarMessage,
  propOptionsCalendarRow,
  propOptionsCalendarTimeRow,
  propOptionsTimeRoll,
} from './props.js';

// Figma's example: April 20, 2025, 9:41.
const example = new Date(2025, 3, 20, 9, 41);

/** `DatePicker.Root`, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'date-picker-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(
      () => ({
        ...getPropOptionsDatePicker('date', addLog),
        ...getPropOptionsFormValue('date-picker-parts-root-form'),
      }),
      [addLog],
    ),
    { external, title: 'DatePicker.Root' },
  );

  return (
    <Component
      center
      inline
      inputGuards
      baseUiId="popover"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="DatePicker.Root"
    >
      <DatePicker.Root
        key={elementKey}
        defaultValue={example}
        {...props}
      />
      <form
        id="date-picker-parts-root-form"
        style={{ marginBlockStart: 16 }}
        onSubmit={(event) => {
          event.preventDefault();
          addLog(
            `submitted: ${JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)))}`,
          );
        }}
      >
        <Button.Root type="submit">
          <Button.Label>Submit</Button.Label>
        </Button.Root>
      </form>
    </Component>
  );
};

/** `DatePicker.Calendar`, with its props. */
const CalendarPart: FunctionComponent = () => {
  const id = 'date-picker-parts-calendar';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(
      () => ({
        ...getPropOptionsCalendar(addLog),
        ...getPropOptionsFormValue('date-picker-parts-calendar-form'),
      }),
      [addLog],
    ),
    { external, title: 'DatePicker.Calendar' },
  );

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="DatePicker.Calendar"
    >
      <DatePicker.Calendar
        key={elementKey}
        // (A date's props, or a range's: `range` picks which.)
        {...(props as CalendarProps)}
      />
      <form
        id="date-picker-parts-calendar-form"
        style={{ marginBlockStart: 16 }}
        onSubmit={(event) => {
          event.preventDefault();
          addLog(
            `submitted: ${JSON.stringify(Object.fromEntries(new FormData(event.currentTarget)))}`,
          );
        }}
      >
        <Button.Root type="submit">
          <Button.Label>Submit</Button.Label>
        </Button.Root>
      </form>
    </Component>
  );
};

/** `DatePicker.TimeRoll`, with its props (its time the demo's). */
const TimeRollPart: FunctionComponent = () => {
  const id = 'date-picker-parts-time-roll';
  const [log, addLog] = useLog();
  const [time, setTime] = useState<Date | null>(example);
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsTimeRoll, {
    external,
    title: 'DatePicker.TimeRoll',
  });

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="DatePicker.TimeRoll"
    >
      <DatePicker.TimeRoll
        {...props}
        value={time}
        onValueChange={(next: Date) => {
          addLog(`time: ${next.toLocaleTimeString()}`);
          setTime(next);
        }}
      />
    </Component>
  );
};

/** `DatePicker.CalendarRow`, outlined, in a calendar's footer. */
const CalendarRowPart: FunctionComponent = () => {
  const id = 'date-picker-parts-calendar-row';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsCalendarRow, {
    external,
    open: true,
    outlined: true,
    title: 'DatePicker.CalendarRow',
  });

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      state={[state]}
      title="DatePicker.CalendarRow"
    >
      <DatePicker.Calendar
        defaultValue={example}
        footer={(calendar: CalendarFooter) => (
          <DatePicker.CalendarRow {...props}>
            <span aria-hidden="true">Jump to</span>
            <DatePicker.CalendarButton
              onClick={() => calendar.select(new Date(), false)}
            >
              Today
            </DatePicker.CalendarButton>
          </DatePicker.CalendarRow>
        )}
      />
    </Component>
  );
};

/** `DatePicker.CalendarButton`, outlined, in a calendar's footer row. */
const CalendarButtonPart: FunctionComponent = () => {
  const id = 'date-picker-parts-calendar-button';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsCalendarButton, {
    external,
    open: true,
    outlined: true,
    title: 'DatePicker.CalendarButton',
  });

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="DatePicker.CalendarButton"
    >
      <DatePicker.Calendar
        defaultValue={example}
        footer={(calendar: CalendarFooter) => (
          <DatePicker.CalendarRow>
            <span aria-hidden="true">Jump to</span>
            <DatePicker.CalendarButton
              {...props}
              onClick={() => {
                addLog('Today clicked');
                calendar.select(new Date(), false);
              }}
            >
              Today
            </DatePicker.CalendarButton>
          </DatePicker.CalendarRow>
        )}
      />
    </Component>
  );
};

/** `DatePicker.CalendarTimeRow`, with its props, in an inline picker. */
const CalendarTimeRowPart: FunctionComponent = () => {
  const id = 'date-picker-parts-calendar-time-row';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsCalendarTimeRow, {
    external,
    title: 'DatePicker.CalendarTimeRow',
  });

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      state={[state]}
      title="DatePicker.CalendarTimeRow"
    >
      <DatePicker.Root
        defaultValue={example}
        mode="dateAndTime"
        pickerStyle="inline"
        footer={(calendar: CalendarFooter) => (
          <DatePicker.CalendarTimeRow
            {...props}
            calendar={calendar}
          />
        )}
      />
    </Component>
  );
};

/** `DatePicker.CalendarMessage`, outlined, below a range's calendar. */
const CalendarMessagePart: FunctionComponent = () => {
  const id = 'date-picker-parts-calendar-message';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsCalendarMessage, {
    external,
    open: true,
    outlined: true,
    title: 'DatePicker.CalendarMessage',
  });

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      state={[state]}
      title="DatePicker.CalendarMessage"
    >
      <DatePicker.Calendar
        range
        defaultValue={{ end: null, start: example } satisfies DateRange}
        footer={() => (
          <DatePicker.CalendarMessage {...props}>
            Stay at least two nights.
          </DatePicker.CalendarMessage>
        )}
      />
    </Component>
  );
};

/** `/date-picker/parts`: the picker, its calendar, roll and footer parts. */
export const DatePickerParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        Root: the picker, whole: compact (buttons opening popovers) or inline.
      </li>
      <li>
        Calendar, TimeRoll: its pickers on their own, for the app to show (e.g.
        below a list row).
      </li>
      <li>
        CalendarRow, CalendarButton, CalendarTimeRow, CalendarMessage: a
        calendar’s footer (its <code>footer</code>).
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="date-picker"
          part="DatePicker.Root"
        />
      </li>
      <li>
        <PartLink
          component="date-picker"
          part="DatePicker.Calendar"
        />
        <ul>
          <li>
            (its <code>footer</code>, optional)
            <ul>
              <li>
                <PartLink
                  component="date-picker"
                  part="DatePicker.CalendarRow"
                />
                <ul>
                  <li>
                    <PartLink
                      component="date-picker"
                      part="DatePicker.CalendarButton"
                    />
                  </li>
                </ul>
              </li>
              <li>
                <PartLink
                  component="date-picker"
                  part="DatePicker.CalendarTimeRow"
                />
              </li>
              <li>
                <PartLink
                  component="date-picker"
                  part="DatePicker.CalendarMessage"
                />
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink
          component="date-picker"
          part="DatePicker.TimeRoll"
        />
      </li>
    </ul>

    <Heading
      id="datepicker-root"
      level={2}
    >
      <code>DatePicker.Root</code>
    </Heading>
    <ul>
      <li>
        A date, a time or both (<code>mode</code>), or a range of dates (
        <code>range</code>).
      </li>
      <li>
        <code>compact</code> (<code>pickerStyle</code>): buttons showing the
        value, opening the calendar or the time in a popover (Base UI’s), or,
        without <code>popover</code>, toggling <code>open</code>;{' '}
        <code>inline</code>: the calendar in place.
      </li>
      <li>
        State: <code>value</code> or <code>defaultValue</code>,{' '}
        <code>onValueChange</code>; <code>open</code> or{' '}
        <code>defaultOpen</code>, <code>onOpenChange</code> (both with why).
      </li>
      <li>
        Renders its buttons, or its calendar: no element of its own (no{' '}
        <code>className</code> or <code>style</code>).
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={datePickerRootRows} />

    <Heading
      id="datepicker-calendar"
      level={2}
    >
      <code>DatePicker.Calendar</code>
    </Heading>
    <ul>
      <li>
        The inline calendar (Figma “Style=Inline”), on its own: its month’s
        days, its title opening a month and year roll.
      </li>
      <li>
        A date or a range (<code>range</code>), limits, disabled and highlighted
        days, a <code>footer</code>.
      </li>
      <li>
        The days are a group (named by its title, or <code>label</code>), one of
        them tabbable: arrow keys move by a day or week, Page Up and Page Down
        by a month, Home and End to the week’s ends.
      </li>
    </ul>
    <CalendarPart />
    <h3>Props</h3>
    <PropsTable rows={datePickerCalendarRows} />

    <Heading
      id="datepicker-timeroll"
      level={2}
    >
      <code>DatePicker.TimeRoll</code>
    </Heading>
    <ul>
      <li>
        A time as a <a href="roll">Roll</a>: hours, minutes and (12 hours) the
        day period; the numbers editable.
      </li>
      <li>
        Controlled only (<code>value</code>, <code>onValueChange</code>): the
        app holds the date whose time it shows.
      </li>
    </ul>
    <TimeRollPart />
    <h3>Props</h3>
    <PropsTable rows={datePickerTimeRollRows} />

    <Heading
      id="datepicker-calendarrow"
      level={2}
    >
      <code>DatePicker.CalendarRow</code>
    </Heading>
    <ul>
      <li>
        A footer row (Figma “Time”’s, 52px): a title, and buttons at its end.
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <CalendarRowPart />
    <h3>Props</h3>
    <PropsTable rows={datePickerCalendarRowRows} />

    <Heading
      id="datepicker-calendarbutton"
      level={2}
    >
      <code>DatePicker.CalendarButton</code>
    </Heading>
    <ul>
      <li>
        A footer button, as the compact style’s (a bordered, secondary{' '}
        <a href="button">Button</a>): e.g. jumping to a date (the footer’s{' '}
        <code>select</code>).
      </li>
      <li>
        Renders a <code>button</code>.
      </li>
    </ul>
    <CalendarButtonPart />
    <h3>Props</h3>
    <PropsTable rows={datePickerCalendarButtonRows} />

    <Heading
      id="datepicker-calendartimerow"
      level={2}
    >
      <code>DatePicker.CalendarTimeRow</code>
    </Heading>
    <ul>
      <li>
        The Time row (Figma “Time”): the time’s button, showing its roll over
        the days; a picker’s default footer, with a time.
      </li>
      <li>
        Takes the footer’s argument (<code>calendar</code>); renders nothing
        without a time.
      </li>
    </ul>
    <CalendarTimeRowPart />
    <h3>Props</h3>
    <PropsTable rows={datePickerCalendarTimeRowRows} />

    <Heading
      id="datepicker-calendarmessage"
      level={2}
    >
      <code>DatePicker.CalendarMessage</code>
    </Heading>
    <ul>
      <li>
        A footer message: what can be picked (<code>info</code>), or what’s
        wrong (<code>error</code>, announced as an alert).
      </li>
      <li>
        Renders a <code>p</code> (a polite live region).
      </li>
    </ul>
    <CalendarMessagePart />
    <h3>Props</h3>
    <PropsTable rows={datePickerCalendarMessageRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const datePickerPartsDemos = [
  RootPart,
  CalendarPart,
  TimeRollPart,
  CalendarRowPart,
  CalendarButtonPart,
  CalendarTimeRowPart,
  CalendarMessagePart,
];
