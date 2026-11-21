import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/symbol/architecture`: how Symbol is built, and what flows into it.

const treeCode = `<span class="uikit-symbol" data-baseline-shift="optical"
      style="--uikit-symbol-height: 0.996em">
  <span class="uikit-symbol-glyph" data-variant="regular">
    <svg viewBox="…" width="…em" height="…em"><path d="…" /></svg>
  </span>
  <span class="uikit-symbol-glyph" data-variant="emphasized">  <!-- if given -->
    <svg …>…</svg>
  </span>
  <!-- its children, e.g. a Badge: not blended, not scaled -->
</span>`;

const emphasisCode = `/* The host says how emphasized (0 to 1); both glyphs are stacked. */
.uikit-symbol-glyph[data-variant='regular'] {
  opacity: calc(1 - var(--uikit-symbol-emphasis, 0));
}
.uikit-symbol-glyph[data-variant='emphasized'] {
  position: absolute;
  inset: 0;
  opacity: var(--uikit-symbol-emphasis, 0);
}

/* e.g. tab-bar/style.css: an active tab's icon */
[data-active] > .uikit-tab-bar-icon {
  --uikit-symbol-emphasis: 1;
}`;

const sections: readonly Section[] = [
  ['an-icon-as-a-glyph', 'An icon as a glyph'],
  ['emphasis-from-its-host', 'Emphasis from its host'],
  ['blended-and-scaled-by-its-host', 'Blended and scaled by its host'],
  ['in-a-line-of-text', 'In a line of text'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/symbol/architecture`: how it's built, and what flows into it. */
export const SymbolArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A symbol draws an icon’s outlines sized like a letter of the current
        font, so it can stand in a line of text or a button. It holds no state:
        its host decides whether it’s emphasized, blended or scaled, through
        inherited custom properties. For using it, see its{' '}
        <a href={publicUrl('symbol/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="an-icon-as-a-glyph"
      level={2}
    >
      An icon as a glyph
    </Heading>
    <ul>
      <li>
        An icon is data: a view box, paths with their opacities, and the units
        per em it was drawn at (20 for SF Symbols). The library ships no icons;
        any object of that shape works.
      </li>
      <li>
        <PartLink part="Symbol" /> renders each glyph as an SVG in a span of its
        own, sized in <code>em</code> from the view box and the units per em. So
        a symbol follows the font size of wherever it is, as a letter would.
      </li>
      <li>
        Its paths are filled in the current color. A layered icon’s paths keep
        their opacities relative to the most opaque one.
      </li>
      <li>
        Each glyph sits in its own span because Chrome kept a scaled SVG root’s
        overflow after it was unscaled, for example in a scroller.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="emphasis-from-its-host"
      level={2}
    >
      Emphasis from its host
    </Heading>
    <ul>
      <li>
        With an <code>emphasizedIcon</code> (a filled variant, say), both glyphs
        are rendered, stacked. Which one shows is up to{' '}
        <code>--uikit-symbol-emphasis</code>, a number from 0 to 1 that the
        symbol inherits: the regular glyph fades out as it rises, the emphasized
        one in.
      </li>
      <li>
        The symbol never decides this itself. Hosts set the property on their
        own state: a selected tab, a lit card, a selected segment, a list row.
        So an app never picks between two icons; it gives both.
      </li>
      <li>
        The property isn’t registered, so it can’t be transitioned: each host
        sets it outright when its state changes. (A transitioned inherited
        property is a layer change on every element below it, which iOS handles
        badly in scrollers.) Unset, it counts as 0.
      </li>
    </ul>
    <CodeView code={emphasisCode} />

    <Heading
      id="blended-and-scaled-by-its-host"
      level={2}
    >
      Blended and scaled by its host
    </Heading>
    <ul>
      <li>
        A host can blend and scale a symbol’s glyphs by setting{' '}
        <code>--uikit-symbol-blend</code> and <code>--uikit-symbol-scale</code>.
        A tab bar’s icons do: their glyphs take the glass’s vibrant blend, and
        grow with its lens. Only the glyph spans read them.
      </li>
      <li>
        The symbol’s children, such as a{' '}
        <PartLink
          component="badge"
          part="Badge"
        />
        , aren’t glyphs, so they stay solid and at their size. The symbol is
        positioned, so it’s the badge’s containing block.
      </li>
    </ul>

    <Heading
      id="in-a-line-of-text"
      level={2}
    >
      In a line of text
    </Heading>
    <ul>
      <li>
        With <code>baselineShift</code> optical (the default), the symbol sets
        its height as <code>--uikit-symbol-height</code>, and the stylesheet
        aligns its center with the text’s: half the cap height above the
        baseline. So it lines up with capital letters at any size, with nothing
        measured in script.
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
        <strong>From its host:</strong> the font size and color, and the
        emphasis, blend and scale properties.
      </li>
      <li>
        <strong>From the app:</strong> the icons, as data.
      </li>
      <li>
        <strong>Out:</strong> a glyph every component with an icon uses, and a
        containing block for badges.
      </li>
    </ul>
  </>
);
