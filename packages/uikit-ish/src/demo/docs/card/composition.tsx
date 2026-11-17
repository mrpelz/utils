import { FunctionComponent, useMemo, useState } from 'react';

import {
  Button,
  cardSizes,
  forwardClick,
  Grid,
  Header,
  List,
  Navigation,
  Page,
  Switch,
  Symbol,
  Toolbar,
  Viewport,
} from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import {
  type PartProps,
  usePartControls,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { sfChevronBackward } from '../../tooling/icons.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  type CardTile,
  lampCard,
  type Lights,
  lightsCard,
  lightsInitial,
  lockCard,
  temperatureCard,
} from './content.js';
import { cardsStage, stageParts, useCardsStage } from './main.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const switchCode = `// A lamp: its switch in the card, a press anywhere on it toggling it.
const LampCard = ({ name }) => {
  const [isOn, setIsOn] = useState(true);
  return (
    <Card.Root active={isOn} onClick={forwardClick('[role=switch]')}>
      <Card.Symbol>
        <Symbol icon={isOn ? sfLightbulbFill : sfLightbulb} />
      </Card.Symbol>
      <Card.Title>{name}</Card.Title>
      <Card.Value>{isOn ? 'On' : 'Off'}</Card.Value>
      <Switch.Root aria-label={name} checked={isOn} onCheckedChange={setIsOn}>
        <Switch.Thumb />
      </Switch.Root>
    </Card.Root>
  );
};

<Grid.Item size="2x1" supportedSizes={cardSizes.binaryControl}>
  <LampCard name="Floor Lamp" />
  <Grid.ResizeHandle />
</Grid.Item>`;

const sliderCode = `// A dimmer: a slider in the card, across or upright by its tile's shape.
const DimmerCard = ({ name, step }) => {
  const orientation = useCardOrientation();
  const [value, setValue] = useState(0.6);
  return (
    <Card.Root>
      <Card.Symbol>
        <Symbol icon={sfLightbulbFill} />
      </Card.Symbol>
      <Slider.Root
        format={{ maximumFractionDigits: 0, style: 'percent' }}
        max={1}
        min={0}
        orientation={orientation}
        step={step ?? 0.01}
        tint="var(--color-ui-system-yellow)"
        value={value}
        onValueChange={setValue}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            {step ? <Slider.Ticks count={Math.round(1 / step) + 1} /> : null}
            <Slider.Thumb aria-label={name} />
          </Slider.Track>
        </Slider.Control>
        <Slider.Label>{name}</Slider.Label>
        <Slider.Value />
      </Slider.Root>
    </Card.Root>
  );
};

<Grid.Item size="2x1" supportedSizes={cardSizes.numericalControl}>
  <DimmerCard name="Dimmer" />
  <Grid.ResizeHandle />
</Grid.Item>
<Grid.Item size="1x2" supportedSizes={cardSizes.numericalControl}>
  <DimmerCard name="Blinds" step={0.25} />
  <Grid.ResizeHandle />
</Grid.Item>`;

const displayCode = `// A lock's state, in words; bright while it's locked.
<Card.Root active={isLocked}>
  <Card.Symbol>
    <Symbol icon={isLocked ? sfLockFill : sfLockOpenFill} />
  </Card.Symbol>
  <Card.Title>Front Door</Card.Title>
  <Card.Value>{isLocked ? 'Locked' : 'Unlocked'}</Card.Value>
</Card.Root>

// A temperature, with one decimal place, in degrees Celsius.
<Card.Root>
  <Card.Symbol>
    <Symbol icon={sfThermometerMedium} />
  </Card.Symbol>
  <Card.Title>Living Room</Card.Title>
  <Card.Value
    format={{
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
      style: 'unit',
      unit: 'celsius',
    }}
    value={21.5}
  />
</Card.Root>`;

const expandCode = `// Heating: small, the room's temperature; expanded, a slider setting
// what it heats to. Its corner button asks for the other.
const celsius = {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: 'unit',
  unit: 'celsius',
};

const HeatingCard = ({ isExpanded, onToggle }) => {
  const [target, setTarget] = useState(22);
  return (
    // Small, a press anywhere on it as on its button; expanded, the slider
    // takes it.
    <Card.Root
      onClick={
        isExpanded ? undefined : forwardClick('[data-card-part=corner-button]')
      }
    >
      {/* Its parts moved from where they were as it expands (see
          Building for changing sizes). */}
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
          value={target}
          onValueChange={setTarget}
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
          <Card.Value format={celsius} value={21.5} />
        </>
      )}
      <Card.CornerButton
        mirrored
        aria-expanded={isExpanded}
        aria-label="Heating details"
        icon={isExpanded ? gridIcons.collapse : gridIcons.expand}
        onClick={onToggle}
      />
    </Card.Root>
  );
};

