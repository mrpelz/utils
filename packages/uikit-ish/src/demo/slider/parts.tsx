import { Slider as BaseSlider } from '@base-ui/react/slider';
import { sfSunMax } from '@bradleyhodges/sfsymbols/sfSunMax';
import { sfSunMin } from '@bradleyhodges/sfsymbols/sfSunMin';
import { FunctionComponent, useMemo } from 'react';

import { Slider, Symbol } from '../../components/index.js';
import { AddLog, useLog } from '../utils/log.js';
import { commonPropOptions, Component, usePropControl } from '../utils/main.js';
import {
  useCreateStateUrl,
  useProvidedState,
} from '../utils/options-context.js';
import { PropsTable } from '../utils/props-table.js';
import {
  sliderControlRows,
  sliderIndicatorRows,
  sliderLabelRows,
  sliderRootRows,
  sliderSymbolRows,
  sliderThumbRows,
  sliderTicksRows,
  sliderTrackRows,
  sliderValueRows,
} from './docs.js';
import {
  getPropOptionsMinSymbol,
  getPropOptionsRoot,
  getPropOptionsThumb,
  propOptionsLabel,
  propOptionsTicks,
  propOptionsValue,
} from './props.js';

// Every view writes out its slider (Brightness, between its symbols), the
// part's props on it (on the first thumb, or the minimum's symbol), so its
// code shows as it'd be used.

const logCommit =
  (addLog: AddLog) =>
  (
    value: number | readonly number[],
    { reason }: BaseSlider.Root.CommitEventDetails,
  ) =>
    addLog(`value committed: ${String(value)}/${reason}`);

/** `Slider.Root`, outlined, with its props. */
const RootPart: FunctionComponent = () => {
  const id = 'slider-parts-root';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(() => getPropOptionsRoot(addLog), [addLog]),
    'Slider.Root',
    external,
    true,
    true,
  );
  // (A range, by its values: a thumb for each.)
  const range = Array.isArray(props.value ?? props.defaultValue);

  return (
    <Component
      center
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="Slider.Root"
    >
      <Slider.Root
        key={elementKey}
        {...props}
      >
        <Slider.Symbol edge="min">
          <Symbol icon={sfSunMin} />
        </Slider.Symbol>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb
              aria-label={range ? 'Minimum brightness' : 'Brightness'}
              index={0}
            />
            {range ? (
              <Slider.Thumb
                aria-label="Maximum brightness"
                index={1}
              />
            ) : null}
          </Slider.Track>
        </Slider.Control>
        <Slider.Symbol edge="max">
          <Symbol icon={sfSunMax} />
        </Slider.Symbol>
      </Slider.Root>
    </Component>
  );
};

/** `Slider.Label`, outlined, with its props. */
const LabelPart: FunctionComponent = () => {
  const id = 'slider-parts-label';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsLabel,
    'Slider.Label',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="Slider.Label"
    >
      <Slider.Root
        defaultValue={60}
        onValueCommitted={logCommit(addLog)}
      >
        <Slider.Label {...props}>Brightness</Slider.Label>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </Component>
  );
};

/** `Slider.Value`, outlined, with its props. */
const ValuePart: FunctionComponent = () => {
  const id = 'slider-parts-value';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    propOptionsValue,
    'Slider.Value',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="Slider.Value"
    >
      <Slider.Root
        defaultValue={60}
        onValueCommitted={logCommit(addLog)}
      >
        <Slider.Label>Brightness</Slider.Label>
        <Slider.Value {...props} />
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </Component>
  );
};

/** `Slider.Control`, outlined, with its props. */
const ControlPart: FunctionComponent = () => {
  const id = 'slider-parts-control';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    commonPropOptions,
    'Slider.Control',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="Slider.Control"
    >
      <Slider.Root
        defaultValue={60}
        onValueCommitted={logCommit(addLog)}
      >
        <Slider.Symbol edge="min">
          <Symbol icon={sfSunMin} />
        </Slider.Symbol>
        <Slider.Control {...props}>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb aria-label="Brightness" />
          </Slider.Track>
        </Slider.Control>
        <Slider.Symbol edge="max">
          <Symbol icon={sfSunMax} />
        </Slider.Symbol>
      </Slider.Root>
    </Component>
  );
};

