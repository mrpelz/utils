import { FunctionComponent, useState } from 'react';

import {
  Button,
  Card,
  cardSizes,
  forwardClick,
  type GlassContextValue,
  Grid,
  gridIcons,
  type GridSize,
  Header,
  List,
  Page,
  Segmented,
  Slider,
  Switch,
  Symbol,
  type SymbolIcon,
  Toolbar,
  useCardOrientation,
  useGridItem,
  Viewport,
} from '../../components/index.js';
import { FlipParts } from '../tooling/flip.js';
import { gridSigns as gridSignsOf } from '../tooling/grid-signs.js';
import {
  sfDoorLeftHandClosed,
  sfDoorLeftHandOpen,
  sfFanFill,
  sfHumidityFill,
  sfLightbulb,
  sfLightbulbFill,
  sfLockFill,
  sfLockOpenFill,
  sfPhoto,
  sfThermometerMedium,
  sfWindowShadeClosed,
} from '../tooling/icons.js';
import {
  CardToneContext,
  type Expansion,
  lightsStore,
  type Tile,
  TonedCard,
  useIsLarge,
  useLights,
} from './cards-shared.js';
import { SectionHeader } from './grid-shared.js';
import { moreTiles } from './more-cards.js';
import {
  AdaptiveBarTitle,
  BackButton,
  type SinkPages,
  usePush,
} from './shared.js';

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

/**
 * Heating: small, the room's temperature; expanded, a slider setting what
 * it heats to. Its corner button expands it and makes it small again.
 */
const HeatingCard: FunctionComponent<{ expansion?: Expansion }> = ({
  expansion,
}) => {
  const [target, setTarget] = useState(22);
  // (Large (expanded, or resized so): its slider.)
  const isExpanded = useIsLarge();
  return (
    <TonedCard
      // (Small, a press anywhere on it as on its button; expanded, its
      // slider's, the button alone expanding it no more.)
      onClick={
        expansion && !isExpanded
          ? forwardClick('[data-card-part=corner-button]')
          : undefined
      }
    >
      {/* (Its parts moved from where they were as it expands, with GSAP.) */}
      <FlipParts />
      <Card.Symbol>
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
          <Card.Title>Heating</Card.Title>
          <Card.Value
            format={celsius}
            value={21.5}
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
        />
      ) : null}
    </TonedCard>
  );
};

/** A binary display: a state, shown by its symbol and its words. */
const StateCard: FunctionComponent<{
  icons: readonly [on: SymbolIcon, off: SymbolIcon];
  isOn: boolean;
  name: string;
  words: readonly [on: string, off: string];
}> = ({ icons, isOn, name, words }) => (
  <TonedCard active={isOn}>
    <Card.Symbol>
      <Symbol icon={isOn ? icons[0] : icons[1]} />
    </Card.Symbol>
    <Card.Title>{name}</Card.Title>
    <Card.Value>{isOn ? words[0] : words[1]}</Card.Value>
  </TonedCard>
);

/** A binary control: a switch, the whole card toggling it. */
const SwitchCard: FunctionComponent<{
  defaultOn?: boolean;
  icons: readonly [on: SymbolIcon, off: SymbolIcon];
  name: string;
}> = ({ defaultOn = false, icons, name }) => {
  const [isOn, setIsOn] = useState(defaultOn);
  return (
    <TonedCard
      active={isOn}
      onClick={forwardClick('[role=switch]')}
    >
      <Card.Symbol>
        <Symbol icon={isOn ? icons[0] : icons[1]} />
      </Card.Symbol>
      <Card.Title>{name}</Card.Title>
      <Card.Value>{isOn ? 'On' : 'Off'}</Card.Value>
      <Switch.Root
        aria-label={name}
        checked={isOn}
        onCheckedChange={setIsOn}
      >
        <Switch.Thumb />
      </Switch.Root>
    </TonedCard>
  );
};

/** A numerical display: a value, formatted as the app says. */
const ValueCard: FunctionComponent<{
  format: Intl.NumberFormatOptions;
  icon: SymbolIcon;
  name: string;
  value: number;
}> = ({ format, icon, name, value }) => (
  <TonedCard>
    <Card.Symbol>
      <Symbol icon={icon} />
    </Card.Symbol>
    <Card.Title>{name}</Card.Title>
    <Card.Value
      format={format}
      value={value}
    />
  </TonedCard>
);

/**
 * A numerical control: a slider, the card its track, across or upright
 * by its tile's shape; stepped (`step`), with ticks.
 */
