import {
  FunctionComponent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  Badge,
  Button,
  Card,
  type CardActions,
  forwardClick,
  gridIcons,
  List,
  Progress,
  Segmented,
  Slider,
  Stepper,
  Switch,
  Symbol,
  type SymbolIcon,
  useGridItem,
} from '../../components/index.js';
import {
  Artwork,
  BarChart,
  type Channel,
  ChannelSliders,
  Dial,
  HourStrip,
  kelvinColor,
  mixColor,
  Sparkline,
  Trend,
  useRowsThatFit,
} from '../tooling/card-kit.js';
import { FlipParts } from '../tooling/flip.js';
import {
  sfAntennaRadiowavesLeftAndRight,
  sfBackwardFill,
  sfBellFill,
  sfBoltFill,
  sfCloudRainFill,
  sfCloudSunFill,
  sfDoorGarageClosed,
  sfDoorLeftHandClosed,
  sfEnvelopeFill,
  sfFlameFill,
  sfForwardFill,
  sfHomepodFill,
  sfHouseFill,
  sfHumidityFill,
  sfLampCeilingFill,
  sfLampFloorFill,
  sfLightbulbFill,
  sfLightbulbLedFill,
  sfLightStrip2,
  sfPauseFill,
  sfPlayFill,
  sfPower,
  sfSnowflake,
  sfSunMaxFill,
  sfThermometerMedium,
  sfWasherFill,
  sfWindowShadeClosed,
} from '../tooling/icons.js';
import {
  type Expansion,
  lightsStore,
  type Tile,
  TonedCard,
  useIsLarge,
  useLights,
} from './cards-shared.js';

// More kinds of cards, built from the library's parts and the demos' card
// kit (tooling/card-kit.tsx: channel sliders, a trend arrow): a tunable
// white light, lights of three, four and five channels, a device's status,
// values with a trend, momentary buttons (pressed, or flashed by the app as
// something happens), a room's summary in a list, a speaker; a thermostat
// (a segmented control and a stepper, large), a garage door (a progress bar
// as it moves), the weather (its forecast in rows, large), the power drawn
// (a sparkline), a washer (time left, a progress bar), the mailbox (a badge
// on its symbol). Each shows its large layout at 2x2 or more, however it got
// there (expanded, resized, opened); those that move their parts do so with
// GSAP (`FlipParts`).

const percent = (value: number) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
    style: 'percent',
  }).format(value);

/** Its corner button expanding it and making it small again. */
const ExpandButton: FunctionComponent<{
  expansion: Expansion;
  name: string;
}> = ({ expansion: { isExpanded, onToggle }, name }) => (
  <Card.CornerButton
    mirrored
    aria-expanded={isExpanded}
    aria-label={`${name} details`}
    icon={isExpanded ? gridIcons.collapse : gridIcons.expand}
    onClick={onToggle}
  />
);

/** Its corner buttons opening it above the page and closing it. */
const OpenButtons: FunctionComponent<{ name: string }> = ({ name }) => {
  const item = useGridItem();
  const isOpen = item?.open === true;
  return (
    <>
      <Card.CornerButton
        aria-label={`${name} details`}
        icon={gridIcons.open}
        visible={!isOpen}
        onClick={() => item?.setOpen(true)}
      />
      <Card.CornerButton
        aria-label="Close"
        corner="top-leading"
        icon={gridIcons.close}
        visible={isOpen}
        onClick={() => item?.setOpen(false)}
      />
    </>
  );
};

/** A color temperature's range (kelvin), as a slider's 0 to 1. */
const warmest = 2200;
const coolest = 6500;

/**
 * A tunable white light: small, one slider (its brightness), in its
 * color's tint; expanded, two bars (brightness and color temperature, from
 * warm to cool), its value saying both.
 */
