import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/popover/architecture`: how Popover is built, and what flows into it.

const treeCode = `<div class="uikit-popover-positioner uikit-viewport-keyboard-accessory">
  <div class="uikit-popover-popup uikit-glass-medium" data-arrow="top"
       style="--uikit-popover-outline-top: shape(…); --uikit-popover-nose: 120px; …">
    <!-- ::before: its backdrop blur, clipped to its outline -->
    <span class="uikit-popover-shape" aria-hidden="true">  <!-- its glow -->
      <span data-layer="fill" />
      <span data-layer="rim" />
      <span data-layer="highlight" />
    </span>
    <div class="uikit-popover-arrow" data-arrow="top" />  <!-- placed, not drawn -->
    <div class="uikit-popover-header">…</div>             <!-- a block-start anchor -->
    <div class="uikit-popover-body" data-viewport-scroller>…</div>
  </div>
</div>`;

const noseCode = `// Arrow, in short: Base UI places the arrow; the popup draws it. Its
// side and its center along the popup's edge are copied onto the popup
// whenever Base UI moves it.
const update = () => {
  const nose = arrowSide(arrow.dataset.side, isRightToLeft); // facing the anchor
  const along = arrow.offsetLeft + arrow.offsetWidth / 2;   // (top or bottom)
  popup.dataset.arrow = nose;                                // picks the outline
  popup.style.setProperty('--uikit-popover-nose', \`\${along}px\`);
};
new MutationObserver(update).observe(arrow, {
  attributeFilter: ['style', 'data-side', 'data-uncentered'],
});`;

const sections: readonly Section[] = [
  ['base-ui-s-popover', 'Base UI’s popover'],
  ['placing-it', 'Placing it'],
  ['the-arrow', 'The arrow'],
  ['its-material', 'Its material'],
  ['header-and-body', 'Header and body'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/popover/architecture`: how it's built, and what flows into it. */
export const PopoverArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A popover is Base UI’s popover, drawn as a panel of the same glass that
        menus use. It can have an arrow that points at whatever opened it. Most
        of the library’s own code does two things: it draws the arrow as part of
        the panel’s outline, and it lets the panel grow instead of scrolling. To
        learn how to use it, see its{' '}
        <a href={publicUrl('popover/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-popover"
      level={2}
    >
      Base UI’s popover
    </Heading>
    <ul>
      <li>
        <PartLink part="Popover.Trigger" />, <PartLink part="Popover.Title" />,{' '}
        <PartLink part="Popover.Description" />,{' '}
        <PartLink part="Popover.Close" /> and the other parts the library
        doesn’t wrap come straight from Base UI. Base UI handles opening,
        closing, focus and roles. <PartLink part="Popover.createHandle" /> is
        Base UI’s handle, for triggers that sit outside the popover.
      </li>
      <li>
        <PartLink part="Popover.Root" /> keeps the popover open when you press
        or focus something in a menu opened from it, such as a submenu. Base UI
        normally tells these presses apart from outside presses by following
        React’s events as they bubble through portals. Preact’s portals don’t
        bubble that way. So the root cancels any close whose target is inside a
        menu.
      </li>
      <li>
        <PartLink part="Popover.Portal" /> has no box of its own. It carries the
        settings of the place where the popover was opened.
      </li>
      <li>
        When the popover opens, <PartLink part="Popover.Popup" /> focuses its
        first focusable element without scrolling the page. When it’s opened by
        touch, it focuses nothing.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="placing-it"
      level={2}
    >
      Placing it
    </Heading>
    <ul>
      <li>
        <PartLink part="Popover.Positioner" /> is Base UI’s positioner. By
        default, it centers the popover 8px away from its anchor. With an arrow,
        the gap grows by the arrow’s depth.
      </li>
      <li>
        The popover stays inside its portal’s container and clear of the safe
        areas. Once the keyboard covers the bottom of the screen, it stays clear
        of the keyboard too (<code>useCollision</code>).
      </li>
      <li>
        When the room on its side is too small, the popover grows instead of
        scrolling. If it fits on neither side, it shifts over its anchor and
        takes as much height as the room allows (<code>useGrowAvoidance</code>
        ). Its arrow is hidden then, because it can no longer point from a side.
      </li>
      <li>
        The positioner renders a{' '}
        <PartLink
          component="viewport"
          part="Viewport.KeyboardAccessory"
        />
        . When you type into a field in the popover, the whole popover moves up
        above the keyboard.
      </li>
    </ul>

    <Heading
      id="the-arrow"
      level={2}
    >
      The arrow
    </Heading>
    <ul>
      <li>
        Base UI places <PartLink part="Popover.Arrow" />, but the arrow itself
        draws nothing. It copies its side and its center onto the popup, and the
        popup draws the arrow as part of its own outline. That way, the panel
        and the wedge are one surface, with one rim and one glow.
      </li>
      <li>
        The outlines are CSS <code>shape()</code> paths. They’re computed once
        for each side and set on the popup as custom properties. There’s one for
        the panel, and two rings inside it for the rim and the highlight. The
        wedge’s position along the edge is a custom property inside these paths.
      </li>
      <li>
        Near a corner, the wedge gets narrower instead of reaching into the
        corner. It stays at least 10px wide on either side of its center.
      </li>
      <li>
        The arrow is hidden when the popover is shifted over its anchor, or when
        Base UI can’t point it at the anchor’s center (<code>whenShifted</code>
        ). The popup then moves back as close as it would be without an arrow.
      </li>
    </ul>
    <CodeView code={noseCode} />

    <Heading
      id="its-material"
      level={2}
    >
      Its material
    </Heading>
    <ul>
      <li>
        The popover uses the menus’ glass (<code>uikit-glass-medium</code>). It
        doesn’t blend with what’s behind it, because a popup that’s transformed
        and animated can’t do that. It scales in from its anchor, the same way
        menus do.
      </li>
      <li>
        The backdrop blur sits on a pseudo-element clipped to the outline. On
        the popup itself, it would blur the popup’s own content. Without an
        arrow, the popup blurs by itself with rounded corners, because WebKit
        doesn’t draw a blur through a clip path.
      </li>
      <li>
        The fill, the rim and the highlight are three layers in a shape element,
        each clipped to its outline. A drop shadow on that element draws the
        glow along the whole outline, including the wedge. A box shadow couldn’t
        follow that shape.
      </li>
      <li>
        The popover’s color scheme follows the tone of its glass. Everything
        inside it uses that scheme, and so do the portals opened from it.
      </li>
    </ul>

    <Heading
      id="header-and-body"
      level={2}
    >
      Header and body
    </Heading>
    <ul>
      <li>
        The popup is a Viewport scope of its own. Its bars and edge effects are
        fixed to the popup, not to the screen. Since the popup isn’t at the
        screen’s edges, its safe area insets are zero inside it.
      </li>
      <li>
        <PartLink part="Popover.Header" /> registers as the bar at the top of
        that scope, with a soft edge effect by default.
      </li>
      <li>
        <PartLink part="Popover.Body" /> is the scroller under the header. It
        registers as an overlay’s scroller, and it’s the current scroller while
        the popover is open. Under the header, it fades out by a mask. Drawing
        glass on top of the popup’s glass would make it lighter.
      </li>
      <li>
        The popup itself can’t scroll, because its material and arrow are drawn
        around it. A tall popover scrolls its body instead.
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
        <strong>From Base UI:</strong> opening and closing, focus, roles, the
        placement, and where the arrow goes.
      </li>
      <li>
        <strong>From Viewport:</strong> the keyboard’s height, the keyboard
        accessory, a scope of its own, the header’s bar, the scroller and the
        edge effects.
      </li>
      <li>
        <strong>From Glass:</strong> the material, its tone, and the body’s
        glass mode.
      </li>
      <li>
        <strong>From Settings:</strong> the settings the portal carries.
      </li>
      <li>
        <strong>Out:</strong> an{' '}
        <a href={publicUrl('activity-view')}>Activity View</a> or a{' '}
        <a href={publicUrl('color-picker')}>Color Picker</a> can sit in a
        popover, and a <a href={publicUrl('date-picker')}>Date Picker</a> opens
        in one.
      </li>
    </ul>
  </>
);
