import { ReactNode } from 'react';

import {
  Card,
  type CardOrientation,
  cardSizes,
  ControlCards,
  forwardClick,
  gridIcons,
  type GridSize,
  Symbol,
  type SymbolIcon,
} from '../../../components/index.js';
import { cardTints } from '../../tooling/card-kit.js';
import { FlipParts } from '../../tooling/flip.js';
import type { PartProps } from '../../tooling/frame/prop-control.js';
import {
  sfHouseFill,
  sfHumidityFill,
  sfLightbulb,
  sfLightbulbFill,
  sfLockFill,
  sfLockOpen,
  sfPhoto,
  sfThermometerMedium,
  sfWindowShadeClosed,
} from '../../tooling/icons.js';

// The guide pages' cards: a home's devices (a lock, a lamp, a temperature,
// a dimmer, the blinds, …), their parts' props from a demo's controls
// (`parts`). Each a function returning its JSX, called where it's shown,
// its state the demo's (see `useCardsStage`): the demo's code shows the
// card's parts as written, not a component of the demo's.

/** A demo's props for the card's parts (see `usePartControls`). */
type Parts = { parts?: PartProps };

/**
 * A card's expansion, as the app keeps it (see `useCardsStage`): whether
 * it's expanded, and asking for the other.
 */
export type Expansion = {
  /** Its size, not expanded (its stored size). */
  collapsedSize: GridSize;
  /** Its size, expanded. */
  expandedSize: GridSize;
  isExpanded: boolean;
  onToggle: () => void;
};

/**
 * Whether a card shows its large layout: its tile at least 2x2, however it
 * got there (expanded, or resized in edit mode).
 */
const isLargeOf = (size: GridSize = '1x1') => {
  const [columns = '1', rows = '1'] = size.split('x');
  return (columns === '*' || Number(columns) >= 2) && Number(rows) >= 2;
};

/**
 * A slider's orientation by its tile's shape (as `useCardOrientation`
 * reads it from its item: here from the size the demo keeps).
 */
export const orientationOf = (size: GridSize): CardOrientation => {
  const [columns = '1', rows = '1'] = size.split('x');
  return columns === '*' || Number(columns) >= Number(rows)
    ? 'horizontal'
    : 'vertical';
};

/** A binary display: the front door's lock, its state in words. */
export const lockCard = ({
  isLocked = true,
  parts = {},
}: Parts & { isLocked?: boolean }): ReactNode => (
  <Card.Root
    active={isLocked}
    {...parts['Card.Root']}
  >
    <Card.Symbol {...parts['Card.Symbol']}>
      <Symbol
        box="square"
        emphasizedIcon={sfLockFill}
        icon={sfLockOpen}
        {...parts.Symbol}
      />
    </Card.Symbol>
    <Card.Title {...parts['Card.Title']}>Front Door</Card.Title>
    <Card.Value {...parts['Card.Value']}>
      {isLocked ? 'Locked' : 'Unlocked'}
    </Card.Value>
  </Card.Root>
);

/** The room's lights, by name: on or off (see `lightsCard`). */
export type Lights = Readonly<Record<string, boolean>>;

export const lightsInitial: Lights = {
  'Ceiling Light': true,
  'Desk Lamp': false,
  'Floor Lamp': true,
};

/**
 * The lights: how many are on, bright while any is (`active`); its corner
 * button goes to their page (`onDrillIn`, the app's navigation), each
 * light's switch there; a press anywhere on it as on that button.
 */
export const lightsCard = ({
  lights,
  onDrillIn,
  parts = {},
}: Parts & { lights: Lights; onDrillIn: () => void }): ReactNode => {
  const onCount = Object.values(lights).filter(Boolean).length;
  return (
    <Card.Root
      active={onCount > 0}
      onClick={forwardClick('[data-card-part=corner-button]')}
      {...parts['Card.Root']}
    >
      <Card.Symbol {...parts['Card.Symbol']}>
        <Symbol
          box="square"
          emphasizedIcon={sfLightbulbFill}
          icon={sfLightbulb}
          {...parts.Symbol}
        />
      </Card.Symbol>
      <Card.Title {...parts['Card.Title']}>Lights</Card.Title>
      <Card.Value {...parts['Card.Value']}>
        {onCount > 0 ? `${String(onCount)} On` : 'Off'}
      </Card.Value>
      <Card.CornerButton
        aria-label="Lights"
        icon={gridIcons.drillIn}
        onClick={onDrillIn}
        {...parts['Card.CornerButton']}
      />
    </Card.Root>
  );
};