const TunableLightCard: FunctionComponent<{ expansion?: Expansion }> = ({
  expansion,
}) => {
  const [brightness, setBrightness] = useState(0.7);
  const [warmth, setWarmth] = useState(0.2);
  const kelvin = Math.round(warmest + warmth * (coolest - warmest));
  const tint = kelvinColor(kelvin);
  // (Large (expanded, or resized so): its two bars.)
  const isExpanded = useIsLarge();
  const name = 'Desk Light';
  return (
    <TonedCard active={brightness > 0}>
      <FlipParts />
      {/* (Its light's color, darker: legible on its fill, the same tint.) */}
      <Card.Symbol
        style={{ color: `color-mix(in oklab, ${tint} 55%, rgb(80 40 0))` }}
      >
        <Symbol icon={sfLightbulbLedFill} />
      </Card.Symbol>
      {isExpanded ? (
        <>
          <ChannelSliders
            channels={[
              { label: 'Light', name: 'Brightness', tint, value: brightness },
              {
                label: 'Color',
                name: 'Color temperature',
                tint,
                value: warmth,
              },
            ]}
            onChange={(index, value) =>
              index === 0 ? setBrightness(value) : setWarmth(value)
            }
          />
          <Card.Title>
            {name} · {kelvin} K
          </Card.Title>
          <Card.Value>{percent(brightness)}</Card.Value>
        </>
      ) : (
        <Slider.Root
          format={{ maximumFractionDigits: 0, style: 'percent' }}
          max={1}
          min={0}
          step={0.01}
          tint={tint}
          value={brightness}
          onValueChange={(next) => setBrightness(next as number)}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb aria-label={name} />
            </Slider.Track>
          </Slider.Control>
          <Slider.Label>{name}</Slider.Label>
          <Slider.Value />
        </Slider.Root>
      )}
      {expansion ? (
        <ExpandButton
          expansion={expansion}
          name={name}
        />
      ) : null}
    </TonedCard>
  );
};

/** A light's channels: their names and tints (see `ChannelLightCard`). */
const rgb = [
  { label: 'R', name: 'Red', tint: '#ff3b30' },
  { label: 'G', name: 'Green', tint: '#34c759' },
  { label: 'B', name: 'Blue', tint: '#0a84ff' },
] as const;
const white = { label: 'W', name: 'White', tint: '#fff4e0' } as const;
const cool = { label: 'CW', name: 'Cool white', tint: '#cfdcff' } as const;
const warm = { label: 'WW', name: 'Warm white', tint: '#ffd9a0' } as const;

/**
 * A light of several channels (three, four, five): small, a switch, its
 * symbol in the color they make, its brightness (their strongest); larger
 * (expanded, or open above the page), a bar per channel. A press on it,
 * small, toggles its switch.
 */
const ChannelLightCard: FunctionComponent<{
  channels: readonly Omit<Channel, 'value'>[];
  expansion?: Expansion;
  icon: SymbolIcon;
  initial: readonly number[];
  name: string;
  /** Opened above the page for its bars (else expanded). */
  opens?: boolean;
}> = ({ channels, expansion, icon, initial, name, opens = false }) => {
  const [values, setValues] = useState(initial);
  const [isOn, setIsOn] = useState(true);
  const isLarge = useIsLarge();
  const all = channels.map((channel, index) => ({
    ...channel,
    value: values[index] ?? 0,
  }));
  const color = isOn ? mixColor(all) : undefined;
  const brightness = Math.max(...values);
  return (
    <TonedCard
      onClick={
        isLarge ? undefined : forwardClick('[role=switch]:not([disabled])')
      }
    >
      <FlipParts />
      <Card.Symbol style={color ? { color } : undefined}>
        <Symbol icon={icon} />
      </Card.Symbol>
      <Switch.Root
        aria-label={name}
        checked={isOn}
        onCheckedChange={setIsOn}
      >
        <Switch.Thumb />
      </Switch.Root>
      {isLarge ? (
        <ChannelSliders
          channels={all}
          onChange={(index, value) =>
            setValues((current) =>
              current.map((each, at) => (at === index ? value : each)),
            )
          }
        />
      ) : null}
      <Card.Title>{name}</Card.Title>
      <Card.Value>{isOn ? percent(brightness) : 'Off'}</Card.Value>
      {opens ? <OpenButtons name={name} /> : null}
      {!opens && expansion ? (
        <ExpandButton
          expansion={expansion}
          name={name}
        />
      ) : null}
    </TonedCard>
  );
};

