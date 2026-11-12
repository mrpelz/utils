import { FunctionComponent, useMemo, useState } from 'react';

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
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';

// An example date: April 20, 2025, 10:00.
const example = new Date(2025, 3, 20, 10, 0);

const day = 24 * 60 * 60 * 1000;

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const inAListRowCode = `const example = new Date(2025, 3, 20, 10, 0);

<List.Item>
  <List.Content>
    <List.Title>Date</List.Title>
  </List.Content>
  <List.Trailing>
    {/* In a row: the popover aligned to the buttons' end. */}
    <DatePicker.Root
      defaultValue={example}
      popoverAlign="end"
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
    />
  </List.Trailing>
</List.Item>`;

const expandedCode = `const example = new Date(2025, 3, 20, 10, 0);
const starts = useCreateDatePickerHandle();

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
      />
    </List.Trailing>
  </List.Item>
  {/* Its calendar and time roll, each in a row below. */}
  <DatePicker.Expandable handle={starts} />
</List.Group>`;

const inAFormCode = `const submit = (values) => console.log(values);
const [birthday, setBirthday] = useState<Date | null>(null);
const birthdayPicker = useCreateDatePickerHandle();

<Form onFormSubmit={submit}>
  <List.Root>
    <Fieldset.Root>
      <Fieldset.Legend>
        <List.Title>About you</List.Title>
      </Fieldset.Legend>
      <List.Group>
        {/* Submitted by the field's name, as an ISO date. */}
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
              onValueChange={setBirthday}
            />
          </List.Trailing>
        </Field.Root>
        <DatePicker.Expandable handle={birthdayPicker} />
      </List.Group>
    </Fieldset.Root>
    …
  </List.Root>
</Form>`;

