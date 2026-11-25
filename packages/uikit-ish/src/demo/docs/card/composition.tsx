import { Fragment, FunctionComponent, useMemo, useState } from 'react';

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
import { usePresentation } from '../../tooling/frame/presentation.js';
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
  partsOfTiles,
  temperatureCard,
} from './content.js';
import { cardsStage, stageParts, useCardsStage } from './main.js';
import { MixedSection, MixedView } from './mixed.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */

const expandCode = `// Heating: small, the room's temperature; expanded, a slider setting
// what it heats to. Its corner button asks for the other.
const celsius = {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
  style: 'unit',
  unit: 'celsius',
};

const HeatingCard = () => {
  const [target, setTarget] = useState(22);
  // (Its item's expansion, see Grid.Item's expanded.)
  const isExpanded = useGridItem()?.expanded === true;
  return (
    // Small, a press anywhere on it as on its button (while it's shown);
    // expanded, the slider takes it.
    <Card.Root
      onClick={
        isExpanded
          ? undefined
          : forwardClick('[data-card-part=corner-button]:not([data-grid-hidden])')
      }
    >
      {/* Its parts moved from where they were as it expands (see
          Building for changing sizes). */}
      <FlipParts />
      <Card.Symbol>
        <Symbol box="square" icon={sfThermometerMedium} />
      </Card.Symbol>
      {isExpanded ? (
        // A slider filling the card (Card.Slider).
        <Card.Slider
          format={celsius}
          max={26}
          min={16}
          label="Heat to"
          step={0.5}
          tint="oklch(72% 0.17 50)"
          value={target}
          onValueChange={setTarget}
        />
      ) : (
        <>
          <Card.Title>Heating</Card.Title>
          <Card.Value format={celsius} value={21.5} />
        </>
      )}
      {/* Its item's expansion; hidden while expanding changes nothing
          (e.g. too few columns), its icon by which way it goes. */}
      <Card.ExpandButton aria-label="Heating details" />
    </Card.Root>
  );
};

// The app's state: the size the user chose (stored), whether it's
// expanded (here, not stored; edit mode makes it small again), edit mode.
const [size, setSize] = useState('1x1');
const [isExpanded, setIsExpanded] = useState(false);
const [editing, setEditing] = useState(false);

<Button.Root onClick={() => setEditing(!editing)}>
  <Button.Label>{editing ? 'Done' : 'Edit'}</Button.Label>
</Button.Root>
<Grid.Root editing={editing}>
  <Grid.Item
    expanded={isExpanded}
    expandedSize="2x2"
    size={size}
    supportedSizes={cardSizes.numericalDisplay}
    onExpandedChange={setIsExpanded}
    onSizeChange={setSize}
  >
    <HeatingCard />
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
      <Symbol box="square" icon={sfLightbulb} emphasizedIcon={sfLightbulbFill} />
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
// it (and a press anywhere on it), an x closes it (Card's
// OpenButton and CloseButton: its item's open and setOpen).
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
        <Symbol box="square" icon={sfPhoto} />
      </Card.Symbol>
      <Card.Title>Front Door Camera</Card.Title>
      <Card.Value>{isOpen ? 'Live, recording since 8:12' : 'Live'}</Card.Value>
      {/* Opening it while it's closed; its x while it's open. */}
      <><Card.OpenButton aria-label="Front Door Camera" /><Card.CloseButton aria-label="Close" /></>
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
// changes its box, with GSAP (the app's dependency, not the library's): a
// translate and one scale each (its text's size), never their sizes (a
// card's parts are laid out on a grid: tweening a part's width moves the
// others). By the tile's timing: its duration, its easing, its elapsed
// time. Placed in a card, it shows nothing.
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

// The tile's easing (a CSS cubic-bezier) as GSAP's, made once each.
const eases = new Map();
const easeOf = (easing) => {
  const points = /^cubic-bezier\\(([^)]+)\\)$/.exec(easing)?.[1];
  if (!points) return 'power3.out';
  if (!eases.has(easing)) {
    const [x1, y1, x2, y2] = points.split(',').map((each) => each.trim());
    eases.set(
      easing,
      CustomEase.create(\`ease-\${eases.size}\`, \`M0,0 C\${x1},\${y1} \${x2},\${y2} 1,1\`),
    );
  }
  return eases.get(easing);
};

const partsOf = (card) =>
  card.querySelectorAll(
    '[data-card-part]:not([data-card-part="root"], [data-card-part="corner-button"])',
  );

// Where each part is drawn in its card (from its leading top corner), its
// text's size (a move of its running: at its scale), its text.
const placesOf = (card) => {
  const isRtl = getComputedStyle(card).direction === 'rtl';
  const box = card.getBoundingClientRect();
  const places = new Map();
  for (const part of partsOf(card)) {
    if (part.getClientRects().length === 0) continue;
    const at = part.getBoundingClientRect();
    places.set(part.dataset.cardPart, {
      fontSize:
        parseFloat(getComputedStyle(part).fontSize) *
        Number(gsap.getProperty(part, 'scale') || 1),
      text: part.textContent,
      x: isRtl ? box.right - at.right : at.left - box.left,
      y: at.top - box.top,
    });
  }
  return [places, isRtl];
};

const FlipParts = () => {
  const marker = useRef(null);
  const before = useRef();
  const running = useRef();
  const cardOf = () => marker.current?.closest('[data-card-part="root"]');
  useGridItemLayout({
    // Where they're drawn, before the change; a move still running let go
    // (what's measured after is where they're laid out).
    onBeforeChange: () => {
      const card = cardOf();
      if (!card) return;
      [before.current] = placesOf(card);
      running.current?.();
    },
    // Laid out anew, the tile still at its old box: moved from where they
    // were, in step with the tile.
    onAfterChange: ({ duration, easing, elapsed }) => {
      const card = cardOf();
      const from = before.current;
      before.current = undefined;
      if (!card || !from) return;
      const [to, isRtl] = placesOf(card);
      const timeline = gsap.timeline({ paused: true });
      for (const part of partsOf(card)) {
        const old = from.get(part.dataset.cardPart);
        const now = to.get(part.dataset.cardPart);
        if (!old || !now) continue;
        timeline.fromTo(
          part,
          {
            // Its text as large as it was, when it's the same text.
            scale: old.text === now.text ? old.fontSize / now.fontSize : 1,
            transformOrigin: isRtl ? 'right top' : 'left top',
            x: isRtl ? now.x - old.x : old.x - now.x,
            y: old.y - now.y,
          },
          {
            clearProps: 'transform,transformOrigin',
            duration: duration / 1000,
            ease: easeOf(easing),
            scale: 1,
            x: 0,
            y: 0,
          },
          0,
        );
      }
      // Its time set from the tile's each frame; done, killed.
      let frame = 0;
      const stop = () => {
        cancelAnimationFrame(frame);
        timeline.progress(1).kill();
        if (running.current === stop) running.current = undefined;
      };
      const follow = () => {
        const time = elapsed();
        timeline.time(Math.min(time, duration) / 1000);
        if (time >= duration) stop();
        else frame = requestAnimationFrame(follow);
      };
      running.current = stop;
      timeline.time(0);
      frame = requestAnimationFrame(follow);
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

const HeatingCard = () => {
  const [target, setTarget] = useState(22);
  const isExpanded = useGridItem()?.expanded === true;
  return (
    <Card.Root
      onClick={
        isExpanded
          ? undefined
          : forwardClick('[data-card-part=corner-button]:not([data-grid-hidden])')
      }
    >
      <FlipParts />
      {/* In both forms: it moves to its new place, never pops. */}
      <Card.Symbol>
        <Symbol box="square" icon={sfThermometerMedium} />
      </Card.Symbol>
      {isExpanded ? (
        // Only in the larger form: shown as the card's edge passes it.
        <Card.Slider
          format={celsius}
          max={26}
          min={16}
          label="Heat to"
          step={0.5}
          tint="oklch(72% 0.17 50)"
          value={target}
          onValueChange={setTarget}
        />
      ) : (
        <>
          <Card.Title>Heating</Card.Title>
          <Card.Value format={celsius} value={21.5} />
        </>
      )}
      <Card.ExpandButton aria-label="Heating details" />
    </Card.Root>
  );
};

// In room of its own: expanded (its own state here), it grows there,
// nothing around it moving.
<Grid.Item
  defaultSize="1x1"
  expandedSize="2x2"
  supportedSizes={cardSizes.numericalDisplay}
>
  <HeatingCard />
  <Grid.Area defaultSize="3x2" />
</Grid.Item>`;

