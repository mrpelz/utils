import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/grid/architecture` and its sub-pages: how Grid is built, and what flows
// into it.

const treeCode = `<div class="uikit-grid-root" style="--uikit-grid-columns: 3; --uikit-grid-unit: 118px; …">
  <section class="uikit-grid-section">                 <!-- a grid of its own -->
    <div class="uikit-grid-header">Lights</div>         <!-- across its columns -->
    <div class="uikit-grid-item" data-grid-part="item"> <!-- a cell: its area -->
      <div class="uikit-grid-item-body">                 <!-- its tile: its size -->
        <!-- e.g. a Card -->
      </div>
    </div>
    <div class="uikit-grid-spacer" data-grid-part="spacer" /> <!-- a deliberate hole -->
    <div class="uikit-grid-break" data-grid-part="break" />   <!-- the next row starts -->
    …
  </section>
</div>`;

const fitCode = `// fitOf, in short: an item's size is what it asked for, snapped to what
// it supports (the same shape first, then the closest area), then fitted
// to the columns. In an area, the area first, then the size within it.
const area = fit(snap(areaRequested, supported), columns);
const size = fit(snap(sizeRequested, supported), area);
// The area at least as big as what it shows.`;

const sections: readonly Section[] = [
  ['units-not-positions', 'Units, not positions'],
  ['cells', 'Cells'],
  ['sizes-and-areas', 'Sizes and areas'],
  ['corner-buttons-and-spawns', 'Corner buttons and spawns'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/grid/architecture`: how it's built, and what flows into it. */
export const GridArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A grid lays out items made of square units, in your app’s order, using
        CSS grid itself. Your app stores only the order and each item’s
        requested size. Where the items land follows from that. Its sub-systems
        have pages of their own.{' '}
        <a href={publicUrl('grid/architecture/layout')}>Layout</a> covers the
        columns, breaks and glides.{' '}
        <a href={publicUrl('grid/architecture/editing')}>Editing</a> covers
        moving and resizing.{' '}
        <a href={publicUrl('grid/architecture/motion')}>Motion</a> covers tiles
        that change their box, and items opened above the page. To learn how to
        use it, see its <a href={publicUrl('grid/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="units-not-positions"
      level={2}
    >
      Units, not positions
    </Heading>
    <ul>
      <li>
        <PartLink part="Grid.Root" /> has as many columns as fit its width at{' '}
        <code>unitSize</code>, stretched to fill it, and never fewer than{' '}
        <code>minColumns</code>. The rows are square.
      </li>
      <li>
        The columns and the unit are custom properties, set before the first
        paint at a new width. The grid isn’t shown until it’s been measured.
      </li>
      <li>
        Placement is CSS grid’s own, row by row. An item that doesn’t fit in the
        rest of a row starts the next row, and leaves a hole.
      </li>
      <li>
        <code>dense</code> fills earlier holes with later items. It doesn’t
        while editing, where a moved item stays where you put it.
      </li>
      <li>
        Items never have positions of their own. So a grid can’t end up with a
        layout your app didn’t ask for. When the width changes, the layout is
        simply worked out again.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="cells"
      level={2}
    >
      Cells
    </Heading>
    <ul>
      <li>
        <PartLink part="Grid.Item" /> is a cell that spans its area. Its tile
        sits inside it, and whatever is in the tile fills it, such as a{' '}
        <a href={publicUrl('card')}>Card</a>.
      </li>
      <li>
        <PartLink part="Grid.Spacer" /> is a deliberate hole of a size.
      </li>
      <li>
        <PartLink part="Grid.Break" /> starts a new row, by setting the next
        item’s column to the first. With more rows, it keeps the rows below it
        empty too (see{' '}
        <a href={publicUrl('grid/architecture/layout')}>Layout</a>).
      </li>
      <li>
        Spacers and breaks are outlined while editing, and moved the same way as
        items.
      </li>
      <li>
        <PartLink part="Grid.Section" /> is a grid of its own, on the same
        columns and unit. It has a <PartLink part="Grid.Header" /> across it,
        and its own <code>dense</code>.
      </li>
      <li>
        <PartLink part="Grid.DropGroup" /> is part of a section, with no
        element. The gaps between its cells are a target for its handles.
      </li>
    </ul>

    <Heading
      id="sizes-and-areas"
      level={2}
    >
      Sizes and areas
    </Heading>
    <ul>
      <li>
        An item’s <code>size</code> is a number of columns by rows, or a full
        width. It’s snapped to the item’s <code>supportedSizes</code>, looking
        at the same shape first and then the closest area, and then fitted to
        the columns.
      </li>
      <li>
        That effective size is what <PartLink part="useGridItem" /> gives to the
        item’s content, for example for a card’s level of detail. Its{' '}
        <code>sizeOf</code> tells what another requested size would come out as
        right now.
      </li>
      <li>
        <PartLink part="Grid.Area" /> gives an item room around its tile. The
        area takes the room in the layout. The tile sits inside it at its{' '}
        <code>placement</code>, and may be <code>movable</code>. The rest of the
        area is hatched while editing.
      </li>
      <li>
        An area renders no element. It registers with its item before it’s
        painted, and its controls go into the item’s cell.{' '}
        <PartLink part="useGridArea" /> reads it.
      </li>
      <li>
        A supported size that couldn’t fit the grid’s fewest columns and most
        rows means the layout can break. It gets a console warning.
      </li>
    </ul>
    <CodeView code={fitCode} />

    <Heading
      id="corner-buttons-and-spawns"
      level={2}
    >
      Corner buttons and spawns
    </Heading>
    <ul>
      <li>
        <PartLink part="Grid.CornerButton" /> is a 44px target in its cell’s
        corner. Its icon comes from the grid’s family of rounded outlines. When
        it’s hidden, it fades out and becomes inert.
      </li>
      <li>
        The grid’s own edit controls are corner buttons, shown while editing. A
        card’s corner buttons show while the grid isn’t editing.
      </li>
      <li>
        <PartLink part="Grid.Spawn" /> marks where your app adds an item. It’s a
        cell of a size, with a dashed tile and a button that fills it, placed
        the same way as an item. What it adds is up to your app.
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
        <strong>From the app:</strong> the order, each item’s size and area, and
        the changes to its data from reorders, resizes and removals.
      </li>
      <li>
        <strong>From List:</strong> how a change is applied to your app’s data.{' '}
        <PartLink part="Grid.reorder" /> is built on <code>List.reorder</code>.
      </li>
      <li>
        <strong>From Contextual Menu:</strong> the backdrop’s look and cutout,
        for an item opened above the page.
      </li>
      <li>
        <strong>Out:</strong> each tile’s effective size and editing state, to
        its content, and its box changes (<code>useGridItemLayout</code>).{' '}
        <a href={publicUrl('card')}>Card</a> and{' '}
        <a href={publicUrl('control-cards')}>ControlCards</a> use these.
      </li>
    </ul>
  </>
);

const columnsCode = `// layoutOf, in short: of the column counts around the unit's range, the
// one whose unit misses the range least, then the target; never fewer
// than minColumns (the units shrinking below the range then).
const [low, high] = unitRangeOf(min, target, max);
const missOf = (unit) =>
  [Math.max(0, low - unit, unit - high), Math.abs(unit - target)];
for (let count = fit(high) - 1; count <= fit(low) + 1; count += 1) {
  const miss = missOf(unitOf(width, gap, count));
  if (isBetter(miss, best)) [best, columns] = [miss, count];
}
columns = Math.max(columns, minColumns);`;

const layoutSections: readonly Section[] = [
  ['columns-for-a-width', 'Columns for a width'],
  ['breaks', 'Breaks'],
  ['the-end-of-line-column', 'The end-of-line column'],
  ['gliding', 'Gliding'],
  ['what-a-resize-takes-in', 'What a resize takes in'],
];

/** `/grid/architecture/layout`: columns, breaks and glides. */
export const GridLayoutArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={layoutSections} />
    <ul className="demo-lead">
      <li>
        A grid’s layout is CSS grid’s placement, plus what the script adds: the
        columns for a width, breaks placed by measuring, shapes drawn while
        editing, and everything gliding as the layout changes (
        <code>layout.ts</code>). For the rest of the grid, see its{' '}
        <a href={publicUrl('grid/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="columns-for-a-width"
      level={2}
    >
      Columns for a width
    </Heading>
    <ul>
      <li>
        The grid picks the number of columns whose unit stays between{' '}
        <code>unitMin</code> and <code>unitMax</code>, and is nearest{' '}
        <code>unitSize</code>. It never has fewer than <code>minColumns</code>.
        When it has to keep that many, the units shrink below their range.
      </li>
      <li>There are no device classes. Only the width counts.</li>
      <li>
        The columns are kept while their unit stays in range, with the units
        stretching along. As soon as the unit leaves the range, the columns
        change, and the items glide to their new places.
      </li>
    </ul>
    <CodeView code={columnsCode} />

    <Heading
      id="breaks"
      level={2}
    >
      Breaks
    </Heading>
    <ul>
      <li>A break of one row only starts the next row.</li>
      <li>
        A break of more rows also keeps the rows below it empty. Fillers, one
        row each, are placed right after it, in the other free runs of those
        rows. So whatever follows starts below them.
      </li>
      <li>
        Breaks are placed in order, each by measuring what comes before it.
        That’s the same while editing or not.
      </li>
      <li>
        A break with no room left in its row starts in the row below, and is
        drawn from that row’s end. A break that keeps nothing empty takes no
        room.
      </li>
      <li>
        While editing, a break is drawn as one shape from where it starts to the
        grid’s end, with every corner rounded. The shape is an SVG path used as
        a clip path, so it’s drawn at once, with no image to decode.
      </li>
    </ul>

    <Heading
      id="the-end-of-line-column"
      level={2}
    >
      The end-of-line column
    </Heading>
    <ul>
      <li>
        While editing, the columns narrow, on every frame as it opens, to make
        room for an end-of-line column at the grid’s end.
      </li>
      <li>
        That column is where a break that ends a row is drawn, with its sign and
        its handle. It’s also where a resize can reach to make a tile a full
        width.
      </li>
      <li>
        A full-width item runs into that column with the upper half of its first
        row. The rest is cut away for a break that follows, by a clip path of
        its shape. The tile’s content and its controls stay clear of the cut.
      </li>
      <li>
        While editing, each section’s rows are outlined as one band, by a mask.
      </li>
    </ul>

    <Heading
      id="gliding"
      level={2}
    >
      Gliding
    </Heading>
    <ul>
      <li>
        When the layout changes, sections and cells glide from where they were
        to where they are. That happens when a cell is resized or moved, when a
        section’s height changes, or when the columns change.
      </li>
      <li>
        The glide uses FLIP: a translate animation added on top of any running
        one. A section carries its cells along. With reduced motion, everything
        moves at once.
      </li>
      <li>
        Some things don’t glide: the cell you’re dragging, one dropped in its
        area, and a tile that’s getting to a new box by itself (see{' '}
        <a href={publicUrl('grid/architecture/motion')}>Motion</a>).
      </li>
      <li>
        What’s on screen stays there. The first item that shows whole below the
        scroller’s bars is kept in place as the layout changes. The page is
        scrolled by as much before it’s painted, and the glide takes that into
        account.
      </li>
      <li>
        That item is only chosen again when you scroll. Toggling edit mode, or
        the width stretching on the same columns, keeps it in place too.
      </li>
    </ul>

    <Heading
      id="what-a-resize-takes-in"
      level={2}
    >
      What a resize takes in
    </Heading>
    <ul>
      <li>
        When an item or a spacer grows, it takes in every spacer it reaches, and
        any breaks that lie wholly inside what it grows over. A growing break
        takes in the breaks right before and after it.
      </li>
      <li>Items are never taken in. They reflow instead.</li>
      <li>
        Only cells your app can be told about and remove are taken in. That
        means they have a name and a remove button. Your app is told their
        names, and removes them (<code>GridSizeChangeDetails</code>).
      </li>
    </ul>
  </>
);

const dragCode = `// move, in short: a new place is taken only once the pointer has moved
// half a unit from where the last was taken, and has rested on it for
// 120ms: no back and forth between two places, the cells rearranged
// under it.
const isAway = !movedAt || distance(at, movedAt) >= unit * dragHysteresis;
if (!isAway || isSameSlot(next, slot)) return cancelCandidate();
if (drag.candidate && isSameSlot(next, drag.candidate)) return;
drag.candidate = next;
drag.timer = setTimeout(() => {
  show(drag.candidate);                      // the placeholder moves
  drag.movedAt = drag.at;
}, dragSettle);`;

const editSections: readonly Section[] = [
  ['edit-mode', 'Edit mode'],
  ['dragging-a-cell', 'Dragging a cell'],
  ['landing-on-an-empty-unit', 'Landing on an empty unit'],
  ['dropped', 'Dropped'],
  ['resizing', 'Resizing'],
  ['tiles-in-their-areas', 'Tiles in their areas'],
];

/** `/grid/architecture/editing`: moving and resizing cells. */
export const GridEditingArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={editSections} />
    <ul className="demo-lead">
      <li>
        While editing, you drag cells to wherever their reorder handle has a
        target, and resize them by their corners. As with List, the grid only
        reports changes, and your app applies them (<code>edit.ts</code>,{' '}
        <code>plan.ts</code>, <code>handle.ts</code>). For the rest of the grid,
        see its <a href={publicUrl('grid/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="edit-mode"
      level={2}
    >
      Edit mode
    </Heading>
    <ul>
      <li>
        <code>editing</code> marks the root.
      </li>
      <li>
        Clicks in cells are held back, except on their edit controls (
        <code>data-grid-edit-control</code>). So the content of a tile isn’t
        acted on. An item that’s open above the page closes.
      </li>
      <li>
        <PartLink part="Grid.createReorderHandle" /> makes a handle, as List’s
        does. You give it to cells (<code>Item</code>, <code>Spacer</code>,{' '}
        <code>Break</code>), and to where they can drop: the cells of a section
        or the root, or a drop group’s cells. A cell with several handles can
        drop wherever any of them is.
      </li>
      <li>
        The handle’s options say whether breaks and spacers may be added or
        changed, so a drop lands where it’s aimed.
      </li>
    </ul>

    <Heading
      id="dragging-a-cell"
      level={2}
    >
      Dragging a cell
    </Heading>
    <ul>
      <li>
        A mouse drags after 4px. A touch has to hold still for 200ms first, so a
        flick still scrolls.
      </li>
      <li>
        A lifted cell leaves the flow. It’s positioned where it was, and follows
        the pointer, wherever its section glides or the page scrolls.
      </li>
      <li>
        A placeholder of the cell’s size shows where it would land. The cells
        are shown in their new order by CSS <code>order</code>, since the order
        in the DOM is your app’s.
      </li>
      <li>
        The placeholder moves with some inertia. It only takes a new place once
        the pointer is half a unit away from where it last moved, and has rested
        for 120ms. So the cells don’t swap back and forth under it.
      </li>
      <li>
        Where the cell can’t go, the placeholder goes back home. Near the top or
        bottom of the scroller, beside its bars, the page scrolls.
      </li>
      <li>
        With the keyboard, Alt and an arrow key move the focused cell to the gap
        before or after it.
      </li>
    </ul>
    <CodeView code={dragCode} />

    <Heading
      id="landing-on-an-empty-unit"
      level={2}
    >
      Landing on an empty unit
    </Heading>
    <ul>
      <li>
        On the first cell of the row below, where the row before would otherwise
        take the cell back, a stand-in break fills that row. That way, the cell
        starts the row where you aimed it.
      </li>
      <li>
        On an empty unit, in a break’s rows or up to three rows below the range,
        a plan says what to add around the cell. It adds breaks and spacers as
        stand-ins, and says which break before it to shorten. So the cell lands
        there, and the cells after it stay where they are.
      </li>
      <li>
        The plan follows CSS grid’s own placement, in units, using the layout
        without the dragged cell.
      </li>
    </ul>

    <Heading
      id="dropped"
      level={2}
    >
      Dropped
    </Heading>
    <ul>
      <li>
        When you drop the cell, the placeholder goes away and the cell returns
        to the flow. The handle’s <code>onReorder</code> is called with the
        change, and what to add before and after it.
      </li>
      <li>
        Your app moves the cell, for example with{' '}
        <PartLink part="Grid.reorder" />, which also makes the added breaks and
        spacers through the handle’s factories. Your app renders the change
        before the next frame.
      </li>
      <li>
        The cell glides from where you let go. If it moved to another section,
        its new element is found by name, and that one glides instead.
      </li>
    </ul>

    <Heading
      id="resizing"
      level={2}
    >
      Resizing
    </Heading>
    <ul>
      <li>
        <PartLink part="Grid.ResizeHandle" /> is an arc in the bottom trailing
        corner, with a chevron that shows which way the tile can go.
      </li>
      <li>
        When you tap it or press a key, the tile goes to the next supported size
        that fits, and back round to the first.
      </li>
      <li>
        When you drag it, the tile grows or shrinks by as many units as you
        drag. A span only changes once you’re 0.2 of a unit past halfway. The
        new size is outlined while you hold it, and the grid only reflows once
        you release.
      </li>
      <li>
        A resize can reach past its row’s end into the next row, when a size one
        column wider is supported. From the start of a row, it can reach into
        the end-of-line column to make the tile a full width. The row change
        shows in that column as an outline with a return sign.
      </li>
      <li>
        <PartLink part="Grid.RemoveButton" /> is an x in the top leading corner.
        What it removes is up to your app.
      </li>
      <li>
        <PartLink part="Grid.AreaButton" /> gives an item without an area the
        next area up its supported sizes.
      </li>
      <li>Dragging from either of those buttons moves its cell instead.</li>
      <li>
        After a press, its own mouse events and click are swallowed, wherever
        they land. A touch aims at whatever is nearest, and could otherwise open
        a neighboring spawn’s menu.
      </li>
    </ul>

    <Heading
      id="tiles-in-their-areas"
      level={2}
    >
      Tiles in their areas
    </Heading>
    <ul>
      <li>
        In an area, a resize stays inside it. It’s outlined on the tile, nothing
        reflows, and nothing is taken in.
      </li>
      <li>
        When you drag past the area’s edge, the tile goes to at least the next
        size up. The area grows to the smallest supported area that holds it.
      </li>
      <li>
        You drag a <code>movable</code> tile within its area, holding it first
        on touch. The nearest of its placements is outlined. When you let go,
        the tile glides there. Its arrow keys step through the placements.
      </li>
      <li>
        If you hold the area’s hatched room instead of the tile, the whole item
        moves.
      </li>
      <li>
        While editing, a tile in a corner is inset away from its corner’s
        controls, but only along an axis that has room.
      </li>
    </ul>
  </>
);

const reshapeCode = `// reshape, in short: laid out at its new box already, the tile is drawn
// from its old one: its size, and a translate added to its own, by the
// grid's reflow timing, started a frame after the next.
const to = body.getBoundingClientRect();
body.style.setProperty('--uikit-grid-tile-width', px(to.width));
body.style.setProperty('--uikit-grid-tile-height', px(to.height));
const sizing = body.animate(
  [{ height: px(from.height), width: px(from.width) }, { height: px(to.height), width: px(to.width) }],
  { duration: reflowDuration, easing: reflowEasing },
);
const at = body.getBoundingClientRect();
const moving = body.animate(
  [{ translate: \`\${px(from.left - at.left)} \${px(from.top - at.top)}\` }, { translate: '0 0' }],
  { duration: reflowDuration, easing: reflowEasing, composite: 'add' },
);
startWithFrame(sizing, moving);`;

const motionSections: readonly Section[] = [
  ['a-tile-getting-to-a-new-box', 'A tile getting to a new box'],
  ['what-s-in-it-hears', 'What’s in it hears'],
  ['open-above-the-page', 'Open above the page'],
];

/** `/grid/architecture/motion`: tiles changing their box. */
export const GridMotionArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={motionSections} />
    <ul className="demo-lead">
      <li>
        A tile can change its box: expanded in place, moved in its area, opened
        above the page or closed. It’s laid out at the new box at once, and
        drawn getting there with the grid’s reflow timing (
        <code>reshape.ts</code>, <code>overlay.tsx</code>). For the rest of the
        grid, see its <a href={publicUrl('grid/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="a-tile-getting-to-a-new-box"
      level={2}
    >
      A tile getting to a new box
    </Heading>
    <ul>
      <li>
        The tile is laid out at its new box at once, and animated from its old
        one. The animation changes its size, and adds a translate on top of its
        own. Meanwhile, the tile is drawn above what’s around it.
      </li>
      <li>
        Whatever moved the tile before is given up, whether that was an earlier
        reshape or the grid’s glide. The animation starts from where those drew
        it.
      </li>
      <li>
        The animation starts a frame after the next, and is held at its start
        until then. So it runs from where it’s first drawn, however long the
        change itself took.
      </li>
      <li>
        The size the tile is getting to is set on it meanwhile. So its content,
        such as a card’s frame, can lay out at the new size from the start.
      </li>
      <li>
        The new box is read with the animations inside the tile set aside, such
        as a card’s last row growing, so it’s the box they’ll leave it at. A
        reshape that’s replaced leaves no size of its own behind.
      </li>
      <li>
        Until it starts, a reshape can be pointed at the box the tile has now (
        <code>retarget</code>), still from where it was. An item opening at its
        content’s size uses that (see below).
      </li>
      <li>
        This doesn’t happen while editing, where tiles are outlined and then
        resized at once. It doesn’t happen with reduced motion either.
      </li>
      <li>
        Once the tile has settled, the grid’s reflow records where it is,
        without gliding it there.
      </li>
    </ul>
    <CodeView code={reshapeCode} />

    <Heading
      id="what-s-in-it-hears"
      level={2}
    >
      What’s in it hears
    </Heading>
    <ul>
      <li>
        <PartLink part="useGridItemLayout" /> calls <code>onBeforeChange</code>{' '}
        before a change reaches the DOM. It uses a class component’s snapshot,
        which runs before any of the change, in React and Preact alike.
      </li>
      <li>
        It calls <code>onAfterChange</code> once the change is there, while the
        tile is still drawn at its old box. An animation library can then move
        its own parts from where they were. The tile’s own move belongs to the
        grid.
      </li>
      <li>
        It only works inside a <PartLink part="Grid.Item" />. The latest
        handlers are called, so they don’t need to be stable.
      </li>
    </ul>

    <Heading
      id="open-above-the-page"
      level={2}
    >
      Open above the page
    </Heading>
    <ul>
      <li>
        An item’s <code>open</code> lifts its tile’s body out of the grid. A
        stand-in keeps its place, so nothing reflows.
      </li>
      <li>
        The body moves to the middle of the screen at its open size, above the
        page dimmed with a{' '}
        <a href={publicUrl('contextual-menu')}>Contextual Menu</a>’s backdrop.
        It’s the live body, never remounted, so its content keeps its state.
        Getting there and back is a reshape.
      </li>
      <li>
        Along a <code>+</code> in its open size, the body’s CSS sizes it to its
        content: <code>max-content</code> wide or <code>auto</code> tall,
        between the item’s smallest supported size and the screen less its
        margins. The overlay reads that size to center it.
      </li>
      <li>
        It reads the size again a frame later, before the reshape starts. What’s
        in the body may render again after the open commit. Preact, for example,
        renders a context’s consumers later, such as a card’s rows. If the size
        changed, the body is centered anew and the reshape retargeted.
      </li>
      <li>
        While it’s open, a resize observer on the body follows its content as it
        changes, outside a reshape. It centers the body again and moves the
        cutouts with it.
      </li>
      <li>
        A{' '}
        <PartLink
          component="card"
          part="Card.Root"
        />{' '}
        open at a <code>+</code> height makes its frame a container of its width
        only. A container of its size has no height of its own to give, so the
        card would open at its smallest size.
      </li>
      <li>
        The backdrop is cut out where the body is, by a mask and a clip path, on
        every frame while it moves. So the body takes presses, even where its
        ancestors’ stacking contexts keep it below the backdrop.
      </li>
      <li>
        The body opens in the middle of the whole screen, over a floating column
        such as a sidebar. That column is cut out too, where the body overlaps
        it.
      </li>
      <li>
        A column the body will overlap is marked <code>data-overlaid</code> as
        soon as the item opens, and stays marked until it’s no longer cut out on
        the way back. Glass in it drops its shadow while it’s marked, because
        the cut would clip that shadow (see{' '}
        <a href={publicUrl('sidebar/architecture#its-glass-and-colors')}>
          Sidebar
        </a>
        ).
      </li>
      <li>
        An opaque underlay under the body, in the grid, keeps bright things
        beside it from showing through its glass.
      </li>
      <li>
        The open item is a modal dialog with a label. Focus moves onto it, and
        back when it closes, and Tab stays inside it. Escape or a press on the
        backdrop closes it, with the reason. Editing closes it too.
      </li>
      <li>
        <PartLink
          component="card"
          part="Card.OpenButton"
        />{' '}
        and{' '}
        <PartLink
          component="card"
          part="Card.CloseButton"
        />{' '}
        open and close it from its corners.
      </li>
    </ul>
  </>
);