/**
 * A camera: opened above the page (its item's `open`, its `openSize`) by
 * its corner button or a press anywhere on it; open, it shows more, its x
 * (top trailing) closing it (as a press beside it, or Escape).
 */
export const cameraCard = ({
  isOpen,
  parts = {},
}: Parts & {
  isOpen: boolean;
}): ReactNode => (
  <Card.Root
    onClick={
      isOpen
        ? undefined
        : forwardClick('[data-card-part=corner-button]:not([data-grid-hidden])')
    }
    {...parts['Card.Root']}
  >
    {/* (Its parts moved from where they were as it opens, with GSAP: the
        demos' helper, see Building for changing sizes.) */}
    <FlipParts />
    <Card.Symbol {...parts['Card.Symbol']}>
      <Symbol
        box="square"
        icon={sfPhoto}
        {...parts.Symbol}
      />
    </Card.Symbol>
    <Card.Title {...parts['Card.Title']}>Front Door Camera</Card.Title>
    <Card.Value {...parts['Card.Value']}>
      {isOpen ? 'Live, recording since 8:12' : 'Live'}
    </Card.Value>
    {/* (Opening it, closed; its x, open, where the others' are: each
        fading as it grows and shrinks, see ControlCards' `OpenButtons`.) */}
    <ControlCards.OpenButtons
      closeLabel="Close"
      label="Front Door Camera"
      {...parts['ControlCards.OpenButtons']}
    />
  </Card.Root>
);

/** A binary control: a lamp, its switch toggled by the whole card. */
export const lampCard = ({
  isOn,
  name = 'Floor Lamp',
  onChange,
  parts = {},
}: Parts & {
  isOn: boolean;
  name?: string;
  onChange: (isOn: boolean) => void;
}): ReactNode => (
  <Card.Root
    active={isOn}
    onClick={forwardClick('[role=switch]')}
    {...parts['Card.Root']}
  >
    <Card.Symbol {...parts['Card.Symbol']}>
      <Symbol
        box="square"
        emphasizedIcon={sfLightbulbFill}
        icon={sfLightbulb}
        {...parts.Symbol}
      />
    </Card.Symbol>
    <Card.Title {...parts['Card.Title']}>{name}</Card.Title>
    <Card.Value {...parts['Card.Value']}>{isOn ? 'On' : 'Off'}</Card.Value>
    <Card.Switch
      aria-label={name}
      checked={isOn}
      {...parts['Card.Switch']}
      onCheckedChange={onChange}
    />
  </Card.Root>
);

/** A temperature, formatted as the cards show it. */
const celsius: Intl.NumberFormatOptions = {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: 'unit',
  unit: 'celsius',
};

/**
 * A numerical display: a room's temperature, formatted by the app; its
 * corner button goes to the room's page (the app's, see `onClick`), as a
 * press anywhere on it does.
 */
export const temperatureCard = ({ parts = {} }: Parts): ReactNode => (
  <Card.Root
    onClick={forwardClick('[data-card-part=corner-button]')}
    {...parts['Card.Root']}
  >
    <Card.CornerButton
      aria-label="Living Room details"
      icon={gridIcons.drillIn}
      {...parts['Card.CornerButton']}
    />
    <Card.Symbol {...parts['Card.Symbol']}>
      <Symbol
        box="square"
        icon={sfThermometerMedium}
        {...parts.Symbol}
      />
    </Card.Symbol>
    <Card.Title {...parts['Card.Title']}>Living Room</Card.Title>
    <Card.Value
      format={celsius}
      value={21.5}
      {...parts['Card.Value']}
    />
  </Card.Root>
);

