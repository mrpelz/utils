import './style.css';

import { FunctionComponent } from 'react';

import { ActivityIndicator, Progress } from '../../components/index.js';
import { Component } from '../frame/component.js';
import { usePropControl } from '../frame/prop-control.js';
import { useProvidedState } from '../frame/state.js';
import { PropsTable } from '../guide/props-table.js';
import { Heading, PartLink } from '../guide/sections.js';
import {
  activityIndicatorRows,
  progressIndicatorRows,
  progressLabelRows,
  progressRootRows,
  progressTrackRows,
  progressValueRows,
} from './docs.js';
import {
  propOptionsGuideLabel,
  propOptionsGuideRoot,
  propOptionsGuideValue,
  propOptionsIndicator,
  propOptionsPart,
} from './props.js';

/** `Progress.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'progress-parts-root';
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsGuideRoot,
    'Progress.Root',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      baseUiId="progress"
      controls={[control]}
      id={id}
      state={[state]}
      title="Progress.Root"
    >
      <div className="progress-demo-stage">
        <Progress.Root
          key={elementKey}
          {...props}
        >
          <Progress.Label>Downloading</Progress.Label>
          <Progress.Value />
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      </div>
    </Component>
  );
};

/** `Progress.Track`, outlined, with its props. */
const TrackPart: FunctionComponent = () => {
  const id = 'progress-parts-track';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsPart,
    'Progress.Track',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      baseUiId="progress"
      controls={[control]}
      id={id}
      state={[state]}
      title="Progress.Track"
    >
      <div className="progress-demo-stage">
        <Progress.Root
          aria-label="Downloading"
          value={40}
        >
          <Progress.Track {...props}>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      </div>
    </Component>
  );
};

/** `Progress.Indicator`, outlined, with its props. */
const IndicatorPart: FunctionComponent = () => {
  const id = 'progress-parts-indicator';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsPart,
    'Progress.Indicator',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      baseUiId="progress"
      controls={[control]}
      id={id}
      state={[state]}
      title="Progress.Indicator"
    >
      <div className="progress-demo-stage">
        <Progress.Root
          aria-label="Downloading"
          value={40}
        >
          <Progress.Track>
            <Progress.Indicator {...props} />
          </Progress.Track>
        </Progress.Root>
      </div>
    </Component>
  );
};

/** `Progress.Label`, outlined, with its props. */
const LabelPart: FunctionComponent = () => {
  const id = 'progress-parts-label';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideLabel,
    'Progress.Label',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      baseUiId="progress"
      controls={[control]}
      id={id}
      state={[state]}
      title="Progress.Label"
    >
      <div className="progress-demo-stage">
        <Progress.Root value={40}>
          <Progress.Label {...props} />
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      </div>
    </Component>
  );
};

/** `Progress.Value`, outlined, with its props. */
const ValuePart: FunctionComponent = () => {
  const id = 'progress-parts-value';
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsGuideValue,
    'Progress.Value',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      baseUiId="progress"
      controls={[control]}
      id={id}
      state={[state]}
      title="Progress.Value"
    >
      <div className="progress-demo-stage">
        <Progress.Root
          aria-label="Downloading"
          value={40}
        >
          <Progress.Value {...props} />
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      </div>
    </Component>
  );
};

/** `ActivityIndicator`, outlined, with its props. */
const ActivityIndicatorPart: FunctionComponent = () => {
  const id = 'progress-parts-activity-indicator';
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsIndicator,
    'ActivityIndicator',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      baseUiId="progress"
      controls={[control]}
      id={id}
      state={[state]}
      title="ActivityIndicator"
    >
      <ActivityIndicator
        key={elementKey}
        aria-label={props.children === undefined ? 'Loading' : undefined}
        {...props}
      />
    </Component>
  );
};

