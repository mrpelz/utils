import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/roll/architecture`: how Roll is built, and what flows into it.

const treeCode = `<div class="uikit-roll-root">                 <!-- ::before: the band -->
  <div class="uikit-roll-column-frame">
    <div role="listbox" tabindex="0" class="uikit-roll-scroller"
         aria-activedescendant="…-7">          <!-- snaps, padded 91px -->
      <div role="option" class="uikit-roll-item" aria-hidden="true" data-roll-copy>
        <span>7</span>                         <!-- a looping copy -->
      </div>
      …
      <div role="option" id="…-7" class="uikit-roll-item" aria-selected="true">
        <span>7</span>                         <!-- turns on the cylinder -->
      </div>
      …
    </div>
    <input class="uikit-roll-edit-field" />    <!-- typing, editable only -->
  </div>
  <div class="uikit-roll-separator">:</div>
  …
</div>`;

const turnCode = `/* style.css, in short: each row's text turns by its progress through the
   column (a scroll-driven animation of a registered, not inherited,
   number), its angle from its distance to the center. */
.uikit-roll-item > span {
  animation: uikit-roll-turn linear both;
  animation-timeline: view();
  --uikit-roll-distance: calc((0.5 - var(--uikit-roll-progress)) * 250);
  --uikit-roll-angle: clamp(-90deg, var(--uikit-roll-distance) / 110 * 1rad, 90deg);
  opacity: max(0, cos(var(--uikit-roll-angle)));
  transform: perspective(1200px) translate3d(…) rotateX(calc(var(--uikit-roll-angle) * -1));
}`;

const settleCode = `// Column, in short: settled (scrollend, or 120ms without a scroll), the
// centered row is selected, unless the column is still on its way.
const settle = () => {
  const index = centered();                         // scrollTop / 34
  if (target !== undefined && target !== index) return scrollToIndex(target);
  if (ownIndex(index) !== index) return jumpToOwnRow(); // a copy: unseen
  const entry = entries.get(items()[index]);
  if (entry.disabled) return later(() => scrollToIndex(nearestEnabled(index)));
  commit(entry.value);                              // onValueChange
};`;

const sections: readonly Section[] = [
  ['native-scrollers', 'Native scrollers'],
  ['the-cylinder', 'The cylinder'],
  ['settling-on-a-row', 'Settling on a row'],
  ['looping', 'Looping'],
  ['mouse-keys-and-typing', 'Mouse, keys and typing'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/roll/architecture`: how it's built, and what flows into it. */
export const RollArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A roll is a row of columns. Each column is a native scroller that snaps
        to its rows. The rows’ text is turned on a cylinder by CSS alone. The
        script decides when a column has come to rest, and which row that
        selects. A roll has no Base UI part. To learn how to use it, see its{' '}
        <a href={publicUrl('roll/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="native-scrollers"
      level={2}
    >
      Native scrollers
    </Heading>
    <ul>
      <li>
        <PartLink part="Roll.Root" /> is a flex row 216px high. It draws the
        band behind its center. <PartLink part="Roll.Separator" /> is text
        between columns, at the band.
      </li>
      <li>
        <PartLink part="Roll.Column" /> renders a scroller with mandatory
        snapping. It’s padded so that its first and last rows can reach the
        center. Touch, wheels and momentum are the browser’s own.
      </li>
      <li>
        The scroller is a listbox, its rows are its options, and the selected
        row is its active descendant.
      </li>
      <li>
        <PartLink part="Roll.Item" /> is a 34px row. It registers its value, and
        whether it’s disabled, in a weak map keyed by its element. So the column
        reads its rows from the DOM, in order, without a list of its own.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="the-cylinder"
      level={2}
    >
      The cylinder
    </Heading>
    <ul>
      <li>
        Each row’s text runs a scroll-driven animation on the column’s view
        timeline. The animation only changes one registered number that isn’t
        inherited: the row’s progress.
      </li>
      <li>
        From that progress, the stylesheet works out the text’s angle on a 110px
        cylinder, its translation and its opacity. The script does nothing per
        frame.
      </li>
      <li>
        The row itself isn’t transformed, because snapping uses transformed
        boxes. Only its text turns, around its own center. That way, text far
        from the middle of a wide column doesn’t lean.
      </li>
      <li>Without scroll-driven animations, the rows stay flat.</li>
    </ul>
    <CodeView code={turnCode} />

    <Heading
      id="settling-on-a-row"
      level={2}
    >
      Settling on a row
    </Heading>
    <ul>
      <li>
        Every scroll records its direction, reports a newly centered row (
        <code>onHighlightChange</code>), and restarts a 120ms timer.
      </li>
      <li>
        The column comes to rest on <code>scrollend</code>, or when the timer
        runs out. The centered row is then selected (<code>onValueChange</code>
        ), together with the reason that moved it.
      </li>
      <li>
        A row that script scrolls to, by a press, a key or a new value, is the
        column’s target until it’s reached. That’s because a smooth scroll can
        be interrupted. When you scroll yourself, the target is cleared.
      </li>
      <li>
        When the column comes to rest on a disabled row, it waits 400ms. Then it
        moves on to the nearest enabled row in the direction you scrolled. So
        scrolling row by row still gets past it.
      </li>
      <li>
        A row can also become disabled while the column is at rest, such as the
        31st when the month changes to April. Then the column moves at once to
        the nearest enabled row, looking upward first.
      </li>
      <li>
        When it’s controlled, the column reports the value and waits for your
        app’s. If your app keeps its own value, the column scrolls back to it.
      </li>
    </ul>
    <CodeView code={settleCode} />

    <Heading
      id="looping"
      level={2}
    >
      Looping
    </Heading>
    <ul>
      <li>
        A <code>loop</code> column renders copies of its rows before and after
        them: at least two copies, and at least 60 rows on each side. That way,
        several flicks in a row don’t reach the end before the column comes to
        rest. The copies are hidden from assistive technology and have no ids.
      </li>
      <li>
        When the column comes to rest on a copy, it jumps by whole copies to the
        original row. The rows look the same, so nothing moves on screen.
      </li>
    </ul>

    <Heading
      id="mouse-keys-and-typing"
      level={2}
    >
      Mouse, keys and typing
    </Heading>
    <ul>
      <li>
        A mouse drags the column directly. Snapping is turned off and the
        pointer is captured. When you release, the column glides on by the speed
        of your last 100ms of movement, to the nearest row.
      </li>
      <li>A click after a drag is ignored. A click on a row scrolls to it.</li>
      <li>
        The arrow keys, Page Up and Page Down step over disabled rows. Home and
        End go to the first and the last enabled row.
      </li>
      <li>
        An <code>editable</code> column shows a numeric field over its selected
        row. It appears when you press that row, press Enter, or type a digit.
        When you enter a value, the row whose text or number matches is
        selected.
      </li>
      <li>
        The field is focused without scrolling, because on iOS that would move
        the whole page.
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
        <strong>From the browser:</strong> scrolling, snapping, momentum and the
        view timeline.
      </li>
      <li>
        <strong>From the app:</strong> the rows, their values, and which ones
        are disabled.
      </li>
      <li>
        <strong>Out:</strong> a{' '}
        <a href={publicUrl('date-picker')}>Date Picker</a>’s wheels are rolls.
      </li>
    </ul>
  </>
);
