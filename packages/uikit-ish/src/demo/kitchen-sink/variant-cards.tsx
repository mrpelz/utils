import { FunctionComponent } from 'react';

import { Card } from '../../components/index.js';
import { cardTints } from '../tooling/card-kit.js';
import { FlipParts } from '../tooling/flip.js';
import {
  sfAirplane,
  sfAntennaRadiowavesLeftAndRight,
  sfBell,
  sfBellFill,
  sfBook,
  sfCar,
  sfCarFill,
  sfDoorGarageClosed,
  sfDoorGarageOpen,
  sfDoorLeftHandClosed,
  sfDropFill,
  sfFan,
  sfFanFill,
  sfFlameFill,
  sfHomepodFill,
  sfHouseFill,
  sfHumidityFill,
  sfLampCeiling,
  sfLampCeilingFill,
  sfLampFloorFill,
  sfLightbulb,
  sfLightbulbFill,
  sfLightStrip2,
  sfLightStrip2Fill,
  sfLockFill,
  sfLockOpen,
  sfPlayFill,
  sfPower,
  sfSnowflake,
  sfSpeakerFill,
  sfSpeakerWave3Fill,
  sfSunMax,
  sfSunMaxFill,
  sfSunMin,
  sfThermometerMedium,
  sfTimer,
  sfWasher,
  sfWasherFill,
  sfWindowShadeClosed,
} from '../tooling/icons.js';
import { rowsOf, type Tile, Toned } from './cards-shared.js';
import { ChannelLightCard, rgb } from './more-cards.js';
import { segmentsOf } from './segments.js';

// The cards page's variants (see cards.tsx): each kind of card in the
// sizes and states its others don't show, the library's supported sizes
// (`cardSizes`) and a few beyond them.

/** A share, whole percent. */
const percent: Intl.NumberFormatOptions = {
  maximumFractionDigits: 0,
  style: 'percent',
};

/** Degrees Celsius, one decimal. */
const celsius: Intl.NumberFormatOptions = {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: 'unit',
  unit: 'celsius',
};

/** A room's rows (more than fit in most of its sizes). */
const roomRows = [
  { icon: sfLightbulbFill, label: 'Lights', value: '3 on' },
  { icon: sfThermometerMedium, label: 'Temperature', value: '20.5 °C' },
  { icon: sfHumidityFill, label: 'Humidity', value: '51 %' },
  { icon: sfWindowShadeClosed, label: 'Blinds', value: 'Open' },
  { icon: sfHomepodFill, label: 'Speaker', value: 'Playing' },
  { icon: sfDoorLeftHandClosed, label: 'Door', value: 'Closed' },
  {
    icon: sfAntennaRadiowavesLeftAndRight,
    label: 'Devices',
    value: '8 online',
  },
  { icon: sfWasherFill, label: 'Washer', value: 'Idle' },
  { icon: sfDropFill, label: 'Leak Sensor', value: 'Dry' },
] as const;

/** A room's summary, opening above the page (see `roomRows`). */
const RoomSummary: FunctionComponent<{ name: string }> = ({ name }) => (
  <Toned.List
    icon={sfHouseFill}
    label={name}
  >
    <FlipParts />
    {rowsOf(roomRows)}
    <Card.CloseButton aria-label="Close" />
  </Toned.List>
);

/** A device's details, expanding in place (no symbols in its rows). */
const DeviceSummary: FunctionComponent<{ name: string }> = ({ name }) => (
  <Toned.List
    icon={sfAntennaRadiowavesLeftAndRight}
    label={name}
    status="Online · 1 min. ago"
  >
    {rowsOf([
      { label: 'Connection', value: 'Thread' },
      { label: 'Battery', value: '64 %' },
      { label: 'Signal', value: '−58 dBm' },
      { label: 'Firmware', value: '2.0.1' },
    ])}
  </Toned.List>
);

/** A heat pump's modes, with symbols (tinted while chosen). */
const heatPumpModes = [
  { icon: sfPower, label: 'Off', value: 'off' },
  { icon: sfFlameFill, label: 'Heat', tint: cardTints.heat, value: 'heat' },
  { icon: sfSnowflake, label: 'Cool', tint: cardTints.shade, value: 'cool' },
  { icon: sfThermometerMedium, label: 'Auto', value: 'auto' },
] as const;