/** How long ago, in words (e.g. “2 min ago”), by the document's language. */
const agoOf = (then: number, now: number) => {
  const minutes = Math.round((now - then) / 60_000);
  const format = new Intl.RelativeTimeFormat(undefined, {
    numeric: 'auto',
    style: 'short',
  });
  return minutes < 60
    ? format.format(-minutes, 'minute')
    : format.format(-Math.round(minutes / 60), 'hour');
};

/** The time now, again each `every` milliseconds. */
const useNow = (every: number) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), every);
    return () => clearInterval(timer);
  }, [every]);
  return now;
};

/**
 * A device's status: its connection's symbol (static), online and when it
 * was last heard from; expanded, the details in rows (a glass list).
 */
const DeviceCard: FunctionComponent<{ expansion?: Expansion }> = ({
  expansion,
}) => {
  const now = useNow(30_000);
  const [heard] = useState(() => Date.now() - 2 * 60_000);
  const isExpanded = useIsLarge();
  const name = 'Hallway Sensor';
  const rows: readonly (readonly [string, string])[] = [
    ['Last heard', agoOf(heard, now)],
    ['Connection', 'Zigbee'],
    ['Battery', '80 %'],
    ['Signal', '−62 dBm'],
    ['Firmware', '1.4.2'],
  ];
  // (As many as fit whole.)
  const [list, fit] = useRowsThatFit();
  return (
    <TonedCard>
      <FlipParts />
      <Card.Symbol>
        <Symbol icon={sfAntennaRadiowavesLeftAndRight} />
      </Card.Symbol>
      {isExpanded ? (
        <List.Root ref={list}>
          <List.Section>
            <List.Group>
              {rows.slice(0, fit).map(([label, value]) => (
                <List.Item key={label}>
                  <List.Content>
                    <List.Title>{label}</List.Title>
                  </List.Content>
                  <List.Trailing>
                    <List.Detail>{value}</List.Detail>
                  </List.Trailing>
                </List.Item>
              ))}
            </List.Group>
          </List.Section>
        </List.Root>
      ) : null}
      <Card.Title>{name}</Card.Title>
      <Card.Value>
        {isExpanded ? 'Online' : `Online · ${agoOf(heard, now)}`}
      </Card.Value>
      {expansion ? (
        <ExpandButton
          expansion={expansion}
          name={name}
        />
      ) : null}
    </TonedCard>
  );
};

/**
 * A value that changes by itself (a random walk, each `every` ms, as a
 * sensor's would), and its trend: the last change's angle (steeper as it
 * changes faster, `scale` per degree).
 */
const useWalk = (start: number, step: number, every: number) => {
  const [[value, angle], set] = useState<readonly [number, number]>([start, 0]);
  useEffect(() => {
    const timer = setInterval(() => {
      set(([current]) => {
        const change = (Math.random() - 0.45) * step;
        return [current + change, (change / step) * 120] as const;
      });
    }, every);
    return () => clearInterval(timer);
  }, [every, step]);
  return [value, angle] as const;
};

/** A value with its trend: an arrow after it, turned by its slope. */
const TrendCard: FunctionComponent<{
  format: Intl.NumberFormatOptions;
  icon: SymbolIcon;
  name: string;
  start: number;
  step: number;
}> = ({ format, icon, name, start, step }) => {
  const [value, angle] = useWalk(start, step, 4000);
  return (
    <TonedCard>
      <Card.Symbol>
        <Symbol icon={icon} />
      </Card.Symbol>
      <Card.Title>{name}</Card.Title>
      <Card.Value>
        {new Intl.NumberFormat(undefined, format).format(value)}
        <Trend angle={angle} />
      </Card.Value>
    </TonedCard>
  );
};

