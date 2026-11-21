import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/switch/architecture`: how Switch is built, and what flows into it.

const dragCode = `// Switch.Root's drag, in short (usePointerDrag: one pointer, captured,
// its moves once a frame).
move: (root, drag, event) => {
  drag.moved = (event.clientX - drag.startX) * drag.direction;
  const start = clamp(drag.start + drag.moved, drag.min, drag.max);
  root.style.setProperty('--uikit-switch-knob-move-duration', '0s');
  root.style.setProperty('--uikit-switch-knob-start', \`\${start}px\`);
  // The knob's center past the middle: the state flips, by Base UI's click.
  const willBeChecked = (start - drag.min) / (drag.max - drag.min) > 0.5;
  if (willBeChecked !== isChecked(root)) {
    drag.isFlipped = true;
    root.click();
  }
},
end: (root, drag) => {
  // The release's own click would toggle again: kept from Base UI unless
  // the release was a tap (quick, not flipped, not flicked back).
  suppressClick = drag.isFlipped || !isQuick || isTowardsCurrent;
},`;

const sections: readonly Section[] = [
  ['base-ui-s-switch', 'Base UI’s switch'],
  ['the-knob-follows-the-finger', 'The knob follows the finger'],
  ['pressed-and-the-lens', 'Pressed, and the lens'],
  ['indeterminate-and-labels', 'Indeterminate, and labels'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/switch/architecture`: how it's built, and what flows into it. */
export const SwitchArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A switch is Base UI’s, with a drag of its own: the knob follows the
        finger, the state flips as it crosses the middle, and a press shows a
        glass lens. For using it, see its{' '}
        <a href={publicUrl('switch/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-switch"
      level={2}
    >
      Base UI’s switch
    </Heading>
    <ul>
      <li>
        <PartLink part="Switch.Root" /> renders Base UI’s root: its state, its
        hidden input for forms, keyboard handling, and <code>data-checked</code>
        . <PartLink part="Switch.Thumb" /> is Base UI’s thumb, the knob.
      </li>
      <li>
        Every state change goes through Base UI: a tap is Base UI’s click, and a
        drag flips the state by clicking the root. So controlled and
        uncontrolled switches, forms and <code>onCheckedChange</code> behave as
        they do in Base UI.
      </li>
      <li>
        Its <code>tint</code> becomes <code>--uikit-switch-on-color</code>. The
        track’s size is a minimum, and the knob is placed with{' '}
        <code>inset-inline-start</code>, so it follows the track’s actual width
        and right-to-left layouts.
      </li>
      <li>
        The root carries <code>data-base-ui-swipe-ignore</code>, so dragging it
        doesn’t swipe a sheet or drawer away.
      </li>
    </ul>

    <Heading
      id="the-knob-follows-the-finger"
      level={2}
    >
      The knob follows the finger
    </Heading>
    <ul>
      <li>
        A pointer press starts a drag (<code>usePointerDrag</code>, shared by
        the library’s controls): the pointer is captured, and moves are handled
        once a frame.
      </li>
      <li>
        While dragging, the knob’s place is written as{' '}
        <code>--uikit-switch-knob-start</code>, with its move duration set to 0,
        so it follows the finger exactly. When its center crosses the middle,
        the root is clicked, and Base UI flips the state.
      </li>
      <li>
        On release, the written properties are removed and the knob settles by
        its transition. The release’s own click would toggle once more, so it’s
        suppressed in the capture phase, unless the release acts as a tap:
        quick, not flipped, and not flicked towards the side it’s on.
      </li>
    </ul>
    <CodeView code={dragCode} />

    <Heading
      id="pressed-and-the-lens"
      level={2}
    >
      Pressed, and the lens
    </Heading>
    <ul>
      <li>
        Pressed, the knob becomes a glass lens and the track shrinks. That’s
        driven by <code>--uikit-switch-pressed</code> (0 to 1), which the thumb
        inherits, set in script rather than by <code>:active</code>:{' '}
        <code>:active</code> is lost when the state flips mid-drag.
      </li>
      <li>
        A quick tap shows no lens. The lens shows once the press has lasted a
        moment or the pointer has moved (<code>delayLens</code>), so a tap only
        toggles. While the lens shows, the touch doesn’t scroll.
      </li>
    </ul>

    <Heading
      id="indeterminate-and-labels"
      level={2}
    >
      Indeterminate, and labels
    </Heading>
    <ul>
      <li>
        <code>indeterminate</code> places the knob in the middle, on the off
        color, and sets the hidden input’s <code>indeterminate</code> too, as a
        checkbox’s, for forms and assistive technology.
      </li>
      <li>
        <code>onOffLabels</code> adds two decorative spans, an on bar and an off
        ring, hidden from assistive technology. The knob covers the one on its
        side.
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
        <strong>From Base UI:</strong> state, the hidden input, keyboard, swipe
        handling’s opt-out attribute.
      </li>
      <li>
        <strong>From the library’s utilities:</strong> the drag, and the lens’s
        delay.
      </li>
      <li>
        <strong>From the tokens and Glass:</strong> the on and off colors, and
        the lens’s glass.
      </li>
      <li>
        <strong>Out:</strong> its <code>data-checked</code> is read by a{' '}
        <a href={publicUrl('card/architecture#the-roots-state')}>Card</a>{' '}
        holding it, to light the card; a card or a list row passes its presses
        on to it with{' '}
        <PartLink
          component="list"
          part="forwardClick"
        />
        .
      </li>
    </ul>
  </>
);