/** `Slider.Track`, outlined, with its props. */
const TrackPart: FunctionComponent = () => {
  const id = 'slider-parts-track';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    commonPropOptions,
    'Slider.Track',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="Slider.Track"
    >
      <Slider.Root
        defaultValue={60}
        onValueCommitted={logCommit(addLog)}
      >
        <Slider.Symbol edge="min">
          <Symbol icon={sfSunMin} />
        </Slider.Symbol>
        <Slider.Control>
          <Slider.Track {...props}>
            <Slider.Indicator />
            <Slider.Thumb aria-label="Brightness" />
          </Slider.Track>
        </Slider.Control>
        <Slider.Symbol edge="max">
          <Symbol icon={sfSunMax} />
        </Slider.Symbol>
      </Slider.Root>
    </Component>
  );
};

/** `Slider.Indicator`, outlined, with its props. */
const IndicatorPart: FunctionComponent = () => {
  const id = 'slider-parts-indicator';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    commonPropOptions,
    'Slider.Indicator',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="Slider.Indicator"
    >
      <Slider.Root
        defaultValue={60}
        onValueCommitted={logCommit(addLog)}
      >
        <Slider.Symbol edge="min">
          <Symbol icon={sfSunMin} />
        </Slider.Symbol>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator {...props} />
            <Slider.Thumb aria-label="Brightness" />
          </Slider.Track>
        </Slider.Control>
        <Slider.Symbol edge="max">
          <Symbol icon={sfSunMax} />
        </Slider.Symbol>
      </Slider.Root>
    </Component>
  );
};

/** `Slider.Thumb` (the first of a range's two), outlined, with its props. */
const ThumbPart: FunctionComponent = () => {
  const id = 'slider-parts-thumb';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsThumb(addLog), [addLog]),
    'Slider.Thumb',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="Slider.Thumb"
    >
      <Slider.Root
        defaultValue={[25, 75]}
        onValueCommitted={logCommit(addLog)}
      >
        <Slider.Symbol edge="min">
          <Symbol icon={sfSunMin} />
        </Slider.Symbol>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb
              aria-label="Minimum brightness"
              index={0}
              {...props}
            />
            <Slider.Thumb
              aria-label="Maximum brightness"
              index={1}
            />
          </Slider.Track>
        </Slider.Control>
        <Slider.Symbol edge="max">
          <Symbol icon={sfSunMax} />
        </Slider.Symbol>
      </Slider.Root>
    </Component>
  );
};

/** `Slider.Ticks`, outlined, with its props. */
const TicksPart: FunctionComponent = () => {
  const id = 'slider-parts-ticks';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    propOptionsTicks,
    'Slider.Ticks',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="Slider.Ticks"
    >
      <Slider.Root
        key={elementKey}
        defaultValue={60}
        // (A tick for each step.)
        step={100 / (props.count - 1)}
        onValueCommitted={logCommit(addLog)}
      >
        <Slider.Symbol edge="min">
          <Symbol icon={sfSunMin} />
        </Slider.Symbol>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Ticks {...props} />
            <Slider.Thumb aria-label="Brightness" />
          </Slider.Track>
        </Slider.Control>
        <Slider.Symbol edge="max">
          <Symbol icon={sfSunMax} />
        </Slider.Symbol>
      </Slider.Root>
    </Component>
  );
};

/** `Slider.Symbol` (the minimum's), outlined, with its props. */
const SymbolPart: FunctionComponent = () => {
  const id = 'slider-parts-symbol';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
    useMemo(() => getPropOptionsMinSymbol(addLog), [addLog]),
    'Slider.Symbol',
    external,
    true,
    true,
  );

  return (
    <Component
      center
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      stateUrl={useCreateStateUrl(id, [state])}
      title="Slider.Symbol"
    >
      <Slider.Root
        defaultValue={60}
        onValueCommitted={logCommit(addLog)}
      >
        <Slider.Symbol {...props}>
          <Symbol icon={sfSunMin} />
        </Slider.Symbol>
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb aria-label="Brightness" />
          </Slider.Track>
        </Slider.Control>
        <Slider.Symbol edge="max">
          <Symbol icon={sfSunMax} />
        </Slider.Symbol>
      </Slider.Root>
    </Component>
  );
};

