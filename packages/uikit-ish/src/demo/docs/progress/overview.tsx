import './style.css';

import { FunctionComponent } from 'react';

import { ActivityIndicator, Progress } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
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
import {
  activityIndicatorRows,
  progressLabelRows,
  progressRootRows,
  progressValueRows,
} from './docs.js';
import { propOptionsOverviewRoot, propOptionsOverviewValue } from './props.js';

/** A download's bar, labeled, its value shown; and a spinner. */
const LiveView: FunctionComponent = () => {
  const id = 'progress-overview';
  const [externalRoot, externalValue] = useProvidedState(id);
  const [controlRoot, propsRoot, stateRoot] = usePropControl(
    propOptionsOverviewRoot,
    { external: externalRoot, isOpen: true, title: 'Progress.Root' },
  );
  const [controlValue, propsValue, stateValue] = usePropControl(
    propOptionsOverviewValue,
    { external: externalValue, title: 'Progress.Value' },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="progress"
      controls={[controlRoot, controlValue]}
      id={id}
      state={[stateRoot, stateValue]}
      title="Progress"
    >
      <div className="progress-demo-stage">
        <Progress.Root {...propsRoot}>
          <Progress.Label>Downloading</Progress.Label>
          <Progress.Value {...propsValue} />
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
        <ActivityIndicator>Loading</ActivityIndicator>
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

/** `/progress`: what progress indicators are for, and their props. */
export const ProgressOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Work going on: a bar filling as it advances (UIKit{' '}
        <code>UIProgressView</code>, Base UI’s <code>Progress</code>), or, of
        unknown length, spinning spokes (<code>UIActivityIndicatorView</code>:{' '}
        <PartLink
          component="progress"
          part="ActivityIndicator"
        />
        ).
      </li>
      <li>Figma “Progress Indicators”: Progress bar, Progress indicator.</li>
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
        A bar: work whose share done is known (a download, an import), so the
        person can tell how long is left.
      </li>
      <li>
        An activity indicator: work of unknown length (loading, connecting),
        where it happens (a row, a page’s content).
      </li>
      <li>Only while the work runs: gone (or the bar full) once it’s done.</li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        A value to set: a <a href="slider">Slider</a> (an editable bar, the
        guide’s <GuideLink to="indicator-continuum">continuum</GuideLink>).
      </li>
      <li>
        Something new waiting, counted: a <a href="badge">Badge</a>.
      </li>
      <li>
        A bar of unknown length (Base UI’s indeterminate): UIKit has none,
        prefer an activity indicator.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most progress indicators set.</li>
      <li>
        All parts’ props: <a href="progress/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Progress.Root', pickRows(progressRootRows, 'value', 'max', 'tint')],
        ['Progress.Label', pickRows(progressLabelRows, 'placement')],
        ['Progress.Value', pickRows(progressValueRows, 'placement')],
        [
          'ActivityIndicator',
          pickRows(activityIndicatorRows, 'display', 'size', 'children'),
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
        Both have the <code>progressbar</code> role, the bar with its value (
        <code>aria-valuenow</code>, read as its formatted value:{' '}
        <code>format</code>, <code>getAriaValueText</code>); an activity
        indicator without one (indeterminate).
      </li>
      <li>
        Named by its label (
        <PartLink
          component="progress"
          part="Progress.Label"
        />
        , an activity indicator’s children); without one, give it an{' '}
        <code>aria-label</code>.
      </li>
      <li>
        A momentary tooltip makes the bar focusable, so keyboard users can read
        it too.
      </li>
      <li>
        The spinner doesn’t follow <code>prefers-reduced-motion</code>; it can
        be stopped (<code>display</code>).
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
        The bar fills its container (at least 280px), 6px high; at 0%, a dot.
        Its fill grows to a new value over 200ms (at once with{' '}
        <code>prefers-reduced-motion</code>).
      </li>
      <li>
        Its label and value above it by default, the label at the line’s start,
        the value at its end (whichever comes first in the markup).
      </li>
      <li>
        The activity indicator turns once a second, a spoke at a time. Stopped,
        it rests at once, freezes where it is, or finishes its turn first; or it
        hides, once finished or at once (<code>display</code>), taking no room.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const progressOverviewDemos = [LiveView];