/**
 * A doorbell: momentary (pressed, its chime rings: it lights up and fades
 * back), and flashed by the app as it rings at the door (here every 20
 * seconds, as its server would tell), saying when it last rang.
 */
const DoorbellCard: FunctionComponent = () => {
  const actions = useRef<CardActions | null>(null);
  const [rang, setRang] = useState<number | undefined>(undefined);
  useEffect(() => {
    const timer = setInterval(() => {
      setRang(Date.now());
      actions.current?.flash();
    }, 20_000);
    return () => clearInterval(timer);
  }, []);
  return (
    <TonedCard
      momentary
      actionsRef={actions}
      onClick={() => setRang(Date.now())}
    >
      <Card.Symbol>
        <Symbol icon={sfBellFill} />
      </Card.Symbol>
      <Card.Title>Doorbell</Card.Title>
      <Card.Value>
        {rang === undefined
          ? 'Quiet'
          : `Rang ${new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(rang)}`}
      </Card.Value>
    </TonedCard>
  );
};

/** All lights off: momentary, its value how many are still on. */
const AllOffCard: FunctionComponent = () => {
  const lights = useLights();
  const onCount = Object.values(lights).filter(Boolean).length;
  return (
    <TonedCard
      momentary
      onClick={() => {
        for (const name of Object.keys(lights)) lightsStore.set(name, false);
      }}
    >
      <Card.Symbol>
        <Symbol icon={sfPower} />
      </Card.Symbol>
      <Card.Title>All Lights Off</Card.Title>
      <Card.Value>
        {onCount > 0 ? `${String(onCount)} on` : 'All off'}
      </Card.Value>
    </TonedCard>
  );
};

/**
 * A room's summary: what's going on there, in rows (a glass list), as many
 * as fit; opened above the page, all of them.
 */
const RoomCard: FunctionComponent = () => {
  const lights = useLights();
  const onCount = Object.values(lights).filter(Boolean).length;
  const [temperature, angle] = useWalk(21.5, 0.3, 5000);
  const rows: readonly (readonly [SymbolIcon, string, ReactNode])[] = [
    [sfLightbulbFill, 'Lights', onCount > 0 ? `${String(onCount)} on` : 'Off'],
    [
      sfThermometerMedium,
      'Temperature',
      <>
        {new Intl.NumberFormat(undefined, {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
          style: 'unit',
          unit: 'celsius',
        }).format(temperature)}
        <Trend angle={angle} />
      </>,
    ],
    [sfHumidityFill, 'Humidity', percent(0.46)],
    [sfWindowShadeClosed, 'Blinds', percent(0.5)],
    [sfHomepodFill, 'Speaker', 'Paused'],
    [sfDoorLeftHandClosed, 'Balcony Door', 'Closed'],
    [sfAntennaRadiowavesLeftAndRight, 'Devices', '12 online'],
  ];
  const name = 'Living Room';
  // (As many as fit whole, whatever its size, open or not.)
  const [list, fit] = useRowsThatFit();
  const shown = rows.slice(0, fit);
  return (
    <TonedCard>
      <FlipParts />
      <Card.Symbol>
        <Symbol icon={sfHouseFill} />
      </Card.Symbol>
      <List.Root ref={list}>
        <List.Section>
          <List.Group>
            {shown.map(([icon, label, value]) => (
              <List.Item key={label}>
                <List.Leading>
                  <List.Image variant="symbol">
                    <Symbol icon={icon} />
                  </List.Image>
                </List.Leading>
                <List.Content>
                  <List.Title>{label}</List.Title>
                </List.Content>
                <List.Trailing>
                  <List.Detail>{value}</List.Detail>
                </List.Trailing>
              </List.Item>
            ))}
          </List.Group>
        </List.Section>
      </List.Root>
      <Card.Title>{name}</Card.Title>
      <OpenButtons name={name} />
    </TonedCard>
  );
};

/** A track's length, in seconds (see `SpeakerCard`). */
const trackLength = 245;