/** `/slider/parts`: a slider's parts, from the root to its ends' symbols. */
export const SliderParts: FunctionComponent = () => (
  <>
    <p className="demo-lead">
      A slider is a <code>Slider.Root</code> holding the value; a{' '}
      <code>Slider.Control</code>, the area that takes presses and drags; in it,
      the <code>Slider.Track</code>, with its fill (
      <code>Slider.Indicator</code>) and a knob (<code>Slider.Thumb</code>) for
      each value. Around them, optionally: a label, the value, and the ends’
      symbols; on the track, ticks.
    </p>
    <ul>
      <li>
        <code>Slider.Root</code>
        <ul>
          <li>
            <code>Slider.Label</code> (optional)
          </li>
          <li>
            <code>Slider.Value</code> (optional)
          </li>
          <li>
            <code>Slider.Symbol</code> (optional, at the minimum’s end)
          </li>
          <li>
            <code>Slider.Control</code>
            <ul>
              <li>
                <code>Slider.Track</code>
                <ul>
                  <li>
                    <code>Slider.Indicator</code>
                  </li>
                  <li>
                    <code>Slider.Ticks</code> (optional)
                  </li>
                  <li>
                    <code>Slider.Thumb</code> (one, or two for a range)
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <code>Slider.Symbol</code> (optional, at the maximum’s end)
          </li>
        </ul>
      </li>
    </ul>

    <h2>
      <code>Slider.Root</code>
    </h2>
    <p>
      Base UI’s slider root: the value (<code>value</code> or{' '}
      <code>defaultValue</code>, a number, or an array of them for a range), its
      bounds and steps (<code>min</code>, <code>max</code>, <code>step</code>,{' '}
      <code>largeStep</code>), its formatting (<code>format</code>,{' '}
      <code>locale</code>), and the fill’s <code>tint</code>. It lays out its
      children in a row, the track taking the space left.
    </p>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={sliderRootRows} />

    <h2>
      <code>Slider.Label</code>
    </h2>
    <p>
      Base UI’s label: it names the slider’s inputs (
      <code>aria-labelledby</code>), so the knob needs no{' '}
      <code>aria-label</code> of its own. In the Body text style, where it is
      among the parts, or by <code>placement</code>: before or after them all,
      or on a line above or below.
    </p>
    <LabelPart />
    <h3>Props</h3>
    <PropsTable rows={sliderLabelRows} />

    <h2>
      <code>Slider.Value</code>
    </h2>
    <p>
      Base UI’s value (an <code>output</code>): the formatted value, or what its
      function child makes of it, in tabular numerals, as wide as its widest
      value. Placed as the label is (at the line’s end above or below), or in a
      tooltip on each knob, always or momentarily.
    </p>
    <ValuePart />
    <h3>Props</h3>
    <PropsTable rows={sliderValueRows} />

    <h2>
      <code>Slider.Control</code>
    </h2>
    <p>
      Base UI’s control: the area that takes presses and drags, as high as the
      knob (28px), at least 120px long, growing to fill the root.
    </p>
    <ControlPart />
    <h3>Props</h3>
    <PropsTable rows={sliderControlRows} />

    <h2>
      <code>Slider.Track</code>
    </h2>
    <p>
      Base UI’s track: the 6px bar in a fill color (UIKit’s{' '}
      <code>systemFill</code>), holding the fill, the ticks and the knobs.
    </p>
    <TrackPart />
    <h3>Props</h3>
    <PropsTable rows={sliderTrackRows} />

    <h2>
      <code>Slider.Indicator</code>
    </h2>
    <p>
      Base UI’s indicator: the fill in the tint, from the minimum to the value
      (between the values, for a range). It’s placed by the value, so it spans
      the whole track at the maximum.
    </p>
    <IndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={sliderIndicatorRows} />

    <h2>
      <code>Slider.Thumb</code>
    </h2>
    <p>
      Base UI’s thumb: the knob, holding the hidden range input that gets the
      focus and the keys. A range has two, by <code>index</code>, each named (
      <code>aria-label</code>) for what it sets.
    </p>
    <ThumbPart />
    <h3>Props</h3>
    <PropsTable rows={sliderThumbRows} />

    <h2>
      <code>Slider.Ticks</code>
    </h2>
    <p>
      Tick marks (iOS 26) inside the track, one for each of the{' '}
      <code>count</code> values between the ends, where the fill ends at them;
      match the root’s <code>step</code> to them. Hidden from assistive
      technology.
    </p>
    <TicksPart />
    <h3>Props</h3>
    <PropsTable rows={sliderTicksRows} />

    <h2>
      <code>Slider.Symbol</code>
    </h2>
    <p>
      A symbol (or text) for an end (UIKit <code>minimumValueImage</code>,{' '}
      <code>maximumValueImage</code>), by its <code>edge</code>: clicking it
      moves the knob to that end.
    </p>
    <SymbolPart />
    <h3>Props</h3>
    <PropsTable rows={sliderSymbolRows} />
  </>
);
