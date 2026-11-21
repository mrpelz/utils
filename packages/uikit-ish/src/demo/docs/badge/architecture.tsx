import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/badge/architecture`: how Badge is built, and what flows into it.

const placeCode = `.uikit-badge[data-badge='corner'],
.uikit-badge[data-badge='symbol'] {
  position: absolute;
  /* Above its host by its overhang, from its end by its inset. */
  inset-block-start: calc(-1 * var(--uikit-badge-overhang));
  inset-inline-start: calc(100% - var(--uikit-badge-inset));
}

/* No content: a dot, its own offsets. */
.uikit-badge:empty {
  --uikit-badge-overhang: -2px;
  --uikit-badge-inset: 12px;
  width: 10px;
  height: 10px;
}`;

const sections: readonly Section[] = [
  ['one-span', 'One span'],
  ['placed-by-its-host', 'Placed by its host'],
  ['a-dot', 'A dot'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/badge/architecture`: how it's built, and what flows into it. */
export const BadgeArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A badge is a single span. Its stylesheet does everything: its shape, its
        place and its dot. One attribute and a few custom properties drive it.
        To learn how to use it, see its{' '}
        <a href={publicUrl('badge/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="one-span"
      level={2}
    >
      One span
    </Heading>
    <ul>
      <li>
        <PartLink part="Badge" /> renders a span. Its <code>placement</code>{' '}
        becomes <code>data-badge</code>. Its <code>tint</code> and{' '}
        <code>textColor</code> become custom properties:{' '}
        <code>--uikit-badge-tint</code> and{' '}
        <code>--uikit-badge-text-color</code>. Your <code>style</code> is merged
        after them, so you can override either.
      </li>
      <li>
        The capsule’s metrics are custom properties with defaults: its height,
        padding, text size and weight. A placement changes the badge only by
        setting other values for them. So there’s one set of rules for the
        capsule, and none per placement.
      </li>
      <li>
        The badge takes no pointer events, so a press on it goes to whatever it
        sits on.
      </li>
    </ul>

    <Heading
      id="placed-by-its-host"
      level={2}
    >
      Placed by its host
    </Heading>
    <ul>
      <li>
        On a corner or a symbol, the badge is absolutely positioned. It sits
        above its host by an overhang, and starts a little before the host’s end
        by an inset. Both are logical, so in a right-to-left layout the badge
        sits on the other corner.
      </li>
      <li>
        The badge needs a host that is its containing block. That’s why you
        place it as a child.{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        and{' '}
        <PartLink
          component="avatar"
          part="Avatar.Root"
        />{' '}
        are positioned, and the badge only reads their box. Nothing in script
        measures either one.
      </li>
      <li>
        On a symbol, the badge is smaller and sits closer to the glyph. It has
        no stacking context of its own there. It’s drawn over the glyph simply
        by coming after it. With a <code>z-index</code>, Safari composited it
        separately and drew it over a pressed tab bar’s lens.
      </li>
      <li>
        A symbol blends and scales only its glyph, not its children. So a badge
        on a vibrant symbol keeps its own color and size.
      </li>
      <li>Inline, the badge stays in the text flow, centered on the line.</li>
    </ul>
    <CodeView code={placeCode} />

    <Heading
      id="a-dot"
      level={2}
    >
      A dot
    </Heading>
    <ul>
      <li>
        Without content, the badge matches <code>:empty</code> and becomes a
        10px dot. The dot has its own overhang and inset, so it sits inside a
        corner, or centered on a symbol’s corner. Nothing in script decides
        this.
      </li>
      <li>
        Inline, a dot is centered on the text by its cap height (
        <code>vertical-align: calc(0.5cap - 5px)</code>), not by its line.
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
        <strong>From its host:</strong> its box, as the containing block. Symbol
        and Avatar are positioned for this. Any positioned element of yours
        works too.
      </li>
      <li>
        <strong>From the tokens:</strong> its default tint, the system red.
      </li>
      <li>
        <strong>Out:</strong> nothing. You place it in a{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />{' '}
        inside a tab bar’s or a button’s icon, in an{' '}
        <PartLink
          component="avatar"
          part="Avatar.Root"
        />
        , or inline in a list row’s detail. When a tab collapses away, its badge
        fades with its symbol. There’s no special case for that.
      </li>
    </ul>
  </>
);