/** A heating program's options: long words (stacked, as the app says). */
const heatingPrograms = [
  {
    icon: sfFlameFill,
    label: 'Comfort',
    subtitle: '21 °C',
    tint: cardTints.heat,
    value: 'comfort',
  },
  {
    icon: sfTimer,
    label: 'Night setback',
    subtitle: '18 °C, 22:00 to 6:00',
    value: 'night',
  },
  {
    icon: sfAirplane,
    label: 'Away for several days',
    subtitle: '16 °C',
    value: 'away',
  },
  {
    icon: sfSnowflake,
    label: 'Frost protection',
    subtitle: '7 °C only',
    tint: cardTints.shade,
    value: 'frost',
  },
  { icon: sfPower, label: 'Off', value: 'off' },
] as const;

/** A room's scenes: many (stacked in a long card). */
const scenes = [
  {
    icon: sfSunMax,
    label: 'Morning',
    subtitle: 'Blinds up, lights 60 %',
    tint: cardTints.light,
    value: 'morning',
  },
  {
    icon: sfLightbulbFill,
    label: 'Bright',
    subtitle: 'All lights 100 %',
    tint: cardTints.light,
    value: 'bright',
  },
  {
    icon: sfLampFloorFill,
    label: 'Relax',
    subtitle: 'Warm, 30 %',
    tint: cardTints.heat,
    value: 'relax',
  },
  {
    icon: sfBook,
    label: 'Reading',
    subtitle: 'Desk and floor lamp',
    value: 'reading',
  },
  {
    icon: sfPlayFill,
    label: 'Movie',
    subtitle: 'Lights off, blinds down',
    value: 'movie',
  },
  {
    icon: sfSunMin,
    label: 'Evening',
    subtitle: 'Warm, 50 %',
    value: 'evening',
  },
  {
    icon: sfTimer,
    label: 'Night',
    subtitle: 'Path lights only',
    value: 'night',
  },
  { icon: sfPower, label: 'Off', subtitle: 'Everything off', value: 'off' },
] as const;

/** A heat pump's modes with their targets under them (taller tiles). */
const heatPumpTargets = [
  { icon: sfPower, label: 'Off', value: 'off' },
  {
    icon: sfFlameFill,
    label: 'Heat',
    subtitle: 'to 21 °C',
    tint: cardTints.heat,
    value: 'heat',
  },
  {
    icon: sfSnowflake,
    label: 'Cool',
    subtitle: 'to 24 °C',
    tint: cardTints.shade,
    value: 'cool',
  },
  {
    icon: sfThermometerMedium,
    label: 'Auto',
    subtitle: '21 to 24 °C',
    value: 'auto',
  },
] as const;

/** An entrance's scenes: few, short words under them (one wide, stacked). */
const entryScenes = [
  {
    icon: sfHouseFill,
    label: 'Arrive',
    subtitle: 'Lights on',
    value: 'arrive',
  },
  { icon: sfAirplane, label: 'Leave', subtitle: 'All off', value: 'leave' },
  { icon: sfTimer, label: 'Night', subtitle: 'Path lights', value: 'night' },
  { icon: sfPower, label: 'Off', subtitle: 'Nothing', value: 'off' },
] as const;

/** A fan's speeds: words only, no symbols. */
const fanSpeeds = [
  { label: 'Off', value: 'off' },
  { label: 'Low', value: 'low' },
  { label: 'Mid', value: 'mid' },
  { label: 'High', value: 'high' },
] as const;

/** A speaker's sources (five: upright, stacked). */
const speakerSources = [
  { icon: sfPower, label: 'Off', value: 'off' },
  { icon: sfSpeakerFill, label: 'Radio', value: 'radio' },
  { icon: sfSpeakerWave3Fill, label: 'Stream', value: 'stream' },
  { icon: sfTimer, label: 'Sleep', value: 'sleep' },
  { icon: sfBellFill, label: 'Chime', value: 'chime' },
] as const;

