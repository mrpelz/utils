import './style.css';

import { FunctionComponent, useState } from 'react';

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
            <List.ExpandableRoot
              onOpenChange={(isOpen: boolean) => addLog(`expanded: ${isOpen}`)}
            >
              <List.Item>
                <List.Title render={<List.ExpandableTrigger />}>
                  Alarm
                </List.Title>
                <List.Detail className="roll-demo-value">
                  {String(hour).padStart(2, '0')}:
                  {String(minute).padStart(2, '0')}
                </List.Detail>
              </List.Item>
              <List.Expandable>
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
              </List.Expandable>
            </List.ExpandableRoot>
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
    </ul>
    <CodeView code={timeCode} />
    <ATime />

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
          part="List.ExpandableTrigger"
        >
          {'<List.Title render={<List.ExpandableTrigger />}>'}
        </PartLink>
        ), the roll in{' '}
        <PartLink
          component="list"
          part="List.Expandable"
        />
        .
      </li>
      <li>The row’s detail shows the value, as Settings does.</li>
      <li>
        A date or a time: the <a href="date-picker">Date picker</a> does this
        itself, with a calendar.
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
    </ul>
    <InAPopover />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const rollCompositionDemos = [
  ATime,
  DependentColumns,
  InlineInAListRow,
  InAPopover,
];
