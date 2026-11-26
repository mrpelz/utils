import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/stack/architecture`: how Stack is built, and what flows into it.

const cssCode = `/* The spacing scale: an app's (set anywhere), else these. */
.uikit-stack {
  --uikit-stack-spacing: var(--uikit-spacing-large, 16px);
  display: flex;
  flex-direction: column;
  gap: var(--uikit-stack-spacing);

  &[data-spacing='small'] { --uikit-stack-spacing: var(--uikit-spacing-small, 8px); }
  &[data-inset] { padding-inline: var(--uikit-content-margin-inline, 16px); }
}`;

const sections: readonly Section[] = [
  ['spacing-between-siblings', 'Spacing between siblings'],
  ['a-flexbox-and-tokens', 'A flexbox and tokens'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/stack/architecture`: how it's built, and what flows into it. */
export const StackArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Stack is the library’s own: a flexbox with a gap from a spacing scale.
        To learn how to use it, see its{' '}
        <a href={publicUrl('stack/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="spacing-between-siblings"
      level={2}
    >
      Spacing between siblings
    </Heading>
    <ul>
      <li>
        Components have no margins of their own, so they never add up or
        collapse next to each other. The space between them is always an
        explicit part.
      </li>
      <li>
        A page’s ends get theirs from{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />
        . A list spaces its own sections, groups and blocks. Everything else
        sits in a stack.
      </li>
    </ul>

    <Heading
      id="a-flexbox-and-tokens"
      level={2}
    >
      A flexbox and tokens
    </Heading>
    <ul>
      <li>
        Its props are data attributes, and its stylesheet maps them to flexbox
        properties. The spacing steps are tokens with defaults, so an app can
        change the scale anywhere.
      </li>
    </ul>
    <CodeView code={cssCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>In:</strong> its props, and the tokens{' '}
        <code>--uikit-spacing-small</code>, <code>-medium</code>,{' '}
        <code>-large</code>, <code>-x-large</code> and{' '}
        <code>--uikit-content-margin-inline</code>.
      </li>
      <li>
        <strong>Out:</strong> nothing. It keeps no state and sends no events.
      </li>
    </ul>
  </>
);
