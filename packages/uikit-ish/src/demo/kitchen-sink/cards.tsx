import { FunctionComponent, useState } from 'react';

import {
  Button,
  Card,
  cardSizes,
  ControlCards,
  forwardClick,
  type GlassContextValue,
  Grid,
  gridIcons,
  type GridSize,
  Header,
  List,
  Page,
  Segmented,
  Switch,
  Symbol,
  Toolbar,
  useGridItem,
  Viewport,
} from '../../components/index.js';
import { cardTints } from '../tooling/card-kit.js';
import { FlipParts } from '../tooling/flip.js';
import { gridSigns as gridSignsOf } from '../tooling/grid-signs.js';
import {
  sfAirplane,
  sfAntennaRadiowavesLeftAndRight,
  sfDoorLeftHandClosed,
  sfDoorLeftHandOpen,
  sfFan,
  sfFanFill,
  sfFlameFill,
  sfGearshape,
  sfHareFill,
  sfHomepodFill,
  sfHouseFill,
  sfHumidityFill,
  sfLightbulb,
  sfLightbulbFill,
  sfLockFill,
  sfLockOpen,
  sfPhoto,
  sfPower,
  sfSnowflake,
  sfThermometerMedium,
  sfTortoiseFill,
  sfWindowShadeClosed,
} from '../tooling/icons.js';
import {
  CardToneContext,
  lightsStore,
  rowsOf,
  settingsStore,
  type Tile,
  Toned,
  TonedCard,
  useIsLarge,
  useLights,
  useSettingsTarget,
} from './cards-shared.js';
import { SectionHeader } from './grid-shared.js';
import { moreTiles } from './more-cards.js';
import { segmentsOf } from './segments.js';
import {
  AdaptiveBarTitle,
  BackButton,
  type SinkPages,
  usePush,
} from './shared.js';
import { variantRooms } from './variant-cards.js';

// Cards: a home's devices as cards in a grid on a picture, every kind in
// each of its sizes: binary displays (a door, a lock), binary controls
// (switches), numerical displays (a temperature, the humidity) and
// numerical controls (sliders, continuous and stepped, horizontal and
// vertical). Edit in the bar starts edit mode: the cards are veiled and
// inert, moved and resized as tiles. More to It: cards with a corner
// button (expanding in place, also within room around it; drilling into a
// page of their own; opening above the page), their parts moved with GSAP
// as they change (see tooling/flip.ts); Empty: cards with nothing but such
// a button, the tile's own motion alone (no GSAP). Below the grid, two on
// their own.

/** A temperature, one decimal place. */
const celsius: Intl.NumberFormatOptions = {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: 'unit',
  unit: 'celsius',
};

/** A share, whole percent. */
const percent: Intl.NumberFormatOptions = {
  maximumFractionDigits: 0,
  style: 'percent',
};

/**
 * Heating: small, the room's temperature; expanded, a slider filling it
 * (a `Card.Slider`) setting what it heats to. Its corner button
 * expands it and makes it small again.
 */
const HeatingCard: FunctionComponent = () => {
  const [target, setTarget] = useState(22);
  // (Large (expanded, or resized so): its slider.)
  const isExpanded = useIsLarge();
  const canExpand = useGridItem()?.expandedSize !== undefined;
  return (
    <TonedCard
      // (Small, a press anywhere on it as on its button (shown: expanding
      // changing it); expanded, its slider's, the button alone expanding
      // it no more.)
      onClick={
        canExpand && !isExpanded
          ? forwardClick(
              '[data-card-part=corner-button]:not([data-grid-hidden])',
            )
          : undefined
      }
    >
      {/* (Its parts moved from where they were as it expands, with GSAP.) */}
      <FlipParts />
      <Card.Symbol>
        <Symbol
          box="square"
          icon={sfThermometerMedium}
        />
      </Card.Symbol>
      {isExpanded ? (
        <Card.Slider
          format={celsius}
          label="Heat to"
          max={26}
          min={16}
          step={0.5}
          tint={cardTints.heat}
          value={target}
          onValueChange={setTarget}
        />
      ) : (
        <>
          <Card.Title>Heating</Card.Title>
          <Card.Value
            format={celsius}
            value={21.5}
          />
        </>
      )}
      <Card.ExpandButton aria-label="Heating details" />
    </TonedCard>
  );
};

