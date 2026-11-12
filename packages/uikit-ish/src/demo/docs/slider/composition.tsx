import './style.css';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import { FunctionComponent, useEffect, useMemo, useState } from 'react';

import {
  Button,
  Field,
  Form,
  forwardClick,
  List,
  Slider,
  Switch,
  Symbol,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import {
  sfBackwardFill,
  sfForwardFill,
  sfPauseFill,
  sfPlayFill,
  sfSpeakerFill,
  sfSpeakerWave3Fill,
  sfSunMax,
  sfSunMin,
} from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { time } from './content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const settingsCode = `<List.Section>
  <List.Header prominence="nested">
    <List.Title>Brightness</List.Title>
  </List.Header>
  <List.Group>
    <List.Item>
      <List.Span>
        <Slider.Root
          defaultValue={60}
          onValueChange={(value) => …}
        >
          <Slider.Symbol edge="min">
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
      </List.Span>
    </List.Item>
    <List.Item onClick={forwardClick('[role=switch]')}>
      <List.Content>
        <List.Title>True Tone</List.Title>
      </List.Content>
      <List.Trailing>
        <Switch.Root aria-label="True Tone">
          <Switch.Thumb />
        </Switch.Root>
      </List.Trailing>
    </List.Item>
  </List.Group>
</List.Section>`;

const rangeCode = `<Slider.Root
  defaultValue={[40, 120]}
  format={{ currency: 'EUR', maximumFractionDigits: 0, style: 'currency' }}
  max={200}
  minStepsBetweenValues={2}
  step={10}
  thumbCollisionBehavior="none"
>
  <Slider.Label placement="block-start">Price</Slider.Label>
  <Slider.Value placement="block-start" />
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb
        aria-label="Minimum price"
        index={0}
      />
      <Slider.Thumb
        aria-label="Maximum price"
        index={1}
      />
    </Slider.Track>
  </Slider.Control>
</Slider.Root>`;

const formCode = `<Form onFormSubmit={(values) => …}>
  <Field.Root name="brightness">
    <Slider.Root
      defaultValue={60}
      format={{ style: 'unit', unit: 'percent' }}
    >
      <Slider.Label placement="block-start">Brightness</Slider.Label>
      <Slider.Value placement="block-start" />
      <Slider.Control>…</Slider.Control>
    </Slider.Root>
  </Field.Root>
  <Field.Root name="speed">
    <Slider.Root
      defaultValue={1}
      max={2}
      min={0.5}
      step={0.25}
    >
      <Slider.Label>Speed</Slider.Label>
      <Slider.Control>…</Slider.Control>
      <Slider.Value>
        {(formattedValues) => \`\${formattedValues[0]}×\`}
      </Slider.Value>
    </Slider.Root>
  </Field.Root>
  <Button.Root type="submit">…</Button.Root>
</Form>`;

const mediaCode = `// The track's length (seconds), as m:ss; the player's seeking.
const duration = 245;
const time = (seconds) =>
  \`\${Math.floor(seconds / 60)}:\${String(Math.floor(seconds % 60)).padStart(2, '0')}\`;
const seek = (seconds) => {…};

const [position, setPosition] = useState(0);
// Playback moves the knob, but not while it's dragged.
const [isScrubbing, setIsScrubbing] = useState(false);

<Slider.Root
  max={duration}
  value={position}
  onValueChange={(value, { reason }) => {
    setIsScrubbing(reason === 'drag');
    setPosition(value);
  }}
  onValueCommitted={(value) => {
    setIsScrubbing(false);
    seek(value);
  }}
>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
      <Slider.Thumb
        aria-label="Position"
        getAriaValueText={(_, value) => \`\${time(value)} of \${time(duration)}\`}
      />
    </Slider.Track>
  </Slider.Control>
  {/* Elapsed at the line's start, remaining at its end. */}
  <Slider.Value placement="block-end">
    {(_, [value]) => time(value)}
  </Slider.Value>
  <Slider.Value placement="block-end">
    {(_, [value]) => \`−\${time(duration - value)}\`}
  </Slider.Value>
</Slider.Root>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const duration = 214;

/** Display settings: the brightness, and a switch. */
const SettingsRow: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'List.Content': [],
            'List.Group': [],
            'List.Header': ['prominence'],
            'List.Item': ['onClick'],
            'List.Root': [],
            'List.Section': [],
            'List.Span': [],
            'List.Title': [],
            'List.Trailing': [],
            'Slider.Control': [],
            'Slider.Indicator': [],
            'Slider.Root': ['defaultValue', 'onValueChange'],
            'Slider.Symbol': ['edge'],
            'Slider.Thumb': ['aria-label'],
            'Slider.Track': [],
            'Switch.Root': ['aria-label', 'defaultChecked', 'onCheckedChange'],
            'Switch.Thumb': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('slider-composition-settings') },
  );

  return (
    <Component
      isInline
      isStretched
      controls={[partControls]}
      id="slider-composition-settings"
      log={log}
      state={[partState]}
      title="Slider in a list row"
    >
      <List.Root {...partProps['List.Root']}>
        <List.Section {...partProps['List.Section']}>
          <List.Header
            {...partProps['List.Header']}
            prominence="nested"
          >
            <List.Title {...partProps['List.Title']}>Brightness</List.Title>
          </List.Header>
          <List.Group {...partProps['List.Group']}>
            <List.Item {...partProps['List.Item']}>
              <List.Span {...partProps['List.Span']}>
                <Slider.Root
                  {...partProps['Slider.Root']}
                  defaultValue={60}
                  onValueChange={(value: number | readonly number[]) =>
                    addLog(`brightness: ${String(value)}`)
                  }
                >
                  <Slider.Symbol
                    {...partProps['Slider.Symbol']}
                    edge="min"
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSunMin}
                    />
                  </Slider.Symbol>
                  <Slider.Control {...partProps['Slider.Control']}>
                    <Slider.Track {...partProps['Slider.Track']}>
                      <Slider.Indicator {...partProps['Slider.Indicator']} />
                      <Slider.Thumb
                        {...partProps['Slider.Thumb']}
                        aria-label="Brightness"
                      />
                    </Slider.Track>
                  </Slider.Control>
                  <Slider.Symbol
                    {...partProps['Slider.Symbol']}
                    edge="max"
                  >
                    <Symbol
                      {...partProps.Symbol}
                      icon={sfSunMax}
                    />
                  </Slider.Symbol>
                </Slider.Root>
              </List.Span>
            </List.Item>
            <List.Item
              {...partProps['List.Item']}
              onClick={forwardClick('[role=switch]')}
            >
              <List.Content {...partProps['List.Content']}>
                <List.Title {...partProps['List.Title']}>True Tone</List.Title>
              </List.Content>
              <List.Trailing {...partProps['List.Trailing']}>
                <Switch.Root
                  {...partProps['Switch.Root']}
                  defaultChecked
                  aria-label="True Tone"
                  onCheckedChange={(isChecked: boolean) =>
                    addLog(`true tone: ${String(isChecked)}`)
                  }
                >
                  <Switch.Thumb {...partProps['Switch.Thumb']} />
                </Switch.Root>
              </List.Trailing>
            </List.Item>
          </List.Group>
        </List.Section>
      </List.Root>
    </Component>
  );
};

/** A price range, its two ends named. */
const Range: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Slider.Control': [],
            'Slider.Indicator': [],
            'Slider.Label': ['placement'],
            'Slider.Root': [
              'defaultValue',
              'format',
              'max',
              'minStepsBetweenValues',
              'onValueCommitted',
              'step',
              'thumbCollisionBehavior',
            ],
            'Slider.Thumb': ['aria-label', 'index'],
            'Slider.Track': [],
            'Slider.Value': ['placement'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('slider-composition-range') },
  );

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[partControls]}
      id="slider-composition-range"
      log={log}
      state={[partState]}
      title="Slider with a range"
    >
      <Slider.Root
        {...partProps['Slider.Root']}
        defaultValue={[40, 120]}
        max={200}
        minStepsBetweenValues={2}
        step={10}
        thumbCollisionBehavior="none"
        format={{
          currency: 'EUR',
          maximumFractionDigits: 0,
          style: 'currency',
        }}
        onValueCommitted={(value: number | readonly number[]) =>
          addLog(`price: ${String(value)}`)
        }
      >
        <Slider.Label
          {...partProps['Slider.Label']}
          placement="block-start"
        >
          Price
        </Slider.Label>
        <Slider.Value
          {...partProps['Slider.Value']}
          placement="block-start"
        />
        <Slider.Control {...partProps['Slider.Control']}>
          <Slider.Track {...partProps['Slider.Track']}>
            <Slider.Indicator {...partProps['Slider.Indicator']} />
            <Slider.Thumb
              {...partProps['Slider.Thumb']}
              aria-label="Minimum price"
              index={0}
            />
            <Slider.Thumb
              {...partProps['Slider.Thumb']}
              aria-label="Maximum price"
              index={1}
            />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </Component>
  );
};

/** A form: two labelled sliders, submitted by their fields' names. */
const InAForm: FunctionComponent = () => {
  const [log, addLog] = useLog();

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Form: ['className', 'onFormSubmit'],
            'Button.Label': [],
            'Button.Root': ['type', 'variant'],
            'Field.Root': ['name'],
            'Slider.Control': [],
            'Slider.Indicator': [],
            'Slider.Label': ['placement'],
            'Slider.Root': ['defaultValue', 'format', 'max', 'min', 'step'],
            'Slider.Thumb': [],
            'Slider.Track': [],
            'Slider.Value': ['placement'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('slider-composition-form') },
  );

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[partControls]}
      id="slider-composition-form"
      log={log}
      state={[partState]}
      title="Sliders in a form"
    >
      <Form
        {...partProps.Form}
        className="slider-demo-form"
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submitted: ${JSON.stringify(values)}`)
        }
      >
        <Field.Root
          {...partProps['Field.Root']}
          name="brightness"
        >
          <Slider.Root
            {...partProps['Slider.Root']}
            defaultValue={60}
            format={{ style: 'unit', unit: 'percent' }}
          >
            <Slider.Label
              {...partProps['Slider.Label']}
              placement="block-start"
            >
              Brightness
            </Slider.Label>
            <Slider.Value
              {...partProps['Slider.Value']}
              placement="block-start"
            />
            <Slider.Control {...partProps['Slider.Control']}>
              <Slider.Track {...partProps['Slider.Track']}>
                <Slider.Indicator {...partProps['Slider.Indicator']} />
                <Slider.Thumb {...partProps['Slider.Thumb']} />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </Field.Root>
        <Field.Root
          {...partProps['Field.Root']}
          name="speed"
        >
          <Slider.Root
            {...partProps['Slider.Root']}
            defaultValue={1}
            max={2}
            min={0.5}
            step={0.25}
          >
            <Slider.Label {...partProps['Slider.Label']}>Speed</Slider.Label>
            <Slider.Control {...partProps['Slider.Control']}>
              <Slider.Track {...partProps['Slider.Track']}>
                <Slider.Indicator {...partProps['Slider.Indicator']} />
                <Slider.Thumb {...partProps['Slider.Thumb']} />
              </Slider.Track>
            </Slider.Control>
            <Slider.Value {...partProps['Slider.Value']}>
              {(formattedValues: readonly string[]) =>
                `${formattedValues[0] ?? ''}×`
              }
            </Slider.Value>
          </Slider.Root>
        </Field.Root>
        <Button.Root
          {...partProps['Button.Root']}
          type="submit"
          variant="bordered-prominent"
        >
          <Button.Label {...partProps['Button.Label']}>Submit</Button.Label>
        </Button.Root>
      </Form>
    </Component>
  );
};

