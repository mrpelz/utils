import { Fragment, FunctionComponent, useMemo } from 'react';

import { cardSizes } from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import { usePresentation } from '../../tooling/frame/presentation.js';
import {
  PropMap,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { cardBlockDemos, CardBlockSections } from './blocks.js';
import { type CardTile, cardTiles, partsOfTiles } from './content.js';
import {
  cardCornerButtonRows,
  cardRootRows,
  cardSizesRows,
  cardSwitchRows,
  cardSymbolRows,
  cardTitleRows,
  cardUseCardOrientationRows,
  cardValueRows,
} from './docs.js';
import { cardsStage, stageParts, useCardsStage } from './main.js';
import {
  getPropOptionsCornerButton,
  getPropOptionsSwitch,
  propOptionsRoot,
  propOptionsSymbol,
  propOptionsTitle,
  propOptionsValue,
} from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in a code sample, not interpolations */
const useCardOrientationCode = `import { Card, useCardOrientation } from '@mrpelz/uikit-ish';

// Card.Slider (and so the slider cards) reads it itself: its
// slider across a wide tile, upright in a tall one. For content of your
// own, read it in the component rendering the card (inside its Grid.Item):
// a battery's level, a bar along its tile.
const BatteryCard = ({ level }) => {
  const orientation = useCardOrientation();
  return (
    <Card.Root>
      <Card.Title>Battery</Card.Title>
      <div
        className="battery-bar"
        data-orientation={orientation}
        style={{ '--level': level }}
      />
    </Card.Root>
  );
};`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/**
 * The cards' parts, beside the one a view features (see `PartView`):
 * every part the stage's cards render (see `partsOfTiles`).
 */
const cardParts = partsOfTiles(cardTiles);

/**
 * A part's view: the cards in a grid (see `cardsStage`), the part's own
 * props outlined on those they suit (`on`, by their tiles' names; unset,
 * all), every other part's in a group of its own.
 */
const PartView: FunctionComponent<{
  id: string;
  on?: readonly string[];
  options: PropMap | ((addLog: AddLog) => PropMap);
  part: string;
}> = ({ id, on, options, part }) => {
  const [log, addLog] = useLog();
  const stage = useCardsStage(addLog);
  const [external] = useProvidedState(id);
  const [control, props, state, elementKey] = usePropControl(
    useMemo(
      () => (typeof options === 'function' ? options(addLog) : options),
      [addLog, options],
    ),
    {
      emphasize: 'outline',
      external,
      isOpen: true,
      title: part,
    },
  );
  const [partControls, partProps, partState, partsKey] = usePartControls(
    useMemo(() => {
      const { [part]: featured = [], ...others } = cardParts;
      // (On some cards only: its other instances' group, if the others
      // render it at all.)
      const elsewhere =
        on &&
        partsOfTiles(cardTiles.filter(({ name }) => !on.includes(name)))[part];
      return partPropMaps(
        {
          ...stageParts,
          ...others,
          ...(elsewhere && { [`${part} (others)`]: featured }),
        },
        addLog,
      );
    }, [addLog, on, part]),
    { provided: useProvidedState(id) },
  );

  const [presentationControl, presentation, presentationState] =
    usePresentation(id);
  // (Only those set: the cards spread a part's props after their own, so
  // an unset one (`undefined`) mustn't override theirs, e.g. a switch's
  // `checked`, as the other parts' groups don't.)
  const setProps = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(props).filter(([, value]) => value !== undefined),
      ),
    [props],
  );

  return (
    <Component
      isInline
      controls={[presentationControl, control, partControls]}
      id={id}
      log={log}
      stage={presentation}
      state={[state, partState, presentationState]}
      title={part}
    >
      {/* (Mounted anew as a control changes: a default is read as it
          mounts.) */}
      <Fragment key={`${elementKey}-${partsKey}`}>
        {cardsStage(stage, partProps, (name) => ({
          ...partProps,
          [part]:
            on === undefined || on.includes(name)
              ? setProps
              : (partProps[`${part} (others)`] ?? {}),
        }))}
      </Fragment>
    </Component>
  );
};

