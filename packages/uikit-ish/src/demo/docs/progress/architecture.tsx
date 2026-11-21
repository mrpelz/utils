import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/progress/architecture`: how Progress and ActivityIndicator are built,
// and what flows into them.

const syncCode = `// useSynchronized, in short: CSS animations put on the page's clock, so
// every spinner (and sliding bar) shows alike, whenever each started.
for (const animation of element.getAnimations({ subtree: true })) {
  if (!(animation instanceof CSSAnimation)) continue;
  if (animation.playState === 'paused') animation.play(); // WebKit, see below
  animation.startTime = 0;
}`;

const stopCode = `// useStopped, finishing: the turn's animation (the spinner's, rotating;
// else the top spoke's) ends after its current iteration, at the top.
const [turn] = element.getAnimations();
const iteration = turn.effect.getComputedTiming().currentIteration;
turn.effect.updateTiming({ iterations: iteration + 1 });
turn.finished.then(() => setIsFinished(true));`;

const sections: readonly Section[] = [
  ['the-bar', 'The bar'],
  ['the-activity-indicator', 'The activity indicator'],
  ['stopping', 'Stopping'],
  ['in-sync', 'In sync'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/progress/architecture`: how it's built, and what flows into it. */
export const ProgressArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Progress holds two components, both on Base UI’s progress: a bar for a
        known amount, and an activity indicator, spinning spokes for an unknown
        one. Most of the indicator’s code is about stopping well and staying in
        step with others. For using them, see their{' '}
        <a href={publicUrl('progress/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="the-bar"
      level={2}
    >
      The bar
    </Heading>
    <ul>
      <li>
        <PartLink part="Progress.Root" />, <PartLink part="Progress.Track" />,{' '}
        <PartLink part="Progress.Indicator" />,{' '}
        <PartLink part="Progress.Label" /> and{' '}
        <PartLink part="Progress.Value" /> are Base UI’s: the value, its
        formatting, the progress bar role and labelling. The root adds a{' '}
        <code>tint</code> (<code>--uikit-progress-tint</code>).
      </li>
      <li>
        The label and value are placed by <code>placement</code>, an attribute
        for the stylesheet. As a tooltip, the value gets the tooltip’s surface
        style and sits on the fill’s end. Momentary, it shows while the bar is
        hovered or focused, so the value registers with the root through a
        context, and the root becomes focusable.
      </li>
      <li>
        Indeterminate (a <code>null</code> value), its fill slides along the
        track, in step with other sliding bars.
      </li>
    </ul>

    <Heading
      id="the-activity-indicator"
      level={2}
    >
      The activity indicator
    </Heading>
    <ul>
      <li>
        <PartLink part="ActivityIndicator" /> is an indeterminate Base UI
        progress root, so it’s announced as busy, with eight spokes in a span
        hidden from assistive technology. Each spoke is turned 45° from the
        last, and carries its phase, a share of a turn behind the brightest, as
        a custom property.
      </li>
      <li>
        Its <code>movement</code> decides what the CSS animations do: the whole
        spinner turns a spoke at a time or smoothly, or the spokes stay put and
        fade in turn, each by its phase.
      </li>
      <li>
        At rest, each spoke’s opacity is computed for its <code>progress</code>{' '}
        (turns along), so a stopped spinner shows exactly where it would have
        been. A spinning one starts from where its progress was when it started.
      </li>
    </ul>

    <Heading
      id="stopping"
      level={2}
    >
      Stopping
    </Heading>
    <ul>
      <li>
        <code>display</code> says how it stops: at rest at once, frozen where it
        is, or finishing its turn first, then optionally hidden.{' '}
        <code>useStopped</code> turns that into a state: spinning, frozen, or at
        rest.
      </li>
      <li>
        Finishing ends the turn’s animation after its current iteration, so it
        stops at the top, and waits for it to finish. Hiding afterwards, it
        keeps turning while it fades out.
      </li>
      <li>
        Frozen, its animations are paused in script, not by{' '}
        <code>animation-play-state</code>: CSS’s pause is ignored once a script
        has set an animation’s start time, as syncing does, and WebKit can
        settle a pause on an older time, so the time is put back once the pause
        has settled.
      </li>
    </ul>
    <CodeView code={stopCode} />

    <Heading
      id="in-sync"
      level={2}
    >
      In sync
    </Heading>
    <ul>
      <li>
        With <code>synchronized</code> (the default), every spinning indicator
        and sliding bar sets its CSS animations’ start time to the page’s
        origin, so all of them show the same step at the same moment, whenever
        each appeared. Again whenever its display or movement changes.
      </li>
      <li>
        Not for an indicator with its own progress or duration, or while frozen:
        setting a start time would play a paused animation again.
      </li>
    </ul>
    <CodeView code={syncCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Base UI:</strong> the value, its formatting, roles and
        labelling.
      </li>
      <li>
        <strong>From Tooltip and Glass:</strong> the value capsule’s surface.
      </li>
      <li>
        <strong>From the system:</strong> reduced motion, by the stylesheet’s
        media query.
      </li>
      <li>
        <strong>Out:</strong>{' '}
        <PartLink
          component="control-cards"
          part="ControlCards.Progress"
        />{' '}
        holds a bar.
      </li>
    </ul>
  </>
);