const SliderCard: FunctionComponent<{
  defaultValue: number;
  format: Intl.NumberFormatOptions;
  icon: SymbolIcon;
  max: number;
  min: number;
  name: string;
  step?: number;
  /** Switchable: on above its minimum (e.g. a dimmer; not blinds). */
  switchable?: boolean;
  tint?: string;
}> = ({
  defaultValue,
  format,
  icon,
  max,
  min,
  name,
  step,
  switchable = false,
  tint,
}) => {
  const orientation = useCardOrientation();
  const [value, setValue] = useState(defaultValue);
  return (
    <TonedCard active={switchable ? value > min : undefined}>
      <Card.Symbol>
        <Symbol icon={icon} />
      </Card.Symbol>
      <Slider.Root
        format={format}
        max={max}
        min={min}
        orientation={orientation}
        step={step ?? 0.01}
        tint={tint}
        value={value}
        onValueChange={(next) => setValue(next as number)}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            {step === undefined ? null : (
              <Slider.Ticks count={Math.round((max - min) / step) + 1} />
            )}
            <Slider.Thumb aria-label={name} />
          </Slider.Track>
        </Slider.Control>
        <Slider.Label>{name}</Slider.Label>
        <Slider.Value />
      </Slider.Root>
    </TonedCard>
  );
};

/**
 * The lights, on or off: the app's state, shared by their card and their
 * page (two pages of the kitchen sink's, so kept outside both).
 */

/**
 * The lights: how many are on, bright while any is (`active`); its corner
 * button goes to their page (`card/lights`), a switch per light; a press
 * anywhere on it as on that button (it has no control of its own).
 */
const LightsCard: FunctionComponent = () => {
  const push = usePush();
  const onCount = Object.values(useLights()).filter(Boolean).length;
  return (
    <TonedCard
      active={onCount > 0}
      onClick={forwardClick('[data-card-part=corner-button]')}
    >
      <Card.Symbol>
        <Symbol icon={onCount > 0 ? sfLightbulbFill : sfLightbulb} />
      </Card.Symbol>
      <Card.Title>Lights</Card.Title>
      <Card.Value>{onCount > 0 ? `${String(onCount)} On` : 'Off'}</Card.Value>
      <Card.CornerButton
        aria-label="Lights"
        icon={gridIcons.drillIn}
        onClick={() => push('card/lights')}
      />
    </TonedCard>
  );
};

/** The lights' page: a switch per light, a press on its row as on it. */
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
        <Symbol icon={sfPhoto} />
      </Card.Symbol>
      <Card.Title>Front Door Camera</Card.Title>
      <Card.Value>{isOpen ? 'Live, recording' : 'Live'}</Card.Value>
      {/* (Opening it, closed; its x, open, where the others' are: each
          fading as it grows and shrinks.) */}
      <Card.CornerButton
        aria-label="Front Door Camera"
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
    </TonedCard>
  );
};

/**
 * An empty card that expands: its corner button alone (expanding it and
 * making it small again), nothing in it moving but that, with its corner:
 * the tile's own motion.
 */
const EmptyExpandingCard: FunctionComponent<{
  expansion?: Expansion;
  name: string;
}> = ({ expansion, name }) => (
  <TonedCard>
    {expansion ? (
      <Card.CornerButton
        mirrored
        aria-expanded={expansion.isExpanded}
        aria-label={name}
        icon={expansion.isExpanded ? gridIcons.collapse : gridIcons.expand}
        onClick={expansion.onToggle}
      />
    ) : null}
  </TonedCard>
);

/**
 * An empty card that opens above the page: its corner button opening it,
 * open, its x closing it (as a press beside it, or Escape).
 */
const EmptyOpeningCard: FunctionComponent<{ name: string }> = ({ name }) => {
  const item = useGridItem();
  const isOpen = item?.open === true;
  return (
    <TonedCard>
      <Card.CornerButton
        aria-label={name}
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
    </TonedCard>
  );
};

const percent: Intl.NumberFormatOptions = {
  maximumFractionDigits: 0,
  style: 'percent',
};