/**
 * A dimmer: a slider card controlling a brightness, with a switch. How the
 * two go together is the app's (here: its value set while off is where it
 * comes on; switched on at its minimum, at its maximum).
 */
const DimmerCard: FunctionComponent = () => {
  const [value, setValue] = useState(0.6);
  const [isOn, setIsOn] = useState(true);
  return (
    <Toned.Slider
      brightness
      checked={isOn}
      emphasizedIcon={sfLightbulbFill}
      format={percent}
      icon={sfLightbulb}
      label="Dimmer"
      max={1}
      min={0}
      tint={cardTints.light}
      value={value}
      onValueChange={setValue}
      onCheckedChange={(next) => {
        setIsOn(next);
        if (next && value <= 0) setValue(1);
      }}
    />
  );
};

/**
 * The lights, on or off: the app's state, shared by their card and their
 * page (two pages of the kitchen sink's, so kept outside both).
 */

/**
 * The lights: how many are on, bright while any is (a state card); its
 * corner button goes to their page (`card/lights`), a switch per light; a
 * press anywhere on it as on that button (it has no control of its own).
 */
const LightsCard: FunctionComponent = () => {
  const push = usePush();
  const onCount = Object.values(useLights()).filter(Boolean).length;
  return (
    <Toned.State
      active={onCount > 0}
      emphasizedIcon={sfLightbulbFill}
      icon={sfLightbulb}
      label="Lights"
      states={[`${String(onCount)} On`, 'Off']}
      onClick={forwardClick('[data-card-part=corner-button]')}
    >
      <Card.CornerButton
        aria-label="Lights"
        icon={gridIcons.drillIn}
        onClick={() => push('card/lights')}
      />
    </Toned.State>
  );
};

/**
 * The home's summary (a list card): some rows going to a page of their own
 * (a chevron after their value: Lights, Doors), others not (Devices).
 */
const HomeCard: FunctionComponent = () => {
  const push = usePush();
  const onCount = Object.values(useLights()).filter(Boolean).length;
  return (
    <Toned.List
      icon={sfHouseFill}
      label="Home"
    >
      {rowsOf([
        {
          icon: sfLightbulbFill,
          label: 'Lights',
          onPress: () => push('card/lights'),
          value: onCount > 0 ? `${String(onCount)} on` : 'Off',
        },
        {
          icon: sfLockFill,
          label: 'Doors',
          onPress: () => push('card/doors'),
          value: '1 unlocked',
        },
        {
          icon: sfAntennaRadiowavesLeftAndRight,
          label: 'Devices',
          value: '12 online',
        },
      ])}
    </Toned.List>
  );
};

/** The doors' page: each door, locked or not (see `HomeCard`). */
const DoorsPage: FunctionComponent = () => (
  <List.Root>
    <List.Section>
      <List.Group>
        {[
          ['Front Door', 'Locked'],
          ['Back Door', 'Unlocked'],
          ['Garage', 'Locked'],
        ].map(([name, state]) => (
          <List.Item key={name}>
            <List.Content>
              <List.Title>{name}</List.Title>
            </List.Content>
            <List.Trailing>
              <List.Detail>{state}</List.Detail>
            </List.Trailing>
          </List.Item>
        ))}
      </List.Group>
    </List.Section>
  </List.Root>
);

/** The lights' page: a switch per light, a press on its row as on it. */
/**
 * A card's settings button (a gear, in its top trailing corner, free of
 * the grid's edit buttons): to its settings page (`card/settings`); shown
 * only while editing (`show`, e.g. a card's settings), or either way
 * (`stay`, in the grid's controls' color while editing).
 */
const SettingsButton: FunctionComponent<{
  name: string;
  whileEditing: 'show' | 'stay';
}> = ({ name, whileEditing }) => {
  const push = usePush();
  return (
    <Card.CornerButton
      aria-label={`${name} Settings`}
      corner="top-trailing"
      icon={sfGearshape}
      whileEditing={whileEditing}
      onClick={() => {
        settingsStore.set(name);
        push('card/settings');
      }}
    />
  );
};