/** A transport button (see `SpeakerCard`): an icon, named. */
const transport = (label: string, icon: SymbolIcon, onClick?: () => void) => (
  <Button.Root
    aria-label={label}
    shape="circle"
    textColor="#fff"
    variant="glass"
    onClick={onClick}
  >
    <Button.Icon>
      <Symbol icon={icon} />
    </Button.Icon>
  </Button.Root>
);

/**
 * A speaker, now playing: small, its album artwork as its symbol, a press
 * playing or pausing it; open above the page, the artwork filling the card,
 * the track over it, its progress and transport buttons under it.
 */
const SpeakerCard: FunctionComponent = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [played, setPlayed] = useState(84);
  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = setInterval(
      () => setPlayed((current) => (current + 1) % trackLength),
      1000,
    );
    return () => clearInterval(timer);
  }, [isPlaying]);
  const isLarge = useIsLarge();
  const name = 'Kitchen Speaker';
  let value = 'Paused';
  if (isLarge) value = 'Morning Mix';
  else if (isPlaying) value = 'Playing · Morning Mix';
  return (
    <TonedCard
      active={isLarge ? undefined : isPlaying}
      className={isLarge ? 'demo-card-art' : undefined}
      onClick={isLarge ? undefined : () => setIsPlaying(!isPlaying)}
    >
      <FlipParts />
      {isLarge ? (
        <Artwork
          fill
          hue={290}
        />
      ) : (
        <Card.Symbol>
          <Artwork hue={290} />
        </Card.Symbol>
      )}
      <Card.Title>{isLarge ? `Bonobo · ${name}` : name}</Card.Title>
      <Card.Value>{value}</Card.Value>
      {isLarge ? (
        <div className="demo-transport">
          <Progress.Root
            aria-label="Played"
            tint="#fff"
            value={(played / trackLength) * 100}
          >
            <Progress.Track>
              <Progress.Indicator />
            </Progress.Track>
          </Progress.Root>
          <div className="demo-transport-buttons">
            {transport('Previous', sfBackwardFill, () => setPlayed(0))}
            {transport(
              isPlaying ? 'Pause' : 'Play',
              isPlaying ? sfPauseFill : sfPlayFill,
              () => setIsPlaying(!isPlaying),
            )}
            {transport('Next', sfForwardFill, () => setPlayed(0))}
          </div>
        </div>
      ) : null}
      <OpenButtons name={name} />
    </TonedCard>
  );
};

/** A thermostat's modes (see `ThermostatCard`). */
type Mode = 'auto' | 'cool' | 'heat';
const modes: Readonly<Record<Mode, readonly [string, SymbolIcon]>> = {
  auto: ['Auto', sfThermometerMedium],
  cool: ['Cool', sfSnowflake],
  heat: ['Heat', sfFlameFill],
};
const modeTints: Readonly<Record<Mode, string>> = {
  auto: 'var(--color-ui-system-green)',
  cool: 'var(--color-ui-system-blue)',
  heat: 'var(--color-ui-system-orange)',
};

/**
 * A thermostat: small, its mode's symbol and what it heats or cools to;
 * large (expanded, or resized so), a segmented control for its mode and a
 * stepper for its target.
 */
