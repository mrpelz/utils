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
        A toolbar is Base UI’s toolbar, used for its keyboard navigation. It
        holds glass capsules of buttons, sides that keep the middle centered,
        and a title. Every button in it is a{' '}
        <a href={publicUrl('button')}>Button</a>. To learn how to use it, see
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
        <PartLink part="Toolbar.Button" /> are Base UI’s. So the bar is a single
        tab stop, and you move between its buttons with the arrow keys.
      </li>
      <li>
        The root works out its glass context, whether given, adaptive or
        automatic. It provides that context to everything inside through Glass’s
        inherited context. So capsules and buttons match the bar without being
        told.
      </li>
      <li>
        The root’s <code>placement</code>, top or bottom, sets its height and
        its insets.
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
        <PartLink part="Toolbar.Group" /> is a glass capsule. It renders Glass’s
        background, tinted when it’s <code>prominent</code> or has a{' '}
        <code>tint</code>. Through a context, it tells its buttons that they’re
        inside it. Its gap and text color are custom properties.
      </li>
      <li>
        <PartLink part="Toolbar.Button" /> always renders a{' '}
        <PartLink
          component="button"
          part="Button.Root"
        />
        .
      </li>
      <li>
        Inside a capsule, the button is the capsule’s content. It has no glass
        of its own. It blends with the capsule’s glass, scales with the
        capsule’s lens, and shows the selection when pressed. Glass variants are
        ignored there, since the glass belongs to the capsule. Classic variants
        keep their own colors.
      </li>
      <li>
        On its own, the button is a glass button with the bar’s context, unless
        it has its own. It’s as tall as the capsules.
      </li>
      <li>
        The toolbar’s stylesheet repeats its class, doubled or tripled, to win
        over the button’s own styles without <code>!important</code>.
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
        <PartLink part="Toolbar.Trailing" /> share the free space equally. So
        whatever sits between them stays centered in the bar, as long as they
        fit. When one side is missing, the stylesheet holds its place with an
        empty one.
      </li>
      <li>
        <PartLink part="Toolbar.Title" /> sits in the middle. When it’s aligned
        to the start, it takes all the free space instead.{' '}
        <PartLink part="Toolbar.Subtitle" /> goes inside it.
      </li>
      <li>
        <PartLink part="Toolbar.Spacer" /> takes free space between parts.
      </li>
      <li>
        The bottom bar doesn’t pad for the home indicator. Its anchor handles
        the safe area inset, whether that’s a{' '}
        <PartLink
          component="viewport"
          part="Viewport.BlockEnd"
        />{' '}
        or a sheet’s.
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
        <strong>From Button:</strong> every button’s element and pressed state.
      </li>
      <li>
        <strong>From Glass:</strong> the capsules’ material, the context and the
        lens.
      </li>
      <li>
        <strong>From Viewport:</strong> its anchor and its insets.
      </li>
      <li>
        <strong>Out:</strong> it’s the bar that a{' '}
        <PartLink
          component="header"
          part="Header.Root"
        />{' '}
        ties to its page. The header fades the bar’s title in, finding it by its
        part attribute. Other glass inside the bar, such as a page control,
        takes the bar’s context.
      </li>
    </ul>
  </>
);