/** A player: the position (scrubbed), playback, and the volume. */
const Media: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);

  // (Playback: a second a second, until the end.)
  useEffect(() => {
    if (!isPlaying || isScrubbing) return undefined;
    const interval = setInterval(
      () => setPosition((value) => Math.min(value + 1, duration)),
      1000,
    );
    return () => clearInterval(interval);
  }, [isPlaying, isScrubbing]);

  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            Symbol: ['icon'],
            'Button.Icon': [],
            'Button.Root': [
              'aria-label',
              'onClick',
              'shape',
              'size',
              'variant',
            ],
            'Slider.Control': [],
            'Slider.Indicator': [],
            'Slider.Root': [
              'defaultValue',
              'max',
              'onValueChange',
              'onValueCommitted',
              'value',
            ],
            'Slider.Symbol': ['edge'],
            'Slider.Thumb': ['aria-label', 'getAriaValueText'],
            'Slider.Track': [],
            'Slider.Value': ['placement'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState('slider-composition-media') },
  );

  return (
    <Component
      isCentered
      isInline
      isStretched
      controls={[partControls]}
      id="slider-composition-media"
      log={log}
      state={[partState]}
      title="Sliders in a player"
    >
      <div className="slider-demo-player">
        <Slider.Root
          {...partProps['Slider.Root']}
          max={duration}
          value={position}
          onValueChange={(
            value: number | readonly number[],
            { reason }: BaseSlider.Root.ChangeEventDetails,
          ) => {
            setIsScrubbing(reason === 'drag');
            setPosition(value as number);
          }}
          onValueCommitted={(value: number | readonly number[]) => {
            setIsScrubbing(false);
            addLog(`seek: ${time(value as number)}`);
          }}
        >
          <Slider.Control {...partProps['Slider.Control']}>
            <Slider.Track {...partProps['Slider.Track']}>
              <Slider.Indicator {...partProps['Slider.Indicator']} />
              <Slider.Thumb
                {...partProps['Slider.Thumb']}
                aria-label="Position"
                getAriaValueText={(_: string, value: number) =>
                  `${time(value)} of ${time(duration)}`
                }
              />
            </Slider.Track>
          </Slider.Control>
          <Slider.Value
            {...partProps['Slider.Value']}
            placement="block-end"
          >
            {(_: readonly string[], [value = 0]: readonly number[]) =>
              time(value)
            }
          </Slider.Value>
          <Slider.Value
            {...partProps['Slider.Value']}
            placement="block-end"
          >
            {(_: readonly string[], [value = 0]: readonly number[]) =>
              `−${time(duration - value)}`
            }
          </Slider.Value>
        </Slider.Root>
        <div className="slider-demo-transport">
          <Button.Root
            {...partProps['Button.Root']}
            aria-label="Back 15 seconds"
            shape="circle"
            variant="borderless"
            onClick={() => setPosition((value) => Math.max(value - 15, 0))}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfBackwardFill}
              />
            </Button.Icon>
          </Button.Root>
          <Button.Root
            {...partProps['Button.Root']}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            shape="circle"
            size="large"
            variant="borderless"
            onClick={() => {
              addLog(isPlaying ? 'pause' : 'play');
              setIsPlaying(!isPlaying);
            }}
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={isPlaying ? sfPauseFill : sfPlayFill}
              />
            </Button.Icon>
          </Button.Root>
          <Button.Root
            {...partProps['Button.Root']}
            aria-label="Forward 15 seconds"
            shape="circle"
            variant="borderless"
            onClick={() =>
              setPosition((value) => Math.min(value + 15, duration))
            }
          >
            <Button.Icon {...partProps['Button.Icon']}>
              <Symbol
                {...partProps.Symbol}
                icon={sfForwardFill}
              />
            </Button.Icon>
          </Button.Root>
        </div>
        <Slider.Root
          {...partProps['Slider.Root']}
          defaultValue={50}
          onValueChange={(value: number | readonly number[]) =>
            addLog(`volume: ${String(value)}`)
          }
        >
          <Slider.Symbol
            {...partProps['Slider.Symbol']}
            edge="min"
          >
            <Symbol
              {...partProps.Symbol}
              icon={sfSpeakerFill}
            />
          </Slider.Symbol>
          <Slider.Control {...partProps['Slider.Control']}>
            <Slider.Track {...partProps['Slider.Track']}>
              <Slider.Indicator {...partProps['Slider.Indicator']} />
              <Slider.Thumb
                {...partProps['Slider.Thumb']}
                aria-label="Volume"
              />
            </Slider.Track>
          </Slider.Control>
          <Slider.Symbol
            {...partProps['Slider.Symbol']}
            edge="max"
          >
            <Symbol
              {...partProps.Symbol}
              icon={sfSpeakerWave3Fill}
            />
          </Slider.Symbol>
        </Slider.Root>
      </div>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['in-a-settings-list', 'In a settings list'],
  ['a-range', 'A range'],
  ['labels-and-forms', 'Labels and forms'],
  ['in-a-player', 'In a player'],
];