const ThermostatCard: FunctionComponent<{ expansion?: Expansion }> = ({
  expansion,
}) => {
  const [mode, setMode] = useState<Mode>('heat');
  const [target, setTarget] = useState(21.5);
  const isLarge = useIsLarge();
  const name = 'Thermostat';
  const [label, icon] = modes[mode];
  return (
    <TonedCard active={mode !== 'auto'}>
      <FlipParts />
      <Card.Symbol>
        <Symbol icon={icon} />
      </Card.Symbol>
      {isLarge ? (
        <div className="demo-card-controls">
          <Dial
            tint={modeTints[mode]}
            value={(target - 10) / 18}
          >
            <span className="demo-dial-label">{label}</span>
            <span className="demo-dial-number">{target.toFixed(1)}°</span>
          </Dial>
          <Segmented.Root
            aria-label="Mode"
            value={mode}
            onValueChange={(next) => setMode(next as Mode)}
          >
            {(Object.keys(modes) as Mode[]).map((each) => (
              <Segmented.Item
                key={each}
                value={each}
              >
                {modes[each][0]}
              </Segmented.Item>
            ))}
            <Segmented.Highlight />
          </Segmented.Root>
          <Stepper.Root
            max={28}
            min={10}
            step={0.5}
            value={target}
            onValueChange={(next: number | null) => setTarget(next ?? target)}
          >
            <Stepper.Group>
              <Stepper.Input aria-label="Target temperature" />
              <Stepper.Decrement />
              <Stepper.Increment />
            </Stepper.Group>
          </Stepper.Root>
        </div>
      ) : null}
      <Card.Title>{name}</Card.Title>
      {/* (Large, its target in its dial.) */}
      {isLarge ? null : (
        <Card.Value>
          {label} · {target.toFixed(1)} °C
        </Card.Value>
      )}
      {expansion ? (
        <ExpandButton
          expansion={expansion}
          name={name}
        />
      ) : null}
    </TonedCard>
  );
};

/**
 * A garage door: a press opens or closes it; moving, a progress bar of
 * how far it's got (large, or on the small card too), its value saying so.
 */
const GarageCard: FunctionComponent = () => {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState<-1 | 0 | 1>(0);
  useEffect(() => {
    if (direction === 0) return undefined;
    const timer = setInterval(() => {
      setPosition((current) => {
        const next = Math.min(1, Math.max(0, current + direction * 0.05));
        if (next === 0 || next === 1) setDirection(0);
        return next;
      });
    }, 150);
    return () => clearInterval(timer);
  }, [direction]);
  let state = position === 1 ? 'Open' : 'Closed';
  if (direction !== 0) state = direction > 0 ? 'Opening…' : 'Closing…';
  return (
    <TonedCard
      active={position > 0}
      onClick={() => setDirection(position > 0 ? -1 : 1)}
    >
      <Card.Symbol>
        <Symbol icon={sfDoorGarageClosed} />
      </Card.Symbol>
      {direction === 0 ? null : (
        <div className="demo-card-controls">
          <Progress.Root
            aria-label="Garage door"
            tint="var(--color-ui-system-orange)"
            value={position * 100}
          >
            <Progress.Track>
              <Progress.Indicator />
            </Progress.Track>
          </Progress.Root>
        </div>
      )}
      <Card.Title>Garage Door</Card.Title>
      <Card.Value>{state}</Card.Value>
    </TonedCard>
  );
};

/** The forecast's hours (see `WeatherCard`). */
const forecast: readonly (readonly [string, SymbolIcon, string])[] = [
  ['Now', sfCloudSunFill, '12°'],
  ['15:00', sfSunMaxFill, '14°'],
  ['16:00', sfSunMaxFill, '14°'],
  ['17:00', sfCloudSunFill, '13°'],
  ['18:00', sfCloudRainFill, '11°'],
  ['19:00', sfCloudRainFill, '10°'],
  ['20:00', sfCloudSunFill, '9°'],
  ['21:00', sfCloudSunFill, '8°'],
];

/**
 * The weather: small, now; large (expanded, or opened above the page), the
 * next hours in rows, as many as fit.
 */
const WeatherCard: FunctionComponent<{ expansion?: Expansion }> = ({
  expansion,
}) => {
  const isLarge = useIsLarge();
  const name = 'Weather';
  return (
    <TonedCard>
      <FlipParts />
      <Card.Symbol>
        <Symbol icon={sfCloudSunFill} />
      </Card.Symbol>
      {isLarge ? <HourStrip hours={forecast} /> : null}
      {/* (Large, its value large: the sky in its title.) */}
      <Card.Title>{isLarge ? `${name} · Partly cloudy` : name}</Card.Title>
      <Card.Value>{isLarge ? '12°' : '12° · Partly cloudy'}</Card.Value>
      {expansion ? (
        <ExpandButton
          expansion={expansion}
          name={name}
        />
      ) : null}
    </TonedCard>
  );
};

