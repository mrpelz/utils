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
        A tooltip is Base UI’s tooltip, shown on hover and on keyboard focus.
        The library adds one thing. On touch, where nothing hovers, the tooltip
        shows while you hold its trigger. To learn how to use it, see its{' '}
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
        Opening, closing, the delays, positioning and the handle are Base UI’s.
      </li>
      <li>
        <PartLink part="Tooltip.Trigger" /> waits 300ms instead of Base UI’s
        600ms. Inside a <PartLink part="Tooltip.Provider" />, the provider’s
        delay applies instead. So when you move between tooltips, the next one
        shows at once.
      </li>
      <li>
        <PartLink part="Tooltip.Portal" /> goes into the library’s portal
        container, with the providers’ settings. It has no box (
        <code>display: contents</code>), so a container laid out as a flex
        column doesn’t shift.
      </li>
      <li>
        <PartLink part="Tooltip.Positioner" /> takes a logical side, and places
        the tooltip 8px from its trigger. The tooltip stays in its container,
        and clear of the safe area and the keyboard (<code>useCollision</code>).
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
        <PartLink part="Tooltip.Root" /> makes a handle of its own when you
        don’t give it one. It passes that handle, and whether it’s disabled, to
        its triggers through a context.
      </li>
      <li>
        A trigger listens for a touch that’s held for 500ms without moving more
        than 10px. Then it opens the tooltip through the handle. When you lift
        your finger, the tooltip closes.
      </li>
      <li>
        A touch that moves or lifts earlier does nothing. That tap belongs to
        the trigger itself.
      </li>
      <li>
        After a long press, the touch’s end is cancelled. Otherwise, the browser
        would emulate a mouse for it. Base UI would take the emulated{' '}
        <code>mouseenter</code> for a hover, and open the tooltip again (see{' '}
        <a href={publicUrl('ios-quirks#mouse-events-after-a-long-press')}>
          iOS Quirks
        </a>
        ).
      </li>
      <li>On Android, the long press’s context menu is prevented too.</li>
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
        <PartLink part="Tooltip.Popup" /> uses the menus’ glass. It takes its
        color scheme from what’s behind it, and passes it to its content.
      </li>
      <li>
        Its surface class (<code>uikit-tooltip-surface</code>) is shared. That
        way, a page control’s value tooltip looks the same, without being a
        tooltip.
      </li>
      <li>
        The tooltip scales in from its trigger the way menus do, using Base UI’s
        starting and ending styles.
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
        <strong>From Base UI:</strong> everything except the long press.
      </li>
      <li>
        <strong>From Viewport, Settings and Glass:</strong> the portal
        container, the collision boundary, the providers’ settings and its color
        scheme.
      </li>
      <li>
        <strong>Out:</strong> its surface style, to the{' '}
        <PartLink
          component="page-control"
          part="PageControl"
        />
        . A tooltip that’s held open and anchored to an element can also label
        it permanently, for example a slider’s thumb.
      </li>
    </ul>
  </>
);
