import { FunctionComponent, useState } from 'react';

import {
  Button,
  type CalendarFooter,
  DatePicker,
  type DatePickerOpen,
  type DateRange,
  Field,
  Fieldset,
  Form,
  List,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';

// Figma's example: April 20, 2025, 9:41.
const example = new Date(2025, 3, 20, 9, 41);

const day = 24 * 60 * 60 * 1000;

/** A settings row: the compact picker at its end. */
const InAListRow: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="date-picker-composition-list"
      log={log}
      title="Date picker in a list row"
    >
      <List.Root style={{ width: 'min(402px, 100%)' }}>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Title>Date</List.Title>
              <DatePicker.Root
                defaultValue={example}
                popoverAlign="end"
                onValueChange={(next: Date) =>
                  addLog(`date: ${next.toLocaleDateString()}`)
                }
              />
            </List.Item>
            <List.Item>
              <List.Title>Reminder</List.Title>
              <DatePicker.Root
                defaultValue={example}
                mode="time"
                popoverAlign="end"
                onValueChange={(next: Date) =>
                  addLog(`reminder: ${next.toLocaleTimeString()}`)
                }
              />
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** An event's start: its buttons toggle the pickers, below the row. */
const ExpandedBelowARow: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [starts, setStarts] = useState<Date>(example);
  const [open, setOpen] = useState<DatePickerOpen | null>(null);

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="date-picker-composition-expanded"
      log={log}
      title="Date picker expanded below a row"
    >
      <List.Root style={{ width: 'min(402px, 100%)' }}>
        <List.Section>
          <List.Group>
            <List.Item>
              <List.Title>Starts</List.Title>
              <DatePicker.Root
                mode="dateAndTime"
                open={open}
                popover={false}
                value={starts}
                onValueChange={(next: Date) => setStarts(next)}
                onOpenChange={(next: DatePickerOpen | null) => {
                  addLog(`open: ${String(next)}`);
                  setOpen(next);
                }}
              />
            </List.Item>
            <List.Expandable open={open === 'date'}>
              <DatePicker.Calendar
                value={starts}
                onValueChange={(next: Date) => {
                  addLog(`starts: ${next.toLocaleString()}`);
                  setStarts(next);
                }}
              />
            </List.Expandable>
            <List.Expandable open={open === 'time'}>
              <DatePicker.TimeRoll
                value={starts}
                onValueChange={(next: Date) => {
                  addLog(`starts: ${next.toLocaleString()}`);
                  setStarts(next);
                }}
              />
            </List.Expandable>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** A sign-up: the birthday submitted by name. */
const InAForm: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [birthday, setBirthday] = useState<Date | null>(null);

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="date-picker-composition-form"
      log={log}
      title="Date picker in a form"
    >
      <Form
        style={{ width: 'min(402px, 100%)' }}
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submitted: ${JSON.stringify(values)}`)
        }
      >
        <List.Root>
          <Fieldset.Root>
            <Fieldset.Legend>
              <List.Title>About you</List.Title>
            </Fieldset.Legend>
            <List.Group>
              <Field.Root
                name="birthday"
                render={<List.Item />}
              >
                <List.Title>Birthday</List.Title>
                <DatePicker.Root
                  max={new Date()}
                  popoverAlign="end"
                  value={birthday}
                  onValueChange={(next: Date) => setBirthday(next)}
                />
              </Field.Root>
            </List.Group>
          </Fieldset.Root>
          <List.Section>
            <List.Block style={{ paddingInline: 0 }}>
              <Button.Root
                fill
                size="large"
                type="submit"
                variant="bordered-prominent"
              >
                <Button.Label>Sign Up</Button.Label>
              </Button.Root>
            </List.Block>
          </List.Section>
        </List.Root>
      </Form>
    </Component>
  );
};

/** A stay: two to seven nights, the footer telling so. */
const ARangeWithRules: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="date-picker-composition-range"
      log={log}
      title="Date picker: a range with rules"
    >
      <DatePicker.Root
        range
        pickerStyle="inline"
        footer={({ value }: CalendarFooter) => {
          const isMissing =
            value !== null && !(value instanceof Date) && value.end === null;
          return (
            <DatePicker.CalendarMessage variant={isMissing ? 'error' : 'info'}>
              {isMissing
                ? 'Select a stay spanning at least two nights.'
                : 'Stay two to seven nights.'}
            </DatePicker.CalendarMessage>
          );
        }}
        isRangeDisabled={(start: Date, end: Date) => {
          const nights = Math.round((end.getTime() - start.getTime()) / day);
          return nights < 2 || nights > 7;
        }}
        onValueChange={({ end, start }: DateRange) => {
          addLog(
            `stay: ${start.toLocaleDateString()} – ${end?.toLocaleDateString() ?? '…'}`,
          );
        }}
      />
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['in-a-list-row', 'In a list row'],
  ['expanded-below-a-row', 'Expanded below a row'],
  ['in-a-form', 'In a form'],
  ['a-range-with-rules', 'A range with rules'],
];

/** `/date-picker/composition`: date pickers in rows, forms, ranges. */
export const DatePickerComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="in-a-list-row"
      level={2}
    >
      In a list row
    </Heading>
    <ul>
      <li>
        The compact style at a <a href="list">List</a> row’s end, as in
        Settings: its buttons show the value, opening the calendar (or the time)
        in a popover.
      </li>
      <li>In a row, the popover aligns to the buttons’ end.</li>
      <li>
        <strong>Library:</strong> the compact picker (
        <PartLink
          component="date-picker"
          part="DatePicker.Root"
        />
        ): its buttons, the calendar or time popover, and aligning it to the
        buttons’ end.
      </li>
      <li>
        <strong>Demo:</strong> the row and its default date.
      </li>
    </ul>
    <InAListRow />

    <Heading
      id="expanded-below-a-row"
      level={2}
    >
      Expanded below a row
    </Heading>
    <ul>
      <li>
        As iOS’s Calendar edits an event: without <code>popover</code>, the
        buttons toggle <code>open</code>, and the app shows the picker below the
        row (
        <PartLink
          component="list"
          part="List.Expandable"
        />
        ).
      </li>
      <li>
        The pickers on their own:{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Calendar"
        />{' '}
        for the date,{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.TimeRoll"
        />{' '}
        for the time, sharing the app’s value.
      </li>
      <li>
        <strong>Library:</strong> the picker without its popover (
        <code>
          popover={'{'}false{'}'}
        </code>
        , toggling <code>open</code>), the calendar and time wheel on their own
        (
        <PartLink
          component="date-picker"
          part="DatePicker.Calendar"
        />
        ,{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.TimeRoll"
        />
        ) and the expandable rows (
        <PartLink
          component="list"
          part="List.Expandable"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> holding <code>open</code> and the date, and
        showing each picker in its expandable row.
      </li>
    </ul>
    <ExpandedBelowARow />

    <Heading
      id="in-a-form"
      level={2}
    >
      In a form
    </Heading>
    <ul>
      <li>
        In a <a href="form">Form</a>, in Base UI’s{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Root
        </PartLink>{' '}
        (its <code>name</code>; the row:{' '}
        <PartLink
          component="list"
          part="List.Item"
        >
          {'render={<List.Item />}'}
        </PartLink>
        ): the picker’s hidden control carries its value (an ISO date), among
        the form’s submitted values; outside a field, by its own{' '}
        <code>name</code>.
      </li>
      <li>
        <code>max</code>: no birthdays in the future.
      </li>
      <li>
        <strong>Library:</strong> the picker’s hidden control (its value an ISO
        date) in Base UI’s{' '}
        <PartLink
          component="form"
          part="Form"
        />{' '}
        and field, and <code>max</code>.
      </li>
      <li>
        <strong>Demo:</strong> the birthday (the app’s state), the field’s name
        and logging what’s submitted.
      </li>
    </ul>
    <InAForm />

    <Heading
      id="a-range-with-rules"
      level={2}
    >
      A range with rules
    </Heading>
    <ul>
      <li>
        <code>range</code>: a start, then an end (pressed, or dragged across).
      </li>
      <li>
        <code>isRangeDisabled</code>: while an end is picked, the days making a
        stay shorter than two nights or longer than seven are disabled.
      </li>
      <li>
        The footer says so (
        <PartLink
          component="date-picker"
          part="DatePicker.CalendarMessage"
        />
        ), and, while the end is missing, what’s wrong (an error, announced).
      </li>
      <li>
        <strong>Library:</strong> the range (<code>range</code>), disabling days
        by a rule (<code>isRangeDisabled</code>) and the footer’s message (
        <PartLink
          component="date-picker"
          part="DatePicker.CalendarMessage"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the rule itself (two to seven nights) and its
        wording.
      </li>
    </ul>
    <ARangeWithRules />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const datePickerCompositionDemos = [
  InAListRow,
  ExpandedBelowARow,
  InAForm,
  ARangeWithRules,
];
