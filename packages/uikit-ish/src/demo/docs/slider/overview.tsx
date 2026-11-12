import { Slider as BaseSlider } from '@base-ui/react/slider';
import { FunctionComponent, useMemo } from 'react';

import { Slider, Symbol } from '../../../components/index.js';
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
  const [control, content, state] = usePropControl(propOptionsOverviewContent, {
    external,
    isOpen: true,
    title: '[content]',
  });
  const [name, min, max] = symbolPairs[content.symbols ?? 'brightness'];

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Slider.Control': [],
            'Slider.Indicator': [],
            'Slider.Root': ['defaultValue', 'onValueCommitted', 'step'],
            'Slider.Symbol': ['edge'],
            'Slider.Thumb': ['aria-label'],
            'Slider.Ticks': ['count'],
            'Slider.Track': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[control, partControls]}
      id={id}
      log={log}
      state={[state, partState]}
      title="Slider"
    >
      <Slider.Root
        {...partProps['Slider.Root']}
        defaultValue={60}
        step={content.ticks ? 100 / (content.ticks - 1) : undefined}
        onValueCommitted={(
          value: number | readonly number[],
          { reason }: BaseSlider.Root.CommitEventDetails,
        ) => addLog(`value committed: ${String(value)}/${reason}`)}
      >
        {content.symbols ? (
          <Slider.Symbol
            {...partProps['Slider.Symbol']}
            edge="min"
          >
            <Symbol
              {...partProps.Symbol}
              icon={min}
            />
          </Slider.Symbol>
        ) : null}
        <Slider.Control {...partProps['Slider.Control']}>
          <Slider.Track {...partProps['Slider.Track']}>
            <Slider.Indicator {...partProps['Slider.Indicator']} />
            {content.ticks ? (
              <Slider.Ticks
                {...partProps['Slider.Ticks']}
                count={content.ticks}
              />
            ) : null}
            <Slider.Thumb
              {...partProps['Slider.Thumb']}
              aria-label={name}
            />
          </Slider.Track>
        </Slider.Control>
        {content.symbols ? (
          <Slider.Symbol
            {...partProps['Slider.Symbol']}
            edge="max"
          >
            <Symbol
              {...partProps.Symbol}
              icon={max}
            />
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
        track.
      </li>
      <li>The track fills with the tint up to the knob.</li>
      <li>
        Symbols at its ends can say what the ends mean, and ticks can mark its
        steps.
      </li>
      <li>It’s Base UI’s slider, with one knob, or two for a range.</li>
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
        For a value on a continuous scale, where the rough position matters more
        than the exact number: brightness, a playback position, a playback
        speed.
      </li>
      <li>
        For a range within bounds (for example a price from–to), with two knobs
        (see <a href={publicUrl('slider/composition')}>Composition</a>).
      </li>
      <li>
        With the minimum at the leading end and the maximum at the trailing end
        (when vertical, at the bottom and the top).
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
        An exact number, changed one step at a time: use a{' '}
        <a href={publicUrl('stepper')}>Stepper</a> (or pair a slider with a text
        field and a stepper when the exact value matters).
      </li>
      <li>
        One of a few named options: use a{' '}
        <a href={publicUrl('segmented')}>Segmented</a> control.
      </li>
      <li>
        A value that only shows progress, rather than one to set: use a{' '}
        <a href={publicUrl('progress')}>Progress</a> bar (a slider is an
        editable one).
      </li>
      <li>
        Audio volume: prefer the platform’s own volume control where there is
        one (see <a href={publicUrl('slider/composition')}>Composition</a>).
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most sliders set, across the parts.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('slider/parts')}>Parts</a> page.
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
        orientation), and the root is a <code>group</code>. With a{' '}
        <code>format</code>, the input’s <code>aria-valuetext</code> is the
        formatted value (without one, assistive technology reads the number). A
        range’s knobs add “start range” and “end range” (Base UI’s wording, in
        English whatever the <code>locale</code>). Set your own with{' '}
        <code>getAriaValueText</code>, for example for a time.
      </li>
      <li>
        Name every knob. A{' '}
        <PartLink
          component="slider"
          part="Slider.Label"
        />{' '}
        labels the inputs (<code>aria-labelledby</code>), or give each thumb an{' '}
        <code>aria-label</code> (a range’s two need different names, for example
        Minimum and Maximum). An <code>aria-label</code> on the root names only
        the group, not the inputs.
      </li>
      <li>
        Tab focuses a knob, with a ring in the tint. The arrow keys move it by a{' '}
        <code>step</code>, Shift plus an arrow key or Page Up/Page Down by a{' '}
        <code>largeStep</code>, and Home and End to the ends.
      </li>
      <li>
        The ticks and the value tooltips are hidden from assistive technology,
        and so are the glyphs of the ends’{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />
        s (text in a{' '}
        <PartLink
          component="slider"
          part="Slider.Symbol"
        />{' '}
        is read). The symbols aren’t focusable, since clicking them is only a
        pointer shortcut for Home and End.
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
        Dragging the knob, or pressing the track, moves the value. While
        pressed, the knob turns into a glass lens with a glow in the tint.{' '}
        <code>onValueChange</code> fires while it moves, and{' '}
        <code>onValueCommitted</code> once it’s released.
      </li>
      <li>Clicking an end’s symbol moves the knob to that end.</li>
      <li>
        The track takes the space the other parts leave, and is at least 120px
        long. The knob rests inside the track at its ends (
        <code>thumbAlignment</code> <code>edge</code>), and the fill spans the
        whole track at the maximum.
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
