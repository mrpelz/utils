import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { ActivityIndicator, Progress } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
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

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          ActivityIndicator: [],
          'Progress.Indicator': [],
          'Progress.Label': [],
          'Progress.Track': [],
        }),
      [],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      baseUiId="progress"
      controls={[controlRoot, controlValue, partControls]}
      id={id}
      state={[stateRoot, stateValue, partState]}
      title="Progress"
    >
      <div className="progress-demo-stage">
        <Progress.Root {...propsRoot}>
          <Progress.Label {...partProps['Progress.Label']}>
            Downloading
          </Progress.Label>
          <Progress.Value {...propsValue} />
          <Progress.Track {...partProps['Progress.Track']}>
            <Progress.Indicator {...partProps['Progress.Indicator']} />
          </Progress.Track>
        </Progress.Root>
        <ActivityIndicator {...partProps.ActivityIndicator}>
          Loading
        </ActivityIndicator>
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
        Work going on: a bar that fills as it advances (Base UI’s{' '}
        <code>Progress</code>), or, for work of unknown length, spinning spokes
        (
        <PartLink
          component="progress"
          part="ActivityIndicator"
        />
        ).
      </li>
      <li>
        So there are two progress indicators: a progress bar and an activity
        indicator.
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
        A bar: for work whose share done is known (a download, an import), so
        people can tell how long is left.
      </li>
      <li>
        An activity indicator: for work of unknown length (loading, connecting),
        where it happens (a row, a page’s content).
      </li>
      <li>
        Show them only while the work runs. Once it’s done, remove them (or show
        the bar full).
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
        A value to set: use a <a href={publicUrl('slider')}>Slider</a> (an
        editable bar).
      </li>
      <li>
        A count of something new waiting: use a{' '}
        <a href={publicUrl('badge')}>Badge</a>.
      </li>
      <li>
        A bar of unknown length (Base UI’s indeterminate one): prefer an
        activity indicator.
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
        All props of all parts are on the{' '}
        <a href={publicUrl('progress/parts')}>Parts</a> page.
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
        Both have the <code>progressbar</code> role. The bar has its value (
        <code>aria-valuenow</code>, read as its formatted value:{' '}
        <code>format</code>, <code>getAriaValueText</code>). An activity
        indicator has none, since it’s indeterminate.
      </li>
      <li>
        Its label names it (
        <PartLink
          component="progress"
          part="Progress.Label"
        />
        , or an activity indicator’s children). Without one, give it an{' '}
        <code>aria-label</code>.
      </li>
      <li>
        A momentary tooltip makes the bar focusable, so keyboard users can read
        it too.
      </li>
      <li>
        The spinner doesn’t follow <code>prefers-reduced-motion</code>, but it
        can be stopped (<code>display</code>).
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
        The bar fills its container (at least 120px, like a slider’s, with a
        label or value before or after it on its line), and is 6px tall. At 0%,
        it’s a dot. Its fill grows to a new value over 200ms (at once with{' '}
        <code>prefers-reduced-motion</code>).
      </li>
      <li>
        Its label and value sit above it by default, with the label at the
        line’s start and the value at its end (whichever comes first in the
        markup).
      </li>
      <li>
        The activity indicator turns once a second, one spoke at a time. When
        stopped, it rests at once, freezes where it is, or finishes its turn
        first. Or it hides, at once or once finished (<code>display</code>),
        taking no room.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const progressOverviewDemos = [LiveView];
