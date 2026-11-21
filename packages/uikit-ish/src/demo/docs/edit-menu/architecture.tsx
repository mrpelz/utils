import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/edit-menu/architecture`: how EditMenu is built, and what flows into it.

const treeCode = `<span class="uikit-edit-menu-hidden-trigger" aria-hidden="true" /> <!-- Base UI's -->
<div class="uikit-edit-menu-positioner">          <!-- at the anchor -->
  <div role="menu" class="uikit-edit-menu-popup uikit-glass-medium">
    <div class="uikit-edit-menu-actions" data-overflowing data-after> <!-- the fades -->
      <div class="uikit-edit-menu-scroller">
        <div role="menuitem" class="uikit-edit-menu-item"><span>Copy</span></div>
        …
        <div role="menuitem" class="uikit-edit-menu-more" aria-haspopup="menu" />
        <span class="uikit-utils-highlight" />      <!-- the selection -->
      </div>
    </div>
  </div>
</div>`;

const selectionCode = `// useKeepSelection, in short: WebKit clears a selection when focus moves
// away from it, which Base UI does by focusing the popup and its items.
// The selection's ranges are saved while the menu isn't focused, and put
// back whenever focus moves inside it (or one of its submenus).
document.addEventListener('selectionchange', () => {
  if (!inMenu(document.activeElement)) ranges = getRanges(document.getSelection());
});
document.addEventListener('focusin', ({ target }) => {
  if (!inMenu(target)) return;
  const selection = document.getSelection();
  if (!selection.isCollapsed || ranges.length === 0) return;
  selection.removeAllRanges();
  for (const range of ranges) selection.addRange(range);
});`;

const sections: readonly Section[] = [
  ['a-menu-without-a-trigger', 'A menu without a trigger'],
  ['keeping-the-selection', 'Keeping the selection'],
  ['the-capsule', 'The capsule'],
  ['touches-drag', 'Touches drag'],
  ['the-selection-as-an-anchor', 'The selection as an anchor'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/edit-menu/architecture`: how it's built, and what flows into it. */
export const EditMenuArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        An edit menu is a Base UI menu, laid out as a row of actions in a glass
        capsule. Your app opens it at an anchor, such as a text selection. Most
        of its own code keeps that selection alive while you use the menu. To
        learn how to use it, see its{' '}
        <a href={publicUrl('edit-menu/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="a-menu-without-a-trigger"
      level={2}
    >
      A menu without a trigger
    </Heading>
    <ul>
      <li>
        <PartLink part="EditMenu.Root" /> is Base UI’s menu root, horizontal and
        not modal. The page stays usable, and a press outside the menu reaches
        the page as the menu closes. That way, the press can clear the
        selection, for example.
      </li>
      <li>
        Base UI only places a menu for a trigger element, so the root renders a
        hidden, inert one. Your app opens the menu with <code>open</code>.
      </li>
      <li>
        <PartLink part="EditMenu.Positioner" /> is Base UI’s. By default, it
        places the menu 8px above its anchor. The menu stays inside its
        container and clear of the safe areas, and it grows instead of
        scrolling, as a popover does.
      </li>
      <li>
        The positioner closes the menu when its anchor or the capsule leaves the
        view (<code>useCloseOutOfView</code>, from Menu).
      </li>
      <li>
        <PartLink part="EditMenu.Item" /> is Base UI’s item. It has a divider
        before it, which hides next to the highlighted item. It can have a
        destructive color.
      </li>
      <li>
        <PartLink part="EditMenu.More" /> is Base UI’s submenu trigger. It opens
        on a press, not on hover, and a second press closes its submenu.
      </li>
      <li>
        That submenu is a regular{' '}
        <PartLink
          component="menu"
          part="Menu.Popup"
        />{' '}
        below the capsule. <PartLink part="EditMenu.SubmenuRoot" /> and{' '}
        <PartLink part="EditMenu.Portal" /> are Menu’s. The root shares Menu’s
        handling of submenus, so a press in a submenu doesn’t close the whole
        menu.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="keeping-the-selection"
      level={2}
    >
      Keeping the selection
    </Heading>
    <ul>
      <li>
        Base UI focuses the popup when it opens, and each item as it’s
        highlighted. WebKit clears a selection when focus moves away from it,
        which would take the menu’s anchor away.
      </li>
      <li>
        So the popup saves the selection’s ranges while focus is somewhere else.
        Whenever focus moves into the menu or one of its submenus, it puts them
        back.
      </li>
    </ul>
    <CodeView code={selectionCode} />

    <Heading
      id="the-capsule"
      level={2}
    >
      The capsule
    </Heading>
    <ul>
      <li>
        <PartLink part="EditMenu.Popup" /> uses the menus’ glass (
        <code>uikit-glass-medium</code>). It scales in the way menus do, and
        takes its color scheme from the tone of its glass.
      </li>
      <li>
        The actions sit in a row that only becomes a scroller when they
        overflow. Otherwise, their content blends with the glass.
      </li>
      <li>
        The popup positions the “more” button outside the scroller, so actions
        never scroll beneath it.
      </li>
      <li>
        An intersection observer watches the first and the last action. It marks
        whether there are more actions before or after the ones in view, for the
        fades at the ends.
      </li>
      <li>
        The selection is one pill that moves from action to action (
        <code>MovingHighlight</code>). The actions don’t each draw their own.
      </li>
    </ul>

    <Heading
      id="touches-drag"
      level={2}
    >
      Touches drag
    </Heading>
    <ul>
      <li>
        A touch in the menu or its submenus never reaches the page. On iOS, a
        tap there would clear the selection. So the touch’s default is
        prevented, and it drags over the items instead (
        <code>dragOverItems</code>, from Menu). The item under your finger is
        highlighted, and chosen when you lift it. Even the “more” button opens
        this way.
      </li>
      <li>When you hold your finger near an end, the actions scroll.</li>
      <li>
        A sideways swipe that starts on overflowing actions, before the
        highlight’s drag begins, pans them instead. When you let go, they keep
        moving for a moment. Nothing is chosen.
      </li>
    </ul>

    <Heading
      id="the-selection-as-an-anchor"
      level={2}
    >
      The selection as an anchor
    </Heading>
    <ul>
      <li>
        <PartLink part="useSelectionAnchor" /> returns the text selection in an
        element as an anchor for the positioner, once you’ve finished making it.
        That’s when you release the pointer, or after a pause. The pause covers
        keys, and touch, whose selection handles cancel the pointer.
      </li>
      <li>
        Changes that keep the same range are ignored, such as the menu putting
        the selection back. A press on a menu keeps the anchor. Any other press
        clears it.
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
        <strong>From Base UI:</strong> the menu, its items, the keyboard and the
        placement.
      </li>
      <li>
        <strong>From Menu:</strong> the submenu’s parts, submenu handling,
        dragging over items, closing out of view, and growing to fit.
      </li>
      <li>
        <strong>From Glass:</strong> the capsule’s material and tone.
      </li>
      <li>
        <strong>From the app:</strong> when it’s open, and its anchor.
      </li>
    </ul>
  </>
);