/** A numerical display: the humidity, as a percentage. */
export const humidityCard = ({ parts = {} }: Parts): ReactNode => (
  <Card.Root {...parts['Card.Root']}>
    <Card.Symbol {...parts['Card.Symbol']}>
      <Symbol
        box="square"
        icon={sfHumidityFill}
        {...parts.Symbol}
      />
    </Card.Symbol>
    <Card.Title {...parts['Card.Title']}>Humidity</Card.Title>
    <Card.Value
      format={{ maximumFractionDigits: 0, style: 'percent' }}
      value={0.46}
      {...parts['Card.Value']}
    />
  </Card.Root>
);

/**
 * Heating: small, the room's temperature; expanded (the app's size for
 * it, see `useCardsStage`), a slider filling it (ControlCards'
 * `SliderFill`) setting what it heats to. Its corner button expands it (as
 * a press anywhere on it does) and makes it small again (only it: the
 * slider takes the rest).
 */
export const heatingCard = ({
  expansion,
  onTargetChange,
  parts = {},
  size,
  target,
}: Parts & {
  expansion?: Expansion;
  onTargetChange: (target: number) => void;
  /** Its tile's size: large (expanded, or resized so), its slider. */
  size?: GridSize;
  target: number;
}): ReactNode => {
  const isExpanded = isLargeOf(size);
  return (
    <Card.Root
      // (Small, a press anywhere on it as on its button; expanded, its
      // slider's, the button alone expanding it no more.)
      onClick={
        expansion && !isExpanded
          ? forwardClick(
              '[data-card-part=corner-button]:not([data-grid-hidden])',
            )
          : undefined
      }
      {...parts['Card.Root']}
    >
      {/* (Its parts moved from where they were as it expands, with GSAP:
          the demos' helper, see Building for changing sizes.) */}
      <FlipParts />
      <Card.Symbol {...parts['Card.Symbol']}>
        <Symbol
          box="square"
          icon={sfThermometerMedium}
          {...parts.Symbol}
        />
      </Card.Symbol>
      {isExpanded ? (
        <ControlCards.SliderFill
          format={celsius}
          max={26}
          min={16}
          name="Heat to"
          step={0.5}
          tint={cardTints.heat}
          value={target}
          onValueChange={onTargetChange}
          {...parts['ControlCards.SliderFill']}
        />
      ) : (
        <>
          <Card.Title {...parts['Card.Title']}>Heating</Card.Title>
          <Card.Value
            format={celsius}
            value={21.5}
            {...parts['Card.Value']}
          />
        </>
      )}
      {/* (Hidden while expanding changes nothing, e.g. too few columns:
          see ControlCards' `ExpandButton`.) */}
      {expansion ? (
        <ControlCards.ExpandButton
          collapsedSize={expansion.collapsedSize}
          expanded={expansion.isExpanded}
          expandedSize={expansion.expandedSize}
          label="Heating details"
          onExpandedChange={expansion.onToggle}
          {...parts['ControlCards.ExpandButton']}
        />
      ) : null}
    </Card.Root>
  );
};

/**
 * A numerical control: a slider card (ControlCards' `Slider`: continuous,
 * or stepped with ticks), across or upright by its tile's shape. A
 * brightness (a dimmer, not blinds): never lit, its dark glass and its fill
 * telling how much; its symbol on above its minimum.
 */
export const dimmerCard = ({
  brightness = false,
  emphasizedIcon,
  icon = sfLightbulb,
  name = 'Dimmer',
  onChange,
  parts = {},
  step,
  tint = cardTints.light,
  value,
}: Parts & {
  brightness?: boolean;
  /** Its symbol's icon while on (e.g. filled; see `brightness`). */
  emphasizedIcon?: SymbolIcon;
  icon?: SymbolIcon;
  name?: string;
  onChange: (value: number) => void;
  step?: number;
  tint?: string;
  value: number;
}): ReactNode => (
  <ControlCards.Slider
    brightness={brightness}
    emphasizedIcon={emphasizedIcon}
    format={{ maximumFractionDigits: 0, style: 'percent' }}
    icon={icon}
    max={1}
    min={0}
    name={name}
    step={step}
    tint={tint}
    value={value}
    onValueChange={onChange}
    {...parts['ControlCards.Slider']}
  />
);

/** A percentage, no decimals. */
const percent = (value: number) =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
    style: 'percent',
  }).format(value);

