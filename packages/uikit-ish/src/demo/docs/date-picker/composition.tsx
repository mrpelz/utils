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
  useCreateDatePickerHandle,
  Viewport,
} from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';

// An example date: April 20, 2025, 10:00.
const example = new Date(2025, 3, 20, 10, 0);

const day = 24 * 60 * 60 * 1000;

/** A settings row: the compact picker at its end. */
const InAListRow: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      hasInputGuards
      isInline
      id="date-picker-composition-list"
      log={log}
      stage="phone"
      title="Date picker in a list row"
    >
      <Viewport.Content>
        <Viewport.Padding edge="block-start" />
        <List.Root>
          <List.Section>
            <List.Group>
              <List.Item>
                <List.Content>
                  <List.Title>Date</List.Title>
                </List.Content>
                <List.Trailing>
                  <DatePicker.Root
                    defaultValue={example}
                    popoverAlign="end"
                    onValueChange={(next: Date) =>
                      addLog(`date: ${next.toLocaleDateString()}`)
                    }
                  />
                </List.Trailing>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Title>Reminder</List.Title>
                </List.Content>
                <List.Trailing>
                  <DatePicker.Root
                    defaultValue={example}
                    mode="time"
                    popoverAlign="end"
                    onValueChange={(next: Date) =>
                      addLog(`reminder: ${next.toLocaleTimeString()}`)
                    }
                  />
                </List.Trailing>
              </List.Item>
            </List.Group>
          </List.Section>
        </List.Root>
        <Viewport.Padding edge="block-end" />
      </Viewport.Content>
    </Component>
  );
};

/**
 * An event's start: its buttons toggle the pickers, in expandable rows
 * below the row (by a handle).
 */
const ExpandedBelowARow: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const starts = useCreateDatePickerHandle();

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
              <List.Content>
                <List.Title>Starts</List.Title>
              </List.Content>
              <List.Trailing>
                <DatePicker.Root
                  defaultValue={example}
                  handle={starts}
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
            <DatePicker.Expandable handle={starts} />
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
  const birthdayPicker = useCreateDatePickerHandle();

  return (
    <Component
      hasInputGuards
      isInline
      id="date-picker-composition-form"
      log={log}
      stage="phone"
      title="Date picker in a form"
    >
      <Viewport.Content>
        <Viewport.Padding edge="block-start" />
        <Form
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
                  <List.Content>
                    <List.Title>Birthday</List.Title>
                  </List.Content>
                  <List.Trailing>
                    <DatePicker.Root
                      handle={birthdayPicker}
                      max={new Date()}
                      value={birthday}
                      onValueChange={(next: Date) => setBirthday(next)}
                    />
                  </List.Trailing>
                </Field.Root>
                <DatePicker.Expandable handle={birthdayPicker} />
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
        <Viewport.Padding edge="block-end" />
      </Viewport.Content>
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
        As a calendar app edits an event: the buttons toggle the calendar and
        the time wheel, each in an expandable row below the row (
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        ), pushing the rows below down.
      </li>
      <li>
        The picker and its pickers are linked by a handle (
        <PartLink
          component="date-picker"
          part="DatePicker.createHandle"
        />
        , in a component <code>useCreateDatePickerHandle</code>): given to the
        picker in the row and to the{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />{' '}
        placed after it. No app state: the picker keeps its value and which
        picker is open.
      </li>
      <li>
        <strong>Library:</strong> the picker’s buttons toggling its pickers (
        <PartLink
          component="date-picker"
          part="DatePicker.Root"
        />{' '}
        <code>handle</code>), the handle (
        <PartLink
          component="date-picker"
          part="DatePicker.createHandle"
        />
        ) and the expandable rows (
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />
        ,{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the row, its default date, and the handle linking
        the picker to its expandable rows.
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
        In a list, its calendar in a row below (
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />
        , by a handle: see{' '}
        <a href="#expanded-below-a-row">Expanded below a row</a>).
      </li>
      <li>
        <strong>Library:</strong> the picker’s hidden control (its value an ISO
        date) in Base UI’s{' '}
        <PartLink
          component="form"
          part="Form"
        />{' '}
        and field, <code>max</code>, and the calendar’s row.
      </li>
      <li>
        <strong>Demo:</strong> the birthday (the app’s state), the handle, the
        field’s name and logging what’s submitted.
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