/** A card's settings (see `SettingsButton`): the app's, made up. */
const SettingsPage: FunctionComponent = () => {
  const name = useSettingsTarget();
  return (
    <List.Root>
      <List.Section>
        <List.Group>
          <List.Item>
            <List.Content>
              <List.Title>Name</List.Title>
            </List.Content>
            <List.Trailing>
              <List.Detail>{name}</List.Detail>
            </List.Trailing>
          </List.Item>
          <List.Item onClick={forwardClick('[role=switch]')}>
            <List.Content>
              <List.Title>Show in Home</List.Title>
            </List.Content>
            <List.Trailing>
              <Switch.Root
                defaultChecked
                aria-label="Show in Home"
              >
                <Switch.Thumb />
              </Switch.Root>
            </List.Trailing>
          </List.Item>
        </List.Group>
      </List.Section>
    </List.Root>
  );
};

const LightsPage: FunctionComponent = () => {
  const lights = useLights();
  return (
    <List.Root>
      <List.Section>
        <List.Group>
          {Object.entries(lights).map(([name, isOn]) => (
            <List.Item
              key={name}
              onClick={forwardClick('[role=switch]')}
            >
              <List.Content>
                <List.Title>{name}</List.Title>
              </List.Content>
              <List.Trailing>
                <Switch.Root
                  aria-label={name}
                  checked={isOn}
                  onCheckedChange={(next) => lightsStore.set(name, next)}
                >
                  <Switch.Thumb />
                </Switch.Root>
              </List.Trailing>
            </List.Item>
          ))}
        </List.Group>
      </List.Section>
    </List.Root>
  );
};

/**
 * A camera: opened above the page (its item's `open`, see `CardsApp`) by
 * its corner button or a press anywhere on it; open, larger, its x (top
 * leading) closing it (as a press beside it, or Escape).
 */
const CameraCard: FunctionComponent = () => {
  const item = useGridItem();
  const isOpen = item?.open === true;
  return (
    <TonedCard
      onClick={
        isOpen
          ? undefined
          : forwardClick(
              '[data-card-part=corner-button]:not([data-grid-hidden])',
            )
      }
    >
      {/* (Its parts moved from where they were as it opens, with GSAP.) */}
      <FlipParts />
      <Card.Symbol>
        <Symbol
          box="square"
          icon={sfPhoto}
        />
      </Card.Symbol>
      <Card.Title>Front Door Camera</Card.Title>
      <Card.Value>{isOpen ? 'Live, recording' : 'Live'}</Card.Value>
      {/* (Opening it, closed; its x, open, where the others' are: each
          fading as it grows and shrinks.) */}
      <>
        <Card.OpenButton aria-label="Front Door Camera" />
        <Card.CloseButton aria-label="Close" />
      </>
    </TonedCard>
  );
};

/**
 * An empty card that expands: its corner button alone (expanding it and
 * making it small again), nothing in it moving but that, with its corner:
 * the tile's own motion.
 */
const EmptyExpandingCard: FunctionComponent<{ name: string }> = ({ name }) => (
  <TonedCard>
    <Card.ExpandButton aria-label={name} />
  </TonedCard>
);

/**
 * An empty card that opens above the page: its corner button opening it,
 * open, its x closing it (as a press beside it, or Escape).
 */
const EmptyOpeningCard: FunctionComponent<{ name: string }> = ({ name }) => (
  <TonedCard>
    <>
      <Card.OpenButton aria-label={name} />
      <Card.CloseButton aria-label="Close" />
    </>
  </TonedCard>
);

/** A room's summary's rows (see the Summaries room): more than fit. */
const roomRows = [
  { icon: sfLightbulbFill, label: 'Lights', value: '2 on' },
  { icon: sfThermometerMedium, label: 'Temperature', value: '21.5 °C' },
  { icon: sfHumidityFill, label: 'Humidity', value: '46 %' },
  { icon: sfWindowShadeClosed, label: 'Blinds', value: '50 %' },
  { icon: sfHomepodFill, label: 'Speaker', value: 'Paused' },
  { icon: sfDoorLeftHandClosed, label: 'Balcony Door', value: 'Closed' },
  {
    icon: sfAntennaRadiowavesLeftAndRight,
    label: 'Devices',
    value: '12 online',
  },
] as const;

