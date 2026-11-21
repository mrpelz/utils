import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/menu/architecture` and its sub-pages: how Menu is built, and what flows
// into it.

const treeCode = `<div class="uikit-menu-positioner">                <!-- Base UI's, grows -->
  <div role="menu" class="uikit-menu-popup uikit-glass-medium" data-size="compact">
    <div class="uikit-menu-quick-actions">…</div>
    <div role="group">
      <div class="uikit-menu-group-label">Sort by</div>
      <div role="menuitemradio" class="uikit-menu-item">
        <span class="uikit-menu-radio-item-indicator">…</span>
        <span class="uikit-menu-icon">…</span>
        <span class="uikit-menu-label">Name</span>
      </div>
      …
    </div>
    <div role="separator" class="uikit-menu-separator" />
    <div role="menuitem" class="uikit-menu-item" aria-haspopup="menu">
      …<span class="uikit-menu-chevron" aria-hidden="true">…</span>
    </div>
    <span class="uikit-utils-highlight" />          <!-- the selection -->
  </div>
</div>`;

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const orderCode = `// Popup, in short: with order="nearest", its items reversed when Base UI
// places it above its trigger, so the first is nearest the trigger. A
// group's label stays its first.
const ordered = order === 'nearest'
  ? (renderProps, state) => ({
      ...renderProps,
      children: (
        <MenuReversedContext.Provider value={state.side === 'top'}>
          {renderProps.children}
        </MenuReversedContext.Provider>
      ),
    })
  : render;`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const sections: readonly Section[] = [
  ['base-ui-s-menu', 'Base UI’s menu'],
  ['two-sizes', 'Two sizes'],
  ['placing-it', 'Placing it'],
  ['the-popup', 'The popup'],
  ['nearest-first', 'Nearest first'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/menu/architecture`: how it's built, and what flows into it. */