/** `/slider/composition`: sliders in lists, forms and a player. */
export const SliderComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <Heading
      id="in-a-settings-list"
      level={2}
    >
      In a settings list
    </Heading>
    <ul>
      <li>
        As on a display settings page: a slider fills a{' '}
        <a href={publicUrl('list')}>List</a> row of its own, between its ends’
        symbols, and the section’s header names it.
      </li>
      <li>
        It takes effect at once, field by field. The app follows{' '}
        <code>onValueChange</code>, as for other settings (for example a{' '}
        <a href={publicUrl('switch')}>Switch</a>).
      </li>
      <li>The header doesn’t label the input, so name the thumb itself.</li>
      <li>
        <strong>Library:</strong> the slider (
        <PartLink
          component="slider"
          part="Slider.Root"
        />
        , with its track, fill and thumb) across the row, between its ends’
        symbols (
        <PartLink
          component="slider"
          part="Slider.Symbol"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the brightness, and following its changes
        (logged).
      </li>
    </ul>
    <CodeView code={settingsCode} />
    <SettingsRow />

    <Heading
      id="a-range"
      level={2}
    >
      A range
    </Heading>
    <ul>
      <li>
        Two thumbs (<code>index</code> 0 and 1) on a value of two numbers, such
        as a price filter’s from–to, each named for its end.
      </li>
      <li>
        They stay at least two steps apart (<code>minStepsBetweenValues</code>),
        and can’t pass each other (<code>thumbCollisionBehavior</code>).
      </li>
      <li>
        <PartLink
          component="slider"
          part="Slider.Value"
        />{' '}
        shows both, formatted as a currency.
      </li>
      <li>
        The inputs’ <code>aria-valuetext</code> reads “€40 start range” and
        “€120 end range”.
      </li>
      <li>
        <strong>Library:</strong> two thumbs, <code>minStepsBetweenValues</code>
        , <code>thumbCollisionBehavior</code>, and the value’s formatting (
        <PartLink
          component="slider"
          part="Slider.Value"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the price range and its currency.
      </li>
    </ul>
    <CodeView code={rangeCode} />
    <Range />

    <Heading
      id="labels-and-forms"
      level={2}
    >
      Labels and forms
    </Heading>
    <ul>
      <li>
        A{' '}
        <PartLink
          component="slider"
          part="Slider.Label"
        />{' '}
        names the inputs, so no <code>aria-label</code> is needed.
      </li>
      <li>
        With a{' '}
        <PartLink
          component="slider"
          part="Slider.Value"
        />
        , it can sit above the track (<code>block-start</code>, with the label
        at the line’s start and the value at its end), or next to it.
      </li>
      <li>
        In a <a href={publicUrl('form')}>Form</a>, Base UI’s{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Root
        </PartLink>{' '}
        names each value.
      </li>
      <li>
        Outside one, the root’s <code>name</code> names its hidden input.
      </li>
      <li>
        <strong>Library:</strong> the label (
        <PartLink
          component="slider"
          part="Slider.Label"
        />
        ) naming the inputs, its placement, and Base UI’s{' '}
        <PartLink
          component="form"
          part="Form"
        />{' '}
        and fields submitting the value by name.
      </li>
      <li>
        <strong>Demo:</strong> the fields’ names, and logging what’s submitted.
      </li>
    </ul>
    <CodeView code={formCode} />
    <InAForm />

    <Heading
      id="in-a-player"
      level={2}
    >
      In a player
    </Heading>
    <ul>
      <li>
        A playback position: the app moves the controlled <code>value</code> as
        it plays.
      </li>
      <li>
        It doesn’t while the knob is dragged (<code>onValueChange</code>’s{' '}
        <code>reason</code> says so), and seeks once it’s released (
        <code>onValueCommitted</code>).
      </li>
      <li>
        Under the track sit the elapsed and remaining times, and the input’s{' '}
        <code>aria-valuetext</code> says both (<code>getAriaValueText</code>).
      </li>
      <li>
        The volume sits below the playback{' '}
        <a href={publicUrl('button')}>Buttons</a>.
      </li>
      <li>
        <strong>Library:</strong> the controlled value,{' '}
        <code>onValueChange</code>’s reason, <code>onValueCommitted</code>, and
        the input’s <code>getAriaValueText</code>.
      </li>
      <li>
        <strong>Demo:</strong> the “playback” (moving the position), pausing it
        while scrubbing, the times under the track, and the playback buttons.
      </li>
    </ul>
    <ul>
      <li>
        For audio volume, prefer the platform’s own volume control (with its
        output device) to a slider, where there is one.
      </li>
      <li>
        A web page has no such control, so it sets its own media’s volume.
      </li>
    </ul>
    <CodeView code={mediaCode} />
    <Media />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sliderCompositionDemos = [SettingsRow, Range, InAForm, Media];