/** The temperature's card alone (see `PartView`'s `on`): one array. */
const temperatureOnly = ['Temperature'] as const;

const RootPart: FunctionComponent = () => (
  <PartView
    id="card-parts-root"
    options={propOptionsRoot}
    part="Card.Root"
  />
);

const SymbolPart: FunctionComponent = () => (
  <PartView
    id="card-parts-symbol"
    options={propOptionsSymbol}
    part="Card.Symbol"
  />
);

/** The lamp's card alone: the only one with a switch of its own here. */
const lampOnly = ['Floor Lamp'] as const;

const SwitchPart: FunctionComponent = () => (
  <PartView
    id="card-parts-switch"
    on={lampOnly}
    options={getPropOptionsSwitch}
    part="Card.Switch"
  />
);

const TitlePart: FunctionComponent = () => (
  <PartView
    id="card-parts-title"
    options={propOptionsTitle}
    part="Card.Title"
  />
);

const CornerButtonPart: FunctionComponent = () => (
  <PartView
    id="card-parts-corner-button"
    // (The temperature's: the only card with one here.)
    on={temperatureOnly}
    options={getPropOptionsCornerButton}
    part="Card.CornerButton"
  />
);

const ValuePart: FunctionComponent = () => (
  <PartView
    id="card-parts-value"
    // (A number: on the temperature alone, not on the cards showing a
    // state in words, nor the humidity's percentage.)
    on={temperatureOnly}
    options={propOptionsValue}
    part="Card.Value"
  />
);

/** Two sliders' tiles (see `OrientationPart`): across, and upright. */
const orientationTiles: readonly CardTile[] = [
  {
    kind: 'dimmer',
    name: 'Dimmer',
    size: '3x1',
    sizes: cardSizes.numericalControl,
  },
  {
    kind: 'blinds',
    name: 'Blinds',
    size: '1x3',
    sizes: cardSizes.numericalControl,
  },
];

/**
 * `useCardOrientation`: two sliders, one across and one upright; resized
 * in edit mode, they turn with their tiles.
 */
const OrientationPart: FunctionComponent = () => {
  const id = 'card-parts-use-card-orientation';
  const [log, addLog] = useLog();
  const stage = useCardsStage(addLog, orientationTiles);
  const [partControls, partProps, partState, partsKey] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          { ...stageParts, ...partsOfTiles(orientationTiles) },
          addLog,
        ),
      [addLog],
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
      title="useCardOrientation"
    >
      <Fragment key={partsKey}>{cardsStage(stage, partProps)}</Fragment>
    </Component>
  );
};

