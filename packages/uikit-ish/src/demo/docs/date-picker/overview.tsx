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
import { GuideLink } from '../hig-guide/link.js';
import { datePickerRootRows } from './docs.js';
import { propOptionsOverview } from './props.js';

// Figma's example: April 20, 2025, 9:41.
const example = new Date(2025, 3, 20, 9, 41);

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
      <li>
        Picks a date, a time, or both (UIKit <code>UIDatePicker</code>), or a
        range of dates.
      </li>
      <li>
        Compact: buttons showing the value, the calendar (or the time) in a
        popover; inline: the calendar in place.
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
        For dates and times: an appointment, a reminder, a birthday, a stay.
      </li>
      <li>
        Compact where space is short (a list row), inline where picking the date
        is the task (the guide’s collapsed picker, a{' '}
        <GuideLink to="choice-family">choice</GuideLink> of an ordered value).
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
        Other values in columns (sizes, measures): a <a href="roll">Roll</a>.
      </li>
      <li>
        A number a step at a time: a <a href="stepper">Stepper</a>.
      </li>
      <li>
        Typed dates (e.g. known from a document): a{' '}
        <a href="text-field">Text field</a>.
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
        All parts’ props: <a href="date-picker/parts">Parts</a>.
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
        The compact style’s buttons show the value; the time’s is named “Time”.
        They open popovers (Base UI’s: focus moves in, Escape closes them).
      </li>
      <li>
        The days are a group of buttons, named by the month’s title, one of them
        tabbable: arrow keys move by a day or a week, Page Up and Page Down by a
        month, Home and End to the week’s ends; each day is named in full
        (“Sunday, April 20, 2025”).
      </li>
      <li>
        The rolls (month and year, the time) are listboxes (see{' '}
        <a href="roll">Roll</a>).
      </li>
      <li>
        A range’s footer message (
        <PartLink
          component="date-picker"
          part="DatePicker.CalendarMessage"
        />
        ) is announced; an error as an alert.
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
        The calendar’s title opens a month and year roll over the days; its
        arrows go to the previous or next month, sliding.
      </li>
      <li>
        The months sit side by side, scrolled sideways natively (a finger, a
        trackpad), snapping to one month per flick; not beyond the limits. What
        a swipe does is <code>swipe</code>’s: by default a date’s turns the
        month, a range’s is dragged across.
      </li>
      <li>
        With a time, the Time row’s button shows the time’s roll in the days’
        place.
      </li>
      <li>
        A range: a start, then an end, pressed or dragged across (held at the
        edge, the drag goes on to the next month).
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
