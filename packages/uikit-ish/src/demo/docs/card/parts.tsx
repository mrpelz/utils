import { FunctionComponent, useMemo } from 'react';

import { cardSizes } from '../../../components/index.js';
import { CodeView } from '../../tooling/frame/code-view.js';
import { Component } from '../../tooling/frame/component.js';
import { AddLog, useLog } from '../../tooling/frame/log.js';
import {
  PropMap,
  usePartControls,
  usePropControl,
} from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { PropsTable } from '../../tooling/guide/props-table.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { partPropMaps } from '../part-options.js';
import {
  cardCornerButtonRows,
  cardIconsRows,
  cardRootRows,
  cardSizesRows,
  cardSymbolRows,
  cardTitleRows,
  cardUseCardOrientationRows,
  cardValueRows,
} from './docs.js';
import { cardsStage, stageParts, useCardsStage } from './main.js';
import {
  getPropOptionsCornerButton,
  propOptionsRoot,
  propOptionsSymbol,
  propOptionsTitle,
  propOptionsValue,
} from './props.js';

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in a code sample, not interpolations */
const useCardOrientationCode = `import { Card, Slider, useCardOrientation } from '@mrpelz/uikit-ish';
import { useState } from 'react';

// Rendered inside its Grid.Item: the slider across a wide tile, upright
// in a tall one.
const DimmerCard = () => {
  const orientation = useCardOrientation();
  const [value, setValue] = useState(0.6);

  return (
    <Card.Root>
      <Slider.Root
        max={1}
        min={0}
        orientation={orientation}
        value={value}
        onValueChange={(next) => setValue(next as number)}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Indicator />
            <Slider.Thumb aria-label="Dimmer" />
          </Slider.Track>
        </Slider.Control>
        <Slider.Label>Dimmer</Slider.Label>
        <Slider.Value />
      </Slider.Root>
    </Card.Root>
  );
};`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

/** The card's parts, beside the one a view features (see `PartView`). */
const cardParts = {
  'Card.CornerButton': ['aria-label', 'icon'],
  'Card.Root': [],
  'Card.Symbol': [],
  'Card.Title': [],
  'Card.Value': ['children', 'format', 'value'],
} as const;

/**
 * A part's view: the cards in a grid (see `cardsStage`), the part's own
 * props outlined on those they suit (`on`, by their tiles' names; unset,
 * all), every other part's in a group of its own.
 */
const PartView: FunctionComponent<{
  id: string;
  on?: readonly string[];
  options: PropMap | ((addLog: AddLog) => PropMap);
  part: keyof typeof cardParts;
}> = ({ id, on, options, part }) => {
  const [log, addLog] = useLog();
  const stage = useCardsStage(addLog);
  const [external] = useProvidedState(id);
  const [control, props, state] = usePropControl(
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
  const [partControls, partProps, partState] = usePartControls(
    useMemo(() => {
      const { [part]: _featured, ...others } = cardParts;
      return partPropMaps({ ...stageParts, ...others }, addLog);
    }, [addLog, part]),
    { provided: useProvidedState(id) },
  );

  return (
    <Component
      isInline
      controls={[control, partControls]}
      id={id}
      log={log}
      stage="phone"
      state={[state, partState]}
      title={part}
    >
      {cardsStage(stage, partProps, (name) =>
        on === undefined || on.includes(name)
          ? { ...partProps, [part]: props }
          : partProps,
      )}
    </Component>
  );
};

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
    on={['Temperature']}
    options={getPropOptionsCornerButton}
    part="Card.CornerButton"
  />
);

const ValuePart: FunctionComponent = () => (
  <PartView
    id="card-parts-value"
    // (A number: on the temperature alone, not on the cards showing a
    // state in words, nor the humidity's percentage.)
    on={['Temperature']}
    options={propOptionsValue}
    part="Card.Value"
  />
);

/**
 * `useCardOrientation`: two sliders, one across and one upright; resized
 * in edit mode, they turn with their tiles.
 */
const OrientationPart: FunctionComponent = () => {
  const id = 'card-parts-use-card-orientation';
  const [log, addLog] = useLog();
  const stage = useCardsStage(addLog, [
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
  ]);
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () => partPropMaps({ ...stageParts, ...cardParts }, addLog),
      [addLog],
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
      title="useCardOrientation"
    >
      {cardsStage(stage, partProps)}
    </Component>
  );
};

/** `/card/parts`: the root, its content's parts, the kinds' sizes. */
export const CardParts: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>Root: the glass surface, in a grid’s tile or on its own.</li>
      <li>Symbol, Title, Value: what it shows.</li>
      <li>
        A{' '}
        <PartLink
          component="switch"
          part="Switch.Root"
        />{' '}
        or a{' '}
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
        <span>)</span>
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
                <PartLink part="Card.Value" /> (optional)
              </li>
              <li>
                <PartLink part="Card.CornerButton" /> (optional, several)
              </li>
              <li>
                <PartLink
                  component="switch"
                  part="Switch.Root"
                />{' '}
                or{' '}
                <PartLink
                  component="slider"
                  part="Slider.Root"
                />{' '}
                (optional; the slider’s orientation from{' '}
                <PartLink part="useCardOrientation" />)
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
        It lays out its parts by its own size: its symbol and a switch at its
        top, its title and value at its bottom, side by side when it’s wide and
        one row tall.
      </li>
      <li>
        In a grid in edit mode, it’s inert and veiled. The veil lifts while a
        tile is moved or resized, and the tile’s corner symbols fade with it.
      </li>
      <li>
        With a{' '}
        <PartLink
          component="switch"
          part="Switch.Root"
        />{' '}
        in it, it’s bright while the switch is on. Its <code>onClick</code>{' '}
        passes presses on to the switch with{' '}
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
        Without a switch, <code>active</code> makes it bright the same way, for
        example for a group of lights with at least one of them on.
      </li>
      <li>
        When its tile changes size outside edit mode, for example as it expands,
        it resizes itself in step with the grid: its glass grows or shrinks from
        the old size to the new, above its neighbors for that moment. Its parts
        are laid out at the new size at once and glide there from where they
        were. Opened above the page, they glide the same way.
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
        . A wide card has it beside its title.
      </li>
      <li>While a switch in the card is on, it takes the switch’s tint.</li>
      <li>
        Renders a <code>span</code>.
      </li>
    </ul>
    <SymbolPart />
    <h3>Props</h3>
    <PropsTable rows={cardSymbolRows} />

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
        It’s a{' '}
        <PartLink
          component="grid"
          part="Grid.CornerButton"
        />
        : a 44px target, its icon one of <PartLink part="cardIcons" /> or the
        app’s own, in the card’s text color.
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

    <Heading
      id="cardicons"
      level={2}
    >
      <code>cardIcons</code>
    </Heading>
    <ul>
      <li>
        The icons for a card’s corner buttons, as <code>SymbolIcon</code>s.
        Filled shapes, apart from the ring, so they read apart from the grid’s
        edit-mode lines (
        <PartLink
          component="grid"
          part="gridIcons"
        />
        ).
      </li>
    </ul>
    <PropsTable rows={cardIconsRows} />

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
        Pass it to a slider’s <code>orientation</code>, in the component that
        renders the card (inside its{' '}
        <PartLink
          component="grid"
          part="Grid.Item"
        />
        ). Resized from wide to tall, the slider turns.
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
  TitlePart,
  ValuePart,
  CornerButtonPart,
  OrientationPart,
];