/** A made-up day's power, by the hour (kW). */
const today: readonly number[] = Array.from({ length: 24 }, (_, index) =>
  Number(
    (
      0.4 +
      Math.max(0, Math.sin(((index - 6) / 24) * Math.PI * 2)) * 1.4 +
      (index % 5) * 0.08
    ).toFixed(2),
  ),
);

/**
 * The power the home draws now, and its course over the last minutes (a
 * sparkline, larger on a larger tile), changing by itself.
 */
const EnergyCard: FunctionComponent<{ expansion?: Expansion }> = ({
  expansion,
}) => {
  const [values, setValues] = useState<readonly number[]>(() =>
    Array.from({ length: 24 }, (_, index) => 1.1 + Math.sin(index / 3) * 0.3),
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setValues((current) => [
        ...current.slice(1),
        Math.max(0.2, (current.at(-1) ?? 1) + (Math.random() - 0.5) * 0.3),
      ]);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  const name = 'Power';
  const now = values.at(-1) ?? 0;
  // (Large, today by the hour: a made-up day, this hour's the latest.)
  const isLarge = useIsLarge();
  const hour = new Date().getHours();
  return (
    <TonedCard>
      <FlipParts />
      <Card.Symbol>
        <Symbol icon={sfBoltFill} />
      </Card.Symbol>
      {isLarge ? (
        <BarChart
          current={hour}
          label={`Power today, by the hour, now ${now.toFixed(1)} kilowatts`}
          tint="var(--color-ui-system-yellow)"
          values={today}
        />
      ) : (
        <Sparkline
          label={`Power over the last minutes, now ${now.toFixed(1)} kilowatts`}
          values={values}
        />
      )}
      <Card.Title>{name}</Card.Title>
      <Card.Value>{now.toFixed(1)} kW</Card.Value>
      {expansion ? (
        <ExpandButton
          expansion={expansion}
          name={name}
        />
      ) : null}
    </TonedCard>
  );
};

/** A washing machine: how long it has left, as a progress bar too. */
const WasherCard: FunctionComponent = () => {
  const total = 90;
  const [left, setLeft] = useState(42);
  useEffect(() => {
    const timer = setInterval(
      () => setLeft((current) => (current <= 0 ? total : current - 1)),
      2000,
    );
    return () => clearInterval(timer);
  }, []);
  return (
    <TonedCard active>
      <Card.Symbol>
        <Symbol icon={sfWasherFill} />
      </Card.Symbol>
      <div className="demo-card-controls">
        <Progress.Root
          aria-label="Washing"
          value={((total - left) / total) * 100}
        >
          <Progress.Track>
            <Progress.Indicator />
          </Progress.Track>
        </Progress.Root>
      </div>
      <Card.Title>Washer</Card.Title>
      <Card.Value>{left} min left</Card.Value>
    </TonedCard>
  );
};

/**
 * The mailbox: how many letters are in it, a badge on its symbol;
 * momentary, a press marks them taken out.
 */
const MailboxCard: FunctionComponent = () => {
  const [letters, setLetters] = useState(3);
  return (
    <TonedCard
      momentary
      onClick={() => setLetters(0)}
    >
      <Card.Symbol>
        <Symbol icon={sfEnvelopeFill}>
          {letters > 0 ? <Badge placement="symbol">{letters}</Badge> : null}
        </Symbol>
      </Card.Symbol>
      <Card.Title>Mailbox</Card.Title>
      <Card.Value>
        {letters > 0 ? `${String(letters)} letters` : 'Empty'}
      </Card.Value>
    </TonedCard>
  );
};

/** The More Kinds section's tiles (see cards.tsx). */
export const moreTiles: readonly Tile[] = [
  {
    card: TunableLightCard,
    expandedSize: '2x2',
    kind: 'numericalControl',
    name: 'Desk Light',
    size: '2x1',
    sizes: ['2x1', '2x2'],
  },
  {
    card: ({ expansion }) => (
      <ChannelLightCard
        channels={rgb}
        expansion={expansion}
        icon={sfLightStrip2}
        initial={[0.9, 0.3, 0.6]}
        name="Light Strip"
      />
    ),
    expandedSize: '2x2',
    kind: 'binaryControl',
    name: 'Light Strip',
    size: '2x1',
    sizes: ['1x1', '2x1', '2x2'],
  },
  {
    card: () => (
      <ChannelLightCard
        opens
        channels={[...rgb, white]}
        icon={sfLampCeilingFill}
        initial={[0.2, 0.5, 0.9, 0.4]}
        name="Ceiling Light"
      />
    ),
    kind: 'binaryControl',
    name: 'Ceiling Light',
    openSize: '4x3',
    size: '2x1',
  },
  {
    area: '4x2',
    card: ({ expansion }) => (
      <ChannelLightCard
        channels={[...rgb, cool, warm]}
        expansion={expansion}
        icon={sfLampFloorFill}
        initial={[0.6, 0.2, 0.1, 0.3, 0.8]}
        name="Floor Lamp"
      />
    ),
    expandedSize: '4x2',
    kind: 'binaryControl',
    name: 'Floor Lamp (five channels)',
    size: '2x1',
    // (3x2 too: on a grid of three columns, its area and expanded size
    // fitted to them, it expands as wide as it can.)
    sizes: ['2x1', '3x2', '4x2'],
  },
  {
    card: DeviceCard,
    expandedSize: '2x2',
    kind: 'binaryDisplay',
    name: 'Hallway Sensor',
    size: '2x1',
    sizes: ['2x1', '2x2'],
  },
  {
    card: () => (
      <TrendCard
        icon={sfThermometerMedium}
        name="Outside"
        start={12.4}
        step={0.4}
        format={{
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
          style: 'unit',
          unit: 'celsius',
        }}
      />
    ),
    kind: 'numericalDisplay',
    name: 'Outside',
    size: '2x1',
  },
  {
    card: () => (
      <TrendCard
        format={{ maximumFractionDigits: 0, style: 'percent' }}
        icon={sfHumidityFill}
        name="Bathroom"
        start={0.62}
        step={0.03}
      />
    ),
    kind: 'numericalDisplay',
    name: 'Bathroom Humidity',
    size: '1x1',
  },
  {
    card: DoorbellCard,
    kind: 'binaryDisplay',
    name: 'Doorbell',
    size: '2x1',
  },
  {
    card: AllOffCard,
    kind: 'binaryDisplay',
    name: 'All Lights Off',
    size: '1x1',
  },
  {
    card: RoomCard,
    kind: 'numericalDisplay',
    name: 'Living Room',
    openSize: '4x3',
    size: '2x2',
  },
  {
    card: SpeakerCard,
    kind: 'binaryDisplay',
    name: 'Kitchen Speaker',
    openSize: '4x4',
    size: '2x1',
  },
  {
    card: ThermostatCard,
    expandedSize: '2x3',
    kind: 'numericalControl',
    name: 'Thermostat',
    size: '2x1',
    sizes: ['2x1', '2x2', '2x3'],
  },
  {
    card: GarageCard,
    kind: 'binaryControl',
    name: 'Garage Door',
    size: '2x1',
    sizes: ['2x1', '2x2'],
  },
  {
    card: WeatherCard,
    expandedSize: '4x2',
    kind: 'numericalDisplay',
    name: 'Weather',
    size: '2x1',
    sizes: ['2x1', '2x2', '3x2', '4x2'],
  },
  {
    card: EnergyCard,
    expandedSize: '4x2',
    kind: 'numericalDisplay',
    name: 'Power',
    size: '2x1',
    sizes: ['2x1', '2x2', '3x2', '4x2'],
  },
  {
    card: WasherCard,
    kind: 'numericalDisplay',
    name: 'Washer',
    size: '2x1',
    sizes: ['2x1', '2x2'],
  },
  {
    card: MailboxCard,
    kind: 'binaryDisplay',
    name: 'Mailbox',
    size: '1x1',
  },
];