// The app's state: the size the user chose (stored), whether it's
// expanded (here, not stored), edit mode.
const [size, setSize] = useState('1x1');
const [isExpanded, setIsExpanded] = useState(false);
const [editing, setEditing] = useState(false);

<Button.Root
  onClick={() => {
    // (Edited at its own size: small again.)
    setIsExpanded(false);
    setEditing(!editing);
  }}
>
  <Button.Label>{editing ? 'Done' : 'Edit'}</Button.Label>
</Button.Root>
<Grid.Root editing={editing}>
  <Grid.Item
    size={isExpanded ? '2x2' : size}
    supportedSizes={cardSizes.numericalDisplay}
    onSizeChange={(next) => {
      setSize(next);
      setIsExpanded(false);
    }}
  >
    <HeatingCard
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
    />
    <Grid.ResizeHandle />
  </Grid.Item>
</Grid.Root>`;

const drillCode = `// The room's lights, the app's: on or off.
const [lights, setLights] = useState({
  'Ceiling Light': true,
  'Desk Lamp': false,
  'Floor Lamp': true,
});
const onCount = Object.values(lights).filter(Boolean).length;

// The pages: Home, and Lights pushed on it.
const [keys, setKeys] = useState(['home']);

// Bright while any is on; a press anywhere on it as on its corner button.
const LightsCard = ({ onDrillIn }) => (
  <Card.Root
    active={onCount > 0}
    onClick={forwardClick('[data-card-part=corner-button]')}
  >
    <Card.Symbol>
      <Symbol icon={sfLightbulbFill} />
    </Card.Symbol>
    <Card.Title>Lights</Card.Title>
    <Card.Value>{onCount > 0 ? onCount + ' On' : 'Off'}</Card.Value>
    <Card.CornerButton
      aria-label="Lights"
      icon={gridIcons.drillIn}
      onClick={onDrillIn}
    />
  </Card.Root>
);

<Navigation.Root onBack={() => setKeys(['home'])}>
  <Navigation.SwipeArea />
  <Navigation.Stack>
    {keys.map((key) => (
      <Header.Root key={key}>
        <Viewport.BlockStart>…</Viewport.BlockStart>
        {key === 'home' ? (
          <Page.Root>
            <Grid.Root>
              <Grid.Item size="2x1" supportedSizes={cardSizes.binaryDisplay}>
                <LightsCard onDrillIn={() => setKeys(['home', 'lights'])} />
              </Grid.Item>
            </Grid.Root>
          </Page.Root>
        ) : (
          <Page.Root>
            <List.Root>
              <List.Section>
                <List.Group>
                  {Object.entries(lights).map(([name, isOn]) => (
                    // A press on the row as on its switch.
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
                          onCheckedChange={(next) =>
                            setLights({ ...lights, [name]: next })
                          }
                        >
                          <Switch.Thumb />
                        </Switch.Root>
                      </List.Trailing>
                    </List.Item>
                  ))}
                </List.Group>
              </List.Section>
            </List.Root>
          </Page.Root>
        )}
      </Header.Root>
    ))}
  </Navigation.Stack>
</Navigation.Root>`;

const overlayCode = `// A camera: open above the page, it shows more; its corner button opens
// it (and a press anywhere on it), an x closes it.
const CameraCard = () => {
  const item = useGridItem();
  const isOpen = item?.open === true;
  return (
    <Card.Root
      onClick={
        isOpen
          ? undefined
          : forwardClick('[data-card-part=corner-button]:not([data-grid-hidden])')
      }
    >
      {/* Its parts moved from where they were as it opens (see Building
          for changing sizes). */}
      <FlipParts />
      <Card.Symbol>
        <Symbol icon={sfPhoto} />
      </Card.Symbol>
      <Card.Title>Front Door Camera</Card.Title>
      <Card.Value>{isOpen ? 'Live, recording since 8:12' : 'Live'}</Card.Value>
      {/* Opening it while it's closed; its x while it's open. */}
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
    </Card.Root>
  );
};

// Its item: its size open, its name as a dialog.
<Grid.Item
  openLabel="Front Door Camera"
  openSize="4x3"
  size="2x1"
  supportedSizes={cardSizes.binaryDisplay}
>
  <CameraCard />
  <Grid.ResizeHandle />
</Grid.Item>`;

const sizeCode = `// The app's: its cards' parts moved from where they were as their tile
// changes its box, with GSAP's Flip (the app's dependency, not the
// library's). Placed in a card, it shows nothing.
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const parts =
  '[data-card-part]:not([data-card-part="root"], [data-card-part="corner-button"])';

