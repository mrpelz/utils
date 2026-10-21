import { Slider as BaseSlider } from '@base-ui/react/slider';
import { FunctionComponent } from 'react';

import { Slider, Symbol } from '../../components/index.js';
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
import { symbolPairs } from './content.js';
import {
  sliderLabelRows,
  sliderRootRows,
  sliderSymbolRows,
  sliderThumbRows,
  sliderTicksRows,
  sliderValueRows,
} from './docs.js';
import { propOptionsOverviewContent } from './props.js';

/** A slider, with or without its ends' symbols and ticks. */
const LiveView: FunctionComponent = () => {
  const id = 'slider-overview';
  const [log, addLog] = useLog();
  const [external] = useProvidedState(id);
  const [control, content, state] = usePropControl(
    propOptionsOverviewContent,
    '[content]',
    external,
    true,
  );
  const [name, min, max] = symbolPairs[content.symbols ?? 'brightness'];

  return (
    <Component
      center
      inline
      stretch
      controls={[control]}
      id={id}
      log={log}
      state={[state]}
      title="Slider"
    >
      <Slider.Root
        defaultValue={60}
        step={content.ticks ? 100 / (content.ticks - 1) : undefined}
        onValueCommitted={(
          value: number | readonly number[],
          { reason }: BaseSlider.Root.CommitEventDetails,
        ) => addLog(`value committed: ${String(value)}/${reason}`)}
      >
        {content.symbols ? (
          <Slider.Symbol edge="min">
            <Symbol icon={min} />
          </Slider.Symbol>
        ) : null}
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            {content.ticks ? <Slider.Ticks count={content.ticks} /> : null}
            <Slider.Thumb aria-label={name} />
          </Slider.Track>
        </Slider.Control>
        {content.symbols ? (
          <Slider.Symbol edge="max">
            <Symbol icon={max} />
          </Slider.Symbol>
        ) : null}
      </Slider.Root>
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

/** `/slider`: what a slider is for, and its key props. */
export const SliderOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Sets a value between a minimum and a maximum by dragging a knob along a
        track (UIKit <code>UISlider</code>).
      </li>
      <li>The track fills with the tint up to the knob.</li>
      <li>
        Symbols at its ends can say what the ends mean; ticks can mark its
        steps.
      </li>
      <li>Base UI’s slider: one knob, or two for a range.</li>
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
        For a value on a continuous scale, where the approximate position
        matters more than the exact number: brightness, a playback position, a
        playback speed.
      </li>
      <li>
        For a range within bounds (e.g. a price from–to): two thumbs (see{' '}
        <a href="slider/composition">Composition</a>).
      </li>
      <li>
        With the minimum at the leading end and the maximum at the trailing end
        (vertically: at the bottom and top), as Apple’s HIG expects.
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
        An exact number, changed a step at a time: a{' '}
        <a href="stepper">Stepper</a> (Apple’s HIG suggests pairing a slider
        with a text field and a stepper when the exact value matters).
      </li>
      <li>
        One of a few named options: a <a href="segmented">Segmented</a> control.
      </li>
      <li>
        A value that only shows progress, not one to set: a{' '}
        <a href="progress">Progress</a> bar (guide{' '}
        <GuideLink to="indicator-continuum">§5</GuideLink>: a slider is an
        editable indicator).
      </li>
      <li>
        Audio volume on iOS: Apple’s HIG says to use the system’s volume view
        instead (see <a href="slider/composition">Composition</a>).
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most sliders set, across their parts.</li>
      <li>
        All parts’ props: <a href="slider/parts">Parts</a>.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        [
          'Slider.Root',
          pickRows(
            sliderRootRows,
            'value',
            'defaultValue',
            'onValueChange',
            'onValueCommitted',
            'min',
            'max',
            'step',
            'disabled',
            'format',
            'name',
            'tint',
          ),
        ],
        ['Slider.Thumb', pickRows(sliderThumbRows, 'index', 'aria-label')],
        ['Slider.Label', pickRows(sliderLabelRows, 'placement')],
        ['Slider.Value', pickRows(sliderValueRows, 'placement', 'children')],
        ['Slider.Ticks', pickRows(sliderTicksRows, 'count')],
        ['Slider.Symbol', pickRows(sliderSymbolRows, 'edge')],
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
        Each knob holds a visually hidden native range input (the{' '}
        <code>slider</code> role, with its minimum, maximum, value and
        orientation); the root is a <code>group</code>. The input’s{' '}
        <code>aria-valuetext</code> is, with a <code>format</code>, the
        formatted value (without one, assistive technology reads the number); a
        range’s thumbs add “start range” and “end range” (Base UI’s, in English
        whatever the <code>locale</code>). Set your own with{' '}
        <code>getAriaValueText</code>, e.g. a time.
      </li>
      <li>
        Name every knob: a{' '}
        <PartLink
          component="slider"
          part="Slider.Label"
        />{' '}
        labels the inputs (<code>aria-labelledby</code>), or give each thumb an{' '}
        <code>aria-label</code> (a range’s two need different names, e.g.
        Minimum and Maximum). An <code>aria-label</code> on the root names only
        the group, not the inputs.
      </li>
      <li>
        Keyboard: Tab focuses a knob, with a ring in the tint. Arrow keys move
        it a <code>step</code>, Shift + an arrow key or Page Up/Page Down a{' '}
        <code>largeStep</code>, Home and End to the ends.
      </li>
      <li>
        The ticks and the value tooltips are hidden from assistive technology,
        as are the glyphs of the ends’ <code>Symbol</code>s (text in a{' '}
        <PartLink
          component="slider"
          part="Slider.Symbol"
        />{' '}
        is read). The symbols aren’t focusable: clicking them is a pointer’s
        shortcut for Home and End.
      </li>
      <li>
        Its animations (the pressed knob’s lens, momentary tooltips) don’t
        follow <code>prefers-reduced-motion</code>.
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
        Dragging the knob, or pressing the track, moves the value; pressed, the
        knob turns into a glass lens with a glow in the tint.{' '}
        <code>onValueChange</code> fires while it moves,{' '}
        <code>onValueCommitted</code> once it’s released.
      </li>
      <li>Clicking an end’s symbol moves the knob to that end.</li>
      <li>
        The track takes the space left by the other parts, at least 120px long.
        The knob rests inside the track at its ends (<code>thumbAlignment</code>{' '}
        <code>edge</code>), and the fill spans the whole track at the maximum.
      </li>
      <li>
        <PartLink
          component="slider"
          part="Slider.Value"
        />{' '}
        reserves the width of its widest value, so the track doesn’t shift while
        the value changes.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sliderOverviewDemos = [LiveView];
