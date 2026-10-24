import './style.css';

import { FunctionComponent, useState } from 'react';

import { Stepper } from '../../components/index.js';
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
import { stepperRootRows } from './docs.js';
import { propOptionsOverview } from './props.js';

/** The stepper, its value shown beside it (the app's), a few props. */
const LiveView: FunctionComponent = () => {
  const id = 'stepper-overview';
  const [log, addLog] = useLog();
  const [value, setValue] = useState<number | null>(5);
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(propOptionsOverview, {
    external,
    open: true,
    title: 'Stepper.Root',
  });

  return (
    <Component
      center
      inline
      inputGuards
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Stepper"
    >
      <div className="stepper-demo-row">
        <output>{value ?? '–'}</output>
        <Stepper.Root
          {...props}
          value={value}
          onValueChange={(next: number | null) => {
            addLog(`value: ${String(next)}`);
            setValue(next);
          }}
        >
          <Stepper.Group>
            <Stepper.Input aria-label="Quantity" />
            <Stepper.Decrement />
            <Stepper.Increment />
          </Stepper.Group>
        </Stepper.Root>
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

/** `/stepper`: what a stepper is for, and its props. */
export const StepperOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Steps a number up or down (UIKit <code>UIStepper</code>): “−” and “+” in
        a capsule.
      </li>
      <li>It shows no value: the app shows it, e.g. in its row.</li>
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
        For small changes to a count or a quantity, a step at a time: guests,
        copies, a font size.
      </li>
      <li>
        Ordered, step-wise (the guide’s{' '}
        <GuideLink to="choice-family">choice family</GuideLink>): each press one
        step, where the value’s near what it should be.
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
        A value along a range, roughly: a <a href="slider">Slider</a>.
      </li>
      <li>
        Large or exact numbers, typed: a <a href="text-field">Text field</a>{' '}
        (numeric input mode).
      </li>
      <li>
        One of a few named options: a <a href="segmented">Segmented</a> control.
      </li>
      <li>
        A value from a long ordered set (a time, a date): a{' '}
        <a href="roll">Roll</a>, or a <a href="date-picker">Date picker</a>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most steppers set.</li>
      <li>
        All parts’ props: <a href="stepper/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Stepper.Root',
          pickRows(
            stepperRootRows,
            'value',
            'defaultValue',
            'onValueChange',
            'min',
            'max',
            'step',
            'disabled',
            'name',
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
        Its value is held by an input, visually hidden: assistive tech reads it
        as a spin button (Base UI’s number field), its text formatted by{' '}
        <code>format</code>.
      </li>
      <li>
        Name the input (
        <PartLink
          component="stepper"
          part="Stepper.Input"
        />
        ’s <code>aria-label</code>) by what it counts: the stepper has no
        visible label.
      </li>
      <li>
        Keyboard: Tab focuses it (a ring around the capsule); the up and down
        arrow keys step, with shift by <code>largeStep</code> and with alt by{' '}
        <code>smallStep</code>; Home and End go to <code>min</code> and{' '}
        <code>max</code>.
      </li>
      <li>
        Its halves are buttons, out of the tab order (the input steps by keys
        instead).
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>A press steps once; held, a half repeats.</li>
      <li>
        At <code>min</code> or <code>max</code>, its half disables (dimmed).
      </li>
      <li>
        Pressed, a half darkens (in dark mode, lightens); no focus ring shows
        for presses, only for the keyboard.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const stepperOverviewDemos = [LiveView];
