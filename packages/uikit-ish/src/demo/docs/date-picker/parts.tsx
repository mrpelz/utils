import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  type CalendarFooter,
  type CalendarProps,
  DatePicker,
  type DatePickerOpen,
  type DateRange,
  List,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  datePickerCalendarButtonRows,
  datePickerCalendarMessageRows,
  datePickerCalendarRowRows,
  datePickerCalendarRows,
  datePickerCalendarTimeRowRows,
  datePickerExpandableRows,
  datePickerHandleRows,
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

// An example date: April 20, 2025, 10:00.
const example = new Date(2025, 3, 20, 10, 0);

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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['type'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      baseUiId="popover"
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
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
        <Button.Root
          {...partProps['Button.Root']}
          type="submit"
        >
          <Button.Label {...partProps['Button.Label']}>Submit</Button.Label>
        </Button.Root>
      </form>
    </Component>
  );
};

/** An event's start, its pickers by a module-level handle. */
const eventStarts = DatePicker.createHandle();

/**
 * `DatePicker.Expandable`: a picker's calendar and time roll, in
 * expandable rows after its row (by `eventStarts`).
 */
const ExpandablePart: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'DatePicker.Root': [
              'defaultValue',
              'handle',
              'mode',
              'onOpenChange',
              'onValueChange',
            ],
            'List.Content': [],
            'List.Detail': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': ['style'],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('date-picker-parts-expandable') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="date-picker-parts-expandable"
      log={log}
      state={[partState]}
      title="DatePicker.Expandable"
    >
      <List.Root
        {...partProps['List.Root']}
        style={{ width: 'min(402px, 100%)' }}
      >
        <List.Section {...partProps['List.Section']}>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>Starts</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <DatePicker.Root
                  {...partProps['DatePicker.Root']}
                  defaultValue={example}
                  handle={eventStarts}
                  mode="dateAndTime"
                  onOpenChange={(next: DatePickerOpen | null) =>
                    addLog(`open: ${String(next)}`)
                  }
                  onValueChange={(next: Date) =>
                    addLog(`starts: ${next.toLocaleString()}`)
                  }
                />
              </List.Trailing>
            </List.Item>
            <DatePicker.Expandable handle={eventStarts} />
            <List.Item {...partProps['List.Item']}>
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>All-day</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <List.Detail {...partProps['List.Detail']}>No</List.Detail>
              </List.Trailing>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Label': [],
            'Button.Root': ['type'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
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
        <Button.Root
          {...partProps['Button.Root']}
          type="submit"
        >
          <Button.Label {...partProps['Button.Label']}>Submit</Button.Label>
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
      hasInputGuards
      isCentered
      isInline
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
    isOpen: true,
    emphasize: 'outline',
    title: 'DatePicker.CalendarRow',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'DatePicker.Calendar': ['defaultValue', 'footer'],
          'DatePicker.CalendarButton': ['onClick'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="DatePicker.CalendarRow"
    >
      <DatePicker.Calendar
        {...partProps['DatePicker.Calendar']}
        defaultValue={example}
        footer={(calendar: CalendarFooter) => (
          <DatePicker.CalendarRow {...props}>
            <span aria-hidden="true">Jump to</span>
            <DatePicker.CalendarButton
              {...partProps['DatePicker.CalendarButton']}
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
    isOpen: true,
    emphasize: 'outline',
    title: 'DatePicker.CalendarButton',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'DatePicker.Calendar': ['defaultValue', 'footer'],
            'DatePicker.CalendarRow': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="DatePicker.CalendarButton"
    >
      <DatePicker.Calendar
        {...partProps['DatePicker.Calendar']}
        defaultValue={example}
        footer={(calendar: CalendarFooter) => (
          <DatePicker.CalendarRow {...partProps['DatePicker.CalendarRow']}>
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'DatePicker.Root': ['defaultValue', 'footer', 'mode', 'pickerStyle'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="DatePicker.CalendarTimeRow"
    >
      <DatePicker.Root
        {...partProps['DatePicker.Root']}
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
    isOpen: true,
    emphasize: 'outline',
    title: 'DatePicker.CalendarMessage',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'DatePicker.Calendar': ['defaultValue', 'footer', 'range'],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="DatePicker.CalendarMessage"
    >
      <DatePicker.Calendar
        {...partProps['DatePicker.Calendar']}
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
        Root: the whole picker, compact (buttons that open popovers) or inline.
      </li>
      <li>
        Expandable and createHandle: its pickers in expandable list rows after
        its row, linked to it by a handle.
      </li>
      <li>
        Calendar and TimeRoll: its pickers on their own, for the app to show
        (for example below a list row).
      </li>
      <li>
        CalendarRow, CalendarButton, CalendarTimeRow and CalendarMessage: a
        calendar’s footer (its <code>footer</code>).
      </li>
    </ul>
    <ul className="demo-tree">
      <li>
        <PartLink
          component="date-picker"
          part="DatePicker.Root"
        />{' '}
        (compact or inline)
      </li>
      <li className="demo-tree-context">
        <PartLink
          component="list"
          part="List.Group"
        />{' '}
        <span>(optional: in a list)</span>
        <ul>
          <li className="demo-tree-context">
            <PartLink
              component="list"
              part="List.Item"
            />{' '}
            <span>with a</span>{' '}
            <PartLink
              component="date-picker"
              part="DatePicker.Root"
            />{' '}
            <span>in its</span>{' '}
            <PartLink
              component="list"
              part="List.Trailing"
            />
          </li>
          <li>
            <PartLink
              component="date-picker"
              part="DatePicker.Expandable"
            />{' '}
            (optional: its pickers in rows after the picker’s row)
          </li>
        </ul>
      </li>
      <li>
        <PartLink
          component="date-picker"
          part="DatePicker.Calendar"
        />{' '}
        (its calendar on its own)
        <ul>
          <li>
            Its <code>footer</code> (optional):
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
        />{' '}
        (its time on its own)
      </li>
      <li>
        Handles (optional: the picker’s and its{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />
        ’s <code>handle</code>):{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.createHandle"
        />{' '}
        (at module level), or{' '}
        <PartLink
          component="date-picker"
          part="useCreateDatePickerHandle"
        />{' '}
        (in a component)
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
        A date, a time, or both (<code>mode</code>), or a range of dates (
        <code>range</code>).
      </li>
      <li>
        <code>compact</code> (<code>pickerStyle</code>) shows the value on
        buttons that open the calendar or the time in a popover (Base UI’s), or
        that toggle <code>open</code> without <code>popover</code>.{' '}
        <code>inline</code> puts the calendar in place.
      </li>
      <li>
        Its state: <code>value</code> or <code>defaultValue</code>, and{' '}
        <code>onValueChange</code>; <code>open</code> or{' '}
        <code>defaultOpen</code>, and <code>onOpenChange</code> (both with the
        reason).
      </li>
      <li>
        Renders its buttons, or its calendar, without an element of its own (so
        it takes no <code>className</code> or <code>style</code>).
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={datePickerRootRows} />

    <Heading
      id="datepicker-expandable"
      level={2}
    >
      <code>DatePicker.Expandable</code>
    </Heading>
    <ul>
      <li>
        A picker’s calendar and time roll in place, as a calendar app edits an
        event. Each sits in an expandable list row (
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        ), opened by the picker’s buttons, and pushes the rows below down.
      </li>
      <li>
        It goes after the picker’s row, among its group’s rows, and is linked to
        the picker by their <code>handle</code> (
        <PartLink
          component="date-picker"
          part="DatePicker.createHandle"
        />
        ). The picker keeps its value and which picker is open, so no app state
        is needed.
      </li>
      <li>
        It renders only the rows (the calendar’s for a date, the roll’s for a
        time).
      </li>
      <li>
        The calendar keeps the picker’s <code>footer</code> (for example
        shortcuts, or a{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.CalendarMessage"
        />
        ), but not the default time row, because the time expands in its own
        row.
      </li>
      <li>Here, it’s an event’s start, with the row below it pushed down.</li>
    </ul>
    <ExpandablePart />
    <h3>Props</h3>
    <PropsTable rows={datePickerExpandableRows} />

    <Heading
      id="datepicker-createhandle"
      level={2}
    >
      <code>DatePicker.createHandle</code>
    </Heading>
    <ul>
      <li>
        A handle that names a picker’s pickers. Give it to the picker (
        <PartLink
          component="date-picker"
          part="DatePicker.Root"
        />
        ’s <code>handle</code>, so its buttons toggle them, without popovers)
        and to the{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />{' '}
        that shows them (like Base UI’s handles link a trigger to its popup).
      </li>
      <li>
        Make it once, for example at a module’s top level (in a component, use{' '}
        <PartLink
          component="date-picker"
          part="useCreateDatePickerHandle"
        />
        ).
      </li>
      <li>
        Here, see{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />
        ’s demo, which uses a module-level handle.
      </li>
    </ul>
    <h3>Returns</h3>
    <PropsTable rows={datePickerHandleRows} />

    <Heading
      id="usecreatedatepickerhandle"
      level={2}
    >
      <code>useCreateDatePickerHandle</code>
    </Heading>
    <ul>
      <li>
        <PartLink
          component="date-picker"
          part="DatePicker.createHandle"
        />{' '}
        in a component: made once, the same for the component’s lifetime.
      </li>
      <li>
        Here, see{' '}
        <a href={publicUrl('date-picker/composition#expanded-below-a-row')}>
          Expanded below a row
        </a>
        .
      </li>
    </ul>
    <h3>Returns</h3>
    <PropsTable rows={datePickerHandleRows} />

    <Heading
      id="datepicker-calendar"
      level={2}
    >
      <code>DatePicker.Calendar</code>
    </Heading>
    <ul>
      <li>
        The inline calendar on its own: its month’s days, with a title that
        opens a month and year roll.
      </li>
      <li>
        It takes a date or a range (<code>range</code>), limits, disabled and
        highlighted days, and a <code>footer</code>.
      </li>
      <li>
        The days are a group (named by its title, or <code>label</code>), with
        one of them in the tab order. The arrow keys move by a day or a week,
        Page Up and Page Down by a month, and Home and End to the week’s ends.
      </li>
      <li>
        Scrolled sideways (by finger or trackpad), the months snap, one per
        flick. <code>swipe</code> sets what a swipe does (it turns the month for
        a date, and drags across for a range).
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
        A time as a <a href={publicUrl('roll')}>Roll</a>: hours, minutes and,
        with 12 hours, the day period. The numbers can be typed.
      </li>
      <li>
        It’s controlled only (<code>value</code>, <code>onValueChange</code>),
        because the app holds the date whose time it shows.
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
        A footer row (52px, like a time row): a title, and buttons at its end.
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
        A footer button, like the compact style’s (a bordered, secondary{' '}
        <a href={publicUrl('button')}>Button</a>), for example to jump to a date
        (the footer’s <code>select</code>).
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
        The time row: the time’s button, which shows its roll over the days.
        It’s a picker’s default footer when there’s a time.
      </li>
      <li>
        It takes the footer’s argument (<code>calendar</code>), and renders
        nothing without a time.
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
  ExpandablePart,
  CalendarPart,
  TimeRollPart,
  CalendarRowPart,
  CalendarButtonPart,
  CalendarTimeRowPart,
  CalendarMessagePart,
];
