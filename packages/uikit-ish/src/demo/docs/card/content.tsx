import { ReactNode } from 'react';

import {
  Card,
  type CardOrientation,
  cardSizes,
  forwardClick,
  gridIcons,
  type GridSize,
  Slider,
  Switch,
  Symbol,
  type SymbolIcon,
} from '../../../components/index.js';
import { FlipParts } from '../../tooling/flip.js';
import type { PartProps } from '../../tooling/frame/prop-control.js';
import {
  sfHumidityFill,
  sfLightbulb,
  sfLightbulbFill,
  sfLockFill,
  sfLockOpenFill,
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
export type Expansion = { isExpanded: boolean; onToggle: () => void };

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
      <Symbol icon={isLocked ? sfLockFill : sfLockOpenFill} />
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
        <Symbol icon={onCount > 0 ? sfLightbulbFill : sfLightbulb} />
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
 * (top leading) closing it (as a press beside it, or Escape).
 */
export const cameraCard = ({
  isOpen,
  onOpenChange,
  parts = {},
}: Parts & {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
      <Symbol icon={sfPhoto} />
    </Card.Symbol>
    <Card.Title {...parts['Card.Title']}>Front Door Camera</Card.Title>
    <Card.Value {...parts['Card.Value']}>
      {isOpen ? 'Live, recording since 8:12' : 'Live'}
    </Card.Value>
    {/* (Opening it, closed; its x, open, where the others' are: each
        fading as it grows and shrinks.) */}
    <Card.CornerButton
      aria-label="Front Door Camera"
      icon={gridIcons.open}
      visible={!isOpen}
      onClick={() => onOpenChange(true)}
      {...parts['Card.CornerButton']}
    />
    <Card.CornerButton
      aria-label="Close"
      corner="top-leading"
      icon={gridIcons.close}
      visible={isOpen}
      onClick={() => onOpenChange(false)}
      {...parts['Card.CornerButton']}
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
      <Symbol icon={isOn ? sfLightbulbFill : sfLightbulb} />
    </Card.Symbol>
    <Card.Title {...parts['Card.Title']}>{name}</Card.Title>
    <Card.Value {...parts['Card.Value']}>{isOn ? 'On' : 'Off'}</Card.Value>
    <Switch.Root
      aria-label={name}
      checked={isOn}
      {...parts['Switch.Root']}
      onCheckedChange={onChange}
    >
      <Switch.Thumb {...parts['Switch.Thumb']} />
    </Switch.Root>
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
      <Symbol icon={sfThermometerMedium} />
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
      <Symbol icon={sfHumidityFill} />
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
 * it, see `useCardsStage`), a slider setting what it heats to. Its corner
 * button expands it (as a press anywhere on it does) and makes it small
 * again (only it: the slider takes the rest).
 */
export const heatingCard = ({
  expansion,
  onTargetChange,
  parts = {},
  target,
}: Parts & {
  expansion?: Expansion;
  onTargetChange: (target: number) => void;
  target: number;
}): ReactNode => {
  const isExpanded = expansion?.isExpanded === true;
  return (
    <Card.Root
      // (Small, a press anywhere on it as on its button; expanded, its
      // slider's, the button alone expanding it no more.)
      onClick={
        expansion && !isExpanded
          ? forwardClick('[data-card-part=corner-button]')
          : undefined
      }
      {...parts['Card.Root']}
    >
      {/* (Its parts moved from where they were as it expands, with GSAP:
          the demos' helper, see Building for changing sizes.) */}
      <FlipParts />
      <Card.Symbol {...parts['Card.Symbol']}>
        <Symbol icon={sfThermometerMedium} />
      </Card.Symbol>
      {isExpanded ? (
        <Slider.Root
          format={celsius}
          max={26}
          min={16}
          step={0.5}
          tint="var(--color-ui-system-orange)"
          value={target}
          {...parts['Slider.Root']}
          onValueChange={(next) => onTargetChange(next as number)}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb aria-label="Heat to" />
            </Slider.Track>
          </Slider.Control>
          <Slider.Label>Heat to</Slider.Label>
          <Slider.Value />
        </Slider.Root>
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
      {expansion ? (
        <Card.CornerButton
          mirrored
          aria-expanded={isExpanded}
          aria-label="Heating details"
          icon={isExpanded ? gridIcons.collapse : gridIcons.expand}
          onClick={expansion.onToggle}
          {...parts['Card.CornerButton']}
        />
      ) : null}
    </Card.Root>
  );
};

/**
 * A numerical control: a slider (continuous, or stepped with ticks), across
 * or upright by its tile's shape (an app reads it with
 * `useCardOrientation`).
 */
export const dimmerCard = ({
  icon = sfLightbulbFill,
  name = 'Dimmer',
  onChange,
  orientation,
  parts = {},
  step,
  tint = 'var(--color-ui-system-yellow)',
  value,
}: Parts & {
  icon?: SymbolIcon;
  name?: string;
  onChange: (value: number) => void;
  orientation: CardOrientation;
  step?: number;
  tint?: string;
  value: number;
}): ReactNode => (
  <Card.Root {...parts['Card.Root']}>
    <Card.Symbol {...parts['Card.Symbol']}>
      <Symbol icon={icon} />
    </Card.Symbol>
    <Slider.Root
      format={{ maximumFractionDigits: 0, style: 'percent' }}
      max={1}
      min={0}
      orientation={orientation}
      step={step ?? 0.01}
      tint={tint}
      value={value}
      {...parts['Slider.Root']}
      onValueChange={(next) => onChange(next as number)}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          {step === undefined ? null : (
            <Slider.Ticks count={Math.round(1 / step) + 1} />
          )}
          <Slider.Thumb aria-label={name} />
        </Slider.Track>
      </Slider.Control>
      <Slider.Label>{name}</Slider.Label>
      <Slider.Value />
    </Slider.Root>
  </Card.Root>
);

/** The cards' state, as the app keeps it (see `useCardsStage`). */
export type CardStates = {
  /** The blinds' level, the dimmer's. */
  blinds: number;
  dimmer: number;
  /** The fan's switch, the lamp's. */
  fan: boolean;
  /** What the heating heats to. */
  heating: number;
  lamp: boolean;
};

export const cardStatesInitial: CardStates = {
  blinds: 0.5,
  dimmer: 0.6,
  fan: false,
  heating: 22,
  lamp: true,
};

/** What a tile's card is shown with (see `cardOf`). */
export type CardContext = Required<Parts> & {
  expansion: Expansion | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  | 'fan'
  | 'heating'
  | 'humidity'
  | 'lamp'
  | 'lock'
  | 'temperature';

/** Each kind's card, with its state (see `cardOf`). */
const cards: Readonly<Record<CardKind, (context: CardContext) => ReactNode>> = {
  blinds: ({ parts, set, size, states }) =>
    dimmerCard({
      icon: sfWindowShadeClosed,
      name: 'Blinds',
      onChange: (value) => set('blinds', value),
      orientation: orientationOf(size),
      parts,
      step: 0.25,
      tint: 'var(--color-ui-system-blue)',
      value: states.blinds,
    }),
  camera: ({ isOpen, onOpenChange, parts }) =>
    cameraCard({ isOpen, onOpenChange, parts }),
  dimmer: ({ parts, set, size, states }) =>
    dimmerCard({
      onChange: (value) => set('dimmer', value),
      orientation: orientationOf(size),
      parts,
      value: states.dimmer,
    }),
  fan: ({ parts, set, states }) =>
    lampCard({
      isOn: states.fan,
      name: 'Ceiling Fan',
      onChange: (isOn) => set('fan', isOn),
      parts,
    }),
  heating: ({ expansion, parts, set, states }) =>
    heatingCard({
      expansion,
      onTargetChange: (target) => set('heating', target),
      parts,
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
  temperature: ({ parts }) => temperatureCard({ parts }),
};

/** A tile's card, by its kind, with its state. */
export const cardOf = (kind: CardKind, context: CardContext): ReactNode =>
  cards[kind](context);

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
