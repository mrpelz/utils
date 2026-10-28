import './style.css';

import { FunctionComponent, useRef, useState } from 'react';

import {
  Button,
  List,
  Popover,
  Roll,
  type RollChangeEventDetails,
  type RollValue,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { hours, minutes } from './props.js';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const days = Array.from({ length: 31 }, (_, index) => index + 1);

const sizes = ['Small', 'Medium', 'Large', 'Extra Large'] as const;

// The time's code (as below).
/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in a code sample, not interpolations */
const timeCode = `const hours = Array.from({ length: 24 }, (_, index) => index);
const minutes = Array.from({ length: 60 }, (_, index) => index);
const [hour, setHour] = useState(7);
const [minute, setMinute] = useState(30);

<Roll.Root>
  <Roll.Column editable loop aria-label="Hours" value={hour} onValueChange={setHour}>
    {hours.map((h) => <Roll.Item key={h} value={h}>{String(h).padStart(2, '0')}</Roll.Item>)}
  </Roll.Column>
  <Roll.Separator aria-hidden="true">:</Roll.Separator>
  <Roll.Column editable loop aria-label="Minutes" value={minute} onValueChange={setMinute}>
    {minutes.map((m) => <Roll.Item key={m} value={m}>{String(m).padStart(2, '0')}</Roll.Item>)}
  </Roll.Column>
</Roll.Root>`;

const carryCode = `const [hour, setHour] = useState(7);
const [minute, setMinute] = useState(58);

// The minute row last passing the center (while rolling).
const passed = useRef(58);

// Rolled past 59 to 00, the next hour; back past 00 to 59, the previous
// one: at once, as the row passes (the shorter way round; not typed).
const onMinuteHighlight = (next, { reason }) => {
  const previous = passed.current;
  passed.current = next;
  if (reason === 'input' || Math.abs(next - previous) <= 30) return;
  setHour((current) => (current + (next < previous ? 1 : 23)) % 24);
};

<Roll.Root>
  <Roll.Column editable loop aria-label="Hours" value={hour} onValueChange={setHour}>…</Roll.Column>
  <Roll.Separator aria-hidden="true">:</Roll.Separator>
  <Roll.Column
    editable
    loop
    aria-label="Minutes"
    value={minute}
    onHighlightChange={onMinuteHighlight}
    onValueChange={(next) => {
      passed.current = next;
      setMinute(next);
    }}
  >
    …
  </Roll.Column>
</Roll.Root>`;

const resetCode = `const [hour, setHour] = useState(7);
const [minute, setMinute] = useState(30);

// Another hour passing the center: its minutes from 00, at once (not only
// once the hours settle).
const onHourHighlight = (next) => {
  if (next !== hour) setMinute(0);
};

<Roll.Root>
  <Roll.Column
    editable
    loop
    aria-label="Hours"
    value={hour}
    onHighlightChange={onHourHighlight}
    onValueChange={setHour}
  >
    …
  </Roll.Column>
  <Roll.Separator aria-hidden="true">:</Roll.Separator>
  <Roll.Column editable loop aria-label="Minutes" value={minute} onValueChange={setMinute}>…</Roll.Column>
</Roll.Root>`;

const dependentCode = `const days = Array.from({ length: 31 }, (_, index) => index + 1);
const [month, setMonth] = useState(3);
const [day, setDay] = useState(30);
// The month's days: the rest disabled (e.g. 31 in April).
const length = new Date(2026, month + 1, 0).getDate();

<Roll.Column aria-label="Day" value={day} onValueChange={setDay}>
  {days.map((d) => <Roll.Item key={d} disabled={d > length} value={d} />)}
</Roll.Column>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** An alarm's time: hours and minutes, looping, typed. */
const ATime: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [hour, setHour] = useState<RollValue>(7);
  const [minute, setMinute] = useState<RollValue>(30);

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="roll-composition-time"
      log={log}
      title="Roll as a time"
    >
      <div className="roll-demo-stack">
        <output className="roll-demo-value">
          {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
        </output>
        <Roll.Root>
          <Roll.Column
            editable
            loop
            aria-label="Hours"
            value={hour}
            onValueChange={(
              next: RollValue,
              { reason }: RollChangeEventDetails,
            ) => {
              addLog(`hour: ${String(next)} (${reason})`);
              setHour(next);
            }}
          >
            {hours.map((value) => (
              <Roll.Item
                key={value}
                value={value}
              >
                {String(value).padStart(2, '0')}
              </Roll.Item>
            ))}
          </Roll.Column>
          <Roll.Separator aria-hidden="true">:</Roll.Separator>
          <Roll.Column
            editable
            loop
            aria-label="Minutes"
            value={minute}
            onValueChange={(
              next: RollValue,
              { reason }: RollChangeEventDetails,
            ) => {
              addLog(`minute: ${String(next)} (${reason})`);
              setMinute(next);
            }}
          >
            {minutes.map((value) => (
              <Roll.Item
                key={value}
                value={value}
              >
                {String(value).padStart(2, '0')}
              </Roll.Item>
            ))}
          </Roll.Column>
        </Roll.Root>
      </div>
    </Component>
  );
};

/** A time whose minutes, wrapping, carry over to its hour. */
const CarryingTheHour: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(58);
  // The minute row last passing the center (while rolling).
  const passed = useRef(58);

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="roll-composition-carry"
      log={log}
      title="Roll carrying the hour"
    >
      <div className="roll-demo-stack">
        <output className="roll-demo-value">
          {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
        </output>
        <Roll.Root>
          <Roll.Column
            editable
            loop
            aria-label="Hours"
            value={hour}
            onValueChange={(next: RollValue) => {
              addLog(`hour: ${String(next)}`);
              setHour(Number(next));
            }}
          >
            {hours.map((value) => (
              <Roll.Item
                key={value}
                value={value}
              >
                {String(value).padStart(2, '0')}
              </Roll.Item>
            ))}
          </Roll.Column>
          <Roll.Separator aria-hidden="true">:</Roll.Separator>
          <Roll.Column
            editable
            loop
            aria-label="Minutes"
            value={minute}
            onHighlightChange={(
              next: RollValue,
              { reason }: RollChangeEventDetails,
            ) => {
              const value = Number(next);
              const previous = passed.current;
              passed.current = value;
              // Rolled past 59 to 00 (or back), the shorter way round, not
              // typed: the next or previous hour, at once.
              if (reason === 'input' || Math.abs(value - previous) <= 30) {
                return;
              }
              const step = value < previous ? 1 : 23;
              addLog(`carried: hour ${step === 1 ? '+1' : '−1'}`);
              setHour((current) => (current + step) % 24);
            }}
            onValueChange={(next: RollValue) => {
              addLog(`minute: ${String(next)}`);
              passed.current = Number(next);
              setMinute(Number(next));
            }}
          >
            {minutes.map((value) => (
              <Roll.Item
                key={value}
                value={value}
              >
                {String(value).padStart(2, '0')}
              </Roll.Item>
            ))}
          </Roll.Column>
        </Roll.Root>
      </div>
    </Component>
  );
};

/** A time whose minutes start over at 00 when its hour changes. */
const ResettingTheMinutes: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [hour, setHour] = useState<RollValue>(7);
  const [minute, setMinute] = useState<RollValue>(30);

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="roll-composition-reset"
      log={log}
      title="Roll resetting the minutes"
    >
      <div className="roll-demo-stack">
        <output className="roll-demo-value">
          {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
        </output>
        <Roll.Root>
          <Roll.Column
            editable
            loop
            aria-label="Hours"
            value={hour}
            onHighlightChange={(next: RollValue) => {
              // Another hour passing the center: its minutes from 00, at once.
              if (next === hour || minute === 0) return;
              addLog(`hour passing ${String(next)}: minutes reset`);
              setMinute(0);
            }}
            onValueChange={(next: RollValue) => {
              addLog(`hour: ${String(next)}`);
              setHour(next);
            }}
          >
            {hours.map((value) => (
              <Roll.Item
                key={value}
                value={value}
              >
                {String(value).padStart(2, '0')}
              </Roll.Item>
            ))}
          </Roll.Column>
          <Roll.Separator aria-hidden="true">:</Roll.Separator>
          <Roll.Column
            editable
            loop
            aria-label="Minutes"
            value={minute}
            onValueChange={(next: RollValue) => {
              addLog(`minute: ${String(next)}`);
              setMinute(next);
            }}
          >
            {minutes.map((value) => (
              <Roll.Item
                key={value}
                value={value}
              >
                {String(value).padStart(2, '0')}
              </Roll.Item>
            ))}
          </Roll.Column>
        </Roll.Root>
      </div>
    </Component>
  );
};

/** A date's month and day: days past the month's end disabled. */
const DependentColumns: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [month, setMonth] = useState<RollValue>(3);
  const [day, setDay] = useState<RollValue>(30);
  const length = new Date(2026, Number(month) + 1, 0).getDate();

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="roll-composition-dependent"
      log={log}
      title="Roll with dependent columns"
    >
      <div className="roll-demo-stack">
        <output className="roll-demo-value">
          {months[Number(month)]} {day}
        </output>
        <Roll.Root>
          <Roll.Column
            align="start"
            aria-label="Month"
            value={month}
            onValueChange={(next: RollValue) => {
              addLog(`month: ${months[Number(next)]}`);
              setMonth(next);
            }}
          >
            {months.map((name, index) => (
              <Roll.Item
                key={name}
                value={index}
              >
                {name}
              </Roll.Item>
            ))}
          </Roll.Column>
          <Roll.Column
            aria-label="Day"
            value={day}
            onValueChange={(next: RollValue) => {
              addLog(`day: ${String(next)}`);
              setDay(next);
            }}
          >
            {days.map((value) => (
              <Roll.Item
                key={value}
                disabled={value > length}
                value={value}
              />
            ))}
          </Roll.Column>
        </Roll.Root>
      </div>
    </Component>
  );
};

/** An alarm row: its time in the detail, the roll expanded below it. */
const InlineInAListRow: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [hour, setHour] = useState<RollValue>(7);
  const [minute, setMinute] = useState<RollValue>(30);

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="roll-composition-list"
      log={log}
      title="Roll inline in a list row"
    >
      <List.Root style={{ width: 'min(402px, 100%)' }}>
        <List.Section>
          <List.Group>
            <List.CollapsibleRoot
              onOpenChange={(isOpen: boolean) => addLog(`expanded: ${isOpen}`)}
            >
              <List.Item>
                <List.Content>
                  <List.Title render={<List.CollapsibleTrigger />}>
                    Alarm
                  </List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Detail className="roll-demo-value">
                    {String(hour).padStart(2, '0')}:
                    {String(minute).padStart(2, '0')}
                  </List.Detail>
                </List.Trailing>
              </List.Item>
              <List.CollapsiblePanel>
                <List.Item>
                  <List.Span>
                    <Roll.Root>
                      <Roll.Column
                        loop
                        aria-label="Hours"
                        value={hour}
                        onValueChange={(next: RollValue) => {
                          addLog(`hour: ${String(next)}`);
                          setHour(next);
                        }}
                      >
                        {hours.map((value) => (
                          <Roll.Item
                            key={value}
                            value={value}
                          >
                            {String(value).padStart(2, '0')}
                          </Roll.Item>
                        ))}
                      </Roll.Column>
                      <Roll.Separator aria-hidden="true">:</Roll.Separator>
                      <Roll.Column
                        loop
                        aria-label="Minutes"
                        value={minute}
                        onValueChange={(next: RollValue) => {
                          addLog(`minute: ${String(next)}`);
                          setMinute(next);
                        }}
                      >
                        {minutes.map((value) => (
                          <Roll.Item
                            key={value}
                            value={value}
                          >
                            {String(value).padStart(2, '0')}
                          </Roll.Item>
                        ))}
                      </Roll.Column>
                    </Roll.Root>
                  </List.Span>
                </List.Item>
              </List.CollapsiblePanel>
            </List.CollapsibleRoot>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** A text size: a button showing it, its roll in a popover. */
const InAPopover: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [size, setSize] = useState<RollValue>('Medium');

  return (
    <Component
      hasInputGuards
      isCentered
      isInline
      id="roll-composition-popover"
      log={log}
      title="Roll in a popover"
    >
      <Popover.Root>
        <Popover.Trigger
          render={
            <Button.Root
              size="large"
              variant="bordered"
            />
          }
        >
          <Button.Label>{size}</Button.Label>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner>
            <Popover.Popup aria-label="Text size">
              <Roll.Root>
                <Roll.Column
                  aria-label="Text size"
                  value={size}
                  onValueChange={(next: RollValue) => {
                    addLog(`size: ${String(next)}`);
                    setSize(next);
                  }}
                >
                  {sizes.map((name) => (
                    <Roll.Item
                      key={name}
                      value={name}
                    />
                  ))}
                </Roll.Column>
              </Roll.Root>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-time', 'A time'],
  ['carrying-over-to-the-hour', 'Carrying over to the hour'],
  ['resetting-the-minutes', 'Resetting the minutes'],
  ['dependent-columns', 'Dependent columns'],
  ['inline-in-a-list-row', 'Inline in a list row'],
  ['in-a-popover', 'In a popover'],
];

/** `/roll/composition`: rolls as times, dates, in rows and popovers. */
export const RollComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="a-time"
      level={2}
    >
      A time
    </Heading>
    <ul>
      <li>
        Hours and minutes, as iOS’s time wheels: two columns,{' '}
        <PartLink
          component="roll"
          part="Roll.Separator"
        >
          {'<Roll.Separator>:</Roll.Separator>'}
        </PartLink>{' '}
        between them.
      </li>
      <li>
        <code>loop</code>: past 23 comes 0; <code>editable</code>: pressing the
        selected row (or typing digits) enters a number.
      </li>
      <li>Rows show two digits (their children); their values stay numbers.</li>
      <li>
        Controlled: the app holds the time, and shows it (here above the wheel).
      </li>
      <li>
        <strong>Library:</strong> the columns (
        <PartLink
          component="roll"
          part="Roll.Column"
        />
        , looping and editable), their rows (
        <PartLink
          component="roll"
          part="Roll.Item"
        />
        ) and the separator.
      </li>
      <li>
        <strong>Demo:</strong> the time (the app’s state) and showing it above
        the wheel.
      </li>
    </ul>
    <CodeView code={timeCode} />
    <ATime />

    <Heading
      id="carrying-over-to-the-hour"
      level={2}
    >
      Carrying over to the hour
    </Heading>
    <ul>
      <li>
        As a clock: rolling the minutes past 59 to 00 advances the hour; back
        past 00 to 59, the hour goes back.
      </li>
      <li>
        At once, as the row passes the center: the minute column’s{' '}
        <code>onHighlightChange</code> (
        <PartLink
          component="roll"
          part="Roll.Column"
        />
        ’s, with its <code>reason</code>), not its <code>onValueChange</code>{' '}
        (only once settled). A step of more than half the minutes is a wrap, the
        shorter way round; a typed value (<code>input</code>) carries nothing.
      </li>
      <li>
        The hour column then rolls to its new value, as any controlled column
        given another <code>value</code>.
      </li>
      <li>
        <strong>Library:</strong> the looping columns and their callbacks:{' '}
        <code>onHighlightChange</code> as rows pass, <code>onValueChange</code>{' '}
        once settled, each with its <code>reason</code>.
      </li>
      <li>
        <strong>Demo:</strong> telling a wrap (the shorter way round) and
        carrying it over to the hour.
      </li>
    </ul>
    <CodeView code={carryCode} />
    <CarryingTheHour />

    <Heading
      id="resetting-the-minutes"
      level={2}
    >
      Resetting the minutes
    </Heading>
    <ul>
      <li>
        Another hour picked, its minutes start over: the minute column rolls
        back to 00.
      </li>
      <li>
        At once, as another hour passes the center (the hour column’s{' '}
        <code>onHighlightChange</code>), not only once it settles; the minute
        column, controlled, rolls to its new value.
      </li>
      <li>
        <strong>Library:</strong> the columns’ callbacks (
        <code>onHighlightChange</code>, <code>onValueChange</code>) and
        controlled columns rolling to a new <code>value</code>.
      </li>
      <li>
        <strong>Demo:</strong> resetting the minutes as another hour passes.
      </li>
    </ul>
    <CodeView code={resetCode} />
    <ResettingTheMinutes />

    <Heading
      id="dependent-columns"
      level={2}
    >
      Dependent columns
    </Heading>
    <ul>
      <li>
        A column’s rows can depend on another’s value: a month’s days, the rest{' '}
        <code>disabled</code> (shown, as iOS shows them, but not selectable).
      </li>
      <li>
        Settled on a disabled day (e.g. 31 after turning to April), the column
        moves on to the nearest enabled one, then selects it.
      </li>
      <li>
        <strong>Library:</strong> disabled rows, shown but not selectable, and
        moving on from a disabled one when settled.
      </li>
      <li>
        <strong>Demo:</strong> the month and day (the app’s state) and disabling
        the days past the month’s end.
      </li>
    </ul>
    <CodeView code={dependentCode} />
    <DependentColumns />

    <Heading
      id="inline-in-a-list-row"
      level={2}
    >
      Inline in a list row
    </Heading>
    <ul>
      <li>
        Below a <a href="list">List</a> row, in place: its title opens it (
        <PartLink
          component="list"
          part="List.CollapsibleTrigger"
        >
          {'<List.Title render={<List.CollapsibleTrigger />}>'}
        </PartLink>
        ), the roll in{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        .
      </li>
      <li>The row’s detail shows the value, as Settings does.</li>
      <li>
        A date or a time: the <a href="date-picker">Date picker</a> does this
        itself, with a calendar.
      </li>
      <li>
        <strong>Library:</strong> the expandable row (
        <PartLink
          component="list"
          part="List.CollapsibleRoot"
        />
        , its trigger and{' '}
        <PartLink
          component="list"
          part="List.CollapsiblePanel"
        />
        ) and the roll in it.
      </li>
      <li>
        <strong>Demo:</strong> the time (the app’s state) and showing it in the
        row’s detail.
      </li>
    </ul>
    <InlineInAListRow />

    <Heading
      id="in-a-popover"
      level={2}
    >
      In a popover
    </Heading>
    <ul>
      <li>
        On demand: a button showing the value opens a{' '}
        <a href="popover">Popover</a> with the roll (iOS’s compact pickers).
      </li>
      <li>Each change applies at once; tapping outside closes it.</li>
      <li>
        <strong>Library:</strong> the{' '}
        <PartLink
          component="popover"
          part="Popover.Root"
        />{' '}
        and the roll in it, applying each change at once.
      </li>
      <li>
        <strong>Demo:</strong> the size (the app’s state) and showing it on the
        button.
      </li>
    </ul>
    <InAPopover />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const rollCompositionDemos = [
  ATime,
  CarryingTheHour,
  ResettingTheMinutes,
  DependentColumns,
  InlineInAListRow,
  InAPopover,
];
