import { FunctionComponent, useMemo } from 'react';

import { Component } from '../../tooling/frame/component.js';
import { useLog } from '../../tooling/frame/log.js';
import { usePresentation } from '../../tooling/frame/presentation.js';
import { usePartControls } from '../../tooling/frame/prop-control.js';
import { useProvidedState } from '../../tooling/frame/state.js';
import { Heading, PartLink } from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';
import { partPropMaps } from '../part-options.js';
import {
  controlCardsStage,
  everyCardOf,
  everyCardParts,
  stageParts,
  useStageOpen,
} from './main.js';

/** One of each card, in a grid on a phone. */
const LiveView: FunctionComponent = () => {
  const id = 'control-cards-overview';
  const [log, addLog] = useLog();
  const open = useStageOpen();
  const [partControls, partProps, partState] = usePartControls(
    useMemo(
      () => partPropMaps({ ...stageParts, ...everyCardParts }, addLog),
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
      title="ControlCards"
    >
      {controlCardsStage(everyCardOf(partProps), partProps, open)}
    </Component>
  );
};

/** `/control-cards`: what the ready-made cards are, and when to use them. */
export const ControlCardsOverview: FunctionComponent = () => (
  <>
    <ul className="demo-lead">
      <li>
        Ready-made cards for what a home’s devices show and control: a state, a
        switch, a value, a level, a button, a progress, a light of several
        channels, a summary in rows.
      </li>
      <li>
        Each is a <a href={publicUrl('card')}>Card</a> with its parts, set up
        for its kind. Put it in a{' '}
        <PartLink
          component="grid"
          part="Grid.Item"
        />{' '}
        with the sizes its kind supports (
        <PartLink
          component="card"
          part="cardSizes"
        />
        ).
      </li>
      <li>
        The parts they’re built of are there for cards of your own: a slider
        filling a card, a light’s bars, a trend arrow, and corner buttons that
        expand a card or open it above the page.
      </li>
    </ul>
    <LiveView />

    <Heading
      id="when-to-use"
      level={2}
    >
      When to use them
    </Heading>
    <ul>
      <li>
        For a device’s usual card: they keep a home’s cards consistent, in their
        layout, their colors and how they’re pressed.
      </li>
      <li>
        For anything else, build your own from{' '}
        <PartLink
          component="card"
          part="Card.Root"
        />{' '}
        and its parts, and take the pieces you need from here, for example{' '}
        <PartLink part="ControlCards.SliderFill" />.
      </li>
      <li>
        A slider card reads with any tint: what’s over its fill is drawn again
        inside it, in the fill’s colors. See{' '}
        <PartLink part="ControlCards.Slider" />.
      </li>
    </ul>
  </>
);

/** Its live views, also on the component's page of demos (and `/all`). */
export const controlCardsOverviewDemos = [LiveView];