/** `/progress/parts`: the bar's parts, and the activity indicator. */
export const ProgressParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>A bar: Base UI’s Progress, its track and fill always needed.</li>
      <li>Its label and value: optional, placed by their own prop.</li>
      <li>An activity indicator: one element of its own.</li>
    </ul>
    <ul>
      <li>
        <PartLink part="Progress.Root" />
        <ul>
          <li>
            <PartLink part="Progress.Label" /> (optional)
          </li>
          <li>
            <PartLink part="Progress.Value" /> (optional)
          </li>
          <li>
            <PartLink part="Progress.Track" />
            <ul>
              <li>
                <PartLink part="Progress.Indicator" />
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <PartLink part="ActivityIndicator" />
      </li>
    </ul>

    <Heading
      id="progress-root"
      level={2}
    >
      <code>Progress.Root</code>
    </Heading>
    <ul>
      <li>The bar, its label and value laid out around its track.</li>
      <li>
        State: <code>value</code> (between <code>min</code> and <code>max</code>
        ; <code>null</code>: indeterminate).
      </li>
      <li>
        Formatting: <code>format</code>, <code>locale</code>,{' '}
        <code>getAriaValueText</code>.
      </li>
      <li>
        Look: <code>tint</code> (the fill).
      </li>
      <li>
        Renders a <code>div</code> with the <code>progressbar</code> role, named
        by its label (without one: <code>aria-label</code>).
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={progressRootRows} />

    <Heading
      id="progress-track"
      level={2}
    >
      <code>Progress.Track</code>
    </Heading>
    <ul>
      <li>
        The track: 6px high, rounded, in the system fill; at least 280px long,
        taking the line’s free space.
      </li>
      <li>Holds the indicator.</li>
    </ul>
    <TrackPart />
    <h3>Props</h3>
    <PropsTable rows={progressTrackRows} />

    <Heading
      id="progress-indicator"
      level={2}
    >
      <code>Progress.Indicator</code>
    </Heading>
    <ul>
      <li>
        The fill, from the track’s start, in the root’s <code>tint</code>; at
        0%, a dot.
      </li>
      <li>Indeterminate, a third of the track sliding along it.</li>
      <li>Its end is where a value’s tooltip points.</li>
    </ul>
    <IndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={progressIndicatorRows} />

    <Heading
      id="progress-label"
      level={2}
    >
      <code>Progress.Label</code>
    </Heading>
    <ul>
      <li>What’s in progress; names the bar.</li>
      <li>
        Where: <code>placement</code>; above (by default) or below the track, at
        the line’s start (before the value, whichever comes first in the
        markup), or before or after the track.
      </li>
      <li>Subheadline, in the secondary label color.</li>
    </ul>
    <LabelPart />
    <h3>Props</h3>
    <PropsTable rows={progressLabelRows} />

    <Heading
      id="progress-value"
      level={2}
    >
      <code>Progress.Value</code>
    </Heading>
    <ul>
      <li>
        The value, formatted (by the root’s <code>format</code>; or by its
        children, a function).
      </li>
      <li>
        Where: <code>placement</code>; above (by default) or below the track, at
        the line’s end (also alone), before or after the track; or in a tooltip
        at the fill’s end, always or momentary.
      </li>
      <li>In a tooltip, iOS 26’s glass capsule (see Tooltip).</li>
    </ul>
    <ValuePart />
    <h3>Props</h3>
    <PropsTable rows={progressValueRows} />

    <Heading
      id="activityindicator"
      level={2}
    >
      <code>ActivityIndicator</code>
    </Heading>
    <ul>
      <li>
        Spinning spokes, for work of unknown length (an indeterminate{' '}
        <code>Progress.Root</code> of its own: no parts).
      </li>
      <li>
        Look: <code>size</code>, <code>movement</code>, <code>duration</code>,{' '}
        <code>color</code>; stopped: <code>animating</code>.
      </li>
      <li>
        Its children a label after it, naming it (without: an{' '}
        <code>aria-label</code>).
      </li>
    </ul>
    <ActivityIndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={activityIndicatorRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const progressPartsDemos = [
  RootPart,
  TrackPart,
  IndicatorPart,
  LabelPart,
  ValuePart,
  ActivityIndicatorPart,
];
