import { FunctionComponent, useEffect, useRef, useState } from 'react';

import {
  Button,
  Card,
  type CardActions,
  type ControlCardChannel,
  ControlCards,
  Progress,
  Segmented,
  Stepper,
  Symbol,
  type SymbolIcon,
} from '../../components/index.js';
import {
  Artwork,
  BarChart,
  Dial,
  HourStrip,
  kelvinColor,
  Sparkline,
} from '../tooling/card-kit.js';
import { FlipParts } from '../tooling/flip.js';
import {
  sfAntennaRadiowavesLeftAndRight,
  sfBackwardFill,
  sfBell,
  sfBellFill,
  sfBoltFill,
  sfCloudRainFill,
  sfCloudSunFill,
  sfDoorGarageClosed,
  sfDoorGarageOpen,
  sfDoorLeftHandClosed,
  sfEnvelope,
  sfEnvelopeFill,
  sfFlame,
  sfFlameFill,
  sfForwardFill,
  sfHomepodFill,
  sfHouseFill,
  sfHumidityFill,
  sfLampCeiling,
  sfLampCeilingFill,
  sfLampFloor,
  sfLampFloorFill,
  sfLightbulbFill,
  sfLightbulbLed,
  sfLightbulbLedFill,
  sfLightStrip2,
  sfLightStrip2Fill,
  sfPauseFill,
  sfPlayFill,
  sfPower,
  sfSnowflake,
  sfSunMaxFill,
  sfThermometerMedium,
  sfWasher,
  sfWasherFill,
  sfWindowShadeClosed,
} from '../tooling/icons.js';
import {
  type Expansion,
  lightsStore,
  type Tile,
  Toned,
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
}> = ({
  expansion: { collapsedSize, expandedSize, isExpanded, onToggle },
  name,
}) => (
  <ControlCards.ExpandButton
    collapsedSize={collapsedSize}
    expanded={isExpanded}
    expandedSize={expandedSize}
    label={`${name} details`}
    onExpandedChange={onToggle}
  />
);

/** Its corner buttons opening it above the page and closing it. */
const OpenButtons: FunctionComponent<{ name: string }> = ({ name }) => (
  <ControlCards.OpenButtons
    closeLabel="Close"
    label={`${name} details`}
  />
);

/** A color temperature's range (kelvin), as a slider's 0 to 1. */
const warmest = 2200;
const coolest = 6500;

/**
 * A tunable white light: small, a slider filling it (its brightness, in
 * its color's tint), a switch; large (expanded, or resized so), two bars
 * (brightness and color temperature, from warm to cool), its value saying
 * both. Never lit, as a dimmer. Its switch and brightness go together
 * (the app's to decide; here, a light's that dims out): dimmed to nothing,
 * off; brightened from it, on; switched on at nothing, at full.
 */
