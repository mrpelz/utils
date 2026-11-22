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
  sfDoorLeftHandClosed,
  sfDoorLeftHandOpen,
  sfFan,
  sfFanFill,
  sfHumidityFill,
  sfLightbulb,
  sfLightbulbFill,
  sfLockFill,
  sfLockOpen,
  sfPhoto,
  sfThermometerMedium,
  sfWindowShadeClosed,
} from '../tooling/icons.js';
import {
  CardToneContext,
  type Expansion,
  lightsStore,
  type Tile,
  Toned,
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

/** A share, whole percent. */
const percent: Intl.NumberFormatOptions = {
  maximumFractionDigits: 0,
  style: 'percent',
};

/**
 * Heating: small, the room's temperature; expanded, a slider filling it
 * (ControlCards' `SliderFill`) setting what it heats to. Its corner button
 * expands it and makes it small again.
 */
const HeatingCard: FunctionComponent<{ expansion?: Expansion }> = ({
  expansion,
}) => {
  const [target, setTarget] = useState(22);
  // (Large (expanded, or resized so): its slider.)
  const isExpanded = useIsLarge();
  return (
    <TonedCard
      // (Small, a press anywhere on it as on its button (shown: expanding
      // changing it); expanded, its slider's, the button alone expanding
      // it no more.)
      onClick={
        expansion && !isExpanded
          ? forwardClick(
              '[data-card-part=corner-button]:not([data-grid-hidden])',
            )
          : undefined
      }
    >
      {/* (Its parts moved from where they were as it expands, with GSAP.) */}
      <FlipParts />
      <Card.Symbol>
        <Symbol icon={sfThermometerMedium} />
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
      {expansion ? (
        <ControlCards.ExpandButton
          collapsedSize={expansion.collapsedSize}
          expanded={expansion.isExpanded}
          expandedSize={expansion.expandedSize}
          label="Heating details"
          onExpandedChange={expansion.onToggle}
        />
      ) : null}
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
      max={1}
      min={0}
      name="Dimmer"
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
      name="Lights"
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
      <ControlCards.OpenButtons
        closeLabel="Close"
        label="Front Door Camera"
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
      <ControlCards.ExpandButton
        collapsedSize={expansion.collapsedSize}
        expanded={expansion.isExpanded}
        expandedSize={expansion.expandedSize}
        label={name}
        onExpandedChange={expansion.onToggle}
      />
    ) : null}
  </TonedCard>
);

/**
 * An empty card that opens above the page: its corner button opening it,
 * open, its x closing it (as a press beside it, or Escape).
 */
const EmptyOpeningCard: FunctionComponent<{ name: string }> = ({ name }) => (
  <TonedCard>
    <ControlCards.OpenButtons
      closeLabel="Close"
      label={name}
    />
  </TonedCard>
);

const roomsInitial: Readonly<Record<string, readonly Tile[]>> = {
  'Living Room': [
    {
      card: () => (
        <Toned.Switch
          defaultChecked
          emphasizedIcon={sfLightbulbFill}
          icon={sfLightbulb}
          name="Floor Lamp"
          tint={cardTints.light}
        />
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
          name="Ceiling Fan"
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
          max={1}
          min={0}
          name="Blinds"
          step={0.25}
          tint={cardTints.shade}
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
        <Toned.Value
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
        <Toned.Value
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
        <Toned.Slider
          defaultValue={21}
          icon={sfThermometerMedium}
          max={25}
          min={15}
          name="Thermostat"
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
        <Toned.State
          active
          emphasizedIcon={sfLockFill}
          icon={sfLockOpen}
          name="Front Door"
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
          name="Back Door"
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
                      // (Expanding, its button shown only where that
                      // changes its size, at these columns too.)
                      const canExpand = expandedSize !== undefined;
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
                                ? {
                                    collapsedSize: size,
                                    expandedSize,
                                    isExpanded,
                                    onToggle: () => toggle(name),
                                  }
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
                <ControlCards.Switch
                  emphasizedIcon={sfLightbulbFill}
                  icon={sfLightbulb}
                  name="Desk Lamp"
                  tint={cardTints.light}
                />
              </div>
              <div>
                <ControlCards.Value
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
