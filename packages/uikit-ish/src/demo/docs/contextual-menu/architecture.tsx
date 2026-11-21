import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/contextual-menu/architecture`: how ContextualMenu is built, and what
// flows into it.

const stackCode = `<ContextualMenu.Positioner>               <!-- Menu's positioner: the stack -->
  <div class="uikit-contextual-menu-slot" /> <!-- the preview's (or trigger's) place -->
  <ContextualMenu.Popup>…</ContextualMenu.Popup> <!-- the menu, below it -->
</ContextualMenu.Positioner>`;

const liftCode = `// Trigger, in short: lifted onto the slot while open, following it every
// frame (as it's placed, shifted, scrolled), and cut out of the backdrop.
const follow = () => {
  const from = wrapper.getBoundingClientRect();
  const to = slot.getBoundingClientRect();
  wrapper.style.setProperty('--uikit-contextual-menu-lift-x', \`\${to.left - from.left}px\`);
  wrapper.style.setProperty('--uikit-contextual-menu-lift-y', \`\${to.top - from.top}px\`);
  cutOut(backdrop, trigger);               // a hole in the dimming, its shape
  frame = requestAnimationFrame(follow);
};`;

const sections: readonly Section[] = [
  ['a-menu-with-a-lifted-stack', 'A menu with a lifted stack'],
  ['the-stack', 'The stack'],
  ['lifting-the-trigger', 'Lifting the trigger'],
  ['opening-on-a-held-press', 'Opening on a held press'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/contextual-menu/architecture`: how it's built, and what flows into it. */
export const ContextualMenuArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A contextual menu is a <a href={publicUrl('menu')}>Menu</a> whose
        positioner holds a stack: what the menu is about, lifted above a dimmed
        page, and the menu below it. That’s either a preview of your own or the
        trigger itself. For using it, see its{' '}
        <a href={publicUrl('contextual-menu/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="a-menu-with-a-lifted-stack"
      level={2}
    >
      A menu with a lifted stack
    </Heading>
    <ul>
      <li>
        <PartLink part="ContextualMenu.Root" /> renders a{' '}
        <PartLink
          component="menu"
          part="Menu.Root"
        />{' '}
        and a context the other parts share: whether it’s open, whether a
        preview is given, the slot where it goes, the backdrop, and the
        trigger’s element.
      </li>
      <li>
        <PartLink part="ContextualMenu.Popup" /> and{' '}
        <PartLink part="ContextualMenu.Portal" /> are Menu’s, and its items are
        Menu’s parts. <PartLink part="ContextualMenu.Backdrop" /> is Base UI’s
        menu backdrop, registered with the root so the trigger can cut itself
        out of it.
      </li>
      <li>
        While it’s open, the root prevents the browser’s own context menu
        anywhere, since a held touch that opened it fires one as it lifts, where
        the trigger was before it moved away.
      </li>
    </ul>

    <Heading
      id="the-stack"
      level={2}
    >
      The stack
    </Heading>
    <ul>
      <li>
        <PartLink part="ContextualMenu.Positioner" /> is Menu’s positioner with
        a slot before the popup. It’s placed from the trigger’s top (its side
        offset is minus the trigger’s height), so the slot starts where the
        trigger is, and shifts as far as the whole stack needs to fit, also
        downwards (<code>sticky</code>).
      </li>
      <li>
        Without a preview, the slot takes the trigger’s size, measured when it
        opens. The stack’s two heights are published as custom properties (
        <code>useStackSizes</code>), so the stylesheet can let the menu scroll
        and give the preview what room is left.
      </li>
      <li>
        <PartLink part="ContextualMenu.Preview" /> portals its content into the
        slot while the menu is open, and tells the root a preview exists.
      </li>
    </ul>
    <CodeView code={stackCode} />

    <Heading
      id="lifting-the-trigger"
      level={2}
    >
      Lifting the trigger
    </Heading>
    <ul>
      <li>
        Without a preview, <PartLink part="ContextualMenu.Trigger" /> moves onto
        the slot: a translation from where it is, written as custom properties,
        and a <code>z-index</code> above the backdrop. The trigger stays in the
        page, so it keeps its state, and its wrapper keeps its place as the
        menu’s anchor.
      </li>
      <li>
        It follows the slot every frame while the menu is open, whether or not
        anything moves, since the slot can be placed, shifted or scrolled at any
        time. The same loop cuts the trigger’s shape out of the backdrop, so the
        page around it stays dimmed and the trigger doesn’t.
      </li>
      <li>
        A <code>z-index</code> only lifts it outside its ancestors’ stacking
        contexts. Inside one, such as a Viewport layer, it can’t rise above the
        backdrop; give it a preview there.
      </li>
    </ul>
    <CodeView code={liftCode} />

    <Heading
      id="opening-on-a-held-press"
      level={2}
    >
      Opening on a held press
    </Heading>
    <ul>
      <li>
        The trigger is Menu’s, opening on a secondary click by default: a right
        click, or a touch held. With <code>openOn</code> set to click, a press
        opens it too, and a secondary click still does.
      </li>
      <li>
        A held touch lifts the trigger away from under the finger, so Base UI
        sees the pointer released off it and cancels the opening. The root
        cancels that cancellation, so the menu stays open as the finger lifts.
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
        <strong>From Menu:</strong> the root, trigger, positioner, popup,
        portal, items, dragging over items, and its growth.
      </li>
      <li>
        <strong>From Base UI:</strong> the backdrop.
      </li>
      <li>
        <strong>Out:</strong> its backdrop’s look to a{' '}
        <a href={publicUrl('grid')}>Grid</a>’s item opened above the page, which
        uses its stylesheet’s backdrop class. The cutout itself (
        <code>cutOut</code>, <code>fillIn</code>) is a shared utility both use.
      </li>
    </ul>
  </>
);