export const MenuArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A menu is Base UI’s menu, drawn in the menus’ glass, in a compact and a
        regular size. Its two larger sub-systems have pages of their own.{' '}
        <a href={publicUrl('menu/architecture/dragging-over-items')}>
          Dragging over items
        </a>{' '}
        covers how touches choose items.{' '}
        <a href={publicUrl('menu/architecture/submenus')}>Submenus</a> covers
        submenus. To learn how to use it, see its{' '}
        <a href={publicUrl('menu/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-menu"
      level={2}
    >
      Base UI’s menu
    </Heading>
    <ul>
      <li>
        Every part is Base UI’s, or renders one. Base UI handles the roles, the
        keyboard, highlighting, checkbox and radio state, filtering and focus.{' '}
        <PartLink part="Menu.createHandle" /> is Base UI’s handle.
      </li>
      <li>
        <PartLink part="Menu.Item" />, <PartLink part="Menu.LinkItem" />,{' '}
        <PartLink part="Menu.CheckboxItem" />,{' '}
        <PartLink part="Menu.RadioItem" /> and{' '}
        <PartLink part="Menu.SubmenuTrigger" /> add a <code>destructive</code>{' '}
        color and the item’s layout: a checkmark, a symbol, a label and
        subtitle, and a shortcut or a chevron.
      </li>
      <li>
        The indicators draw a checkmark by default. A popup with checkbox or
        radio items reserves the checkmark’s column in every item.
      </li>
      <li>
        <PartLink part="Menu.QuickActions" /> is a row of{' '}
        <PartLink part="Menu.QuickAction" /> tiles, each a Base UI item.{' '}
        <PartLink part="Menu.Shortcut" /> puts each glyph of a string in a cell
        of its own.
      </li>
      <li>
        <PartLink part="Menu.Group" />, <PartLink part="Menu.RadioGroup" />,{' '}
        <PartLink part="Menu.GroupLabel" /> and{' '}
        <PartLink part="Menu.Separator" /> are Base UI’s, styled.
      </li>
      <li>
        <PartLink part="Menu.Trigger" /> is Base UI’s. It opens on touch down
        instead of on a mouse down, and on a secondary click with{' '}
        <code>openOn</code>. Its touches drag over the items (see{' '}
        <a href={publicUrl('menu/architecture/dragging-over-items')}>
          Dragging over items
        </a>
        ).
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="two-sizes"
      level={2}
    >
      Two sizes
    </Heading>
    <ul>
      <li>
        <PartLink part="Menu.Root" /> passes its <code>size</code> to every
        popup through a context, together with the root’s actions. That way, its
        positioners can close the whole menu.
      </li>
      <li>
        In the compact size, items are 40px tall with 17px labels, inset 8px.
        Submenus open over their trigger, and cover the items below it. In the
        regular size, items are 36px tall with 15px labels, and submenus open
        beside their trigger.
      </li>
      <li>
        Popups are 238px to 280px wide in the compact size, and up to 320px in
        the regular size. Longer labels wrap. The popup’s corners are concentric
        with the item selections.
      </li>
    </ul>

    <Heading
      id="placing-it"
      level={2}
    >
      Placing it
    </Heading>
    <ul>
      <li>
        <PartLink part="Menu.Positioner" /> is Base UI’s. It places the menu 8px
        from its trigger. It flips it at most, and never moves it beside the
        trigger. The menu stays inside its portal’s container, clear of the safe
        areas (<code>useCollision</code>).
      </li>
      <li>
        A popup taller than the room beside its trigger grows over the trigger
        instead of scrolling. It only scrolls when it’s taller than the screen (
        <code>useGrowAvoidance</code>).
      </li>
      <li>
        The positioner closes the menu when its anchor or popup leaves the view
        (<code>useCloseOutOfView</code>). Base UI marks a hidden anchor, and an
        intersection observer watches the positioner. This only happens while
        the positioner’s own popup is open.
      </li>
      <li>
        <PartLink part="Menu.Portal" /> has no box of its own. It carries the
        settings of the place where the menu was opened.
      </li>
    </ul>

    <Heading
      id="the-popup"
      level={2}
    >
      The popup
    </Heading>
    <ul>
      <li>
        <PartLink part="Menu.Popup" /> uses the menus’ glass (
        <code>uikit-glass-medium</code>), and scales in from its trigger. Its
        color scheme follows the tone of its glass, and passes on to the
        submenus opened from it.
      </li>
      <li>
        The selection is one pill that moves between items (
        <code>MovingHighlight</code>). It marks the highlighted item. In a
        regular menu, it also marks the trigger of an open submenu.
      </li>
      <li>
        When the menu is closed by keys, focus returns to its trigger. When a
        pointer closes it, focus doesn’t return. Otherwise, Chrome would show a
        focus ring on a trigger that the popup had focused by script.
      </li>
    </ul>

    <Heading
      id="nearest-first"
      level={2}
    >
      Nearest first
    </Heading>
    <ul>
      <li>
        With <code>order</code> set to <code>nearest</code>, a popup placed
        above its trigger reverses its items. So the first item is still the one
        nearest the trigger.
      </li>
      <li>
        The side is Base UI’s, flipped or not. It’s passed down through a
        context from the popup’s render.
      </li>
      <li>
        The children are flattened first, fragments included, with their keys
        kept. A group reverses its own items, but keeps its label first. The
        scroller starts at its end, where the first item is.
      </li>
    </ul>
    <CodeView code={orderCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Base UI:</strong> the menu, its items, the keyboard, focus
        and the placement.
      </li>
      <li>
        <strong>From Glass and Settings:</strong> the material and its tone, and
        the portal’s settings.
      </li>
      <li>
        <strong>From the library’s utilities:</strong> collision, growth, the
        moving selection, edge scrolling and secondary clicks.
      </li>
      <li>
        <strong>Out:</strong> a{' '}
        <a href={publicUrl('contextual-menu')}>Contextual Menu</a> is a menu
        with a lifted stack. An <a href={publicUrl('edit-menu')}>Edit Menu</a>{' '}
        shares its submenu handling, dragging, closing out of view, and
        submenus. A <a href={publicUrl('popover')}>Popover</a> stays open for a
        press in a menu opened from it.
      </li>
    </ul>
  </>
);

const dragCode = `// dragOverItems, in short: the finger hovers items as a mouse would, so
// Base UI highlights only the one under it; released, that one is clicked.
const update = () => {
  const next = menuItemAt(finger.x, finger.y);   // the topmost menu there
  if (next === item) return;
  if (item && !isOpenSubmenuTrigger(item)) hover(item, false, finger);
  item = next;
  hover(item, true, finger);                     // pointerover/enter/move, mouse too
  if (isClosedSubmenuTrigger(item)) dwell = setTimeout(() => pressClick(item), 300);
};`;

const dragSections: readonly Section[] = [
  ['opening-on-touch-down', 'Opening on touch down'],
  ['hovering-as-a-mouse-would', 'Hovering as a mouse would'],
  ['submenus-on-the-way', 'Submenus on the way'],
  ['scrolling-and-panning', 'Scrolling and panning'],
  ['released', 'Released'],
];

/** `/menu/architecture/dragging-over-items`: touches choosing items. */
export const MenuDraggingArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={dragSections} />
    <ul className="demo-lead">
      <li>
        A touch on a menu’s trigger opens the menu, and then drags on over its
        items. The item under your finger is highlighted, and chosen where you
        lift your finger. That’s what Base UI does for a mouse pressed on the
        trigger. <code>dragOverItems</code> does this for menus, contextual
        menus and edit menus. For the rest of the menu, see its{' '}
        <a href={publicUrl('menu/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="opening-on-touch-down"
      level={2}
    >
      Opening on touch down
    </Heading>
    <ul>
      <li>
        Base UI opens a menu on a mouse down. On a touch, the trigger stops Base
        UI’s own handler. iOS touches have no size, and Base UI takes those for
        a screen reader’s, which would highlight the first item.
      </li>
      <li>
        The trigger prevents the touch’s default, so no mouse events are
        emulated afterwards. It presses the trigger with a synthetic mouse down
        instead. When the menu is already open, that closes it, as a mouse down
        does.
      </li>
      <li>
        A touch captures the pointer to the trigger. So the capture is released,
        and the items are hit-tested instead.
      </li>
      <li>
        When the touch ends, a synthetic mouse up on the trigger stops Base UI
        from letting a later tap choose an item twice.
      </li>
      <li>
        Nothing scrolls while you drag. Touch moves are prevented, and the
        document is marked as dragging.
      </li>
    </ul>

    <Heading
      id="hovering-as-a-mouse-would"
      level={2}
    >
      Hovering as a mouse would
    </Heading>
    <ul>
      <li>
        Each move finds the enabled item at your finger, in the topmost menu
        there, also beneath a modal menu’s backdrop.
      </li>
      <li>
        When your finger leaves an item and enters the next, the pointer and
        mouse events a mouse would cause are dispatched. They’re sent at your
        finger’s position, with some movement. That’s because Base UI keeps
        submenus open by the pointer’s path, and WebKit ignores moves without
        movement.
      </li>
      <li>
        The touch’s own moves and boundary events are kept from Base UI, which
        would end the hover on a touch move.
      </li>
    </ul>
    <CodeView code={dragCode} />

    <Heading
      id="submenus-on-the-way"
      level={2}
    >
      Submenus on the way
    </Heading>
    <ul>
      <li>
        Resting 300ms on a submenu’s trigger opens the submenu. That’s longer
        than Base UI’s hover delay, so a regular submenu that opens on hover has
        opened by then. Your finger can drag on into it.
      </li>
      <li>
        When your finger leaves an open submenu’s trigger and enters the
        submenu, the trigger’s hover doesn’t end. Ending it would make Base UI
        reset the submenu’s highlight.
      </li>
    </ul>

    <Heading
      id="scrolling-and-panning"
      level={2}
    >
      Scrolling and panning
    </Heading>
    <ul>
      <li>
        When you hold your finger near an end of a menu that scrolls, in either
        direction, the menu scrolls on every frame. It scrolls faster the closer
        you get to the end (<code>edgeScrollDelta</code>), and the item under
        your finger is found again.
      </li>
      <li>
        A touch can also start in a sideways scroller that overflows, such as an
        edit menu’s actions. If your finger moves sideways first, 8px within
        120ms, it pans the scroller instead, and nothing is chosen.
      </li>
      <li>
        When you let go after panning, the scroller keeps moving with your speed
        and eases out to rest at a snap position. It prefers a position that
        shows a peek of the items beyond. A new touch stops a scroller that’s
        still settling.
      </li>
    </ul>

    <Heading
      id="released"
      level={2}
    >
      Released
    </Heading>
    <ul>
      <li>
        When you lift your finger on an item, that item is clicked, with a click
        count of one. Base UI takes a click without a count for a screen
        reader’s.
      </li>
      <li>
        An open submenu’s trigger isn’t clicked, because that would close the
        submenu. The exception is when the touch began on that trigger while the
        submenu was already open.
      </li>
      <li>
        When you lift your finger outside every menu after dragging, the menu
        closes, as Base UI does for a mouse.
      </li>
      <li>
        For half a second afterwards, the touch’s emulated mouse down, mouse up
        and click are kept from their targets. iOS sends them despite the
        prevented default, and they would toggle the menu again.
      </li>
    </ul>
  </>
);

const submenuCode = `// SubmenuRoot, in short: a compact submenu (covering its parent) is
// tracked; a press outside it closes it alone, the innermost first.
onOpenChange={(isOpen, details) => {
  if (isTracked && !isOpen && details.reason === 'outside-press' &&
      submenus.closing(details.event)?.close !== toggle.close) {
    details.cancel();                          // not this one's to close
    return;
  }
  if (isTracked) isOpen ? submenus.add(toggle) : submenus.remove(toggle.close);
}}`;

const submenuSections: readonly Section[] = [
  ['where-they-open', 'Where they open'],
  ['a-press-outside', 'A press outside'],
  ['pressed-again', 'Pressed again'],
  ['portals-without-bubbling', 'Portals without bubbling'],
];

/** `/menu/architecture/submenus`: submenus, open and closed. */
export const MenuSubmenusArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={submenuSections} />
    <ul className="demo-lead">
      <li>
        A submenu is Base UI’s, opened by a <PartLink part="Menu.SubmenuRoot" />
        ’s <PartLink part="Menu.SubmenuTrigger" />. In the compact size, a
        submenu covers its parent. So a press outside it closes only the
        submenu, and its trigger closes it when you press it again. Edit menus
        share all of this. For the rest of the menu, see its{' '}
        <a href={publicUrl('menu/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="where-they-open"
      level={2}
    >
      Where they open
    </Heading>
    <ul>
      <li>
        In the compact size, a submenu opens below its trigger, over its
        parent’s items, as wide as the parent. It never flips above. It only
        shifts up over the trigger when there’s no room below.
      </li>
      <li>
        The trigger stays visible, with its chevron turned down, and the
        parent’s other items fade. The submenu draws no background of its own,
        because it would add to the parent’s glass.
      </li>
      <li>
        In the regular size, a submenu opens beside its trigger, aligned with
        its first item, and flips at most. An edit menu’s submenu opens below
        the capsule, at its end.
      </li>
      <li>
        The submenu root passes the size on, so an edit menu’s submenus take the
        edit menu’s size.
      </li>
    </ul>

    <Heading
      id="a-press-outside"
      level={2}
    >
      A press outside
    </Heading>
    <ul>
      <li>
        The root keeps a list of the open submenus that a press outside closes
        one at a time. That’s the compact submenus, or every submenu in an edit
        menu.
      </li>
      <li>
        The innermost submenu decides, once per press. Base UI tells each open
        menu about the press, and a mouse press even twice.
      </li>
      <li>
        Such a press, on the parent’s items, on the page or on a modal backdrop,
        is stopped at the window before anything else sees it, and its defaults
        are prevented. It closes the innermost submenu when you release the
        pointer. The mouse, touch and click events that follow are stopped too,
        for 600ms.
      </li>
    </ul>
    <CodeView code={submenuCode} />

    <Heading
      id="pressed-again"
      level={2}
    >
      Pressed again
    </Heading>
    <ul>
      <li>
        In the compact size, a submenu trigger opens on a press, not on hover. A
        compact menu has no hover. And Base UI ignores clicks on a submenu that
        hover opened, so moving away would close it.
      </li>
      <li>
        A press on the trigger of an open submenu closes it (
        <code>useSubmenuToggle</code>), because a compact submenu covers the
        parent’s other items.
      </li>
      <li>
        A mouse click within 400ms after hover opened the submenu keeps it open.
        That click was already on its way.
      </li>
    </ul>

    <Heading
      id="portals-without-bubbling"
      level={2}
    >
      Portals without bubbling
    </Heading>
    <ul>
      <li>
        A submenu renders in a portal. Base UI tells a press in a submenu apart
        from a press outside the menu by following React’s events as they bubble
        through portals.
      </li>
      <li>
        Preact’s portals don’t bubble that way. So the whole menu would close,
        for example when you toggle a checkbox item in a submenu.
      </li>
      <li>
        The root’s <code>onOpenChange</code> cancels a close from a press whose
        target is in any menu (<code>useKeepOpenInSubmenus</code>). A{' '}
        <a href={publicUrl('popover')}>Popover</a> does the same for menus
        opened from it.
      </li>
    </ul>
  </>
);
