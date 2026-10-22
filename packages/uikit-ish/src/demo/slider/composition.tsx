import './style.css';

import { Slider as BaseSlider } from '@base-ui/react/slider';
import { sfBackwardFill } from '@bradleyhodges/sfsymbols/sfBackwardFill';
import { sfForwardFill } from '@bradleyhodges/sfsymbols/sfForwardFill';
import { sfPauseFill } from '@bradleyhodges/sfsymbols/sfPauseFill';
import { sfPlayFill } from '@bradleyhodges/sfsymbols/sfPlayFill';
import { sfSpeakerFill } from '@bradleyhodges/sfsymbols/sfSpeakerFill';
import { sfSpeakerWave3Fill } from '@bradleyhodges/sfsymbols/sfSpeakerWave3Fill';
import { sfSunMax } from '@bradleyhodges/sfsymbols/sfSunMax';
import { sfSunMin } from '@bradleyhodges/sfsymbols/sfSunMin';
import { FunctionComponent, useEffect, useState } from 'react';

import {
  Button,
  Field,
  Form,
  forwardClick,
  List,
  Slider,
  Switch,
  Symbol,
} from '../../components/index.js';
import { CodeView } from '../frame/code-view.js';
import { Component } from '../frame/component.js';
import { useLog } from '../frame/log.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../guide/sections.js';
import { GuideLink } from '../hig-guide/link.js';
import { time } from './content.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const settingsCode = `<List.Section>
  <List.Header prominence="nested">
    <List.Title>Brightness</List.Title>
  </List.Header>
  <List.Group>
    <List.Item>
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
    </List.Item>
    <List.Item onClick={forwardClick('[role=switch]')}>
      <List.Title>True Tone</List.Title>
      <Switch.Root aria-label="True Tone">
        <Switch.Thumb />
      </Switch.Root>
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