/** A device's details' rows (see the Summaries room): no symbols. */
const deviceRows = [
  { label: 'Last heard', value: '2 min. ago' },
  { label: 'Connection', value: 'Zigbee' },
  { label: 'Battery', value: '80 %' },
  { label: 'Signal', value: '−62 dBm' },
  { label: 'Firmware', value: '1.4.2' },
] as const;

/**
 * A device's status (a list card), expanding in place from its last row
 * (see the Summaries room).
 */
const SensorCard: FunctionComponent<{ name: string }> = ({ name }) => (
  <Toned.List
    icon={sfAntennaRadiowavesLeftAndRight}
    label={name}
    status="Online"
  >
    {rowsOf(deviceRows)}
  </Toned.List>
);

/**
 * A room's summary (a list card), opening above the page from its last
 * row (see the Summaries room).
 */
const SummaryCard: FunctionComponent<{ name: string }> = ({ name }) => (
  <Toned.List
    icon={sfHouseFill}
    label={name}
  >
    <FlipParts />
    {rowsOf(roomRows)}
    <Card.CloseButton aria-label="Close" />
  </Toned.List>
);

/** A heat pump's modes (see the Modes room): off, or heating, cooling. */
const heatPumpModes = [
  { icon: sfPower, label: 'Off', value: 'off' },
  { icon: sfFlameFill, label: 'Heat', tint: cardTints.heat, value: 'heat' },
  { icon: sfSnowflake, label: 'Cool', tint: cardTints.shade, value: 'cool' },
  { icon: sfThermometerMedium, label: 'Auto', value: 'auto' },
] as const;