const TunableLightCard: FunctionComponent<{ expansion?: Expansion }> = ({
  expansion,
}) => {
  const [brightness, setBrightness] = useState(0.7);
  const [warmth, setWarmth] = useState(0.2);
  const [isOn, setIsOn] = useState(true);
  const switchTo = (next: boolean) => {
    setIsOn(next);
    if (next && brightness <= 0) setBrightness(1);
  };
  const kelvin = Math.round(warmest + warmth * (coolest - warmest));
  const tint = kelvinColor(kelvin);
  const isExpanded = useIsLarge();
  const name = 'Desk Light';
  return (
    // (Never lit, as a dimmer: its dark glass and its fill telling how
    // much; its symbol on while it's on at all.)
    <TonedCard active={false}>
      <FlipParts />
      <Card.Symbol
        active={isOn && brightness > 0}
        tint={tint}
      >
        <Symbol
          emphasizedIcon={sfLightbulbLedFill}
          icon={sfLightbulbLed}
        />
      </Card.Symbol>
      {isExpanded ? (
        <>
          <ControlCards.Channels
            value={[brightness, warmth]}
            channels={[
              { label: 'Light', name: 'Brightness', tint },
              { label: 'Color', name: 'Color temperature', tint },
            ]}
            onValueChange={(index, value) =>
              index === 0 ? setBrightness(value) : setWarmth(value)
            }
          />
          <Card.Title>
            {name} · {kelvin} K
          </Card.Title>
          <Card.Value>{percent(brightness)}</Card.Value>
        </>
      ) : (
        <ControlCards.SliderFill
          format={{ maximumFractionDigits: 0, style: 'percent' }}
          // (Its state with its value, as a slider card's: the app's, here
          // as ControlCards.Slider's default.)
          getValueText={(formatted) => `${isOn ? 'On' : 'Off'} · ${formatted}`}
          max={1}
          min={0}
          name={name}
          tint={tint}
          value={brightness}
          onPress={() => switchTo(!isOn)}
          onValueChange={(next) => {
            setBrightness(next);
            setIsOn(next > 0);
          }}
        />
      )}
      <Card.Switch
        aria-label={name}
        checked={isOn}
        tint={tint}
        onCheckedChange={switchTo}
      />
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
 * A light of several channels (three, four, five): a light card; opened
 * above the page (`opens`) or expanded for its bars.
 */
const ChannelLightCard: FunctionComponent<{
  channels: readonly ControlCardChannel[];
  /** Its symbol's icon while on (e.g. filled). */
  emphasizedIcon: SymbolIcon;
  expansion?: Expansion;
  icon: SymbolIcon;
  initial: readonly number[];
  name: string;
  /** Opened above the page for its bars (else expanded). */
  opens?: boolean;
}> = ({ expansion, initial, name, opens = false, ...props }) => (
  <Toned.Light
    defaultValue={initial}
    name={name}
    {...props}
  >
    <FlipParts />
    {opens ? <OpenButtons name={name} /> : null}
    {!opens && expansion ? (
      <ExpandButton
        expansion={expansion}
        name={name}
      />
    ) : null}
  </Toned.Light>
);

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
 * A device's status (a list card): its connection's symbol, online and
 * when it was last heard from; expanded, the details in rows.
 */
const DeviceCard: FunctionComponent<{ expansion?: Expansion }> = ({
  expansion,
}) => {
  const now = useNow(30_000);
  const [heard] = useState(() => Date.now() - 2 * 60_000);
  const isExpanded = useIsLarge();
  const name = 'Hallway Sensor';
  return (
    <Toned.List
      icon={sfAntennaRadiowavesLeftAndRight}
      name={name}
      status={isExpanded ? 'Online' : `Online · ${agoOf(heard, now)}`}
      expansion={
        expansion
          ? {
              collapsedSize: expansion.collapsedSize,
              expanded: expansion.isExpanded,
              expandedSize: expansion.expandedSize,
              label: `${name} details`,
              onExpandedChange: expansion.onToggle,
            }
          : undefined
      }
      rows={
        isExpanded
          ? [
              { label: 'Last heard', value: agoOf(heard, now) },
              { label: 'Connection', value: 'Zigbee' },
              { label: 'Battery', value: '80 %' },
              { label: 'Signal', value: '−62 dBm' },
              { label: 'Firmware', value: '1.4.2' },
            ]
          : []
      }
    >
      <FlipParts />
    </Toned.List>
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

/** A value with its trend (a value card): an arrow after it. */
const TrendCard: FunctionComponent<{
  format: Intl.NumberFormatOptions;
  icon: SymbolIcon;
  name: string;
  start: number;
  step: number;
}> = ({ format, icon, name, start, step }) => {
  const [value, angle] = useWalk(start, step, 4000);
  return (
    <Toned.Value
      format={format}
      icon={icon}
      name={name}
      trend={angle}
      value={value}
    />
  );
};

/**
 * A doorbell (a button card): pressed, its chime rings (it lights up and
 * fades back); flashed by the app as it rings at the door (here every 20
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
    <Toned.Button
      actionsRef={actions}
      emphasizedIcon={sfBellFill}
      icon={sfBell}
      name="Doorbell"
      status={
        rang === undefined
          ? 'Quiet'
          : `Rang ${new Intl.DateTimeFormat(undefined, { timeStyle: 'short' }).format(rang)}`
      }
      onPress={() => setRang(Date.now())}
    />
  );
};

/** All lights off (a button card): its value how many are still on. */
const AllOffCard: FunctionComponent = () => {
  const lights = useLights();
  const onCount = Object.values(lights).filter(Boolean).length;
  return (
    <Toned.Button
      icon={sfPower}
      name="All Lights Off"
      status={onCount > 0 ? `${String(onCount)} on` : 'All off'}
      onPress={() => {
        for (const name of Object.keys(lights)) lightsStore.set(name, false);
      }}
    />
  );
};

/**
 * A room's summary (a list card): what's going on there, in rows, as many
 * as fit; opened above the page, all of them.
 */
const RoomCard: FunctionComponent = () => {
  const lights = useLights();
  const onCount = Object.values(lights).filter(Boolean).length;
  const [temperature, angle] = useWalk(21.5, 0.3, 5000);
  const name = 'Living Room';
  return (
    <Toned.List
      icon={sfHouseFill}
      name={name}
      opening={{ closeLabel: 'Close', label: `${name} details` }}
      rows={[
        {
          icon: sfLightbulbFill,
          label: 'Lights',
          value: onCount > 0 ? `${String(onCount)} on` : 'Off',
        },
        {
          icon: sfThermometerMedium,
          label: 'Temperature',
          value: (
            <>
              {new Intl.NumberFormat(undefined, {
                maximumFractionDigits: 1,
                minimumFractionDigits: 1,
                style: 'unit',
                unit: 'celsius',
              }).format(temperature)}
              <ControlCards.Trend angle={angle} />
            </>
          ),
        },
        { icon: sfHumidityFill, label: 'Humidity', value: percent(0.46) },
        { icon: sfWindowShadeClosed, label: 'Blinds', value: percent(0.5) },
        { icon: sfHomepodFill, label: 'Speaker', value: 'Paused' },
        { icon: sfDoorLeftHandClosed, label: 'Balcony Door', value: 'Closed' },
        {
          icon: sfAntennaRadiowavesLeftAndRight,
          label: 'Devices',
          value: '12 online',
        },
      ]}
    >
      <FlipParts />
    </Toned.List>
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
/** Each mode's label and icon, and its icon while on (e.g. filled). */
const modes: Readonly<
  Record<Mode, readonly [string, SymbolIcon, SymbolIcon?]>
> = {
  auto: ['Auto', sfThermometerMedium],
  cool: ['Cool', sfSnowflake],
  heat: ['Heat', sfFlame, sfFlameFill],
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
  const [label, icon, emphasizedIcon] = modes[mode];
  return (
    <TonedCard active={mode !== 'auto'}>
      <FlipParts />
      <Card.Symbol>
        <Symbol
          emphasizedIcon={emphasizedIcon}
          icon={icon}
        />
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
 * A garage door (a progress card): a press opens or closes it; moving, a
 * progress bar of how far it's got, its value saying so.
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
    <Toned.Progress
      active={position > 0}
      emphasizedIcon={sfDoorGarageOpen}
      icon={sfDoorGarageClosed}
      name="Garage Door"
      status={state}
      tint="var(--color-ui-system-orange)"
      value={direction === 0 ? undefined : position * 100}
      onClick={() => setDirection(position > 0 ? -1 : 1)}
    />
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

/** A washing machine (a progress card): how long it has left. */
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
    <Toned.Progress
      active
      emphasizedIcon={sfWasherFill}
      icon={sfWasher}
      name="Washer"
      status={`${String(left)} min left`}
      value={((total - left) / total) * 100}
    />
  );
};

/**
 * The mailbox (a button card): how many letters are in it, a badge on its
 * symbol; a press marks them taken out.
 */
const MailboxCard: FunctionComponent = () => {
  const [letters, setLetters] = useState(3);
  return (
    <Toned.Button
      badge={letters > 0 ? letters : undefined}
      emphasizedIcon={sfEnvelopeFill}
      icon={sfEnvelope}
      name="Mailbox"
      status={letters > 0 ? `${String(letters)} letters` : 'Empty'}
      onPress={() => setLetters(0)}
    />
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
        emphasizedIcon={sfLightStrip2Fill}
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
        emphasizedIcon={sfLampCeilingFill}
        icon={sfLampCeiling}
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
        emphasizedIcon={sfLampFloorFill}
        expansion={expansion}
        icon={sfLampFloor}
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
