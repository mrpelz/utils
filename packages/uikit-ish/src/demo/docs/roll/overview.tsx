import './style.css';

import { FunctionComponent, useMemo, useState } from 'react';

import { Roll, type RollValue } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { rollColumnRows } from './docs.js';
import { fruits, propOptionsOverview } from './props.js';

/** A column of fruit, its value shown above it (the app's), a few props. */
const LiveView: FunctionComponent = () => {
  const id = 'roll-overview';
  const [log, addLog] = useLog();
  const [fruit, setFruit] = useState<RollValue>('Cherry');
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsOverview, {
    external,
    isOpen: true,
    title: 'Roll.Column',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Roll.Item': ['value'],
            'Roll.Root': [],
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
      title="Roll"
    >
      <div className="roll-demo-stack">
        <output className="roll-demo-value">{fruit}</output>
        <Roll.Root {...partProps['Roll.Root']}>
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
                {...partProps['Roll.Item']}
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
        A wheel of columns, each scrolled to select a row, with the selection in
        a band across its center.
      </li>
      <li>
        It shows the parts of a value side by side, such as a time’s hours and
        minutes, or a date’s month and day.
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
        For a value from a long, ordered set, with one part per column: times,
        dates, measures.
      </li>
      <li>
        Inline (in an expanded row) or on demand (in a popover), as a wheel
        picker for choosing one value from a large set.
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
        Dates and times as such: use a{' '}
        <a href={publicUrl('date-picker')}>Date Picker</a>, which is built on
        rolls and adds a calendar.
      </li>
      <li>
        A few options, all visible: use a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control. Options with
        details: use a <a href={publicUrl('list')}>List</a>.
      </li>
      <li>
        A number, one step at a time: use a{' '}
        <a href={publicUrl('stepper')}>Stepper</a>.
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
        All props of all parts are on the{' '}
        <a href={publicUrl('roll/parts')}>Parts</a> page.
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
        Each column is a <code>listbox</code>, with its rows as options and the
        selected one active (<code>aria-activedescendant</code>). Name it with{' '}
        <PartLink
          component="roll"
          part="Roll.Column"
        />
        ’s <code>aria-label</code>, for example “Hours”.
      </li>
      <li>
        Tab focuses a column. The up and down arrow keys move its selection,
        Page Up and Page Down by five, and Home and End to the first and last
        row. When it’s editable, Enter (or a digit) starts typing a value.
      </li>
      <li>
        Disabled rows are announced as disabled (<code>aria-disabled</code>).
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
        A column scrolls natively (by touch, wheel and momentum) or follows a
        mouse drag, and snaps to its rows. Once it settles, the centered row is
        selected (<code>onValueChange</code>), not while it’s turning.
      </li>
      <li>Pressing a row scrolls it to the center.</li>
      <li>
        When it settles on a disabled row for a moment, the column moves on to
        the nearest enabled one.
      </li>
      <li>
        With <code>editable</code>, pressing the selected row shows a field for
        typing a value (with a numeric keyboard), as on time wheels.
      </li>
      <li>
        With <code>loop</code>, the rows repeat endlessly, as on time wheels.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const rollOverviewDemos = [LiveView];
