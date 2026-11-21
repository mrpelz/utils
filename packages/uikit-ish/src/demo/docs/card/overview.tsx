import { FunctionComponent, useMemo } from 'react';

import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePresentation } from '../../tooling/frame/presentation.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { KeyPropsTable, pickRows } from '../../tooling/guide/props-table.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import { cardRootRows, cardValueRows } from './docs.js';
import { cardsStage, stageParts, useCardsStage } from './main.js';

/** A phone: one card of each kind in a grid, edited with Edit. */
const LiveView: FunctionComponent = () => {
  const id = 'card-overview';
  const [log, addLog] = useLog();
  const stage = useCardsStage(addLog);
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () =>
        partPropMaps(
          {
            ...stageParts,
            'Card.Root': [],
            'Card.Value': ['children', 'format', 'value'],
            'Card.CornerButton': ['aria-label', 'icon'],
          },
          addLog,
        ),
      [addLog],
    ),
    { provided: useProvidedState(id) },
  );

  const [presentationControl, presentation, presentationState] =
    usePresentation(id, true);

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
      {cardsStage(stage, partProps)}
    </Component>
  );
};

/** The page's sections (its headings' ids), listed at its top. */
const sections: readonly Section[] = [
  ['when-to-use-it', 'When to use it'],
  ['when-to-use-something-else', 'When to use something else'],
  ['kinds', 'Kinds'],
  ['key-props', 'Key props'],
  ['accessibility', 'Accessibility'],
  ['behavior', 'Behavior'],
];

/** `/card`: what a card is for, its kinds, and its props. */
export const CardOverview: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A glass surface for something an app shows or controls, in a{' '}
        <a href={publicUrl('grid')}>Grid</a>’s tile.
      </li>
      <li>
        It shows more the larger its tile is, and steps aside while the grid is
        being edited.
      </li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use-it"
      level={2}
    >
      When to use it
    </Heading>
    <ul>
      <li>
        For a home screen or a control center: devices, their states and their
        settings, each a tile people can move and resize.
      </li>
      <li>
        For a state or a number to see at a glance, or one setting to change
        right there: a switch or a level.
      </li>
    </ul>

    <Heading
      id="when-to-use-something-else"
      level={2}
    >
      When to use something else
    </Heading>
    <ul>
      <li>
        Settings in a list, read from top to bottom: a{' '}
        <a href={publicUrl('list')}>List</a> with a{' '}
        <a href={publicUrl('switch')}>Switch</a> or a{' '}
        <a href={publicUrl('slider')}>Slider</a> in its rows.
      </li>
      <li>
        Many settings of one thing: a page of their own, reached from the card.
      </li>
    </ul>

    <Heading
      id="kinds"
      level={2}
    >
      Kinds
    </Heading>
    <ul>
      <li>
        A binary display shows a state, by its symbol and its words: a door
        locked or unlocked. It’s bright in one of them (<code>active</code>),
        for example while the door is locked. With nothing to press, it shows no
        press feedback.
      </li>
      <li>
        A binary control is a{' '}
        <PartLink
          component="switch"
          part="Switch.Root"
        />{' '}
        in the card: on, the whole card is bright (<code>active</code>). A press
        anywhere on it toggles the switch, and the card shows that it’s hovered
        and pressed.
      </li>
      <li>
        A numerical display shows a number formatted as the app says: its unit,
        its decimal places. At 2x2, it’s large.
      </li>
      <li>
        A numerical control is a{' '}
        <PartLink
          component="slider"
          part="Slider.Root"
        />{' '}
        in the card: the card is its track, the fill its background. It runs
        across a wide tile and upright in a tall one, and it’s never square.
        Stepped, it shows ticks.
      </li>
      <li>
        The sizes each kind supports are in <PartLink part="cardSizes" />, for
        its item’s <code>supportedSizes</code>.
      </li>
    </ul>

    <Heading
      id="key-props"
      level={2}
    >
      Key props
    </Heading>
    <ul>
      <li>The props most cards set.</li>
      <li>
        All props of all parts are on the{' '}
        <a href={publicUrl('card/parts')}>Parts</a> page.
      </li>
    </ul>
    <KeyPropsTable
      parts={[
        ['Card.Root', pickRows(cardRootRows, 'children', 'active', 'onClick')],
        ['Card.Value', pickRows(cardValueRows, 'value', 'format', 'locale')],
      ]}
    />

    <Heading
      id="accessibility"
      level={2}
    >
      Accessibility
    </Heading>
    <ul>
      <li>
        A card is a plain element. What’s in it carries its meaning: the
        switch’s and the slider’s roles, their names (give them one), and the
        slider’s value as text, formatted as it’s shown.
      </li>
      <li>
        Tab focuses the switch or the slider. A slider’s card shows the focus
        ring, since its knob isn’t drawn.
      </li>
      <li>
        In edit mode, a card is inert: it can’t be focused or pressed, and the
        grid’s controls are what’s reached.
      </li>
    </ul>

    <Heading
      id="behavior"
      level={2}
    >
      Behavior
    </Heading>
    <ul>
      <li>
        It fills its tile, and lays out its parts by its size: a symbol and a
        switch at its top, its title and value at its bottom. Wide and one row
        tall, they sit side by side.
      </li>
      <li>
        In edit mode, a veil covers it, so the grid’s corner symbols read on it,
        and presses go to the grid: held, the tile is dragged.
      </li>
      <li>
        While any tile is moved or resized, every card’s veil lifts and the
        corner symbols fade with it, so the cards show their content as the grid
        changes. A resized tile still shows its new size as an outline.
      </li>
      <li>
        A <PartLink part="Card.CornerButton" /> in a corner offers what’s more
        to the card: going to a page of its own (see{' '}
        <a href={publicUrl('card/composition#drilling-in')}>Drilling in</a>), or
        expanding it in place (see{' '}
        <a href={publicUrl('card/composition#expanding-in-place')}>
          Expanding in place
        </a>
        ), or opening it above the page (see{' '}
        <a href={publicUrl('card/composition#opening-above-the-page')}>
          Opening above the page
        </a>
        ). It’s hidden in edit mode, where the grid’s controls take the corners.
      </li>
      <li>
        As its tile changes size, its glass grows or shrinks with it and its
        parts are laid out at the new size at once; moving them from where they
        were is up to the app (see{' '}
        <a href={publicUrl('card/composition#building-for-changing-sizes')}>
          Building for changing sizes
        </a>
        ).
      </li>
      <li>
        On its own, outside a grid, it’s never in edit mode and is as large as
        its box.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const cardOverviewDemos = [LiveView];