const mediaCode = `const [position, setPosition] = useState(0);
// Playback moves the knob, but not while it's dragged.
const [scrubbing, setScrubbing] = useState(false);

<Slider.Root
  max={duration}
  value={position}
  onValueChange={(value, { reason }) => {
    setScrubbing(reason === 'drag');
    setPosition(value);
  }}
  onValueCommitted={(value) => {
    setScrubbing(false);
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

  return (
    <Component
      inline
      stretch
      id="slider-composition-settings"
      log={log}
      title="Slider in a list row"
    >
      <List.Root>
        <List.Section>
          <List.Header prominence="nested">
            <List.Title>Brightness</List.Title>
          </List.Header>
          <List.Group>
            <List.Item>
              <Slider.Root
                defaultValue={60}
                onValueChange={(value: number | readonly number[]) =>
                  addLog(`brightness: ${String(value)}`)
                }
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
            </List.Item>
            <List.Item onClick={forwardClick('[role=switch]')}>
              <List.Title>True Tone</List.Title>
              <Switch.Root
                defaultChecked
                aria-label="True Tone"
                onCheckedChange={(checked: boolean) =>
                  addLog(`true tone: ${String(checked)}`)
                }
              >
                <Switch.Thumb />
              </Switch.Root>
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

  return (
    <Component
      center
      inline
      stretch
      id="slider-composition-range"
      log={log}
      title="Slider with a range"
    >
      <Slider.Root
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
      </Slider.Root>
    </Component>
  );
};

/** A form: two labelled sliders, submitted by their fields' names. */
const InAForm: FunctionComponent = () => {
  const [log, addLog] = useLog();

  return (
    <Component
      center
      inline
      stretch
      id="slider-composition-form"
      log={log}
      title="Sliders in a form"
    >
      <Form
        className="slider-demo-form"
        onFormSubmit={(values: Record<string, unknown>) =>
          addLog(`submitted: ${JSON.stringify(values)}`)
        }
      >
        <Field.Root name="brightness">
          <Slider.Root
            defaultValue={60}
            format={{ style: 'unit', unit: 'percent' }}
          >
            <Slider.Label placement="block-start">Brightness</Slider.Label>
            <Slider.Value placement="block-start" />
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
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
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
            <Slider.Value>
              {(formattedValues: readonly string[]) =>
                `${formattedValues[0] ?? ''}×`
              }
            </Slider.Value>
          </Slider.Root>
        </Field.Root>
        <Button.Root
          type="submit"
          variant="bordered-prominent"
        >
          <Button.Label>Submit</Button.Label>
        </Button.Root>
      </Form>
    </Component>
  );
};

/** A player: the position (scrubbed), playback, and the volume. */
const Media: FunctionComponent = () => {
  const [log, addLog] = useLog();
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);

  // (Playback: a second a second, until the end.)
  useEffect(() => {
    if (!playing || scrubbing) return undefined;
    const interval = setInterval(
      () => setPosition((value) => Math.min(value + 1, duration)),
      1000,
    );
    return () => clearInterval(interval);
  }, [playing, scrubbing]);

  return (
    <Component
      center
      inline
      stretch
      id="slider-composition-media"
      log={log}
      title="Sliders in a player"
    >
      <div className="slider-demo-player">
        <Slider.Root
          max={duration}
          value={position}
          onValueChange={(
            value: number | readonly number[],
            { reason }: BaseSlider.Root.ChangeEventDetails,
          ) => {
            setScrubbing(reason === 'drag');
            setPosition(value as number);
          }}
          onValueCommitted={(value: number | readonly number[]) => {
            setScrubbing(false);
            addLog(`seek: ${time(value as number)}`);
          }}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb
                aria-label="Position"
                getAriaValueText={(_: string, value: number) =>
                  `${time(value)} of ${time(duration)}`
                }
              />
            </Slider.Track>
          </Slider.Control>
          <Slider.Value placement="block-end">
            {(_: readonly string[], [value = 0]: readonly number[]) =>
              time(value)
            }
          </Slider.Value>
          <Slider.Value placement="block-end">
            {(_: readonly string[], [value = 0]: readonly number[]) =>
              `−${time(duration - value)}`
            }
          </Slider.Value>
        </Slider.Root>
        <div className="slider-demo-transport">
          <Button.Root
            aria-label="Back 15 seconds"
            shape="circle"
            variant="borderless"
            onClick={() => setPosition((value) => Math.max(value - 15, 0))}
          >
            <Button.Icon>
              <Symbol icon={sfBackwardFill} />
            </Button.Icon>
          </Button.Root>
          <Button.Root
            aria-label={playing ? 'Pause' : 'Play'}
            shape="circle"
            size="large"
            variant="borderless"
            onClick={() => {
              addLog(playing ? 'pause' : 'play');
              setPlaying(!playing);
            }}
          >
            <Button.Icon>
              <Symbol icon={playing ? sfPauseFill : sfPlayFill} />
            </Button.Icon>
          </Button.Root>
          <Button.Root
            aria-label="Forward 15 seconds"
            shape="circle"
            variant="borderless"
            onClick={() =>
              setPosition((value) => Math.min(value + 15, duration))
            }
          >
            <Button.Icon>
              <Symbol icon={sfForwardFill} />
            </Button.Icon>
          </Button.Root>
        </div>
        <Slider.Root
          defaultValue={50}
          onValueChange={(value: number | readonly number[]) =>
            addLog(`volume: ${String(value)}`)
          }
        >
          <Slider.Symbol edge="min">
            <Symbol icon={sfSpeakerFill} />
          </Slider.Symbol>
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb aria-label="Volume" />
            </Slider.Track>
          </Slider.Control>
          <Slider.Symbol edge="max">
            <Symbol icon={sfSpeakerWave3Fill} />
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
        As iOS’s Display &amp; Brightness: a slider filling a{' '}
        <a href="list">List</a> row of its own, between its ends’ symbols; the
        section’s header names it.
      </li>
      <li>
        Takes effect at once (guide,{' '}
        <GuideLink to="commit-model">§8.2, commit model</GuideLink>: immediate
        per field): the app follows <code>onValueChange</code>, as for other
        settings (e.g. a <a href="switch">Switch</a>).
      </li>
      <li>The header doesn’t label the input: name the thumb itself.</li>
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
        Two thumbs (<code>index</code> 0 and 1) on a value of two numbers, e.g.
        a price filter’s from–to; each named for its end.
      </li>
      <li>
        Two steps apart at least (<code>minStepsBetweenValues</code>); can’t
        pass each other (<code>thumbCollisionBehavior</code>).
      </li>
      <li>
        <PartLink
          component="slider"
          part="Slider.Value"
        />{' '}
        shows both, formatted as a currency.
      </li>
      <li>
        Inputs’ <code>aria-valuetext</code>: “€40 start range”, “€120 end
        range”.
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
        names the inputs (no <code>aria-label</code> needed).
      </li>
      <li>
        With{' '}
        <PartLink
          component="slider"
          part="Slider.Value"
        />
        : above the track (<code>block-start</code>: label at the line’s start,
        value at its end), or beside it.
      </li>
      <li>
        In a <a href="form">Form</a>: Base UI’s{' '}
        <PartLink
          component="form"
          part="Field"
        >
          Field.Root
        </PartLink>{' '}
        names each value.
      </li>
      <li>
        Outside one: the root’s <code>name</code> names its hidden input.
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
        Not while the knob is dragged (<code>onValueChange</code>’s{' '}
        <code>reason</code>); seeks once it’s released (
        <code>onValueCommitted</code>).
      </li>
      <li>
        Under the track: elapsed and remaining time; the input’s{' '}
        <code>aria-valuetext</code> says both (<code>getAriaValueText</code>).
      </li>
      <li>
        Below the playback <a href="button">Buttons</a>: the volume.
      </li>
    </ul>
    <ul>
      <li>
        HIG: on iOS, audio volume uses the system’s volume view (with its output
        device control), not a slider.
      </li>
      <li>A web page has no such view; it sets its own media’s volume.</li>
    </ul>
    <CodeView code={mediaCode} />
    <Media />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const sliderCompositionDemos = [SettingsRow, Range, InAForm, Media];
