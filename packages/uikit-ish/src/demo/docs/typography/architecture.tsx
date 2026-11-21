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
        them to the text style tokens. The tokens are what every other component
        uses for its text, so Typography is the same type system, exposed for
        your own text. For using it, see its{' '}
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
        <code>useRender</code>, so <code>render</code> makes it a heading or a
        paragraph. Its props become attributes: <code>data-text-style</code>,{' '}
        <code>data-text-size</code>, <code>data-color</code>,{' '}
        <code>data-emphasized</code> and <code>data-italic</code>. There is no
        state and no script beyond that.
      </li>
      <li>
        Each label color is a token too (<code>--color-ui-label</code> and its
        secondary to quaternary), so text follows the color scheme and contrast
        without anything in script.
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
        tracking, weight and emphasized weight (<code>--font-ui-body-size</code>{' '}
        and so on). The global stylesheet defines them for the default text
        size. A text style attribute picks which set the element reads.
      </li>
      <li>
        <strong>A size</strong> doesn’t pick other tokens: it redefines all of
        them on the element. Because they’re custom properties, they inherit, so
        everything inside the element, other components too, is set at that
        size.
      </li>
      <li>
        <strong>Emphasis</strong> swaps the weight for the style’s emphasized
        weight. Weights go through <code>font-variation-settings</code>, with{' '}
        <code>font-weight</code> rounded down to a hundred as a fallback, so
        variable fonts get the exact weight.
      </li>
      <li>
        The accessibility sizes have no tracking, and a few styles share metrics
        at some sizes; those are written out per size rather than computed.
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
        <strong>From Settings:</strong> the color scheme and contrast, through
        the color tokens. Settings also publishes a text size (
        <code>--uikit-settings-text-size</code>), but nothing reads it yet: a
        text size is set per element, with <code>textSize</code>, and applies to
        what’s inside it.
      </li>
      <li>
        <strong>Out:</strong> the same tokens every component’s text uses. A
        size set on a Typography (or any element carrying the size’s tokens)
        reaches the components inside it.
      </li>
    </ul>
  </>
);
