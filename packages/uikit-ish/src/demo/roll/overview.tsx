import './style.css';

import { FunctionComponent, useState } from 'react';

import { Roll, type RollValue } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { KeyPropsTable, pickRows } from '../guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { rollColumnRows } from './docs.js';
import { fruits, propOptionsOverview } from './props.js';

/** A column of fruit, its value shown above it (the app's), a few props. */
const LiveView: FunctionComponent = () => {
  const id = 'roll-overview';
  const [log, addLog] = useLog();
  const [fruit, setFruit] = useState<RollValue>('Cherry');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsOverview,
    'Roll.Column',
    external,
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
      title="Roll"
    >
      <div className="roll-demo-stack">
        <output className="roll-demo-value">{fruit}</output>
        <Roll.Root>
          <Roll.Column
            aria-label="Fruit"
            {...props}
            value={fruit}
            onValueChange={(next: RollValue) => {
              addLog(`fruit: ${String(next)}`);
              setFruit(next);
            }}
          >
            {fruits.map((name) => (
              <Roll.Item
                key={name}
                value={name}
              />
            ))}
          </Roll.Column>
        </Roll.Root>
      </div>
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

/** `/roll`: what a roll is for, and its props. */
export const RollOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A wheel of columns, each scrolled to select a row (UIKit{' '}
        <code>UIPickerView</code>): the selection in a band across its center.
      </li>
      <li>
        The parts of a value side by side: a time’s hours and minutes, a date’s
        month and day.
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
        For a value from a long, ordered set, one part per column: times, dates,
        measures.
      </li>
      <li>
        Inline (in a row, expanded) or on demand (in a popover): the guide’s
        wheel picker, a <em>Choice</em> of one from a large set (
        <GuideLink to="choice-family">choice family</GuideLink>).
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
        Dates and times as such: a <a href="date-picker">Date picker</a> (built
        on rolls, with a calendar).
      </li>
      <li>
        A few options, all visible: a <a href="segmented">Segmented</a> control;
        options with details: a <a href="list">List</a>.
      </li>
      <li>
        A number a step at a time: a <a href="stepper">Stepper</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most rolls’ columns set.</li>
      <li>
        All parts’ props: <a href="roll/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Roll.Column',
          pickRows(
            rollColumnRows,
            'value',
            'defaultValue',
            'onValueChange',
            'editable',
            'loop',
            'aria-label',
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
        Each column is a <code>listbox</code>, its rows options, the selected
        one active (<code>aria-activedescendant</code>): name it (
        <PartLink
          component="roll"
          part="Roll.Column"
        />
        ’s <code>aria-label</code>), e.g. “Hours”.
      </li>
      <li>
        Keyboard: Tab focuses a column; the up and down arrow keys move its
        selection, Page Up and Page Down by five, Home and End to the first and
        last row. Editable, Enter (or a digit) types a value.
      </li>
      <li>
        Disabled rows are announced as such (<code>aria-disabled</code>).
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
        A column scrolls natively (touch, wheel, momentum), or follows a mouse
        drag, and snaps to its rows; settled, the centered row is selected (
        <code>onValueChange</code>), not while it turns.
      </li>
      <li>Pressed, a row scrolls to the center.</li>
      <li>
        Settled on a disabled row a moment, the column moves on to the nearest
        enabled one.
      </li>
      <li>
        <code>editable</code>: pressing the selected row shows a field for a
        typed value (a numeric keyboard), as iOS’s time wheels.
      </li>
      <li>
        <code>loop</code>: rows repeat endlessly, as iOS’s time wheels.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const rollOverviewDemos = [LiveView];