const rangeCode = `const day = 24 * 60 * 60 * 1000;

<DatePicker.Root
  range
  pickerStyle="inline"
  footer={({ value }) => {
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
  isRangeDisabled={(start, end) => {
    const nights = Math.round((end.getTime() - start.getTime()) / day);
    return nights < 2 || nights > 7;
  }}
/>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A settings row: the compact picker at its end. */
const InAListRow: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'DatePicker.Root': [
              'defaultValue',
              'mode',
              'onValueChange',
              'popoverAlign',
            ],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('date-picker-composition-list') },
  );

  return (
    <Component
      hasInputGuards
      isInline
      controls={[partControls]}
      id="date-picker-composition-list"
      log={log}
      stage="phone"
      state={[partState]}
      title="Date picker in a list row"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Viewport.Padding
          {...partProps['Viewport.Padding']}
          edge="block-start"
        />
        <List.Root {...partProps['List.Root']}>
          <List.Section {...partProps['List.Section']}>
            <List.Group {...partProps['List.Group']}>
              <List.Item {...partProps['List.Item']}>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>Date</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <DatePicker.Root
                    {...partProps['DatePicker.Root']}
                    defaultValue={example}
                    popoverAlign="end"
                    onValueChange={(next: Date) =>
                      addLog(`date: ${next.toLocaleDateString()}`)
                    }
                  />
                </List.Trailing>
              </List.Item>
              <List.Item {...partProps['List.Item']}>
                <List.Content {...partProps['List.Content']}>
                  <List.Title {...partProps['List.Title']}>Reminder</List.Title>
                </List.Content>
                <List.Trailing {...partProps['List.Trailing']}>
                  <DatePicker.Root
                    {...partProps['DatePicker.Root']}
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
        <Viewport.Padding
          {...partProps['Viewport.Padding']}
          edge="block-end"
        />
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
    { provided: useProvidedState('date-picker-composition-expanded') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="date-picker-composition-expanded"
      log={log}
      state={[partState]}
      title="Date picker expanded below a row"
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Form: ['onFormSubmit'],
            'Button.Label': [],
            'Button.Root': ['fill', 'size', 'type', 'variant'],
            'DatePicker.Root': ['handle', 'max', 'onValueChange', 'value'],
            'Field.Root': ['name', 'render'],
            'Fieldset.Legend': [],
            'Fieldset.Root': [],
            'List.Block': ['style'],
            'List.Content': [],
            'List.Group': [],
            'List.Item': [],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('date-picker-composition-form') },
  );

  return (
    <Component
      hasInputGuards
      isInline
      controls={[partControls]}
      id="date-picker-composition-form"
      log={log}
      stage="phone"
      state={[partState]}
      title="Date picker in a form"
    >
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Viewport.Padding
          {...partProps['Viewport.Padding']}
          edge="block-start"
        />
        <Form
          {...partProps.Form}
          onFormSubmit={(values: Record<string, unknown>) =>
            addLog(`submitted: ${JSON.stringify(values)}`)
          }
        >
          <List.Root {...partProps['List.Root']}>
            <Fieldset.Root {...partProps['Fieldset.Root']}>
              <Fieldset.Legend {...partProps['Fieldset.Legend']}>
                <List.Title {...partProps['List.Title']}>About you</List.Title>
              </Fieldset.Legend>
              <List.Group {...partProps['List.Group']}>
                <Field.Root
                  {...partProps['Field.Root']}
                  name="birthday"
                  render={<List.Item {...partProps['List.Item']} />}
                >
                  <List.Content {...partProps['List.Content']}>
                    <List.Title {...partProps['List.Title']}>
                      Birthday
                    </List.Title>
                  </List.Content>
                  <List.Trailing {...partProps['List.Trailing']}>
                    <DatePicker.Root
                      {...partProps['DatePicker.Root']}
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
            <List.Section {...partProps['List.Section']}>
              <List.Block
                {...partProps['List.Block']}
                style={{ paddingInline: 0 }}
              >
                <Button.Root
                  {...partProps['Button.Root']}
                  fill
                  size="large"
                  type="submit"
                  variant="bordered-prominent"
                >
                  <Button.Label {...partProps['Button.Label']}>
                    Sign Up
                  </Button.Label>
                </Button.Root>
              </List.Block>
            </List.Section>
          </List.Root>
        </Form>
        <Viewport.Padding
          {...partProps['Viewport.Padding']}
          edge="block-end"
        />
      </Viewport.Content>
    </Component>
  );
};

/** A stay: two to seven nights, the footer telling so. */
const ARangeWithRules: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'DatePicker.CalendarMessage': ['variant'],
            'DatePicker.Root': [
              'footer',
              'isRangeDisabled',
              'onValueChange',
              'pickerStyle',
              'range',
            ],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('date-picker-composition-range') },
  );

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      controls={[partControls]}
      id="date-picker-composition-range"
      log={log}
      state={[partState]}
      title="Date picker: a range with rules"
    >
      <DatePicker.Root
        {...partProps['DatePicker.Root']}
        range
        pickerStyle="inline"
        footer={({ value }: CalendarFooter) => {
          const isMissing =
            value !== null && !(value instanceof Date) && value.end === null;
          return (
            <DatePicker.CalendarMessage
              {...partProps['DatePicker.CalendarMessage']}
              variant={isMissing ? 'error' : 'info'}
            >
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
        The compact style sits at a <a href={publicUrl('list')}>List</a> row’s
        end, as in a settings app. Its buttons show the value, and open the
        calendar (or the time) in a popover.
      </li>
      <li>
        In a row, align the popover with the buttons’ end (
        <code>popoverAlign=&quot;end&quot;</code>).
      </li>
      <li>
        <strong>Library:</strong> the compact picker (
        <PartLink
          component="date-picker"
          part="DatePicker.Root"
        />
        ): its buttons, the calendar or time popover, and aligning it with the
        buttons’ end.
      </li>
      <li>
        <strong>Demo:</strong> the rows and their default date.
      </li>
    </ul>
    <CodeView code={inAListRowCode} />
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
        the time roll, each in an expandable row below the row (
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        ), and push the rows below down.
      </li>
      <li>
        A handle links the picker and its pickers (
        <PartLink
          component="date-picker"
          part="DatePicker.createHandle"
        />
        ; in a component, <code>useCreateDatePickerHandle</code>). It’s given to
        the picker in the row, and to the{' '}
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />{' '}
        placed after it. No app state is needed, because the picker keeps its
        value and which picker is open.
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
        ), and the expandable rows (
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
        <strong>Demo:</strong> the row, its default date, and the handle that
        links the picker to its expandable rows.
      </li>
    </ul>
    <CodeView code={expandedCode} />
    <ExpandedBelowARow />

    <Heading
      id="in-a-form"
      level={2}
    >
      In a form
    </Heading>
    <ul>
      <li>
        In a <a href={publicUrl('form')}>Form</a>, it goes in Base UI’s{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Root
        </PartLink>{' '}
        (with its <code>name</code>, and rendered as the row,{' '}
        <PartLink
          component="list"
          part="List.Item"
        >
          {'render={<List.Item />}'}
        </PartLink>
        ). The picker’s hidden control carries its value (an ISO date) among the
        form’s submitted values. Outside a field, it submits under its own{' '}
        <code>name</code>.
      </li>
      <li>
        <code>max</code> keeps birthdays out of the future.
      </li>
      <li>
        In a list, its calendar opens in a row below (
        <PartLink
          component="date-picker"
          part="DatePicker.Expandable"
        />
        , through a handle; see{' '}
        <a href="#expanded-below-a-row">Expanded below a row</a>).
      </li>
      <li>
        <strong>Library:</strong> the picker’s hidden control (with an ISO date
        as its value) in Base UI’s{' '}
        <PartLink
          component="form"
          part="Form"
        />{' '}
        and field, <code>max</code>, and the calendar’s row.
      </li>
      <li>
        <strong>Demo:</strong> the birthday (the app’s state), the handle, the
        field’s name, and logging what’s submitted.
      </li>
    </ul>
    <CodeView code={inAFormCode} />
    <InAForm />

    <Heading
      id="a-range-with-rules"
      level={2}
    >
      A range with rules
    </Heading>
    <ul>
      <li>
        <code>range</code> takes a start, then an end (pressed, or dragged
        across).
      </li>
      <li>
        <code>isRangeDisabled</code>: while an end is being picked, the days
        that would make a stay shorter than two nights or longer than seven are
        disabled.
      </li>
      <li>
        The footer says so (
        <PartLink
          component="date-picker"
          part="DatePicker.CalendarMessage"
        />
        ), and while the end is missing, it says what’s wrong (as an error,
        announced).
      </li>
      <li>
        <strong>Library:</strong> the range (<code>range</code>), disabling days
        by a rule (<code>isRangeDisabled</code>), and the footer’s message (
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
    <CodeView code={rangeCode} />
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
