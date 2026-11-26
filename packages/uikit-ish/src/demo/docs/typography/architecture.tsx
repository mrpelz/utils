import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/typography/architecture`: how Typography is built, and what flows into
// it.

const tokensCode = `/* styles.css: each text style's tokens, at the default size (Large). */
:root {
  --font-ui-body-size: 17px;
  --font-ui-body-line-height: 22px;
  --font-ui-body-tracking: -0.43px;
  --font-ui-body-weight: 400;
  --font-ui-body-weight-emphasized: 590;
  /* … every text style */
}

/* typography/style.css: a style reads its tokens; a size redefines them. */
.uikit-typography {
  font-size: var(--font-ui-body-size);
  line-height: var(--font-ui-body-line-height);

  &[data-text-style='callout'] {
    font-size: var(--font-ui-callout-size); /* … */
  }

  &[data-text-size='xSmall'] {
    --font-ui-body-size: 14px; /* … every style, for it and its content */
  }
}`;

const sections: readonly Section[] = [
  ['one-element-four-attributes', 'One element, four attributes'],
  ['styles-and-sizes-as-tokens', 'Styles and sizes as tokens'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/typography/architecture`: how it's built, and what flows into it. */
export const TypographyArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Typography is one element with attributes, and a stylesheet that maps
        them to the text style tokens. Every other component uses those same
        tokens for its text. So Typography is the same type system, opened up
        for your own text. To learn how to use it, see its{' '}
        <a href={publicUrl('typography/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="one-element-four-attributes"
      level={2}
    >
      One element, four attributes
    </Heading>
    <ul>
      <li>
        <PartLink part="Typography" /> renders a span through Base UI’s{' '}
        <code>useRender</code>, so <code>render</code> can make it a heading or
        a paragraph.
      </li>
      <li>
        Its props become attributes: <code>data-text-style</code>,{' '}
        <code>data-text-size</code>, <code>data-color</code>,{' '}
        <code>data-emphasized</code> and <code>data-italic</code>. There’s no
        state and no script beyond that.
      </li>
      <li>
        Each label color is a token too: <code>--color-ui-label</code>, and its
        secondary to quaternary variants. So text follows the color scheme and
        the contrast setting, without anything in script.
      </li>
    </ul>

    <Heading
      id="styles-and-sizes-as-tokens"
      level={2}
    >
      Styles and sizes as tokens
    </Heading>
    <ul>
      <li>
        <strong>A style</strong> is a set of tokens: size, line height,
        tracking, weight and emphasized weight, such as{' '}
        <code>--font-ui-body-size</code>. The global stylesheet defines them for
        the default text size. A text style attribute picks which set the
        element reads.
      </li>
      <li>
        <strong>A size</strong> doesn’t pick other tokens. It redefines all of
        them on the element. Because they’re custom properties, they inherit. So
        everything inside the element, other components included, is set at that
        size.
      </li>
      <li>
        <strong>Emphasis</strong> swaps the weight for the style’s emphasized
        weight.
      </li>
      <li>
        Weights go through <code>font-variation-settings</code>, so variable
        fonts get the exact weight. As a fallback, <code>font-weight</code> is
        rounded down to the nearest hundred.
      </li>
      <li>
        The accessibility sizes have no tracking, and a few styles share metrics
        at some sizes. Those are written out per size instead of computed.
      </li>
    </ul>
    <CodeView code={tokensCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From the tokens:</strong> every metric and color.
      </li>
      <li>
        <strong>From Settings:</strong> the color scheme and the contrast
        setting, through the color tokens.
      </li>
      <li>
        A provider’s text size (see <a href={publicUrl('settings')}>Settings</a>
        , the system’s or its own) sets the same tokens for everything inside
        it, as <code>textSize</code> does for what’s inside a Typography. The
        nearest one wins.
      </li>
      <li>
        <strong>Out:</strong> the same tokens every component’s text uses. A
        size set on a Typography reaches the components inside it. So does a
        size on any element that carries that size’s tokens.
      </li>
    </ul>
  </>
);