const FlipParts = () => {
  const marker = useRef(null);
  const state = useRef();
  const cardOf = () => marker.current.closest('[data-card-part="root"]');
  useGridItemLayout({
    // Where they are, before the change.
    onBeforeChange: () => {
      state.current = Flip.getState(cardOf().querySelectorAll(parts), {
        props: 'fontSize',
        simple: true,
      });
    },
    // Laid out anew, the tile still at its old box: moved from where they
    // were, in step with the tile.
    onAfterChange: ({ duration, elapsed }) => {
      const timeline = Flip.from(state.current, {
        duration: duration / 1000,
        ease: 'power3.out',
        props: 'fontSize',
        simple: true,
        targets: cardOf().querySelectorAll(parts),
      }).pause();
      const follow = () => {
        timeline.time(Math.min(elapsed(), duration) / 1000);
        if (elapsed() < duration) requestAnimationFrame(follow);
      };
      requestAnimationFrame(follow);
    },
  });
  return <span ref={marker} hidden />;
};

// A card showing more the larger it is; what it shows depends on its state.
const celsius = {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: 'unit',
  unit: 'celsius',
};

const HeatingCard = ({ isExpanded, onToggle }) => {
  const [target, setTarget] = useState(22);
  return (
    <Card.Root
      onClick={
        isExpanded ? undefined : forwardClick('[data-card-part=corner-button]')
      }
    >
      <FlipParts />
      {/* In both forms: it moves to its new place, never pops. */}
      <Card.Symbol>
        <Symbol icon={sfThermometerMedium} />
      </Card.Symbol>
      {isExpanded ? (
        // Only in the larger form: shown as the card's edge passes it.
        <Slider.Root
          format={celsius}
          max={26}
          min={16}
          step={0.5}
          value={target}
          onValueChange={setTarget}
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
          <Card.Value format={celsius} value={21.5} />
        </>
      )}
      <Card.CornerButton
        mirrored
        aria-expanded={isExpanded}
        aria-label="Heating details"
        icon={isExpanded ? gridIcons.collapse : gridIcons.expand}
        onClick={onToggle}
      />
    </Card.Root>
  );
};

const [isExpanded, setIsExpanded] = useState(false);

// In room of its own: expanded, it grows there, nothing around it moving.
<Grid.Item
  size={isExpanded ? '2x2' : '1x1'}
  supportedSizes={cardSizes.numericalDisplay}
>
  <HeatingCard
    isExpanded={isExpanded}
    onToggle={() => setIsExpanded(!isExpanded)}
  />
  <Grid.Area defaultSize="3x2" />
</Grid.Item>`;

const aloneCode = `// No grid: as large as its box, never in edit mode.
<div style={{ height: 100, width: 220 }}>
  <LampCard name="Desk Lamp" />
