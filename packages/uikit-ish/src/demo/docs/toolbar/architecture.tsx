import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/toolbar/architecture`: how Toolbar is built, and what flows into it.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const buttonCode = `// Toolbar.Button, in short: Base UI's toolbar button (keyboard
// navigation), rendering a Button, as one of a capsule's or on its own.
const isInGroup = useContext(GroupContext);
const inherited = useContext(InheritedGlassContext);

<BaseToolbar.Button
  render={
    render ??
    (isInGroup ? (
      // In a capsule: the capsule is the glass; the button, its content.
      <Button.Root className="uikit-toolbar-button" variant={classicOnly} />
    ) : (
      // On its own: a glass Button, the bar's context unless its own.
      <Button.Root
        className="uikit-toolbar-glass-button"
        context={context ?? inherited}
        variant={variant ?? (prominent ? 'glass-prominent' : 'glass')}
      />
    ))
  }
/>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const sections: readonly Section[] = [
  ['base-ui-s-toolbar', 'Base UI’s toolbar'],
  ['capsules-and-buttons', 'Capsules and buttons'],
  ['its-layout', 'Its layout'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/toolbar/architecture`: how it's built, and what flows into it. */
export const ToolbarArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A toolbar is Base UI’s, for its keyboard navigation, with glass capsules
        of buttons, sides that keep the middle centered, and a title. Every
        button is a <a href={publicUrl('button')}>Button</a>. For using it, see
        its <a href={publicUrl('toolbar/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-toolbar"
      level={2}
    >
      Base UI’s toolbar
    </Heading>
    <ul>
      <li>
        <PartLink part="Toolbar.Root" />, <PartLink part="Toolbar.Group" /> and{' '}
        <PartLink part="Toolbar.Button" /> are Base UI’s, so the bar is one tab
        stop and its buttons are moved between with the arrow keys.
      </li>
      <li>
        The root resolves its glass context (given, adaptive or automatic) and
        provides it to everything inside through Glass’s inherited context, so
        capsules and buttons match the bar without being told. Its{' '}
        <code>placement</code> (top or bottom) sets its height and its insets.
      </li>
      <li>The bar draws no glass itself. Its capsules and its buttons do.</li>
    </ul>

    <Heading
      id="capsules-and-buttons"
      level={2}
    >
      Capsules and buttons
    </Heading>
    <ul>
      <li>
        <PartLink part="Toolbar.Group" /> is a glass capsule: it renders Glass’s
        background, tinted when <code>prominent</code> or given a{' '}
        <code>tint</code>, and tells its buttons they’re inside it through a
        context. Its gap and text color are custom properties.
      </li>
      <li>
        <PartLink part="Toolbar.Button" /> renders a{' '}
        <PartLink
          component="button"
          part="Button.Root"
        />{' '}
        either way. Inside a capsule, it’s the capsule’s content: no glass of
        its own, blended with the capsule’s, scaled with its lens, showing the
        selection when pressed. Glass variants are ignored there, since the
        glass is the capsule’s; classic ones keep their own colors.
      </li>
      <li>
        On its own, it’s a glass button with the bar’s context unless it has its
        own, as high as the capsules.
      </li>
      <li>
        Its stylesheet repeats its class (doubled, tripled) to win over the
        button’s own styles without <code>!important</code>.
      </li>
    </ul>
    <CodeView code={buttonCode} />

    <Heading
      id="its-layout"
      level={2}
    >
      Its layout
    </Heading>
    <ul>
      <li>
        <PartLink part="Toolbar.Leading" /> and{' '}
        <PartLink part="Toolbar.Trailing" /> share the free space equally, so
        whatever is between them stays centered in the bar while they fit. A
        missing side is held by an empty one in the stylesheet.
      </li>
      <li>
        <PartLink part="Toolbar.Title" /> sits in the middle; aligned to the
        start, it takes all the free space instead.{' '}
        <PartLink part="Toolbar.Subtitle" /> goes inside it.{' '}
        <PartLink part="Toolbar.Spacer" /> takes free space between parts.
      </li>
      <li>
        The bottom bar doesn’t pad for the home indicator: its anchor (
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />
        , or a sheet’s) handles the safe area inset.
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
        <strong>From Base UI:</strong> the toolbar’s keyboard navigation.
      </li>
      <li>
        <strong>From Button:</strong> every button’s element and press state.
      </li>
      <li>
        <strong>From Glass:</strong> the capsules’ material, the context, the
        lens.
      </li>
      <li>
        <strong>From Viewport:</strong> its anchor, its insets.
      </li>
      <li>
        <strong>Out:</strong> it’s the bar a{' '}
        <PartLink
          component="header"
          part="Header.Root"
        />{' '}
        ties to its page, whose title it fades in by its part attribute. Other
        glass inside it, such as a page control, takes its context.
      </li>
    </ul>
  </>
);