/**
 * A room's summary: what its other cards say, in rows (ControlCards'
 * `List`: as many as fit whole); opened above the page, all of them.
 */
export const roomCard = ({
  parts = {},
  states,
}: Parts & { states: CardStates }): ReactNode => (
  <ControlCards.List
    icon={sfHouseFill}
    name="Living Room"
    opening={{ closeLabel: 'Close', label: 'Living Room details' }}
    rows={[
      {
        icon: sfLightbulbFill,
        label: 'Floor Lamp',
        value: states.lamp ? 'On' : 'Off',
      },
      { icon: sfLightbulbFill, label: 'Dimmer', value: percent(states.dimmer) },
      {
        icon: sfWindowShadeClosed,
        label: 'Blinds',
        value: percent(states.blinds),
      },
      {
        icon: sfThermometerMedium,
        label: 'Heating to',
        value: `${String(states.heating)} °C`,
      },
      { icon: sfHumidityFill, label: 'Humidity', value: percent(0.46) },
    ]}
    {...parts['ControlCards.List']}
  >
    {/* (Its parts moved from where they were as it opens, with GSAP: the
        demos' helper, see Building for changing sizes.) */}
    <FlipParts />
  </ControlCards.List>
);

/** The cards' state, as the app keeps it (see `useCardsStage`). */
export type CardStates = {
  /** The blinds' level, the dimmer's. */
  blinds: number;
  dimmer: number;
  /** The lamp's switch. */
  /** What the heating heats to. */
  heating: number;
  lamp: boolean;
};

export const cardStatesInitial: CardStates = {
  blinds: 0.5,
  dimmer: 0.6,
  heating: 22,
  lamp: true,
};

/** What a tile's card is shown with (see `cardOf`). */
export type CardContext = Required<Parts> & {
  expansion: Expansion | undefined;
  isOpen: boolean;
  /** Sets a card's state (logged). */
  set: <K extends keyof CardStates>(key: K, value: CardStates[K]) => void;
  /** Its tile's size, as the demo keeps it. */
  size: GridSize;
  states: CardStates;
};

/** The kinds of the guide pages' cards (see `cardOf`). */
export type CardKind =
  | 'blinds'
  | 'camera'
  | 'dimmer'
  | 'heating'
  | 'humidity'
  | 'lamp'
  | 'lock'
  | 'room'
  | 'temperature';

/** Each kind's card, with its state (see `cardOf`). */
const cards: Readonly<Record<CardKind, (context: CardContext) => ReactNode>> = {
  blinds: ({ parts, set, states }) =>
    dimmerCard({
      icon: sfWindowShadeClosed,
      name: 'Blinds',
      onChange: (value) => set('blinds', value),
      parts,
      step: 0.25,
      tint: cardTints.shade,
      value: states.blinds,
    }),
  camera: ({ isOpen, parts }) => cameraCard({ isOpen, parts }),
  dimmer: ({ parts, set, states }) =>
    dimmerCard({
      brightness: true,
      emphasizedIcon: sfLightbulbFill,
      onChange: (value) => set('dimmer', value),
      parts,
      value: states.dimmer,
    }),
  heating: ({ expansion, parts, set, size, states }) =>
    heatingCard({
      expansion,
      onTargetChange: (target) => set('heating', target),
      parts,
      size,
      target: states.heating,
    }),
  humidity: ({ parts }) => humidityCard({ parts }),
  lamp: ({ parts, set, states }) =>
    lampCard({
      isOn: states.lamp,
      onChange: (isOn) => set('lamp', isOn),
      parts,
    }),
  lock: ({ parts }) => lockCard({ parts }),
  room: ({ parts, states }) => roomCard({ parts, states }),
  temperature: ({ parts }) => temperatureCard({ parts }),
};

/** A tile's card, by its kind, with its state. */
export const cardOf = (kind: CardKind, context: CardContext): ReactNode =>
  cards[kind](context);

