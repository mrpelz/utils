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
        A badge is a single span. Everything it does, its shape, its place and
        its dot, is its stylesheet’s, driven by one attribute and a few custom
        properties. For using it, see its{' '}
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
        <PartLink part="Badge" /> renders a span with its <code>placement</code>{' '}
        as <code>data-badge</code>, and its <code>tint</code> and{' '}
        <code>textColor</code> as custom properties (
        <code>--uikit-badge-tint</code>, <code>--uikit-badge-text-color</code>
        ). The app’s own <code>style</code> is merged after them, so it can
        override either.
      </li>
      <li>
        The capsule’s metrics (its height, padding, text size and weight) are
        custom properties with defaults. A placement changes the badge only by
        setting different values for them, so there’s one set of rules for the
        capsule and none per placement.
      </li>
      <li>
        It takes no pointer events, so a press on it goes to what it sits on.
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
        On a corner or a symbol, the badge is absolutely positioned: above its
        host by an overhang, starting a little before the host’s end by an
        inset. Both are logical, so in a right-to-left layout it sits on the
        other corner.
      </li>
      <li>
        It needs a host that is its containing block. That’s why it’s placed as
        a child:{' '}
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
        measures either.
      </li>
      <li>
        On a symbol, the badge is smaller and set closer to the glyph. It has no
        stacking context of its own there: it’s drawn over the glyph by coming
        after it. With a <code>z-index</code>, Safari composited it apart and
        drew it over a pressed tab bar’s lens.
      </li>
      <li>
        A symbol blends and scales only its glyph, not its children, so a badge
        on a vibrant symbol keeps its own color and size.
      </li>
      <li>
        Inline, it stays in the text flow, vertically centered on the line.
      </li>
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
        10px dot, with its own overhang and inset, so it sits inside a corner or
        centered on a symbol’s corner. Nothing in script decides this.
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
        and Avatar are positioned for that; any element of yours that is works
        too.
      </li>
      <li>
        <strong>From the tokens:</strong> its default tint, the system red.
      </li>
      <li>
        <strong>Out:</strong> nothing. It’s placed in a{' '}
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
        fades with its symbol, with no special case.
      </li>
    </ul>
  </>
);