export const variantRooms: Readonly<Record<string, readonly Tile[]>> = {
  // (Switches and states, at both their sizes, on and off.)
  'Switches and States': [
    {
      card: () => (
        <Toned.Switch
          defaultChecked
          emphasizedIcon={sfLightbulbFill}
          icon={sfLightbulb}
          label="Hall Light"
          tint={cardTints.light}
        />
      ),
      kind: 'binaryControl',
      name: 'Hall Light',
      size: '1x1',
    },
    {
      card: () => (
        <Toned.Switch
          emphasizedIcon={sfLightbulbFill}
          icon={sfLightbulb}
          label="Porch Light"
          tint={cardTints.light}
        />
      ),
      kind: 'binaryControl',
      name: 'Porch Light',
      size: '2x1',
    },
    {
      card: () => (
        <Toned.State
          active
          emphasizedIcon={sfDoorGarageOpen}
          icon={sfDoorGarageClosed}
          label="Carport Gate"
          states={['Open', 'Closed']}
        />
      ),
      kind: 'binaryDisplay',
      name: 'Carport Gate',
      size: '1x1',
    },
    {
      card: () => (
        <Toned.State
          active={false}
          emphasizedIcon={sfLockFill}
          icon={sfLockOpen}
          label="Shed"
          states={['Locked', 'Unlocked']}
        />
      ),
      kind: 'binaryDisplay',
      name: 'Shed',
      size: '2x1',
    },
  ],
  // (Values with their trends, at each size.)
  Values: [
    {
      card: () => (
        <Toned.Value
          format={celsius}
          icon={sfThermometerMedium}
          label="Bedroom"
          trend={40}
          value={19.5}
        />
      ),
      kind: 'numericalDisplay',
      name: 'Bedroom Temperature',
      size: '1x1',
    },
    {
      card: () => (
        <Toned.Value
          format={percent}
          icon={sfHumidityFill}
          label="Cellar Humidity"
          trend={-30}
          value={0.68}
        />
      ),
      kind: 'numericalDisplay',
      name: 'Cellar Humidity',
      size: '2x1',
    },
    {
      card: () => (
        <Toned.Value
          icon={sfDropFill}
          label="Rain Today"
          trend={0}
          value={4.2}
          format={{
            maximumFractionDigits: 1,
            style: 'unit',
            unit: 'millimeter',
          }}
        />
      ),
      kind: 'numericalDisplay',
      name: 'Rain Today',
      size: '2x2',
    },
  ],
  // (Sliders in every direction and length: ticked or not, with a switch
  // or not, a brightness.)
  Sliders: [
    {
      card: () => (
        <Toned.Slider
          brightness
          defaultChecked
          defaultValue={0.6}
          emphasizedIcon={sfSunMaxFill}
          format={percent}
          icon={sfSunMax}
          label="Kitchen Lights"
          max={1}
          min={0}
          tint={cardTints.light}
        />
      ),
      kind: 'numericalControl',
      name: 'Kitchen Lights',
      size: '3x1',
    },
    {
      card: () => (
        <Toned.Slider
          defaultValue={0.3}
          format={percent}
          icon={sfSpeakerWave3Fill}
          label="Volume"
          max={1}
          min={0}
          step={0.1}
        />
      ),
      kind: 'numericalControl',
      name: 'Volume',
      size: '4x1',
    },
    {
      card: () => (
        <Toned.Slider
          defaultChecked
          defaultValue={0.75}
          emphasizedIcon={sfFanFill}
          format={percent}
          icon={sfFan}
          label="Attic Fan"
          max={1}
          min={0}
          step={0.25}
          tint={cardTints.air}
        />
      ),
      kind: 'numericalControl',
      name: 'Attic Fan',
      size: '1x2',
    },
    {
      card: () => (
        <Toned.Slider
          brightness
          defaultChecked={false}
          defaultValue={0.4}
          emphasizedIcon={sfLightbulbFill}
          format={percent}
          icon={sfLightbulb}
          label="Garden Lights"
          max={1}
          min={0}
          tint={cardTints.light}
        />
      ),
      kind: 'numericalControl',
      name: 'Garden Lights',
      size: '1x3',
    },
    {
      card: () => (
        <Toned.Slider
          defaultValue={0.5}
          format={percent}
          icon={sfWindowShadeClosed}
          label="Skylight"
          max={1}
          min={0}
          tint={cardTints.shade}
        />
      ),
      kind: 'numericalControl',
      name: 'Skylight',
      size: '2x1',
    },
  ],
  // (Buttons and progress at their sizes, a light at sizes of its own.)
  'Buttons, Progress and Lights': [
    {
      card: () => (
        <Toned.Button
          emphasizedIcon={sfBellFill}
          icon={sfBell}
          label="Chime"
          status="Ready"
        />
      ),
      kind: 'binaryDisplay',
      name: 'Chime',
      size: '1x1',
    },
    {
      card: () => (
        <Toned.Progress
          active
          emphasizedIcon={sfWasherFill}
          icon={sfWasher}
          label="Dryer"
          // (A light tint: dark text on its fill, see ControlCards.)
          tint="var(--color-ui-system-yellow)"
        >
          <Card.Progress value={80}>
            <Card.ProgressBar>
              <Card.ProgressLabel>12 min</Card.ProgressLabel>
            </Card.ProgressBar>
          </Card.Progress>
        </Toned.Progress>
      ),
      kind: 'progressDisplay',
      name: 'Dryer',
      size: '1x1',
    },
    {
      card: () => (
        // (Not switchable (`active` left out): its glass by the color
        // scheme, or the page's tone.)
        <Toned.Progress
          emphasizedIcon={sfWasherFill}
          icon={sfWasher}
          label="Dishwasher"
          tint="var(--color-ui-system-purple)"
        >
          <Card.Progress value={35}>
            <Card.Subtitle>Eco, ends at 15:10</Card.Subtitle>
            <Card.ProgressValue />
            <Card.ProgressBar>
              <Card.ProgressLabel>Drying</Card.ProgressLabel>
              <Card.ProgressDetail>40 min left</Card.ProgressDetail>
            </Card.ProgressBar>
          </Card.Progress>
        </Toned.Progress>
      ),
      kind: 'progressDisplay',
      name: 'Dishwasher',
      size: '2x2',
    },
    {
      // (Not active: the car's off, parked, while its battery charges; dark
      // glass, its symbol and fill not lit, its progress shown all the same.
      // Whether a progress is "on" is the app's, see ControlCards.)
      card: () => (
        <Toned.Progress
          active={false}
          emphasizedIcon={sfCarFill}
          icon={sfCar}
          label="Car"
          tint="var(--color-ui-system-green)"
        >
          <Card.Progress value={64}>
            <Card.ProgressBar>
              <Card.ProgressLabel>Charging</Card.ProgressLabel>
              <Card.ProgressDetail>1 h 20 min</Card.ProgressDetail>
            </Card.ProgressBar>
          </Card.Progress>
        </Toned.Progress>
      ),
      kind: 'progressDisplay',
      name: 'Car',
      size: '2x1',
    },
    {
      card: () => (
        <ChannelLightCard
          channels={rgb}
          emphasizedIcon={sfLightStrip2Fill}
          icon={sfLightStrip2}
          initial={[0.2, 0.8, 0.5]}
          name="Shelf Strip"
        />
      ),
      kind: 'binaryControl',
      name: 'Shelf Strip',
      size: '1x1',
      sizes: ['1x1', '2x1', '2x2'],
    },
    {
      card: () => (
        <ChannelLightCard
          channels={rgb}
          emphasizedIcon={sfLampCeilingFill}
          icon={sfLampCeiling}
          initial={[0.7, 0.4, 0.9]}
          name="Studio Light"
        />
      ),
      kind: 'binaryControl',
      name: 'Studio Light',
      size: '2x2',
      sizes: ['1x1', '2x1', '2x2'],
    },
  ],
  // (Summaries at their wider and taller sizes: opening, expanding, a
  // sole row.)
  'Wider Summaries': [
    {
      card: () => <RoomSummary name="Loft" />,
      kind: 'summaryDisplay',
      name: 'Loft',
      openSize: '4x4',
      size: '4x1',
    },
    {
      card: () => <RoomSummary name="Study" />,
      kind: 'summaryDisplay',
      name: 'Study',
      openSize: '4x4',
      size: '3x2',
    },
    {
      card: () => <RoomSummary name="Basement" />,
      kind: 'summaryDisplay',
      name: 'Basement',
      openSize: '4x4',
      size: '4x2',
    },
    {
      card: () => <RoomSummary name="Guest House" />,
      kind: 'summaryDisplay',
      name: 'Guest House',
      openSize: '4x4',
      size: '3x3',
    },
    {
      card: () => <DeviceSummary name="Cellar Sensor" />,
      expandedSize: '4x2',
      kind: 'summaryDisplay',
      name: 'Cellar Sensor',
      size: '4x1',
    },
    {
      card: () => <RoomSummary name="Whole House" />,
      kind: 'summaryDisplay',
      name: 'Whole House',
      size: '4x4',
    },
  ],
  // (Segmented cards: what their options show at the app's discretion
  // (symbols and words, symbols only, words only, words in a taller
  // tile), and their wider and taller sizes.)
  'More Modes': [
    {
      card: () => (
        <Toned.Segmented
          icon={sfPower}
          label="Lounge Heat Pump"
          offValue="off"
        >
          {' '}
          <FlipParts />
          <Card.Segmented
            defaultValue="cool"
            optionContent="icon"
          >
            {segmentsOf(heatPumpModes)}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Lounge Heat Pump',
      size: '2x1',
    },
    {
      card: () => (
        <Toned.Segmented
          icon={sfPower}
          label="Studio Heat Pump"
          offValue="off"
        >
          {' '}
          <FlipParts />
          <Card.Segmented
            defaultValue="heat"
            optionContent="label"
          >
            {segmentsOf(heatPumpModes)}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Studio Heat Pump',
      size: '2x1',
    },
    {
      card: () => (
        <Toned.Segmented
          icon={sfFan}
          label="Ceiling Fan Speed"
          offValue="off"

          tint={cardTints.air}
        >
          {' '}
          <FlipParts />
          <Card.Segmented defaultValue="mid">
            {segmentsOf(fanSpeeds)}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Ceiling Fan Speed',
      size: '2x2',
    },
    {
      card: () => (
        <Toned.Segmented
          icon={sfPower}
          label="Basement Heat Pump"
          offValue="off"
          // (Cooling not available (e.g. in winter): disabled.)
        >
          {' '}
          <FlipParts />
          <Card.Segmented defaultValue="auto">
            {segmentsOf(
              heatPumpModes.map((mode) =>
                mode.value === 'cool' ? { ...mode, disabled: true } : mode,
              ),
            )}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Basement Heat Pump',
      size: '4x1',
    },
    {
      card: () => (
        <Toned.Segmented
          icon={sfFan}
          label="Bathroom Fan"
          offValue="off"

          tint={cardTints.air}
        >
          {' '}
          <FlipParts />
          <Card.Segmented defaultValue="low">
            {segmentsOf(fanSpeeds)}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Bathroom Fan',
      size: '3x1',
    },
    {
      card: () => (
        <Toned.Segmented
          icon={sfPower}
          label="Workshop Heat Pump"
          offValue="off"
        >
          {' '}
          <FlipParts />
          <Card.Segmented defaultValue="heat">
            {segmentsOf(heatPumpTargets)}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Workshop Heat Pump',
      size: '4x2',
    },
    {
      card: () => (
        <Toned.Segmented
          icon={sfSpeakerFill}
          label="Speaker Source"
          offValue="off"
          // (The chime unavailable (e.g. muted at night): disabled.)
        >
          {' '}
          <FlipParts />
          <Card.Segmented defaultValue="stream">
            {segmentsOf(
              speakerSources.map((source) =>
                source.value === 'chime'
                  ? { ...source, disabled: true }
                  : source,
              ),
            )}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Speaker Source',
      size: '1x3',
    },
    {
      card: () => (
        <Toned.Segmented
          icon={sfFan}
          label="Porch Fan"
          offValue="off"

          tint={cardTints.air}
        >
          {' '}
          <FlipParts />
          <Card.Segmented defaultValue="off">
            {segmentsOf(fanSpeeds)}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Porch Fan',
      size: '3x2',
    },
    {
      // (Stacked as the app says, though two wide: long words.)
      card: () => (
        <Toned.Segmented
          icon={sfFlameFill}
          label="Heating Program"
          offValue="off"
        >
          {' '}
          <FlipParts />
          <Card.Segmented
            defaultValue="night"
            orientation="vertical"
          >
            {segmentsOf(heatingPrograms)}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Heating Program',
      size: '2x3',
    },
    {
      // (Long, many options stacked.)
      card: () => (
        <Toned.Segmented
          icon={sfLightbulbFill}
          label="Scenes"
          offValue="off"
        >
          {' '}
          <FlipParts />
          <Card.Segmented
            defaultValue="relax"
            orientation="vertical"
          >
            {segmentsOf(scenes)}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Scenes',
      size: '2x4',
    },
    {
      // (Long and slim, many options stacked, each its symbol over its
      // words (their subtitles where they're tall enough: here, none).)
      card: () => (
        <Toned.Segmented
          icon={sfLightbulbFill}
          label="Den Scenes"
          offValue="off"
        >
          {' '}
          <FlipParts />
          <Card.Segmented
            defaultValue="movie"
            orientation="vertical"
          >
            {segmentsOf(scenes)}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Den Scenes',
      size: '1x4',
    },
    {
      // (Long and slim, few options stacked: tall enough for their
      // subtitles, under their words.)
      card: () => (
        <Toned.Segmented
          icon={sfHouseFill}
          label="Entry"
          offValue="off"
        >
          {' '}
          <FlipParts />
          <Card.Segmented
            defaultValue="arrive"
            orientation="vertical"
          >
            {segmentsOf(entryScenes)}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Entry Scenes',
      size: '1x4',
    },
  ],
};
