import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/segmented/architecture`: how Segmented is built, and what flows into
// it.

const treeCode = `<div role="radiogroup" class="uikit-segmented-root">  <!-- Base UI's radio group -->
  <div class="uikit-segmented-scroller">                <!-- scrolls, with overflow -->
    <div class="uikit-segmented-track">                 <!-- equal columns -->
      <button role="radio" class="uikit-segmented-item">
        <span class="uikit-segmented-label">
          <span class="uikit-segmented-label-text">Day</span>
          <span class="uikit-segmented-label-reserve" aria-hidden="true">Day</span>
        </span>
      </button>
      …
      <div class="uikit-segmented-highlight" />          <!-- the selection -->
    </div>
  </div>
  <span class="uikit-segmented-lens" aria-hidden="true" /> <!-- pressed -->
</div>`;

const highlightCode = `/* The highlight placed by how many items precede the checked one (and
   sized by how many there are): one rule per count, each with one more
   combinator, so the most specific match wins. Base UI renders a hidden
   input beside each radio, so :nth-child can't count them. */
.uikit-segmented-highlight {
  [data-checked] ~ & { /* … */ }
  [role='radio'] ~ [data-checked] ~ & { /* one before it */ }
  [role='radio'] ~ [role='radio'] ~ [data-checked] ~ & { /* two */ }
  /* … up to ten */
}`;

const sections: readonly Section[] = [
  ['radios-in-a-track', 'Radios in a track'],
  ['the-highlight', 'The highlight'],
  ['the-lens', 'The lens'],
  ['scrolling', 'Scrolling'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/segmented/architecture`: how it's built, and what flows into it. */
export const SegmentedArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A segmented control is Base UI’s radio group, laid out as a track of
        equal columns. A highlight sits under the checked item, and a glass lens
        shows while you press it. To learn how to use it, see its{' '}
        <a href={publicUrl('segmented/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="radios-in-a-track"
      level={2}
    >
      Radios in a track
    </Heading>
    <ul>
      <li>
        <PartLink part="Segmented.Root" /> is Base UI’s radio group. Base UI
        handles the value, the keyboard and forms. The root renders a scroller
        and a track around its items, and the lens next to them.
      </li>
      <li>
        <PartLink part="Segmented.Item" /> is Base UI’s radio. Its label sits in
        a span that clips it. That way, the rounded item doesn’t clip the
        separator drawn at its start.
      </li>
      <li>
        A hidden copy of the label, at the checked weight, shares the label’s
        grid cell. So the columns don’t get wider when the widest label is
        checked.
      </li>
      <li>
        The items are equal grid columns. When the control sizes to its content,
        every column fits the widest label.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="the-highlight"
      level={2}
    >
      The highlight
    </Heading>
    <ul>
      <li>
        <PartLink part="Segmented.Highlight" /> is a plain element in the track,
        with no script. The stylesheet places it under the checked item by
        counting the items before it with chained sibling combinators. That
        works for up to ten items.
      </li>
      <li>The highlight is hidden while nothing is checked.</li>
      <li>
        It clips itself and its shadow to the track, so it never shows past the
        ends.
      </li>
    </ul>
    <CodeView code={highlightCode} />

    <Heading
      id="the-lens"
      level={2}
    >
      The lens
    </Heading>
    <ul>
      <li>
        A press on an item starts a drag (<code>usePointerDrag</code>). The lens
        follows the pointer, clamped to the items, and the closest enabled item
        is marked.
      </li>
      <li>
        When you release, that item is clicked, so Base UI checks it, and
        focused. The lens settles on it as it fades out.
      </li>
      <li>
        A quick tap shows no lens. The lens only shows after a moment or a move
        (<code>delayLens</code>), so a tap just checks the item. While the lens
        shows, the touch doesn’t scroll.
      </li>
      <li>
        The lens’s position and size are custom properties on the root. It’s
        drawn above the items and outside the track, so the track doesn’t clip
        it.
      </li>
      <li>
        A focus ring only shows for keyboard focus. When a press focuses the
        control, the root marks itself <code>data-pointer-focus</code>.
      </li>
    </ul>

    <Heading
      id="scrolling"
      level={2}
    >
      Scrolling
    </Heading>
    <ul>
      <li>
        With <code>overflow</code> set to scroll, the items snap by their start,
        with a peek of the previous item.
      </li>
      <li>
        The checked item is scrolled into view when the control mounts, and
        again whenever it changes, however that happens. For that, the root
        watches for <code>data-checked</code> changes.
      </li>
      <li>
        It scrolls to the nearest snap position that shows the checked item, so
        snapping doesn’t move it out of view again. With reduced motion, it
        scrolls instantly.
      </li>
      <li>
        On touch, a finger that moves before the lens shows scrolls the items
        instead.
      </li>
      <li>
        When the lens shows and you hold it near an end, the lens scrolls the
        items, a little more each frame, as menus do.
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
        <strong>From Base UI:</strong> the value, the keyboard and forms.
      </li>
      <li>
        <strong>From the library’s utilities:</strong> the drag, the lens’s
        delay, scrolling at the edges, the keyboard-focus check, and reduced
        motion as the settings say (<code>reducedMotionOf</code>).
      </li>
      <li>
        <strong>From Glass:</strong> the lens.
      </li>
      <li>
        <strong>Out:</strong> the root carries{' '}
        <code>data-base-ui-swipe-ignore</code>, so pressing it doesn’t swipe a
        sheet away. A header’s accessory or a toolbar can hold it.
      </li>
    </ul>
  </>
);