/** `/card/parts`: the root, its content's parts, the kinds' sizes. */
export const CardParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: the glass surface, in a grid’s tile or on its own.</li>
      <li>Symbol, Title, Subtitle, Value, Trend: what it shows.</li>
      <li>
        Slider, Progress, StageList, Channels, Segmented, Rows: what fills its
        bottom, each composed of its own parts.
      </li>
      <li>
        CornerButton, ExpandButton, OpenButton, CloseButton: what’s more to it,
        by its tile’s state.
      </li>
      <li>
        Switch: its switch, in the card’s tint. Or a{' '}
        <PartLink
          component="slider"
          part="Slider.Root"
        />{' '}
        in it: what it controls, styled by the card.
      </li>
    </ul>
    <ul className="demo-tree">
      <li className="demo-tree-context">
        <PartLink
          component="grid"
          part="Grid.Item"
        />{' '}
        <span>
          (optional: its tile, with its <code>supportedSizes</code> from
        </span>{' '}
        <PartLink part="cardSizes" />
        <span>; its expandedSize and openSize for the corner buttons)</span>
        <ul>
          <li>
            <PartLink part="Card.Root" />
            <ul>
              <li>
                <PartLink part="Card.Symbol" /> (optional)
              </li>
              <li>
                <PartLink part="Card.Title" />
              </li>
              <li>
                <PartLink part="Card.Subtitle" /> (optional)
              </li>
              <li>
                <PartLink part="Card.Value" /> (optional)
                <ul>
                  <li>
                    <PartLink part="Card.Trend" /> (optional)
                  </li>
                </ul>
              </li>
              <li>
                <PartLink part="Card.Switch" /> (optional)
              </li>
              <li>
                one of:
                <ul>
                  <li>
                    <PartLink part="Card.Slider" />, or a plain{' '}
                    <PartLink
                      component="slider"
                      part="Slider.Root"
                    />{' '}
                    (its orientation from <PartLink part="useCardOrientation" />
                    )
                  </li>
                  <li>
                    <PartLink part="Card.Progress" />
                    <ul>
                      <li>
                        <PartLink part="Card.ProgressValue" /> (optional)
                      </li>
                      <li>
                        <PartLink part="Card.ProgressBar" />
                        <ul>
                          <li>
                            <PartLink part="Card.ProgressLabel" />,{' '}
                            <PartLink part="Card.ProgressDetail" /> (optional)
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <PartLink part="Card.StageList" />
                    <ul>
                      <li>
                        <PartLink part="Card.Stage" /> (several)
                      </li>
                    </ul>
                  </li>
                  <li>
                    <PartLink part="Card.Channels" />
                    <ul>
                      <li>
                        <PartLink part="Card.Channel" /> (several)
                      </li>
                    </ul>
                  </li>
                  <li>
                    <PartLink part="Card.Segmented" />
                    <ul>
                      <li>
                        <PartLink part="Card.SegmentedItem" /> (several)
                      </li>
                    </ul>
                  </li>
                  <li>
                    <PartLink part="Card.Rows" />, or a plain{' '}
                    <PartLink
                      component="list"
                      part="List.Root"
                    />
                    <ul>
                      <li>
                        <PartLink part="Card.Row" /> (several)
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <PartLink part="Card.CornerButton" />,{' '}
                <PartLink part="Card.ExpandButton" />,{' '}
                <PartLink part="Card.OpenButton" />,{' '}
                <PartLink part="Card.CloseButton" /> (optional, several)
              </li>
            </ul>
          </li>
          <li>
            <PartLink
              component="grid"
              part="Grid.ResizeHandle"
            />
          </li>
        </ul>
      </li>
    </ul>

    <Heading
      id="card-root"
      level={2}
    >
      <code>Card.Root</code>
    </Heading>
    <ul>
      <li>
        The glass surface, the Sidebar’s and Islands’ material, with its item’s
        corner radius. It fills its tile.
      </li>
      <li>
        At every size, its symbol is in the top leading corner and a switch in
        the top trailing one. Its title sits right above its value in the bottom
        leading corner, the value in the secondary text color.
      </li>
      <li>
        In a grid in edit mode, it’s inert and veiled. The veil lifts while a
        tile is moved or resized, and the tile’s corner symbols fade with it.
      </li>
      <li>
        With a <PartLink part="Card.Switch" /> in it, it’s lit while the switch
        is on and dark while it’s off, in both color schemes. Its{' '}
        <code>onClick</code> passes presses on to the switch with{' '}
        <PartLink
          component="list"
          part="forwardClick"
        />
        .
      </li>
      <li>
        With a{' '}
        <PartLink
          component="slider"
          part="Slider.Root"
        />{' '}
        in it, it’s the slider’s track, and the fill is its background.
      </li>
      <li>
        A slider filling it with{' '}
        <PartLink
          component="card"
          part="Card.Slider"
        />{' '}
        has an opaque fill, and everything over it is drawn twice: on the card,
        and inside the fill in the text color for the fill’s tone. The card’s{' '}
        <PartLink part="Card.Symbol" /> and{' '}
        <PartLink part="Card.CornerButton" />s take part: the slider registers
        its fill with the card, and they draw their copies there.
      </li>
      <li>
        Without a switch, <code>active</code> makes it bright the same way, for
        example for a group of lights with at least one of them on.
      </li>
      <li>
        <code>momentary</code> makes it a button without a state of its own: a
        press lights it up the same way for a moment, and it fades back. Its{' '}
        <code>actionsRef</code>’s <code>flash()</code> does that from anywhere,
        for example as the app’s server says something happened (see{' '}
        <PartLink
          component="control-cards"
          part="ControlCards.Button"
        />
        , a momentary card ready-made).
      </li>
      <li>
        A{' '}
        <PartLink
          component="list"
          part="List.Root"
        />{' '}
        (inset grouped, its default style) shows rows in it. Its group sits in a
        well at the card’s bottom, 6px from its edges, its corners following the
        card’s. The card’s title and value sit beside its symbol at the top, the
        value small. Each row stays on one line, in the card’s text size and
        colors, its symbol under the card’s and its title where the card’s
        starts. Open above the page, the rows take the list’s own size. It
        doesn’t scroll: what doesn’t fit is cut off, so show as many rows as fit
        (see{' '}
        <a href={publicUrl('card/composition#rows-in-a-card')}>
          Rows in a card
        </a>
        ).
      </li>
      <li>
        When its tile changes size, for example as it expands or opens above the
        page, its glass grows or shrinks with the tile, its parts laid out at
        the new size from the start (see{' '}
        <a href={publicUrl('card/composition#building-for-changing-sizes')}>
          Building for changing sizes
        </a>
        ).
      </li>
      <li>
        Renders a <code>div</code>.
      </li>
    </ul>
    <RootPart />
    <h3>Props</h3>
    <PropsTable rows={cardRootRows} />

    <Heading
      id="card-symbol"
      level={2}
    >
      <code>Card.Symbol</code>
    </Heading>
    <ul>
      <li>
        A symbol at the card’s top leading corner, for example a{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />
        . With a corner button in that corner, it moves beside its title.
      </li>
      <li>
        While the card is on (lit: a switch in it on, or its active), it takes
        its tint (the switch’s on color by default) and its{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        shows its emphasizedIcon, for example the filled variant. Off, or not
        switchable, it shows its icon: give a switchable card’s symbol the
        outlined one. With its own active, it shows as on while the card isn’t
        lit, for example a dimmer’s symbol above its minimum, its{' '}
        <PartLink
          component="slider"
          part="Slider.Root"
        />
        ’s fill telling how much. Over a slider’s fill, it’s in the card’s text
        color instead of its tint, its icon still telling on from off.
      </li>
      <li>
        Give its{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        a square box (<code>box=&quot;square&quot;</code>), as the ready-made
        cards do. Icons of different shapes then line up from card to card.
      </li>
      <li>
        Renders a <code>span</code>.
      </li>
    </ul>
    <SymbolPart />
    <h3>Props</h3>
    <PropsTable rows={cardSymbolRows} />

    <Heading
      id="card-switch"
      level={2}
    >
      <code>Card.Switch</code>
    </Heading>
    <ul>
      <li>
        The card’s switch, in its top trailing corner: a{' '}
        <PartLink
          component="switch"
          part="Switch.Root"
        />{' '}
        with its thumb, smaller than a switch on its own.
      </li>
      <li>
        On, it’s drawn in the card’s <code>tint</code>, the same color as its{' '}
        <PartLink part="Card.Symbol" />. Without one, it’s the switch’s green.
      </li>
      <li>
        Over a slider’s fill, it’s set apart from the fill: on, it’s a darker
        shade of the tint. The fill has the same tint, so pass the slider’s tint
        here too. Off, there’s no fill under it, so it has the switch’s own off
        color.
      </li>
      <li>
        A card that’s never lit (<code>active</code> given as <code>false</code>
        , such as a dimmer’s) draws its switch that way at every size. So it
        looks the same when the card expands and its fill becomes something
        else, such as a light’s channels.
      </li>
      <li>
        It’s one of the card’s parts. As the tile changes size, it moves with
        the card’s other parts (see{' '}
        <PartLink
          component="grid"
          part="useGridItemLayout"
        />
        ).
      </li>
      <li>
        A plain{' '}
        <PartLink
          component="switch"
          part="Switch.Root"
        />{' '}
        in a card still works and lights the card, but keeps the switch’s own
        colors.
      </li>
      <li>
        Renders a <code>span</code>, as a switch does.
      </li>
    </ul>
    <SwitchPart />
    <h3>Props</h3>
    <PropsTable rows={cardSwitchRows} />

    <Heading
      id="card-title"
      level={2}
    >
      <code>Card.Title</code>
    </Heading>
    <ul>
      <li>
        What the card is about, emphasized, two lines at most. Long words break
        with a hyphen.
      </li>
      <li>
        Renders a <code>span</code>.
      </li>
    </ul>
    <TitlePart />
    <h3>Props</h3>
    <PropsTable rows={cardTitleRows} />

    <Heading
      id="card-value"
      level={2}
    >
      <code>Card.Value</code>
    </Heading>
    <ul>
      <li>
        A number, formatted by <code>Intl.NumberFormat</code> with the app’s{' '}
        <code>format</code> and <code>locale</code>: its unit, its decimal
        places. Or a state, as its children.
      </li>
      <li>
        Below the title, in the secondary color. Large on a large card, for
        example a 2x2 one.
      </li>
      <li>
        Renders a <code>span</code>.
      </li>
    </ul>
    <ValuePart />
    <h3>Props</h3>
    <PropsTable rows={cardValueRows} />

    <Heading
      id="card-cornerbutton"
      level={2}
    >
      <code>Card.CornerButton</code>
    </Heading>
    <ul>
      <li>
        A button in a corner of the card, for what’s more to it: going to a page
        of its own, expanding the card in place, opening it above the page. What
        it does is up to its <code>onClick</code>.
      </li>
      <li>
        As its tile changes size, it stays in its corner: it moves with the
        card’s edge, whatever moves the rest of the card’s parts.
      </li>
      <li>
        It’s a{' '}
        <PartLink
          component="grid"
          part="Grid.CornerButton"
        />
        : a 44px target, its icon one of{' '}
        <PartLink
          component="grid"
          part="gridIcons"
        />{' '}
        or the app’s own.
      </li>
      <li>
        Its icon is in the card’s text color. Over a slider filling the card,
        it’s drawn twice, split at the fill’s edge like the slider’s label; the
        button itself stays on top to take presses.
      </li>
      <li>
        It’s shown outside edit mode only. In edit mode, it fades out and the
        grid’s own controls take the corners.
      </li>
      <li>
        The card’s parts keep clear of its icon: a switch or its value move in a
        little, and with one in the top leading corner, its symbol moves beside
        its title.
      </li>
      <li>
        A press on it is its own. It sits above everything in the card, so a
        slider filling the card doesn’t take it, and on a card with a switch it
        doesn’t toggle the switch.
      </li>
      <li>
        Renders a <code>button</code>. Give it a name that says what it does,
        for example “Living Room details”.
      </li>
    </ul>
    <CornerButtonPart />
    <h3>Props</h3>
    <PropsTable rows={cardCornerButtonRows} />

    <CardBlockSections />

    <Heading
      id="cardsizes"
      level={2}
    >
      <code>cardSizes</code>
    </Heading>
    <ul>
      <li>
        The sizes each kind of card supports, for its item’s{' '}
        <code>supportedSizes</code>.
      </li>
    </ul>
    <PropsTable rows={cardSizesRows} />

    <Heading
      id="usecardorientation"
      level={2}
    >
      <code>useCardOrientation</code>
    </Heading>
    <ul>
      <li>
        Its tile’s shape, from its item: horizontal when it’s at least as wide
        as it’s tall, else vertical.
      </li>
      <li>
        <PartLink
          component="card"
          part="Card.Slider"
        />{' '}
        reads it itself, so a slider card turns as it’s resized from wide to
        tall, as these two do in edit mode.
      </li>
      <li>
        For content of your own, read it in the component that renders the card
        (inside its{' '}
        <PartLink
          component="grid"
          part="Grid.Item"
        />
        ) and lay the content out by it.
      </li>
    </ul>
    <CodeView code={useCardOrientationCode} />
    <OrientationPart />
    <h3>Returns</h3>
    <PropsTable rows={cardUseCardOrientationRows} />
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const cardPartsDemos = [
  RootPart,
  SymbolPart,
  SwitchPart,
  TitlePart,
  ValuePart,
  CornerButtonPart,
  ...cardBlockDemos,
  OrientationPart,
];