</div>`;

/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** A phone with some cards in a grid (see `cardsStage`). */
const StageView: FunctionComponent<{
  id: string;
  tiles: readonly CardTile[];
}> = ({ id, tiles }) => {
  const [log, addLog] = useLog();
  const stage = useCardsStage(addLog, tiles);
  // (Room around a tile: its area's controls too.)
  const hasArea = tiles.some(({ area }) => area !== undefined);
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...stageParts,
            ...(hasArea && { 'Grid.Area': ['defaultSize'] as const }),
            'Card.CornerButton': [
              'aria-expanded',
              'aria-label',
              'icon',
              'mirrored',
              'onClick',
            ],
            'Card.Root': [],
            'Card.Symbol': [],
            'Card.Title': [],
            'Card.Value': ['children', 'format', 'value'],
          },
          addLog,
        ),
      [addLog, hasArea],
    ),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[partState]}
      title="Card"
    >
      {cardsStage(stage, partProps)}
    </Component>
  );
};

const SwitchView: FunctionComponent = () => (
  <StageView
    id="card-composition-switch"
    tiles={[
      {
        kind: 'lamp',
        name: 'Floor Lamp',
        size: '2x1',
        sizes: cardSizes.binaryControl,
      },
      {
        kind: 'fan',
        name: 'Ceiling Fan',
        size: '1x1',
        sizes: cardSizes.binaryControl,
      },
    ]}
  />
);

const SliderView: FunctionComponent = () => (
  <StageView
    id="card-composition-slider"
    tiles={[
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
    ]}
  />
);

const DisplayView: FunctionComponent = () => (
  <StageView
    id="card-composition-display"
    tiles={[
      {
        kind: 'lock',
        name: 'Front Door',
        size: '2x1',
        sizes: cardSizes.binaryDisplay,
      },
      {
        kind: 'humidity',
        name: 'Humidity',
        size: '1x1',
        sizes: cardSizes.numericalDisplay,
      },
      {
        kind: 'temperature',
        name: 'Temperature',
        size: '2x2',
        sizes: cardSizes.numericalDisplay,
      },
    ]}
  />
);

const ExpandView: FunctionComponent = () => (
  <StageView
    id="card-composition-expand"
    tiles={[
      {
        kind: 'heating',
        expandedSize: '2x2',
        name: 'Heating',
        size: '1x1',
        sizes: cardSizes.numericalDisplay,
      },
      {
        kind: 'humidity',
        name: 'Humidity',
        size: '1x1',
        sizes: cardSizes.numericalDisplay,
      },
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
    ]}
  />
);

/**
 * A phone's two pages: Home (the lights' card, a lock's), and Lights,
 * pushed by the card's corner button, a switch per light (the card's value
 * following them).
 */
const DrillView: FunctionComponent = () => {
  const id = 'card-composition-drill-in';
  const [log, addLog] = useLog();
  const [keys, setKeys] = useState<readonly string[]>(['home']);
  const [lights, setLights] = useState<Lights>(lightsInitial);
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Button.Icon': [],
            'Card.CornerButton': ['aria-label', 'icon', 'onClick'],
            'Card.Root': ['active', 'onClick'],
            'Card.Symbol': [],
            'Card.Title': [],
            'Card.Value': ['children'],
            'Grid.Item': ['size', 'supportedSizes'],
            'Grid.Root': [],
            'List.Content': [],
            'List.Group': [],
            'List.Item': ['onClick'],
            'List.Root': [],
            'List.Section': [],
            'List.Title': [],
            'List.Trailing': [],
            'Navigation.Back': ['aria-label', 'render'],
            'Navigation.Root': ['onBack'],
            'Navigation.Stack': [],
            'Navigation.SwipeArea': [],
            'Page.Root': [],
            'Switch.Root': ['aria-label', 'checked', 'onCheckedChange'],
            'Switch.Thumb': [],
            Symbol: ['icon'],
            'Toolbar.Button': ['shape'],
            'Toolbar.Leading': [],
            'Toolbar.Root': ['placement'],
            'Toolbar.Title': [],
            'Viewport.BlockStart': [],
            'Viewport.Content': [],
            'Viewport.Padding': ['edge'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );
  const parts: PartProps = partProps;

  return (
    <Component
      isInline
      controls={[partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[partState]}
      title="Card"
    >
      <Viewport.Background>
        <div
          aria-hidden="true"
          className="demo-picture"
        />
      </Viewport.Background>
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Navigation.Root
          {...partProps['Navigation.Root']}
          onBack={() => {
            addLog('back');
            setKeys(['home']);
          }}
        >
          <Navigation.SwipeArea {...partProps['Navigation.SwipeArea']} />
          <Navigation.Stack {...partProps['Navigation.Stack']}>
            {keys.map((key) => (
              <Header.Root key={key}>
                <Viewport.BlockStart {...partProps['Viewport.BlockStart']}>
                  <Toolbar.Root
                    {...partProps['Toolbar.Root']}
                    placement="block-start"
                  >
                    {key === 'home' ? null : (
                      <Toolbar.Leading {...partProps['Toolbar.Leading']}>
                        <Navigation.Back
                          {...partProps['Navigation.Back']}
                          aria-label="Home"
                          render={
                            <Toolbar.Button
                              {...partProps['Toolbar.Button']}
                              shape="circle"
                            />
                          }
                        >
                          <Button.Icon {...partProps['Button.Icon']}>
                            <Symbol
                              {...partProps.Symbol}
                              icon={sfChevronBackward}
                            />
                          </Button.Icon>
                        </Navigation.Back>
                      </Toolbar.Leading>
                    )}
                    <Toolbar.Title {...partProps['Toolbar.Title']}>
                      <span>{key === 'home' ? 'Home' : 'Lights'}</span>
                    </Toolbar.Title>
                  </Toolbar.Root>
                </Viewport.BlockStart>
                {key === 'home' ? (
                  <Page.Root
                    {...partProps['Page.Root']}
                    // (With its control's class, if any.)
                    className={[
                      'card-demo-page',
                      partProps['Page.Root']?.className,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <Viewport.Padding
                      {...partProps['Viewport.Padding']}
                      edge="block-start"
                    />
                    <div className="card-demo-content">
                      <Grid.Root {...partProps['Grid.Root']}>
                        <Grid.Item
                          {...partProps['Grid.Item']}
                          size="2x1"
                          supportedSizes={cardSizes.binaryDisplay}
                        >
                          {lightsCard({
                            lights,
                            onDrillIn: () => {
                              addLog('push: lights');
                              setKeys(['home', 'lights']);
                            },
                            parts,
                          })}
                        </Grid.Item>
                        <Grid.Item
                          {...partProps['Grid.Item']}
                          size="1x1"
                          supportedSizes={cardSizes.binaryDisplay}
                        >
                          {lockCard({ parts })}
                        </Grid.Item>
                      </Grid.Root>
                    </div>
                    <Viewport.Padding
                      {...partProps['Viewport.Padding']}
                      edge="block-end"
                    />
                  </Page.Root>
                ) : (
                  <Page.Root {...partProps['Page.Root']}>
                    <Viewport.Padding
                      {...partProps['Viewport.Padding']}
                      edge="block-start"
                    />
                    <List.Root {...partProps['List.Root']}>
                      <List.Section {...partProps['List.Section']}>
                        <List.Group {...partProps['List.Group']}>
                          {Object.entries(lights).map(([name, isOn]) => (
                            <List.Item
                              key={name}
                              onClick={forwardClick('[role=switch]')}
                              {...partProps['List.Item']}
                            >
                              <List.Content {...partProps['List.Content']}>
                                <List.Title {...partProps['List.Title']}>
                                  {name}
                                </List.Title>
                              </List.Content>
                              <List.Trailing {...partProps['List.Trailing']}>
                                <Switch.Root
                                  {...partProps['Switch.Root']}
                                  aria-label={name}
                                  checked={isOn}
                                  onCheckedChange={(next) => {
                                    addLog(`${name}: ${next ? 'on' : 'off'}`);
                                    setLights((current) => ({
                                      ...current,
                                      [name]: next,
                                    }));
                                  }}
                                >
                                  <Switch.Thumb
                                    {...partProps['Switch.Thumb']}
                                  />
                                </Switch.Root>
                              </List.Trailing>
                            </List.Item>
                          ))}
                        </List.Group>
                      </List.Section>
                    </List.Root>
                    <Viewport.Padding
                      {...partProps['Viewport.Padding']}
                      edge="block-end"
                    />
                  </Page.Root>
                )}
              </Header.Root>
            ))}
          </Navigation.Stack>
        </Navigation.Root>
      </Viewport.Content>
    </Component>
  );
};

const OverlayView: FunctionComponent = () => (
  <StageView
    id="card-composition-overlay"
    tiles={[
      {
        kind: 'camera',
        name: 'Front Door Camera',
        openSize: '4x3',
        size: '2x1',
        sizes: cardSizes.binaryDisplay,
      },
      {
        kind: 'lock',
        name: 'Front Door',
        size: '1x1',
        sizes: cardSizes.binaryDisplay,
      },
      {
        kind: 'lamp',
        name: 'Floor Lamp',
        size: '2x1',
        sizes: cardSizes.binaryControl,
      },
      {
        kind: 'humidity',
        name: 'Humidity',
        size: '1x1',
        sizes: cardSizes.numericalDisplay,
      },
    ]}
  />
);

const SizeView: FunctionComponent = () => (
  <StageView
    id="card-composition-changing-size"
    tiles={[
      {
        area: '3x2',
        kind: 'heating',
        expandedSize: '2x2',
        name: 'Heating',
        size: '1x1',
        sizes: cardSizes.numericalDisplay,
      },
      {
        kind: 'camera',
        name: 'Front Door Camera',
        openSize: '4x3',
        size: '2x1',
        sizes: cardSizes.binaryDisplay,
      },
      {
        kind: 'lock',
        name: 'Front Door',
        size: '1x1',
        sizes: cardSizes.binaryDisplay,
      },
    ]}
  />
);

/** Cards on their own: no grid, in boxes of their own sizes. */
const AloneView: FunctionComponent = () => {
  const id = 'card-composition-alone';
  const [log, addLog] = useLog();
  const [isDeskLampOn, setIsDeskLampOn] = useState(true);
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            'Card.Root': [],
            'Card.Symbol': [],
            'Card.Title': [],
            'Card.Value': ['children', 'format', 'value'],
            'Page.Root': [],
            'Viewport.Content': [],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );
  const parts: PartProps = partProps;

  return (
    <Component
      isInline
      controls={[partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[partState]}
      title="Card"
    >
      <Viewport.Background>
        <div
          aria-hidden="true"
          className="demo-picture"
        />
      </Viewport.Background>
      <Viewport.Content {...partProps['Viewport.Content']}>
        <Page.Root
          {...partProps['Page.Root']}
          // (With its control's class, if any.)
          className={['card-demo-page', partProps['Page.Root']?.className]
            .filter(Boolean)
            .join(' ')}
        >
          <Viewport.Padding edge="block-start" />
          <div className="card-demo-content card-demo-alone">
            <div>
              {lampCard({
                isOn: isDeskLampOn,
                name: 'Desk Lamp',
                onChange: (isOn) => {
                  addLog(`Desk Lamp: ${isOn ? 'on' : 'off'}`);
                  setIsDeskLampOn(isOn);
                },
                parts,
              })}
            </div>
            <div>{temperatureCard({ parts })}</div>
          </div>
        </Page.Root>
      </Viewport.Content>
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['a-switch-in-a-card', 'A switch in a card'],
  ['a-slider-in-a-card', 'A slider in a card'],
  ['displays', 'Displays'],
  ['expanding-in-place', 'Expanding in place'],
  ['drilling-in', 'Drilling in'],
  ['opening-above-the-page', 'Opening above the page'],
  ['building-for-changing-sizes', 'Building for changing sizes'],
  ['on-its-own', 'On its own'],
];

/** `/card/composition`: the kinds of cards, each as an app writes it. */
export const CardComposition: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Each card here is a component of the app’s, in a{' '}
        <PartLink
          component="grid"
          part="Grid.Item"
        />{' '}
        whose <code>supportedSizes</code> come from{' '}
        <PartLink part="cardSizes" />.
      </li>
      <li>
        In edit mode, the cards are veiled and can be moved and resized. While
        one is, the veils lift.
      </li>
    </ul>

    <Heading
      id="a-switch-in-a-card"
      level={2}
    >
      A switch in a card
    </Heading>
    <ul>
      <li>
        A lamp: a{' '}
        <PartLink
          component="switch"
          part="Switch.Root"
        />{' '}
        in a <PartLink part="Card.Root" />, which passes its presses on to it
        with{' '}
        <PartLink
          component="list"
          part="forwardClick"
        />
        , as a list row does.
      </li>
      <li>
        On, the whole card is bright and its symbol takes the switch’s tint. Its
        words say it too, so color isn’t the only sign.
      </li>
      <li>
        <strong>Library:</strong> the switch styled by the card, its state as
        the card’s background, presses passed on.
      </li>
      <li>
        <strong>Demo:</strong> the lamp and the fan, their state, their symbols
        and words, Edit and Done.
      </li>
    </ul>
    <CodeView code={switchCode} />
    <SwitchView />

    <Heading
      id="a-slider-in-a-card"
      level={2}
    >
      A slider in a card
    </Heading>
    <ul>
      <li>
        A dimmer: a{' '}
        <PartLink
          component="slider"
          part="Slider.Root"
        />{' '}
        in a card, the card its track, the fill its background. It has no knob;
        the card shows the focus ring.
      </li>
      <li>
        Its orientation is <PartLink part="useCardOrientation" />: across in a
        wide tile, upright in a tall one. Resize the blinds to 2x1 in edit mode
        and it turns.
      </li>
      <li>
        Its value is the slider’s own <code>format</code>, passed to{' '}
        <code>Intl.NumberFormat</code>. With a <code>step</code>, it snaps, and{' '}
        <PartLink
          component="slider"
          part="Slider.Ticks"
        />{' '}
        mark the steps across the card.
      </li>
      <li>
        <strong>Library:</strong> the slider styled by the card, the tile’s
        orientation.
      </li>
      <li>
        <strong>Demo:</strong> the dimmer and the blinds (in quarters), their
        values and tints.
      </li>
    </ul>
    <CodeView code={sliderCode} />
    <SliderView />

    <Heading
      id="displays"
      level={2}
    >
      Displays
    </Heading>
    <ul>
      <li>
        A lock’s state in words, and numbers in <PartLink part="Card.Value" />.
        The lock is <code>active</code> while it’s locked, so the card is bright
        then. Nothing on them can be pressed, so they show no press feedback.
      </li>
      <li>
        The formatting is the app’s: the unit, the decimal places and the locale
        are options for <code>Intl.NumberFormat</code>. At 2x2, the value is
        large.
      </li>
      <li>
        <strong>Library:</strong> the layout by size, the value formatted with
        the app’s options.
      </li>
      <li>
        <strong>Demo:</strong> the lock, the temperature and the humidity, their
        formats.
      </li>
    </ul>
    <CodeView code={displayCode} />
    <DisplayView />

    <Heading
      id="expanding-in-place"
      level={2}
    >
      Expanding in place
    </Heading>
    <ul>
      <li>
        A heating card shows the room’s temperature. Expanded, it’s larger and
        shows a slider that sets what it heats to. The grid makes room for it
        and moves the tiles after it.
      </li>
      <li>
        Expanding is the app’s: it keeps whether the card is expanded and gives
        its{' '}
        <PartLink
          component="grid"
          part="Grid.Item"
        />{' '}
        the expanded size, here 2x2, which must be in its{' '}
        <code>supportedSizes</code>. Whether that’s stored is the app’s choice
        too. Here it isn’t, so the card is small again after a reload.
      </li>
      <li>
        A <PartLink part="Card.CornerButton" /> asks for the other state. Its
        icon comes from the same state:{' '}
        <PartLink
          component="grid"
          part="gridIcons"
        />
        ’s <code>expand</code> while it’s small, <code>collapse</code> while
        it’s expanded. It’s <code>mirrored</code>, since the triangle points to
        a corner, and says its state with <code>aria-expanded</code>.
      </li>
      <li>
        Small, the card has no control of its own, so a press anywhere on it
        expands it too, passed on to the button with{' '}
        <PartLink
          component="list"
          part="forwardClick"
        />
        . Expanded, the slider takes presses, so only the button collapses it.
      </li>
      <li>
        Edit starts with the card small again, so edit mode moves and resizes
        the size the user chose. A resize stores the new size and leaves the
        card small.
      </li>
      <li>
        A card already as large as its expanded size has nothing to expand: it
        shows no button.
      </li>
      <li>
        Getting there is the grid’s (see Grid’s{' '}
        <a href={publicUrl('grid/composition#expanding-in-place')}>
          Expanding in place
        </a>
        ). The card’s symbol moves from its old place with GSAP, by the demos’{' '}
        <code>FlipParts</code> (see{' '}
        <a href="#building-for-changing-sizes">Building for changing sizes</a>
        ).
      </li>
      <li>
        <strong>Library:</strong> the corner button and its icons, the grid
        making room for the new size.
      </li>
      <li>
        <strong>Demo:</strong> the expanded state and size, what the card shows
        expanded, collapsing for edit mode.
      </li>
    </ul>
    <CodeView code={expandCode} />
    <ExpandView />

    <Heading
      id="drilling-in"
      level={2}
    >
      Drilling in
    </Heading>
    <ul>
      <li>
        The lights’ card says how many are on. Its corner button goes to a page
        of their own, a switch per light, and the card follows them: its count,
        and its brightness.
      </li>
      <li>
        Going there is the app’s: the button’s <code>onClick</code> pushes the
        page, here on a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Root"
        />
        ’s stack. Back, or a swipe from the edge, returns to the cards.
      </li>
      <li>
        Its icon is{' '}
        <PartLink
          component="grid"
          part="gridIcons"
        />
        ’s <code>drillIn</code>, a ring, and its name says where it goes:
        “Lights”.
      </li>
      <li>
        The card has no control of its own, so a press anywhere on it goes there
        too: its <code>onClick</code> passes it on to the button with{' '}
        <PartLink
          component="list"
          part="forwardClick"
        />
        , as the rows on the lights’ page pass theirs on to their switches.
      </li>
      <li>
        It’s <code>active</code> while any light is on: bright, as a card whose
        switch is on.
      </li>
      <li>
        <strong>Library:</strong> the corner button and its icon, the
        navigation’s stack and transition.
      </li>
      <li>
        <strong>Demo:</strong> the lights and their states, the two pages, the
        count on the card.
      </li>
    </ul>
    <CodeView code={drillCode} />
    <DrillView />

    <Heading
      id="opening-above-the-page"
      level={2}
    >
      Opening above the page
    </Heading>
    <ul>
      <li>
        The camera’s card opens above the page: larger, in the middle of the
        screen, over the dimmed page, and opaque. Open, it shows more.
      </li>
      <li>
        Its{' '}
        <PartLink
          component="grid"
          part="Grid.Item"
        />{' '}
        says how large (<code>openSize</code>, here 4x3, fitted to the screen)
        and what it’s called as a dialog (<code>openLabel</code>). The card
        opens and closes it with{' '}
        <PartLink
          component="grid"
          part="useGridItem"
        />
        ’s <code>open</code> and <code>setOpen</code>.
      </li>
      <li>
        Its corner button shows{' '}
        <PartLink
          component="grid"
          part="gridIcons"
        />
        ’s <code>open</code>, a rounded square. A press anywhere on the card
        goes there too, with{' '}
        <PartLink
          component="list"
          part="forwardClick"
        />
        . Open, an x (<code>close</code>) in the top leading corner closes it,
        where the grid’s remove buttons are, and the card takes no press of its
        own. Each button is shown only in its state (<code>visible</code>),
        fading as the card grows and shrinks, and the card’s symbol moves beside
        its title, clear of the x.
      </li>
      <li>
        The grid lifts the card itself, so what’s in it keeps its state. A faint
        stand-in keeps its place, so nothing else in the grid moves. Closed, it
        moves and shrinks back into that place (see Grid’s{' '}
        <a href={publicUrl('grid/composition#opening-above-the-page')}>
          Opening above the page
        </a>
        ). Its parts move along with GSAP, by the demos’ <code>FlipParts</code>{' '}
        (see{' '}
        <a href="#building-for-changing-sizes">Building for changing sizes</a>
        ).
      </li>
      <li>
        It’s a modal dialog: focus moves into it and stays there, and a press
        beside it or Escape closes it, as its x does. Focus then goes back where
        it was. Starting edit mode closes it.
      </li>
      <li>
        <strong>Library:</strong> the lifting, the dimmed page, the stand-in,
        focus and closing, the corner button and its icons.
      </li>
      <li>
        <strong>Demo:</strong> the camera’s card and what it shows open, its
        open size and name.
      </li>
    </ul>
    <CodeView code={overlayCode} />
    <OverlayView />

    <Heading
      id="building-for-changing-sizes"
      level={2}
    >
      Building for changing sizes
    </Heading>
    <ul>
      <li>
        A card changes size when it expands in place, when it opens above the
        page, and when it’s resized in edit mode. The first two are animated.
        The library moves the card itself; moving what’s in it is up to your
        content.
      </li>
      <li>
        <strong>What the library does.</strong> The change is made at once: the
        card is laid out at its new size, and the grid at its new layout. Its
        tile then moves and resizes from its old box to its new one, and the
        tiles around it move to their new places. The card’s glass grows or
        shrinks with the tile, keeping its rounded corners, its rim and its
        shadow, and its corner buttons stay in their corners. With reduced
        motion, everything changes at once.
      </li>
      <li>
        <strong>What stays with your content.</strong> The card’s parts are laid
        out at the new size from the start, and stay where that puts them,
        clipped by the card’s glass as it grows or shrinks. To move them from
        where they were, use{' '}
        <PartLink
          component="grid"
          part="useGridItemLayout"
        />
        : it tells you before the change (record where things are) and once it’s
        in the page (move them from there), with the tile’s timing.
      </li>
      <li>
        <strong>With an animation library.</strong> The demos use GSAP’s Flip,
        written as a <code>FlipParts</code> placed in the card (see the code
        below). GSAP is the app’s choice and dependency, not the library’s. It
        moves <PartLink part="Card.Symbol" />, <PartLink part="Card.Title" />{' '}
        and <PartLink part="Card.Value" /> to their new places and their text to
        its new size, in step with the tile. Parts that are only in one form
        aren’t faded: they show or go as the card’s edge passes them. The empty
        cards in the kitchen sink move without any of it.
      </li>
      <li>
        <strong>Keep parts across forms.</strong> A part moves only when it’s in
        both forms. Keep the same part where it means the same, like the heating
        card’s symbol.
      </li>
      <li>
        <strong>Choose detail by size, show state by content.</strong> The
        card’s layout already follows its size: side by side when it’s wide and
        one row tall, its value large from about 180px. Switch what it shows
        when its state changes (expanded, or open with{' '}
        <PartLink
          component="grid"
          part="useGridItem"
        />
        ’s <code>open</code>), in the same change as its size.
      </li>
      <li>
        <strong>Keep text short.</strong> A title shows two lines at most. Long
        words break with a hyphen, but a short title reads better at every size.
      </li>
      <li>
        <strong>Changes from anywhere.</strong> Changing an item’s size or{' '}
        <code>open</code> from a corner button, from elsewhere in your app, or
        by the grid itself (Escape, a press beside it, edit mode starting) moves
        the tile the same way, and tells your content the same way.
      </li>
      <li>
        <strong>Expanding in place:</strong> the expanded size must be in the
        item’s <code>supportedSizes</code>. Collapse the card before edit mode
        starts, so the stored size is what’s edited (see{' '}
        <a href="#expanding-in-place">Expanding in place</a>). In a{' '}
        <PartLink
          component="grid"
          part="Grid.Area"
        />
        , the card grows within its room, centered if it’s centered, and nothing
        around it moves. The grid moves the tile to its new place, and the card
        resizes from there.
      </li>
      <li>
        <strong>Opening above the page:</strong> give the item an{' '}
        <code>openSize</code> and an <code>openLabel</code>. Put the x that
        closes it in the top leading corner and the button that opens it
        elsewhere, each <code>visible</code> in its own state: one fades out at
        the start of the move and the other fades in at its end. While the x is
        there, the symbol moves beside the title, clear of it (see{' '}
        <a href="#opening-above-the-page">Opening above the page</a>).
      </li>
      <li>
        <strong>Pressing the card:</strong> a card whose corner button and body
        do the same thing passes its presses on with{' '}
        <PartLink
          component="list"
          part="forwardClick"
        />
        , except in a form that has a control of its own: the expanded heating
        card’s slider takes presses, so only its button collapses it.
      </li>
      <li>
        <strong>Library:</strong> the tile moving and resizing (the glass with
        it, the tiles around it moving), the corner buttons following their
        corners and fading, lifting above the page, telling the content (
        <PartLink
          component="grid"
          part="useGridItemLayout"
        />
        ).
      </li>
      <li>
        <strong>Demo:</strong> the heating card’s two forms and its room, the
        camera’s open state, their corner buttons and presses, and moving their
        parts with GSAP (<code>FlipParts</code>).
      </li>
    </ul>
    <CodeView code={sizeCode} />
    <SizeView />

    <Heading
      id="on-its-own"
      level={2}
    >
      On its own
    </Heading>
    <ul>
      <li>
        A card works without a grid: it’s as large as its box, never in edit
        mode, and lays out its parts by that size.
      </li>
      <li>
        <strong>Library:</strong> the card outside a grid.
      </li>
      <li>
        <strong>Demo:</strong> the boxes’ sizes.
      </li>
    </ul>
    <CodeView code={aloneCode} />
    <AloneView />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const cardCompositionDemos = [
  SwitchView,
  SliderView,
  DisplayView,
  ExpandView,
  DrillView,
  OverlayView,
  SizeView,
  AloneView,
];
