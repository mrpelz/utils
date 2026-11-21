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
        Progress holds two components, both built on Base UI’s progress. One is
        a bar for a known amount. The other is an activity indicator, a set of
        spinning spokes for an unknown amount. Most of the indicator’s code is
        about stopping well and staying in step with other indicators. To learn
        how to use them, see their{' '}
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
        <PartLink part="Progress.Value" /> are Base UI’s. Base UI handles the
        value, its formatting, the progress bar role and the labels. The root
        adds a <code>tint</code> (<code>--uikit-progress-tint</code>).
      </li>
      <li>
        The label and the value are placed by <code>placement</code>, an
        attribute for the stylesheet.
      </li>
      <li>
        As a tooltip, the value gets the tooltip’s surface style, and sits at
        the end of the fill.
      </li>
      <li>
        As a momentary tooltip, the value only shows while you hover or focus
        the bar. For that, the value registers with the root through a context,
        and the root becomes focusable.
      </li>
      <li>
        When the bar is indeterminate, with a <code>null</code> value, its fill
        slides along the track, in step with other sliding bars.
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
        progress root, so it’s announced as busy. It holds eight spokes in a
        span that’s hidden from assistive technology.
      </li>
      <li>
        Each spoke is turned 45° from the last. Each one carries its phase as a
        custom property: a share of a turn behind the brightest spoke.
      </li>
      <li>
        Its <code>movement</code> decides what the CSS animations do. The whole
        spinner can turn one spoke at a time, or smoothly. Or the spokes can
        stay in place and fade in turn, each by its phase.
      </li>
      <li>
        At rest, each spoke’s opacity is computed for its <code>progress</code>,
        measured in turns. So a stopped spinner shows exactly where it would
        have been. A spinning one starts from where its progress was when it
        started.
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
        <code>display</code> says how the indicator stops. It can come to rest
        at once, freeze where it is, or finish its turn first and then
        optionally hide. <code>useStopped</code> turns that into a state:
        spinning, frozen, or at rest.
      </li>
      <li>
        Finishing ends the turn’s animation after its current iteration, so it
        stops at the top. The indicator waits for that animation to finish. When
        it hides afterwards, it keeps turning while it fades out.
      </li>
      <li>
        When it freezes, its animations are paused in script, not with{' '}
        <code>animation-play-state</code>. CSS’s pause is ignored once a script
        has set an animation’s start time, which syncing does.
      </li>
      <li>
        WebKit can also settle a pause on an older time. So the time is put back
        once the pause has settled.
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
        With <code>synchronized</code>, the default, every spinning indicator
        and sliding bar sets its CSS animations’ start time to the page’s
        origin. So all of them show the same step at the same moment, no matter
        when each appeared. This happens again whenever an indicator’s display
        or movement changes.
      </li>
      <li>
        It doesn’t happen for an indicator with its own progress or duration, or
        while it’s frozen. Setting a start time would make a paused animation
        play again.
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
        <strong>From Base UI:</strong> the value, its formatting, the roles and
        the labels.
      </li>
      <li>
        <strong>From Tooltip and Glass:</strong> the surface of the value’s
        capsule.
      </li>
      <li>
        <strong>From Settings:</strong> reduced motion, read by a style query in
        the stylesheet.
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
