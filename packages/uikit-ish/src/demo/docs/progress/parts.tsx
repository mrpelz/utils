import './style.css';

import { FunctionComponent, useMemo } from 'react';

import { ActivityIndicator, Progress } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import {
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
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
    { external, isOpen: true, emphasize: 'outline', title: 'Progress.Root' },
  );

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Progress.Indicator': [],
          'Progress.Label': [],
          'Progress.Track': [],
          'Progress.Value': [],
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
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Progress.Root"
    >
      <div className="progress-demo-stage">
        <Progress.Root
          key={elementKey}
          {...props}
        >
          <Progress.Label {...partProps['Progress.Label']}>
            Downloading
          </Progress.Label>
          <Progress.Value {...partProps['Progress.Value']} />
          <Progress.Track {...partProps['Progress.Track']}>
            <Progress.Indicator {...partProps['Progress.Indicator']} />
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
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Progress.Track',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Progress.Indicator': [],
          'Progress.Root': ['aria-label', 'value'],
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
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Progress.Track"
    >
      <div className="progress-demo-stage">
        <Progress.Root
          {...partProps['Progress.Root']}
          aria-label="Downloading"
          value={40}
        >
          <Progress.Track {...props}>
            <Progress.Indicator {...partProps['Progress.Indicator']} />
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
  const [control, props, state] = usePropControl(propOptionsPart, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Progress.Indicator',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Progress.Root': ['aria-label', 'value'],
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
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Progress.Indicator"
    >
      <div className="progress-demo-stage">
        <Progress.Root
          {...partProps['Progress.Root']}
          aria-label="Downloading"
          value={40}
        >
          <Progress.Track {...partProps['Progress.Track']}>
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
  const [control, props, state] = usePropControl(propOptionsGuideLabel, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Progress.Label',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Progress.Indicator': [],
          'Progress.Root': ['value'],
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
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Progress.Label"
    >
      <div className="progress-demo-stage">
        <Progress.Root
          {...partProps['Progress.Root']}
          value={40}
        >
          <Progress.Label {...props} />
          <Progress.Track {...partProps['Progress.Track']}>
            <Progress.Indicator {...partProps['Progress.Indicator']} />
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
  const [control, props, state] = usePropControl(propOptionsGuideValue, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Progress.Value',
  });

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps({
          'Progress.Indicator': [],
          'Progress.Root': ['aria-label', 'value'],
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
      controls={[control, partControls]}
      id={id}
      state={[state, partState]}
      title="Progress.Value"
    >
      <div className="progress-demo-stage">
        <Progress.Root
          {...partProps['Progress.Root']}
          aria-label="Downloading"
          value={40}
        >
          <Progress.Value {...props} />
          <Progress.Track {...partProps['Progress.Track']}>
            <Progress.Indicator {...partProps['Progress.Indicator']} />
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
  const [control, props, state] = usePropControl(propOptionsIndicator, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'ActivityIndicator',
  });

  return (
    <Component
      isCentered
      isInline
      baseUiId="progress"
      controls={[control]}
      id={id}
      state={[state]}
      title="ActivityIndicator"
    >
      <ActivityIndicator
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
      <li>A bar: Base UI’s Progress, which always needs its track and fill.</li>
      <li>
        Its label and value are optional, and each places itself with its own
        prop.
      </li>
      <li>An activity indicator: one element of its own.</li>
    </ul>
    <ul className="demo-tree">
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
      <li>The bar, with its label and value laid out around its track.</li>
      <li>
        Its state: <code>value</code>, between <code>min</code> and{' '}
        <code>max</code> (<code>null</code> means indeterminate).
      </li>
      <li>
        Its formatting: <code>format</code>, <code>locale</code> and{' '}
        <code>getAriaValueText</code>.
      </li>
      <li>
        Its look: <code>tint</code> (for the fill).
      </li>
      <li>
        Renders a <code>div</code> with the <code>progressbar</code> role, named
        by its label (without one, by <code>aria-label</code>).
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
        The track: 6px tall, rounded, in the system fill. It’s at least 120px
        long (like a slider’s), and takes the line’s free space.
      </li>
      <li>It holds the indicator.</li>
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
        The fill, from the track’s start, in the root’s <code>tint</code>. At
        0%, it’s a dot.
      </li>
      <li>When indeterminate, it’s a third of the track, sliding along it.</li>
      <li>A value’s tooltip points at its end.</li>
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
      <li>What’s in progress. It names the bar.</li>
      <li>
        Its place (<code>placement</code>): above (by default) or below the
        track, at the line’s start (before the value, whichever comes first in
        the markup), or before or after the track.
      </li>
      <li>In Subheadline, in the secondary label color.</li>
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
        The value, formatted by the root’s <code>format</code>, or by its
        children, as a function.
      </li>
      <li>
        Its place (<code>placement</code>): above (by default) or below the
        track, at the line’s end (also on its own), before or after the track,
        or in a tooltip at the fill’s end, always or only momentarily.
      </li>
      <li>
        In a tooltip, it’s a glass capsule (see{' '}
        <a href={publicUrl('tooltip')}>Tooltip</a>).
      </li>
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
        Spinning spokes, for work of unknown length. It’s an indeterminate{' '}
        <PartLink
          component="progress"
          part="Progress.Root"
        />{' '}
        of its own, without parts.
      </li>
      <li>
        Its look: <code>size</code>, <code>movement</code>,{' '}
        <code>duration</code> and <code>color</code>. Whether it spins, stops or
        hides, and how: <code>display</code>.
      </li>
      <li>
        Its children are a label after it, which names it (without one, use an{' '}
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