/** A card's symbol, a card's text (what each kind sets on them). */
const symbolParts = {
  'Card.Symbol': [],
  Symbol: ['emphasizedIcon', 'icon'],
} as const;
const textParts = {
  'Card.Title': [],
  'Card.Value': ['children', 'format', 'value'],
} as const;
const expandParts = {
  'ControlCards.ExpandButton': [
    'collapsedSize',
    'expanded',
    'expandedSize',
    'label',
    'onExpandedChange',
  ],
} as const;
const openParts = {
  'ControlCards.OpenButtons': ['closeLabel', 'label'],
} as const;
const sliderCardParts = {
  'ControlCards.Slider': [
    'brightness',
    'emphasizedIcon',
    'format',
    'icon',
    'max',
    'min',
    'name',
    'step',
    'tint',
    'value',
    'onValueChange',
  ],
} as const;

/**
 * Each kind's card's parts (see `cardOf`), by the props it sets itself:
 * its controls' groups (see `partPropMaps`), every part it renders.
 */
const kindParts: Readonly<
  Record<CardKind, Readonly<Record<string, readonly string[]>>>
> = {
  blinds: sliderCardParts,
  camera: {
    'Card.Root': ['onClick'],
    ...symbolParts,
    ...textParts,
    ...openParts,
  },
  dimmer: sliderCardParts,
  heating: {
    'Card.Root': ['onClick'],
    ...symbolParts,
    ...textParts,
    'ControlCards.SliderFill': [
      'format',
      'max',
      'min',
      'name',
      'step',
      'tint',
      'value',
      'onValueChange',
    ],
    ...expandParts,
  },
  humidity: { 'Card.Root': [], ...symbolParts, ...textParts },
  lamp: {
    'Card.Root': ['active', 'onClick'],
    ...symbolParts,
    ...textParts,
    'Card.Switch': ['aria-label', 'checked', 'onCheckedChange'],
  },
  lock: { 'Card.Root': ['active'], ...symbolParts, ...textParts },
  room: {
    'ControlCards.List': ['icon', 'name', 'opening', 'rows'],
  },
  temperature: {
    'Card.CornerButton': ['aria-label', 'icon', 'onClick'],
    'Card.Root': ['onClick'],
    ...symbolParts,
    ...textParts,
  },
};

/**
 * The parts tiles' cards render (see `kindParts`), the props any of them
 * sets left to it (no control silently doing nothing).
 */
export const partsOfTiles = (
  tiles: readonly Pick<CardTile, 'kind'>[],
): Record<string, readonly string[]> => {
  const parts: Record<string, Set<string>> = {};
  for (const { kind } of tiles) {
    for (const [part, fixed] of Object.entries(kindParts[kind])) {
      parts[part] ??= new Set();
      for (const prop of fixed) parts[part].add(prop);
    }
  }
  return Object.fromEntries(
    Object.entries(parts).map(([part, fixed]) => [part, [...fixed]]),
  );
};

/** A tile of the guide pages' grids: its card, its kind's sizes, its size. */
export type CardTile = {
  /** Room around its tile (a `Grid.Area`), its tile centered in it. */
  area?: GridSize;
  /** Its size expanded (see `Expansion`), if it expands. */
  expandedSize?: GridSize;
  kind: CardKind;
  name: string;
  /** Its size opened above the page (see `cameraCard`), if it opens. */
  openSize?: GridSize;
  size: GridSize;
  sizes: readonly GridSize[];
};

/** One of each kind, in sizes that show them well. */
export const cardTiles: readonly CardTile[] = [
  {
    kind: 'lamp',
    name: 'Floor Lamp',
    size: '2x1',
    sizes: cardSizes.binaryControl,
  },
  {
    kind: 'lock',
    name: 'Front Door',
    size: '1x1',
    sizes: cardSizes.binaryDisplay,
  },
  {
    kind: 'temperature',
    name: 'Temperature',
    size: '2x2',
    sizes: cardSizes.numericalDisplay,
  },
  {
    kind: 'dimmer',
    name: 'Dimmer',
    size: '2x1',
    sizes: cardSizes.numericalControl,
  },
  {
    kind: 'blinds',
    name: 'Blinds',
    size: '1x2',
    sizes: cardSizes.numericalControl,
  },
  {
    kind: 'humidity',
    name: 'Humidity',
    size: '1x1',
    sizes: cardSizes.numericalDisplay,
  },
];
