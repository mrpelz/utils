import { FunctionComponent } from 'react';

import { DatePicker } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePropControl } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { datePickerRootRows } from './docs.js';
import { propOptionsOverview } from './props.js';

// An example date: April 20, 2025, 10:00.
const example = new Date(2025, 3, 20, 10, 0);

/** The picker, its value in its buttons (compact) or calendar (inline). */
const LiveView: FunctionComponent = () => {
  const id = 'date-picker-overview';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsOverview,
    { external, isOpen: true, title: 'DatePicker.Root' },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      baseUiId="popover"
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Date picker"
    >
      <DatePicker.Root
        key={elementKey}
        defaultValue={example}
        {...props}
        onValueChange={(next: Date) =>
          addLog(`value: ${next.toLocaleString()}`)
        }
      />
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/date-picker`: what a date picker is for, and its props. */
export const DatePickerOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>Picks a date, a time, both, or a range of dates.</li>
      <li>
        In its compact style, it shows the value on buttons that open the
        calendar (or the time) in a popover. In its inline style, the calendar
        sits in place.
      </li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        For dates and times: an appointment, a reminder, a birthday or a stay.
      </li>
      <li>
        Use the compact style where space is short (a list row), and the inline
        style where picking the date is the task. (Collapsed, it’s a choice of
        an ordered value.)
      </li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        Other values in columns (sizes, measures): use a{' '}
        <a href={publicUrl('roll')}>Roll</a>.
      </li>
      <li>
        A number, one step at a time: use a{' '}
        <a href={publicUrl('stepper')}>Stepper</a>.
      </li>
      <li>
        Typed dates (for example copied from a document): use a{' '}
        <a href={publicUrl('text-field')}>Text Field</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most date pickers set.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('date-picker/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'DatePicker.Root',
          pickRows(
            datePickerRootRows,
            'mode',
            'pickerStyle',
            'value',
            'defaultValue',
            'onValueChange',
            'range',
            'min',
            'max',
          ),
        ],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        The compact style’s buttons show the value, and the time’s button is
        named “Time”. They open popovers (Base UI’s: focus moves inside, and
        Escape closes them).
      </li>
      <li>
        The days are a group of buttons, named by the month’s title, with one of
        them in the tab order. The arrow keys move by a day or a week, Page Up
        and Page Down by a month, and Home and End to the week’s ends. Each day
        is named in full (“Sunday, April 20, 2025”).
      </li>
      <li>
        The rolls (month and year, and the time) are listboxes (see{' '}
        <a href={publicUrl('roll')}>Roll</a>).
      </li>
      <li>
        A range’s footer message (
        <PartLink
          component="date-picker"
          part="DatePicker.CalendarMessage"
        />
        ) is announced, and an error as an alert.
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        The calendar’s title opens a month and year roll over the days. Its
        arrows go to the previous or next month, sliding.
      </li>
      <li>
        The months sit side by side and scroll sideways natively (by finger or
        trackpad), snapping one month per flick, and not past the limits.{' '}
        <code>swipe</code> sets what a swipe does: by default, it turns the
        month for a date, and drags across for a range.
      </li>
      <li>
        With a time, the Time row’s button shows the time’s roll in place of the
        days.
      </li>
      <li>
        A range takes a start, then an end, pressed or dragged across. Held at
        the edge, the drag goes on to the next month.
      </li>
      <li>
        Names, numerals, the hour cycle and the week’s first day follow the
        locale.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const datePickerOverviewDemos = [LiveView];
