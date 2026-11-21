import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/tooltip/architecture`: how Tooltip is built, and what flows into it.

const longPressCode = `// useLongPress, in short: on a trigger, a touch held 500ms without moving
// 10px opens the tooltip by its root's handle; lifting closes it.
trigger.addEventListener('pointerdown', (event) => {
  if (event.pointerType !== 'touch' || !event.isPrimary) return;
  timer = setTimeout(() => {
    isShown = true;
    isLongPressed = true;
    handle.open(triggerId);
  }, 500);
  // On the window: moved too far, ended, or cancelled: end().
});

// After a long press, its touch's end is cancelled: no click, and no
// mouse events emulated for it (mouseenter would reopen it as a hover).
trigger.addEventListener('touchend', (event) => {
  if (isLongPressed && event.cancelable) event.preventDefault();
}, { passive: false });`;

const sections: readonly Section[] = [
  ['base-ui-s-tooltip', 'Base UI’s tooltip'],
  ['on-touch-a-long-press', 'On touch, a long press'],
  ['the-capsule', 'The capsule'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/tooltip/architecture`: how it's built, and what flows into it. */
export const TooltipArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A tooltip is Base UI’s, shown on hover and keyboard focus, with one
        addition: on touch, where nothing hovers, it shows while its trigger is
        held. For using it, see its{' '}
        <a href={publicUrl('tooltip/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-tooltip"
      level={2}
    >
      Base UI’s tooltip
    </Heading>
    <ul>
      <li>
        Opening, closing, delays, positioning and the handle are Base UI’s.{' '}
        <PartLink part="Tooltip.Trigger" /> waits 300ms instead of Base UI’s
        600ms, unless it’s inside a <PartLink part="Tooltip.Provider" />, whose
        delay then applies, so moving between tooltips shows the next at once.
      </li>
      <li>
        <PartLink part="Tooltip.Portal" /> goes to the library’s portal
        container, with the providers’ settings, and has no box (
        <code>display: contents</code>), so a container laid out as a flex
        column doesn’t shift.
      </li>
      <li>
        <PartLink part="Tooltip.Positioner" /> takes a logical side, 8px from
        its trigger, and stays in its container and clear of the safe area and
        the keyboard (<code>useCollision</code>).
      </li>
    </ul>

    <Heading
      id="on-touch-a-long-press"
      level={2}
    >
      On touch, a long press
    </Heading>
    <ul>
      <li>
        <PartLink part="Tooltip.Root" /> makes a handle of its own when it isn’t
        given one, and passes it, with whether it’s disabled, to its triggers
        through a context. A trigger listens for a touch held 500ms within 10px,
        then opens the tooltip through that handle; lifting the finger closes
        it.
      </li>
      <li>
        A touch that moves or lifts earlier does nothing: the tap is the
        trigger’s own.
      </li>
      <li>
        After a long press, the touch’s end is cancelled. Otherwise the browser
        emulates a mouse for it, and Base UI takes its <code>mouseenter</code>{' '}
        for a hover and reopens the tooltip (see{' '}
        <a href={publicUrl('ios-quirks#mouse-events-after-a-long-press')}>
          iOS Quirks
        </a>
        ). On Android, the long press’s context menu is prevented too.
      </li>
    </ul>
    <CodeView code={longPressCode} />

    <Heading
      id="the-capsule"
      level={2}
    >
      The capsule
    </Heading>
    <ul>
      <li>
        <PartLink part="Tooltip.Popup" /> is the menus’ glass, its color scheme
        from what’s behind it, passed to what’s inside. Its surface class (
        <code>uikit-tooltip-surface</code>) is shared, so a page control’s value
        tooltip looks the same without being a tooltip.
      </li>
      <li>
        It scales in from its trigger, as menus do, by Base UI’s starting and
        ending styles.
      </li>
    </ul>

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Base UI:</strong> everything but the long press.
      </li>
      <li>
        <strong>From Viewport, Settings and Glass:</strong> the portal container
        and collision boundary, the providers’ settings, and its color scheme.
      </li>
      <li>
        <strong>Out:</strong> its surface style, to{' '}
        <PartLink
          component="page-control"
          part="PageControl"
        />
        . Held open and anchored to an element, it labels things for good, for
        example a slider’s thumb.
      </li>
    </ul>
  </>
);