const roomsInitial: Readonly<Record<string, readonly Tile[]>> = {
  'Living Room': [
    {
      card: () => (
        <SwitchCard
          defaultOn
          icons={[sfLightbulbFill, sfLightbulb]}
          name="Floor Lamp"
        />
      ),
      kind: 'binaryControl',
      name: 'Floor Lamp',
      size: '2x1',
    },
    {
      card: () => (
        <SwitchCard
          icons={[sfFanFill, sfFanFill]}
          name="Ceiling Fan"
        />
      ),
      kind: 'binaryControl',
      name: 'Ceiling Fan',
      size: '1x1',
    },
    {
      card: () => (
        <SliderCard
          switchable
          defaultValue={0.6}
          format={percent}
          icon={sfLightbulbFill}
          max={1}
          min={0}
          name="Dimmer"
          tint="var(--color-ui-system-yellow)"
        />
      ),
      kind: 'numericalControl',
      name: 'Dimmer',
      size: '2x1',
    },
    {
      card: () => (
        <SliderCard
          defaultValue={0.5}
          format={percent}
          icon={sfWindowShadeClosed}
          max={1}
          min={0}
          name="Blinds"
          step={0.25}
        />
      ),
      kind: 'numericalControl',
      name: 'Blinds',
      size: '1x2',
    },
  ],
  Climate: [
    {
      card: () => (
        <ValueCard
          icon={sfThermometerMedium}
          name="Living Room Temperature"
          value={21.5}
          format={{
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
            style: 'unit',
            unit: 'celsius',
          }}
        />
      ),
      kind: 'numericalDisplay',
      name: 'Temperature',
      size: '2x2',
    },
    {
      card: () => (
        <ValueCard
          format={percent}
          icon={sfHumidityFill}
          name="Humidity"
          value={0.46}
        />
      ),
      kind: 'numericalDisplay',
      name: 'Humidity',
      size: '1x1',
    },
    {
      card: () => (
        <SliderCard
          defaultValue={21}
          icon={sfThermometerMedium}
          max={25}
          min={15}
          name="Thermostat"
          step={0.5}
          tint="var(--color-ui-system-orange)"
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
        <ValueCard
          icon={sfFanFill}
          name="Wind"
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
      card: ({ expansion }) => (
        <EmptyExpandingCard
          expansion={expansion}
          name="Expand in place"
        />
      ),
      expandedSize: '2x2',
      kind: 'numericalDisplay',
      name: 'Empty, expanding',
      size: '1x1',
    },
    {
      area: '3x2',
      card: ({ expansion }) => (
        <EmptyExpandingCard
          expansion={expansion}
          name="Expand in its area"
        />
      ),
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
  Security: [
    {
      card: () => (
        <StateCard
          isOn
          icons={[sfLockFill, sfLockOpenFill]}
          name="Front Door"
          words={['Locked', 'Unlocked']}
        />
      ),
      kind: 'binaryDisplay',
      name: 'Front Door',
      size: '2x1',
    },
    {
      card: () => (
        <StateCard
          icons={[sfDoorLeftHandOpen, sfDoorLeftHandClosed]}
          isOn={false}
          name="Back Door"
          words={['Open', 'Closed']}
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
  // (Which are expanded: the app's state, not stored; none while editing.)
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const toggle = (name: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  const [gridSigns] = useState(gridSignsOf);
  const handle = Grid.useCreateReorderHandle({
    onReorder: (change) =>
      setRooms((current) => Grid.reorder(current, change, ({ name }) => name)),
  });
  const resize = (name: string, size: GridSize) => {
    // (Resized: as stored, small.)
    setExpanded((current) => {
      const next = new Set(current);
      next.delete(name);
      return next;
    });
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
                onClick={() => {
                  // (Edited as stored: expanded ones small again.)
                  if (!editing) setExpanded(new Set());
                  setEditing(!editing);
                }}
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
            <Grid.Root
              className="kitchen-sink-grid"
              editing={editing}
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
                    }) => {
                      const isExpanded = expanded.has(name);
                      // (Expanding only where that's larger than it is.)
                      const canExpand =
                        expandedSize !== undefined && expandedSize !== size;
                      return (
                        <Grid.Item
                          key={name}
                          dropName={name}
                          openLabel={openSize ? name : undefined}
                          openSize={openSize}
                          reorderHandle={handle}
                          supportedSizes={sizes ?? cardSizes[kind]}
                          size={
                            isExpanded && expandedSize ? expandedSize : size
                          }
                          onSizeChange={(next) => resize(name, next)}
                        >
                          <CardOf
                            expansion={
                              canExpand
                                ? { isExpanded, onToggle: () => toggle(name) }
                                : undefined
                            }
                          />
                          <Grid.ResizeHandle />
                          {/* (Room around it: expanded, it grows in there,
                            nothing around it moving.) */}
                          {area ? (
                            <Grid.Area defaultSize={area}>
                              <Grid.ResizeHandle />
                            </Grid.Area>
                          ) : null}
                        </Grid.Item>
                      );
                    },
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
                <SwitchCard
                  icons={[sfLightbulbFill, sfLightbulb]}
                  name="Desk Lamp"
                />
              </div>
              <div>
                <ValueCard
                  format={percent}
                  icon={sfHumidityFill}
                  name="Humidity"
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
};