const roomsInitial: Readonly<Record<string, readonly Tile[]>> = {
  'Living Room': [
    {
      card: () => (
        <Toned.Switch
          defaultChecked
          emphasizedIcon={sfLightbulbFill}
          icon={sfLightbulb}
          label="Floor Lamp"
          tint={cardTints.light}
        >
          {/* (Its settings, editing or not: its color as the card's, lit
              or off, and the grid's controls' while editing.) */}
          <SettingsButton
            name="Floor Lamp"
            whileEditing="stay"
          />
        </Toned.Switch>
      ),
      kind: 'binaryControl',
      name: 'Floor Lamp',
      size: '2x1',
    },
    {
      card: () => (
        <Toned.Switch
          emphasizedIcon={sfFanFill}
          icon={sfFan}
          label="Ceiling Fan"
          tint={cardTints.air}
        />
      ),
      kind: 'binaryControl',
      name: 'Ceiling Fan',
      size: '1x1',
    },
    {
      card: DimmerCard,
      kind: 'numericalControl',
      name: 'Dimmer',
      size: '2x1',
    },
    {
      card: () => (
        <Toned.Slider
          defaultValue={0.5}
          format={percent}
          icon={sfWindowShadeClosed}
          label="Blinds"
          max={1}
          min={0}
          step={0.25}
          tint={cardTints.shade}
        />
      ),
      kind: 'numericalControl',
      name: 'Blinds',
      size: '1x2',
    },
    {
      // (Ticked, with a switch: off, its fill not drawn, a dashed line
      // where it'd end, its value with its off word.)
      card: () => (
        <Toned.Slider
          defaultChecked
          defaultValue={0.5}
          emphasizedIcon={sfFanFill}
          format={percent}
          icon={sfFan}
          label="Fan Speed"
          max={1}
          min={0}
          step={0.25}
          tint={cardTints.air}
        />
      ),
      kind: 'numericalControl',
      name: 'Fan Speed',
      size: '2x1',
    },
  ],
  Climate: [
    {
      card: () => (
        <Toned.Value
          icon={sfThermometerMedium}
          label="Living Room Temperature"
          value={21.5}
          format={{
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
            style: 'unit',
            unit: 'celsius',
          }}
        >
          {/* (Its settings, while editing only.) */}
          <SettingsButton
            name="Living Room Temperature"
            whileEditing="show"
          />
        </Toned.Value>
      ),
      kind: 'numericalDisplay',
      name: 'Temperature',
      size: '2x2',
    },
    {
      card: () => (
        <Toned.Value
          format={percent}
          icon={sfHumidityFill}
          label="Humidity"
          value={0.46}
        >
          {/* (Its settings, editing or not.) */}
          <SettingsButton
            name="Humidity"
            whileEditing="stay"
          />
        </Toned.Value>
      ),
      kind: 'numericalDisplay',
      name: 'Humidity',
      size: '1x1',
    },
    {
      card: () => (
        <Toned.Slider
          defaultValue={21}
          icon={sfThermometerMedium}
          label="Thermostat"
          max={25}
          min={15}
          step={0.5}
          tint={cardTints.heat}
          format={{
            maximumFractionDigits: 1,
            style: 'unit',
            unit: 'celsius',
          }}
        />
      ),
      kind: 'numericalControl',
      name: 'Thermostat',
      size: '1x3',
    },
    {
      card: () => (
        <Toned.Value
          icon={sfFanFill}
          label="Wind"
          value={12.5}
          format={{
            maximumFractionDigits: 1,
            style: 'unit',
            unit: 'kilometer-per-hour',
          }}
        />
      ),
      kind: 'numericalDisplay',
      name: 'Wind',
      size: '2x1',
    },
  ],
  Empty: [
    {
      card: () => <EmptyExpandingCard name="Expand in place" />,
      expandedSize: '2x2',
      kind: 'numericalDisplay',
      name: 'Empty, expanding',
      size: '1x1',
    },
    {
      area: '3x2',
      card: () => <EmptyExpandingCard name="Expand in its area" />,
      expandedSize: '2x2',
      kind: 'numericalDisplay',
      name: 'Empty, expanding in its area',
      size: '1x1',
    },
    {
      card: () => <EmptyOpeningCard name="Open above the page" />,
      kind: 'binaryDisplay',
      name: 'Empty, opening',
      openSize: '4x3',
      size: '2x1',
    },
  ],
  'More to It': [
    {
      card: HeatingCard,
      expandedSize: '2x2',
      kind: 'numericalDisplay',
      name: 'Heating',
      size: '1x1',
    },
    {
      card: HeatingCard,
      expandedSize: '2x2',
      kind: 'numericalDisplay',
      name: 'Heating (2x2 already)',
      size: '2x2',
    },
    {
      area: '3x2',
      card: HeatingCard,
      expandedSize: '2x2',
      kind: 'numericalDisplay',
      name: 'Heating (in its area)',
      size: '1x1',
    },
    {
      card: LightsCard,
      kind: 'binaryDisplay',
      name: 'Lights',
      size: '2x1',
    },
    {
      card: CameraCard,
      kind: 'binaryDisplay',
      name: 'Front Door Camera',
      openSize: '4x3',
      size: '2x1',
    },
  ],
  'More Kinds': moreTiles,
  // (Rows, as the mock-ups show them: a room's, opening from its last row
  // (2x2, 2x1); a device's details, expanding from it and back (one
  // expanded at first).)
  Summaries: [
    {
      // (Rows going to pages of their own: a chevron after their values.)
      card: HomeCard,
      kind: 'summaryDisplay',
      name: 'Home',
      size: '2x2',
    },
    {
      card: () => <SummaryCard name="Kitchen" />,
      kind: 'summaryDisplay',
      name: 'Kitchen',
      openSize: '4x3',
      size: '2x2',
    },
    {
      card: () => <SummaryCard name="Bedroom" />,
      kind: 'summaryDisplay',
      name: 'Bedroom',
      openSize: '4x3',
      size: '2x1',
    },
    {
      card: () => <SensorCard name="Garage Sensor" />,
      expandedSize: '2x2',
      kind: 'summaryDisplay',
      name: 'Garage Sensor',
      size: '2x1',
    },
    {
      card: () => <SensorCard name="Attic Sensor" />,
      expandedSize: '2x2',
      kind: 'summaryDisplay',
      name: 'Attic Sensor',
      size: '2x1',
    },
  ],
  // (A device of a few modes in each of its layouts: across a row (its
  // words only, two wide; its symbols beside them, three wide), taller,
  // upright, and 1x1, opening above the page to choose.)
  Modes: [
    {
      card: () => (
        <Toned.Segmented
          icon={sfPower}
          label="Heat Pump"
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
      name: 'Heat Pump',
      size: '2x1',
    },
    {
      card: () => (
        <Toned.Segmented
          icon={sfPower}
          label="Office Heat Pump"
          offValue="off"
        >
          {' '}
          <FlipParts />
          <Card.Segmented defaultValue="off">
            {segmentsOf(heatPumpModes)}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Office Heat Pump',
      size: '3x1',
    },
    {
      card: () => (
        <Toned.Segmented
          icon={sfPower}
          label="Air Purifier"
          offValue="off"
          tint={cardTints.air}
        >
          {' '}
          <FlipParts />
          <Card.Segmented defaultValue="slow">
            {segmentsOf([
              { icon: sfPower, label: 'Off', value: 'off' },
              { icon: sfFanFill, label: 'Auto', value: 'auto' },
              { icon: sfTortoiseFill, label: 'Slow', value: 'slow' },
              { icon: sfHareFill, label: 'Turbo', value: 'turbo' },
            ])}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Air Purifier',
      size: '2x2',
    },
    {
      card: () => (
        <Toned.Segmented
          icon={sfLockOpen}
          label="Alarm"
          offValue="off"
          tint="oklch(64% 0.21 25)"
        >
          {' '}
          <FlipParts />
          <Card.Segmented defaultValue="away">
            {segmentsOf([
              { icon: sfLockOpen, label: 'Off', value: 'off' },
              { icon: sfHouseFill, label: 'Home', value: 'home' },
              { icon: sfAirplane, label: 'Away', value: 'away' },
            ])}
          </Card.Segmented>
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Alarm',
      size: '1x2',
    },
    {
      card: () => (
        <Toned.Segmented
          icon={sfPower}
          label="Guest Room Heat"
          offValue="off"
        >
          {' '}
          <FlipParts />
          <Card.Segmented defaultValue="off">
            {segmentsOf(heatPumpModes)}
          </Card.Segmented>
          <Card.OpenButton aria-label="Guest Room Heat modes" />
          <Card.CloseButton aria-label="Close" />
        </Toned.Segmented>
      ),
      kind: 'choiceControl',
      name: 'Guest Room Heat',
      openSize: '3x2',
      size: '1x1',
    },
  ],
  ...variantRooms,
  Security: [
    {
      card: () => (
        <Toned.State
          active
          emphasizedIcon={sfLockFill}
          icon={sfLockOpen}
          label="Front Door"
          states={['Locked', 'Unlocked']}
        />
      ),
      kind: 'binaryDisplay',
      name: 'Front Door',
      size: '2x1',
    },
    {
      card: () => (
        <Toned.State
          active={false}
          emphasizedIcon={sfDoorLeftHandOpen}
          icon={sfDoorLeftHandClosed}
          label="Back Door"
          states={['Open', 'Closed']}
        />
      ),
      kind: 'binaryDisplay',
      name: 'Back Door',
      size: '1x1',
    },
  ],
};

/** The heading above the cards on their own (as a section's, no grid). */
const SectionHeaderAlone: FunctionComponent = () => (
  <div className="kitchen-sink-grid-header">
    <span className="kitchen-sink-grid-heading">
      <span className="kitchen-sink-grid-title">On Their Own</span>
      <span className="kitchen-sink-grid-hint">
        Cards work outside a grid too, sized by their boxes.
      </span>
    </span>
  </div>
);

/** The page: a bar with Back and Edit, the rooms below it. */
const CardsApp: FunctionComponent = () => {
  const [editing, setEditing] = useState(false);
  // (The cards' glass context, to compare: the scheme's, forced, adaptive.)
  const [tone, setTone] = useState<string>('scheme');
  const [rooms, setRooms] = useState(roomsInitial);
  const [gridSigns] = useState(gridSignsOf);
  const handle = Grid.useCreateReorderHandle({
    onReorder: (change) =>
      setRooms((current) => Grid.reorder(current, change, ({ name }) => name)),
  });
  const resize = (name: string, size: GridSize) => {
    setRooms((current) =>
      Object.fromEntries(
        Object.entries(current).map(([room, tiles]) => [
          room,
          tiles.map((tile) => (tile.name === name ? { ...tile, size } : tile)),
        ]),
      ),
    );
  };

  return (
    <>
      <Viewport.Background>
        <div
          aria-hidden="true"
          className="demo-picture"
        />
      </Viewport.Background>
      <Header.Root>
        <Viewport.BlockStart>
          <Toolbar.Root placement="block-start">
            <Toolbar.Leading>
              <BackButton />
            </Toolbar.Leading>
            <AdaptiveBarTitle>
              <span>Cards</span>
            </AdaptiveBarTitle>
            <Toolbar.Trailing>
              <Toolbar.Button
                prominent={editing}
                onClick={() => setEditing(!editing)}
              >
                <Button.Label>{editing ? 'Done' : 'Edit'}</Button.Label>
              </Toolbar.Button>
            </Toolbar.Trailing>
          </Toolbar.Root>
        </Viewport.BlockStart>
        <Page.Root
          className="kitchen-sink-grid-page"
          style={gridSigns}
        >
          <Viewport.Padding edge="block-start" />
          <Header.LargeTitle>
            <span>Cards</span>
          </Header.LargeTitle>
          <div className="kitchen-sink-tone">
            <Segmented.Root
              aria-label="Cards’ glass"
              value={tone}
              onValueChange={(next) => setTone(String(next))}
            >
              <Segmented.Item value="scheme">Scheme</Segmented.Item>
              <Segmented.Item value="bright">Light</Segmented.Item>
              <Segmented.Item value="dim">Dark</Segmented.Item>
              <Segmented.Item value="adaptive">Adaptive</Segmented.Item>
              <Segmented.Highlight />
            </Segmented.Root>
          </div>
          <CardToneContext.Provider
            value={tone === 'scheme' ? undefined : (tone as GlassContextValue)}
          >
            {/* (Four rows at most: the long cards, e.g. a segmented card's
                many options stacked.) */}
            <Grid.Root
              className="kitchen-sink-grid"
              editing={editing}
              maxTileRows={4}
              reorderHandle={handle}
            >
              {Object.entries(rooms).map(([room, tiles]) => (
                <Grid.Section
                  key={room}
                  dropName={room}
                  reorderHandle={handle}
                >
                  <SectionHeader title={room} />
                  {tiles.map(
                    ({
                      area,
                      card: CardOf,
                      expandedSize,
                      kind,
                      name,
                      openSize,
                      size,
                      sizes,
                    }) => (
                      // (Expanding (its expanded size, if any): its
                      // card's button only where that changes its size, at
                      // these columns too.)
                      <Grid.Item
                        key={name}
                        // (Expanded: its own state, not stored; small
                        // again as editing starts. One at first, as the
                        // mock-ups show it: Attic Sensor's.)
                        defaultExpanded={name === 'Attic Sensor'}
                        dropName={name}
                        expandedSize={expandedSize}
                        openLabel={openSize ? name : undefined}
                        openSize={openSize}
                        reorderHandle={handle}
                        size={size}
                        supportedSizes={sizes ?? cardSizes[kind]}
                        onSizeChange={(next) => resize(name, next)}
                      >
                        <CardOf />
                        <Grid.ResizeHandle />
                        {/* (Room around it: expanded, it grows in there,
                            nothing around it moving.) */}
                        {area ? (
                          <Grid.Area defaultSize={area}>
                            <Grid.ResizeHandle />
                          </Grid.Area>
                        ) : null}
                      </Grid.Item>
                    ),
                  )}
                </Grid.Section>
              ))}
            </Grid.Root>
          </CardToneContext.Provider>
          {/* (Cards on their own: no grid, sized by their boxes.) */}
          <div className="kitchen-sink-cards-alone">
            <SectionHeaderAlone />
            <div className="kitchen-sink-cards-alone-row">
              <div>
                <ControlCards.Switch
                  emphasizedIcon={sfLightbulbFill}
                  icon={sfLightbulb}
                  label="Desk Lamp"
                  tint={cardTints.light}
                />
              </div>
              <div>
                <ControlCards.Value
                  format={percent}
                  icon={sfHumidityFill}
                  label="Humidity"
                  value={0.52}
                />
              </div>
            </div>
          </div>
          <Viewport.Padding edge="block-end" />
        </Page.Root>
      </Header.Root>
    </>
  );
};

export const cardsPages: SinkPages = {
  card: { Content: CardsApp, isBare: true, title: 'Cards' },
  'card/lights': { Content: LightsPage, title: 'Lights' },
  'card/doors': { Content: DoorsPage, title: 'Doors' },
  'card/settings': { Content: SettingsPage, title: 'Settings' },
};
