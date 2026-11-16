import { FunctionComponent, useState } from 'react';

import {
  Card,
  cardIcons,
  cardSizes,
  forwardClick,
  type GridSize,
  Slider,
  Switch,
  Symbol,
  type SymbolIcon,
  useCardOrientation,
  useGridItem,
} from '../../../components/index.js';
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

// The guide pages' cards: a home's devices, one of each kind (a lock, a
// lamp, a temperature, a dimmer, the blinds), each a component as an app
// would write it, its parts' props from a demo's controls (`parts`).

/** A demo's props for the card's parts (see `usePartControls`). */
type Parts = { parts?: PartProps };

/**
 * A card's expansion, as the app keeps it (see `CardsStage`): whether it's
 * expanded, and asking for the other.
 */
export type Expansion = { isExpanded: boolean; onToggle: () => void };

/** A binary display: the front door's lock, its state in words. */
export const LockCard: FunctionComponent<Parts & { isLocked?: boolean }> = ({
  isLocked = true,
  parts = {},
}) => (
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

/** The room's lights, by name: on or off (see `LightsCard`). */
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
export const LightsCard: FunctionComponent<
  Parts & { lights: Lights; onDrillIn: () => void }
> = ({ lights, onDrillIn, parts = {} }) => {
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
        icon={cardIcons.drillIn}
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
export const CameraCard: FunctionComponent<Parts> = ({ parts = {} }) => {
  const item = useGridItem();
  const isOpen = item?.open === true;
  return (
    <Card.Root
      onClick={
        isOpen
          ? undefined
          : forwardClick(
              '[data-card-part=corner-button]:not([data-grid-hidden])',
            )
      }
      {...parts['Card.Root']}
    >
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
        icon={cardIcons.overlay}
        visible={!isOpen}
        onClick={() => item?.setOpen(true)}
        {...parts['Card.CornerButton']}
      />
      <Card.CornerButton
        aria-label="Close"
        corner="top-leading"
        icon={cardIcons.close}
        visible={isOpen}
        onClick={() => item?.setOpen(false)}
        {...parts['Card.CornerButton']}
      />
    </Card.Root>
  );
};

/** A binary control: a lamp, its switch toggled by the whole card. */
export const LampCard: FunctionComponent<
  Parts & { name?: string; onChange?: (isOn: boolean) => void }
> = ({ name = 'Floor Lamp', onChange, parts = {} }) => {
  const [isOn, setIsOn] = useState(true);
  return (
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
        onCheckedChange={(next) => {
          setIsOn(next);
          onChange?.(next);
        }}
      >
        <Switch.Thumb {...parts['Switch.Thumb']} />
      </Switch.Root>
    </Card.Root>
  );
};

/**
 * A numerical display: a room's temperature, formatted by the app; its
 * corner button goes to the room's page (the app's, see `onClick`), as a
 * press anywhere on it does.
 */
export const TemperatureCard: FunctionComponent<Parts> = ({ parts = {} }) => (
  <Card.Root
    onClick={forwardClick('[data-card-part=corner-button]')}
    {...parts['Card.Root']}
  >
    <Card.CornerButton
      aria-label="Living Room details"
      icon={cardIcons.drillIn}
      {...parts['Card.CornerButton']}
    />
    <Card.Symbol {...parts['Card.Symbol']}>
      <Symbol icon={sfThermometerMedium} />
    </Card.Symbol>
    <Card.Title {...parts['Card.Title']}>Living Room</Card.Title>
    <Card.Value
      value={21.5}
      format={{
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
        style: 'unit',
        unit: 'celsius',
      }}
      {...parts['Card.Value']}
    />
  </Card.Root>
);

/** A numerical display: the humidity, as a percentage. */
export const HumidityCard: FunctionComponent<Parts> = ({ parts = {} }) => (
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

/** A temperature, formatted as the heating card shows it. */
const celsius: Intl.NumberFormatOptions = {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: 'unit',
  unit: 'celsius',
};

/**
 * Heating: small, the room's temperature; expanded (the app's size
 * for it, see `CardsStage`), a slider setting what it heats to. Its corner
 * button expands it (as a press anywhere on it does) and makes it small
 * again (only it: the slider takes the rest).
 */
export const HeatingCard: FunctionComponent<
  Parts & { expansion?: Expansion }
> = ({ expansion, parts = {} }) => {
  const [target, setTarget] = useState(22);
  const isExpanded = expansion?.isExpanded === true;
  const button = expansion ? (
    <Card.CornerButton
      mirrored
      aria-expanded={isExpanded}
      aria-label="Heating details"
      icon={isExpanded ? cardIcons.collapse : cardIcons.expand}
      onClick={expansion.onToggle}
      {...parts['Card.CornerButton']}
    />
  ) : null;
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
          onValueChange={(next) => setTarget(next as number)}
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
      {button}
    </Card.Root>
  );
};

/**
 * A numerical control: a slider (continuous, or stepped with ticks), across
 * or upright by its tile's shape (`useCardOrientation`).
 */
export const DimmerCard: FunctionComponent<
  Parts & {
    icon?: SymbolIcon;
    name?: string;
    onChange?: (value: number) => void;
    step?: number;
    tint?: string;
  }
> = ({
  icon = sfLightbulbFill,
  name = 'Dimmer',
  onChange,
  parts = {},
  step,
  tint = 'var(--color-ui-system-yellow)',
}) => {
  const orientation = useCardOrientation();
  const [value, setValue] = useState(0.6);
  return (
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
        onValueChange={(next) => {
          setValue(next as number);
          onChange?.(next as number);
        }}
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
};

/** The blinds: a stepped slider (quarters), upright in a tall tile. */
export const BlindsCard: FunctionComponent<Parts> = (props) => (
  <DimmerCard
    {...props}
    icon={sfWindowShadeClosed}
    name="Blinds"
    step={0.25}
    tint="var(--color-ui-system-blue)"
  />
);

/** A fan: another switch. */
export const FanCard: FunctionComponent<Parts> = (props) => (
  <LampCard
    {...props}
    name="Ceiling Fan"
  />
);

/** A tile of the guide pages' grids: its card, its kind's sizes, its size. */
export type CardTile = {
  Card: FunctionComponent<Parts & { expansion?: Expansion }>;
  /** Room around its tile (a `Grid.Area`), its tile centered in it. */
  area?: GridSize;
  /** Its size expanded (see `Expansion`), if it expands. */
  expandedSize?: GridSize;
  name: string;
  /** Its size opened above the page (see `CameraCard`), if it opens. */
  openSize?: GridSize;
  size: GridSize;
  sizes: readonly GridSize[];
};

/** One of each kind, in sizes that show them well. */
export const cardTiles: readonly CardTile[] = [
  {
    Card: LampCard,
    name: 'Floor Lamp',
    size: '2x1',
    sizes: cardSizes.binaryControl,
  },
  {
    Card: LockCard,
    name: 'Front Door',
    size: '1x1',
    sizes: cardSizes.binaryDisplay,
  },
  {
    Card: TemperatureCard,
    name: 'Temperature',
    size: '2x2',
    sizes: cardSizes.numericalDisplay,
  },
  {
    Card: DimmerCard,
    name: 'Dimmer',
    size: '2x1',
    sizes: cardSizes.numericalControl,
  },
  {
    Card: BlindsCard,
    name: 'Blinds',
    size: '1x2',
    sizes: cardSizes.numericalControl,
  },
  {
    Card: HumidityCard,
    name: 'Humidity',
    size: '1x1',
    sizes: cardSizes.numericalDisplay,
  },
];