const rowsCode = `// A room's summary in rows (ControlCards' List, its Card.Rows): as many
// as fit whole, the last counting those left out and opening it above the
// page (its item's openSize), where all of them show (a Card.CloseButton
// in its top trailing corner closes it).
<Grid.Item
  openLabel="Living Room"
  openSize="4x4"
  size="2x2"
  supportedSizes={['2x2']}
>
  <ControlCards.List icon={sfHouseFill} label="Living Room">
    <Card.Rows>
      <Card.Row icon={sfLightbulbFill} value={isLampOn ? 'On' : 'Off'}>
        Floor Lamp
      </Card.Row>
      <Card.Row icon={sfLightbulbFill} value="60%">Dimmer</Card.Row>
      <Card.Row icon={sfWindowShadeClosed} value="50%">Blinds</Card.Row>
      <Card.Row icon={sfThermometerMedium} value="22 °C">Heating to</Card.Row>
      <Card.Row icon={sfHumidityFill} value="46%">Humidity</Card.Row>
    </Card.Rows>
    <Card.CloseButton aria-label="Close" />
  </ControlCards.List>
</Grid.Item>`;

const aloneCode = `// No grid: as large as its box, never in edit mode, its parts laid out
// by that size. A lamp, its switch toggled by a press anywhere on it.
const [isOn, setIsOn] = useState(true);

<div style={{ height: 100, width: 220 }}>
  <Card.Root active={isOn} onClick={forwardClick('[role=switch]')}>
    <Card.Symbol>
      <Symbol box="square" icon={sfLightbulb} emphasizedIcon={sfLightbulbFill} />
    </Card.Symbol>
    <Card.Title>Desk Lamp</Card.Title>
    <Card.Value>{isOn ? 'On' : 'Off'}</Card.Value>
    <Card.Switch aria-label="Desk Lamp" checked={isOn} onCheckedChange={setIsOn} />
  </Card.Root>
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
  const [partControls, partProps, partState, partsKey] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...stageParts,
            ...(hasArea && { 'Grid.Area': ['defaultSize'] as const }),
            // (Every part its cards render, see `partsOfTiles`.)
            ...partsOfTiles(tiles),
          },
          addLog,
        ),
      // (Its tiles: its view's, one array, never written anew.)
      [addLog, hasArea, tiles],
    ),
    { provided: useProvidedState(id) },
  );

  const [presentationControl, presentation, presentationState] =
    usePresentation(id);

  return (
    <Component
      isInline
      controls={[presentationControl, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[partState, presentationState]}
      title="Card"
    >
      {/* (Mounted anew as a control changes: a default is read as it
          mounts.) */}
      <Fragment key={partsKey}>{cardsStage(stage, partProps)}</Fragment>
    </Component>
  );
};

/** Its tiles (see `ExpandView`): one array, never written anew. */
const expandTiles: readonly CardTile[] = [
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
];

const ExpandView: FunctionComponent = () => (
  <StageView
    id="card-composition-expand"
    tiles={expandTiles}
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
            // (Switchable (its lights on or not): its glass by its state.)
            'Card.Root': ['active', 'context', 'onClick'],
            'Card.Symbol': [],
            'Card.Title': [],
            // (Its words: a number's format, locale and number unused.)
            'Card.Value': ['children', 'format', 'locale', 'value'],
            // (Its size the app's; no expansion, no default read, nothing
            // opened above the page.)
            'Grid.Item': [
              'defaultExpanded',
              'defaultOpen',
              'defaultSize',
              'expanded',
              'expandedSize',
              'openSize',
              'size',
              'supportedSizes',
            ],
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

  const [presentationControl, presentation, presentationState] =
    usePresentation(id);

  return (
    <Component
      isInline
      controls={[presentationControl, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[partState, presentationState]}
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

/** Its tiles (see `OverlayView`): one array, never written anew. */
const overlayTiles: readonly CardTile[] = [
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
];

const OverlayView: FunctionComponent = () => (
  <StageView
    id="card-composition-overlay"
    tiles={overlayTiles}
  />
);

/** Its tiles (see `SizeView`): one array, never written anew. */
const sizeTiles: readonly CardTile[] = [
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
];

const SizeView: FunctionComponent = () => (
  <StageView
    id="card-composition-changing-size"
    tiles={sizeTiles}
  />
);

/** Its tiles (see `RowsView`): one array, never written anew. */
const rowsTiles: readonly CardTile[] = [
  {
    kind: 'room',
    name: 'Living Room',
    openSize: '4x4',
    size: '2x2',
    sizes: ['2x2'],
  },
  {
    kind: 'lamp',
    name: 'Floor Lamp',
    size: '2x1',
    sizes: cardSizes.binaryControl,
  },
];

const RowsView: FunctionComponent = () => (
  <StageView
    id="card-composition-rows"
    tiles={rowsTiles}
  />
);

/** Its cards' kinds (see `AloneView`): one array, never written anew. */
const aloneKinds = [{ kind: 'lamp' }, { kind: 'temperature' }] as const;

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
            // (Every part its two cards render, see `partsOfTiles`.)
            ...partsOfTiles(aloneKinds),
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
  ['expanding-in-place', 'Expanding in place'],
  ['drilling-in', 'Drilling in'],
  ['opening-above-the-page', 'Opening above the page'],
  ['rows-in-a-card', 'Rows in a card'],
  ['building-for-changing-sizes', 'Building for changing sizes'],
  ['building-blocks-together', 'Building blocks together'],
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
      <li>
        This page is about what cards do in a grid: expanding, drilling in,
        opening above the page, changing size, and its building blocks together.
        The ready-made cards (a switch, a state, a value, a slider, a button, a
        progress, stages, a light, rows, a choice) are on{' '}
        <a href={publicUrl('control-cards')}>ControlCards</a>’ pages.
      </li>
    </ul>

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
        Expanding is its{' '}
        <PartLink
          component="grid"
          part="Grid.Item"
        />
        ’s: its <code>expandedSize</code>, here 2x2, which must be in its{' '}
        <code>supportedSizes</code>, and whether it’s expanded (
        <code>expanded</code>, kept by the app, or its own). Its own size stays
        as it is. Whether the expansion is stored is the app’s choice. Here it
        isn’t, so the card is small again after a reload; edit mode makes it
        small again too.
      </li>
      <li>
        <PartLink
          component="card"
          part="Card.ExpandButton"
        />
        , a <PartLink part="Card.CornerButton" />, asks for the other state. It
        compares both sizes as its item would be them now (
        <PartLink
          component="grid"
          part="useGridItem"
        />
        ’s <code>sizeOf</code>). When they come out the same, for example with
        too few columns, expanding would change nothing, and it hides.
      </li>
      <li>
        Its icon shows which way the card goes:
        <PartLink
          component="grid"
          part="gridIcons"
        />
        ’s <code>expand</code> when it grows, <code>collapse</code> when it
        shrinks. It’s mirrored, since the triangle points to a corner, and says
        whether the card is expanded with <code>aria-expanded</code>.
      </li>
      <li>
        Small, the card has no control of its own, so a press anywhere on it
        expands it too, passed on to the button with
        <PartLink
          component="list"
          part="forwardClick"
        />
        while the button is shown. Expanded, the slider takes presses, so only
        the button collapses it.
      </li>
      <li>
        Edit starts with the card small again, so edit mode moves and resizes
        the size the user chose. A resize stores the new size and leaves the
        card small.
      </li>
      <li>
        A card already as large as its expanded size has nothing to expand, so
        its button hides, as it does when the grid is too narrow for it.
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
        <strong>Library:</strong> the expand button (its sizes compared, its
        icon), the grid making room for the new size.
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
        It’s <code>active</code> while any light is on, lit as a card whose
        switch is on, and dark while they’re all off.
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
        and what it’s called as a dialog (<code>openLabel</code>).{' '}
        <PartLink
          component="card"
          part="Card.OpenButton"
        />{' '}
        and{' '}
        <PartLink
          component="card"
          part="Card.CloseButton"
        />{' '}
        open and close it with{' '}
        <PartLink
          component="grid"
          part="useGridItem"
        />
        ’s <code>open</code> and <code>setOpen</code>.
      </li>
      <li>
        They’re two <PartLink part="Card.CornerButton" />
        s. Closed, one shows{' '}
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
        . Open, an x (<code>close</code>) in the top trailing corner closes it,
        clear of the card’s symbol, and the card takes no press of its own. Each
        button is shown only in its state (<code>visible</code>), fading as the
        card grows and shrinks.
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
        focus and closing, the open and close buttons.
      </li>
      <li>
        <strong>Demo:</strong> the camera’s card and what it shows open, its
        open size and name.
      </li>
    </ul>
    <CodeView code={overlayCode} />
    <OverlayView />

    <Heading
      id="rows-in-a-card"
      level={2}
    >
      Rows in a card
    </Heading>
    <ul>
      <li>
        A room’s summary shows what its other cards say, in rows:{' '}
        <PartLink
          component="control-cards"
          part="ControlCards.List"
        />
        , a{' '}
        <PartLink
          component="list"
          part="List.Root"
        />{' '}
        in a well at the card’s bottom, under its symbol and title. The rows
        follow the floor lamp’s switch beside it.
      </li>
      <li>
        The list doesn’t scroll in a card, and each row stays on one line. The
        card shows as many rows as fit whole. When some are left out, its last
        row counts them, for example “2 more”.
      </li>
      <li>
        That row opens it above the page, where all of them show, as the
        camera’s card opens with its corner button (see{' '}
        <a href="#opening-above-the-page">Opening above the page</a>): its item
        has an openSize. Open, a{' '}
        <PartLink
          component="card"
          part="Card.CloseButton"
        />{' '}
        in its top trailing corner closes it, clear of its symbol.
      </li>
      <li>
        <strong>Library:</strong> the list card, its rows fitted to its size,
        opening above the page.
      </li>
      <li>
        <strong>Demo:</strong> the rows, following the other cards’ state.
      </li>
    </ul>
    <CodeView code={rowsCode} />
    <RowsView />

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
        <strong>With an animation library.</strong> The demos use GSAP, written
        as a <code>FlipParts</code> placed in the card (see the code below).
        GSAP is the app’s choice and dependency, not the library’s. It moves{' '}
        <PartLink part="Card.Symbol" />, <PartLink part="Card.Title" /> and{' '}
        <PartLink part="Card.Value" /> to their new places by a translate, and
        their text to its new size by one scale (only moved when its text
        changes), in step with the tile. Never their sizes: the card’s parts are
        laid out on a grid, so tweening one part’s width or height (as GSAP’s
        Flip plugin does) moves the others. Parts that are only in one form
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
        card’s layout already follows its size: its value is large from about
        180px. Switch what it shows when its state changes (expanded, or open
        with{' '}
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
        <code>openSize</code> and an <code>openLabel</code>.{' '}
        <PartLink
          component="card"
          part="Card.OpenButton"
        />{' '}
        and{' '}
        <PartLink
          component="card"
          part="Card.CloseButton"
        />{' '}
        put the x that closes it in the top trailing corner and the button that
        opens it in the bottom trailing one, each <code>visible</code> in its
        own state: one fades out at the start of the move and the x fades in
        once, after it’s open. A switch there moves in, clear of it (see{' '}
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

    <MixedSection />

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
  ExpandView,
  DrillView,
  OverlayView,
  RowsView,
  SizeView,
  MixedView,
  AloneView,
];
