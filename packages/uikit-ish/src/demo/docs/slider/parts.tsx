import { Slider as BaseSlider } from '@base-ui/react/slider';
import { sfSunMax } from '@bradleyhodges/sfsymbols/sfSunMax';
import { sfSunMin } from '@bradleyhodges/sfsymbols/sfSunMin';
import { FunctionComponent, useMemo } from 'react';

import { Slider, Symbol } from '../../../components/index.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import {
  commonPropOptions,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
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
  getPropOptionsGuideThumb,
  getPropOptionsMinSymbol,
  getPropOptionsRoot,
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
    { external, isOpen: true, emphasize: 'outline', title: 'Slider.Root' },
  );
  // (A range, by its values: a thumb for each.)
  const isRange = Array.isArray(props.value ?? props.defaultValue);

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
              aria-label={isRange ? 'Minimum brightness' : 'Brightness'}
              index={0}
            />
            {isRange ? (
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
  const [control, props, state] = usePropControl(propOptionsLabel, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Slider.Label',
  });

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
  const [control, props, state] = usePropControl(propOptionsValue, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Slider.Value',
  });

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
  const [control, props, state] = usePropControl(commonPropOptions, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Slider.Control',
  });

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
  const [control, props, state] = usePropControl(commonPropOptions, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Slider.Track',
  });

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
  const [control, props, state] = usePropControl(commonPropOptions, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Slider.Indicator',
  });

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
    useMemo(() => getPropOptionsGuideThumb(addLog), [addLog]),
    { external, isOpen: true, emphasize: 'outline', title: 'Slider.Thumb' },
  );

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
            <Slider.Thumb {...props} />
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
  const [control, props, state, elementKey] = usePropControl(propOptionsTicks, {
    external,
    isOpen: true,
    emphasize: 'outline',
    title: 'Slider.Ticks',
  });

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
    { external, isOpen: true, emphasize: 'outline', title: 'Slider.Symbol' },
  );

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
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
    <ul className="demo-lead">
      <li>
        <PartLink
          component="slider"
          part="Slider.Root"
        />
        : holds the value.
      </li>
      <li>
        <PartLink
          component="slider"
          part="Slider.Control"
        />
        : the area taking presses and drags.
      </li>
      <li>
        In it,{' '}
        <PartLink
          component="slider"
          part="Slider.Track"
        />
        : its fill (
        <PartLink
          component="slider"
          part="Slider.Indicator"
        />
        ) and a knob (
        <PartLink
          component="slider"
          part="Slider.Thumb"
        />
        ) per value.
      </li>
      <li>
        Optional, around them: a label, the value, the ends’ symbols. On the
        track: ticks.
      </li>
    </ul>
    <ul>
      <li>
        <PartLink
          component="slider"
          part="Slider.Root"
        />
        <ul>
          <li>
            <PartLink
              component="slider"
              part="Slider.Label"
            />{' '}
            (optional)
          </li>
          <li>
            <PartLink
              component="slider"
              part="Slider.Value"
            />{' '}
            (optional)
          </li>
          <li>
            <PartLink
              component="slider"
              part="Slider.Symbol"
            />{' '}
            (optional, at the minimum’s end)
          </li>
          <li>
            <PartLink
              component="slider"
              part="Slider.Control"
            />
            <ul>
              <li>
                <PartLink
                  component="slider"
                  part="Slider.Track"
                />
                <ul>
                  <li>
                    <PartLink
                      component="slider"
                      part="Slider.Indicator"
                    />
                  </li>
                  <li>
                    <PartLink
                      component="slider"
                      part="Slider.Ticks"
                    />{' '}
                    (optional)
                  </li>
                  <li>
                    <PartLink
                      component="slider"
                      part="Slider.Thumb"
                    />{' '}
                    (one, or two for a range)
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="slider"
              part="Slider.Symbol"
            />{' '}
            (optional, at the maximum’s end)
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="slider-root"
      level={2}
    >
      <code>Slider.Root</code>
    </Heading>
    <ul>
      <li>Base UI’s slider root.</li>
      <li>
        Value: <code>value</code> or <code>defaultValue</code> (a number, or an
        array of them for a range).
      </li>
      <li>
        Bounds and steps: <code>min</code>, <code>max</code>, <code>step</code>,{' '}
        <code>largeStep</code>.
      </li>
      <li>
        Formatting: <code>format</code>, <code>locale</code>.
      </li>
      <li>
        The fill’s <code>tint</code>.
      </li>
      <li>Lays out its children in a row; the track takes the space left.</li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={sliderRootRows} />

    <Heading
      id="slider-label"
      level={2}
    >
      <code>Slider.Label</code>
    </Heading>
    <ul>
      <li>
        Base UI’s label: names the slider’s inputs (<code>aria-labelledby</code>
        ); the knob needs no <code>aria-label</code>.
      </li>
      <li>Body text style.</li>
      <li>
        Where it is among the parts, or by <code>placement</code>: before or
        after them all, or on a line above or below.
      </li>
    </ul>
    <LabelPart />
    <h3>Props</h3>
    <PropsTable rows={sliderLabelRows} />

    <Heading
      id="slider-value"
      level={2}
    >
      <code>Slider.Value</code>
    </Heading>
    <ul>
      <li>
        Base UI’s value (an <code>output</code>): the formatted value, or what
        its function child makes of it.
      </li>
      <li>Tabular numerals, as wide as its widest value.</li>
      <li>
        Placed as the label (at the line’s end, above or below), or in a tooltip
        on each knob, always or momentarily.
      </li>
    </ul>
    <ValuePart />
    <h3>Props</h3>
    <PropsTable rows={sliderValueRows} />

    <Heading
      id="slider-control"
      level={2}
    >
      <code>Slider.Control</code>
    </Heading>
    <ul>
      <li>Base UI’s control: the area taking presses and drags.</li>
      <li>
        As high as the knob (28px), at least 120px long, filling the root.
      </li>
    </ul>
    <ControlPart />
    <h3>Props</h3>
    <PropsTable rows={sliderControlRows} />

    <Heading
      id="slider-track"
      level={2}
    >
      <code>Slider.Track</code>
    </Heading>
    <ul>
      <li>
        Base UI’s track: the 6px bar, in a fill color (<code>systemFill</code>).
      </li>
      <li>Holds the fill, the ticks and the knobs.</li>
    </ul>
    <TrackPart />
    <h3>Props</h3>
    <PropsTable rows={sliderTrackRows} />

    <Heading
      id="slider-indicator"
      level={2}
    >
      <code>Slider.Indicator</code>
    </Heading>
    <ul>
      <li>
        Base UI’s indicator: the fill in the tint, from the minimum to the value
        (between the values, for a range).
      </li>
      <li>Placed by the value: spans the whole track at the maximum.</li>
    </ul>
    <IndicatorPart />
    <h3>Props</h3>
    <PropsTable rows={sliderIndicatorRows} />

    <Heading
      id="slider-thumb"
      level={2}
    >
      <code>Slider.Thumb</code>
    </Heading>
    <ul>
      <li>
        Base UI’s thumb: the knob, holding the hidden range input that gets
        focus and keys.
      </li>
      <li>
        A range: two, by <code>index</code>, each named (<code>aria-label</code>
        ) for what it sets.
      </li>
    </ul>
    <ThumbPart />
    <h3>Props</h3>
    <PropsTable rows={sliderThumbRows} />

    <Heading
      id="slider-ticks"
      level={2}
    >
      <code>Slider.Ticks</code>
    </Heading>
    <ul>
      <li>
        Tick marks inside the track, one per each of the <code>count</code>{' '}
        values between the ends.
      </li>
      <li>
        Where the fill ends at them; match the root’s <code>step</code> to them.
      </li>
      <li>Hidden from assistive technology.</li>
    </ul>
    <TicksPart />
    <h3>Props</h3>
    <PropsTable rows={sliderTicksRows} />

    <Heading
      id="slider-symbol"
      level={2}
    >
      <code>Slider.Symbol</code>
    </Heading>
    <ul>
      <li>
        A symbol (or text) for an end, by its <code>edge</code>.
      </li>
      <li>Clicking it moves the knob to that end.</li>
    </ul>
    <SymbolPart />
    <h3>Props</h3>
    <PropsTable rows={sliderSymbolRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sliderPartsDemos = [
  RootPart,
  LabelPart,
  ValuePart,
  ControlPart,
  TrackPart,
  IndicatorPart,
  ThumbPart,
  TicksPart,
  SymbolPart,
];
