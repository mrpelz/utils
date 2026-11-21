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
        positioner holds a stack. On top is what the menu is about, lifted above
        a dimmed page. The menu sits below it. What’s lifted is either a preview
        of your own, or the trigger itself. To learn how to use it, see its{' '}
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
        />
        . It also provides a context that the other parts share. The context
        says whether the menu is open and whether there’s a preview, and holds
        the slot where the preview goes, the backdrop, and the trigger’s
        element.
      </li>
      <li>
        <PartLink part="ContextualMenu.Popup" /> and{' '}
        <PartLink part="ContextualMenu.Portal" /> are Menu’s, and so are the
        items.
      </li>
      <li>
        <PartLink part="ContextualMenu.Backdrop" /> is Base UI’s menu backdrop.
        It registers with the root, so the trigger can cut itself out of it.
      </li>
      <li>
        While the menu is open, the root prevents the browser’s own context menu
        everywhere. That’s because a held touch that opened the menu fires one
        as it lifts, at the place where the trigger was before it moved away.
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
        <PartLink part="ContextualMenu.Positioner" /> is Menu’s positioner, with
        a slot before the popup.
      </li>
      <li>
        The positioner is placed from the trigger’s top. Its side offset is
        minus the trigger’s height, so the slot starts exactly where the trigger
        is. It shifts as far as the whole stack needs to fit, downward too (
        <code>sticky</code>).
      </li>
      <li>
        Without a preview, the slot takes the trigger’s size, measured when the
        menu opens.
      </li>
      <li>
        The heights of the stack’s two parts are published as custom properties
        (<code>useStackSizes</code>). The stylesheet uses them to let the menu
        scroll, and to give the preview the room that’s left.
      </li>
      <li>
        <PartLink part="ContextualMenu.Preview" /> portals its content into the
        slot while the menu is open. It also tells the root that a preview
        exists.
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
        the slot. It’s moved by a translation from where it is, written as
        custom properties, and raised above the backdrop by a{' '}
        <code>z-index</code>.
      </li>
      <li>
        The trigger stays in the page, so it keeps its state. Its wrapper keeps
        its place, and stays the menu’s anchor.
      </li>
      <li>
        While the menu is open, the trigger follows the slot every frame,
        whether or not anything moves. The slot can be placed, shifted or
        scrolled at any time. The same loop cuts the trigger’s shape out of the
        backdrop, so the page around it stays dimmed and the trigger doesn’t.
      </li>
      <li>
        A <code>z-index</code> only lifts the trigger above things outside its
        ancestors’ stacking contexts. Inside one, such as a Viewport layer, it
        can’t rise above the backdrop. Give it a preview there.
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
        The trigger is Menu’s. By default, it opens on a secondary click: a
        right click, or a held touch. With <code>openOn</code> set to click, a
        normal press opens it too, and a secondary click still works.
      </li>
      <li>
        A held touch lifts the trigger away from under the finger. Base UI then
        sees the pointer released somewhere else, and cancels the opening. The
        root cancels that cancellation, so the menu stays open when you lift
        your finger.
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
        <strong>From Menu:</strong> the root, the trigger, the positioner, the
        popup, the portal, the items, dragging over items, and growing to fit.
      </li>
      <li>
        <strong>From Base UI:</strong> the backdrop.
      </li>
      <li>
        <strong>Out:</strong> its backdrop’s look, to a{' '}
        <a href={publicUrl('grid')}>Grid</a>’s item opened above the page. That
        item uses this stylesheet’s backdrop class. Both use the same shared
        utility for the cutout (<code>cutOut</code>, <code>fillIn</code>).
      </li>
    </ul>
  </>
);
