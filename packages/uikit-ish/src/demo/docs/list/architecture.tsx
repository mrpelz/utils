import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/list/architecture` and its sub-pages: how List is built, and what flows
// into it.

const treeCode = `<div class="uikit-list-root" data-list-style="insetGrouped">
  <section class="uikit-list-section">
    <div class="uikit-list-header">…</div>
    <ul class="uikit-list-group">
      <li class="uikit-list-item" data-edit-leading="off">  <!-- the row's box -->
        <div class="uikit-list-track">                      <!-- room to swipe -->
          <div class="uikit-list-pin" />                   <!-- its swipe actions -->
          <div class="uikit-list-row">                      <!-- its slots, a grid -->
            <span class="uikit-list-leading">…</span>
            <span class="uikit-list-content">
              <span class="uikit-list-title">…</span>
            </span>
            <span class="uikit-list-trailing">…</span>
          </div>
        </div>
      </li>
      …
    </ul>
    <div class="uikit-list-footer">…</div>
  </section>
  <span class="uikit-list-index-anchor"><nav class="uikit-list-index">…</nav></span>
</div>`;

const expandCode = `// useExpandedRow, in short: a collapsible's rows open and close each by
// its own height, from what it is now, then are marked closed and inert.
const from = isOpen ? closed : box(item);   // { height, paddingTop, paddingBottom }
if (isOpen) settle();                       // shown, to be measured
const to = isOpen ? box(item) : closed;
item.style.overflow = 'clip';
item.animate([{ ...from, opacity: isOpen ? 0 : 1 }, { ...to, opacity: isOpen ? 1 : 0 }],
  { duration: 300, easing: 'ease' }).finished.then(done);`;

const sections: readonly Section[] = [
  ['sections-groups-and-rows', 'Sections, groups and rows'],
  ['a-row-is-slots', 'A row is slots'],
  ['pressable-rows', 'Pressable rows'],
  ['edit-modes', 'Edit modes'],
  ['collapsible-rows', 'Collapsible rows'],
  ['the-index', 'The index'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/list/architecture`: how it's built, and what flows into it. */
export const ListArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A list is a set of sections with rows. Each row is a grid of slots. Its
        stylesheet does most of the work, driven by custom properties and
        attributes. Three larger sub-systems have pages of their own:{' '}
        <a href={publicUrl('list/architecture/reordering')}>Reordering</a>,{' '}
        <a href={publicUrl('list/architecture/selection')}>Selection</a> and{' '}
        <a href={publicUrl('list/architecture/swipe-actions')}>Swipe actions</a>
        . To learn how to use it, see its{' '}
        <a href={publicUrl('list/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="sections-groups-and-rows"
      level={2}
    >
      Sections, groups and rows
    </Heading>
    <ul>
      <li>
        <PartLink part="List.Root" /> sets its <code>listStyle</code> and{' '}
        <code>outline</code> as attributes. The styles are inset grouped, the
        default, grouped, and plain. The other parts read the style from custom
        properties. Outside a root, they fall back to inset grouped.
      </li>
      <li>
        <PartLink part="List.Section" /> holds an optional{' '}
        <PartLink part="List.Header" />, a <PartLink part="List.Group" /> of
        rows or a <PartLink part="List.Block" /> of text, and a{' '}
        <PartLink part="List.Footer" />.
      </li>
      <li>
        A group is a <code>ul</code>, and its rows are <code>li</code>s. It
        clips swiped rows sideways only.
      </li>
      <li>
        In a plain list, the section titles are sticky and opaque. Its sections
        snap to the top of a scroll container that snaps.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="a-row-is-slots"
      level={2}
    >
      A row is slots
    </Heading>
    <ul>
      <li>
        <PartLink part="List.Item" /> renders its box, a track it can be swiped
        in, and the row itself.
      </li>
      <li>
        The row is a grid that only holds slots:{' '}
        <PartLink part="List.Leading" />, <PartLink part="List.Content" />,{' '}
        <PartLink part="List.Trailing" />, <PartLink part="List.Span" /> and{' '}
        <PartLink part="List.Below" />. Anything else placed directly in a row
        gets a console warning, once per row.
      </li>
      <li>
        Everything that isn’t leading, a title or a subtitle counts as trailing,
        with 16px between items. Controls up to 36px high fit a regular row.
      </li>
      <li>
        A row with a <PartLink part="List.Subtitle" /> is tall. Both heights are
        minimums, and grow with wrapping text.
      </li>
      <li>
        <PartLink part="List.Below" /> is a line under the row’s line. It starts
        where the row’s content starts. That start is measured into a custom
        property, again whenever the row’s parts resize. When it’s hidden, it
        collapses.
      </li>
      <li>
        The other parts are elements with a part attribute:{' '}
        <PartLink part="List.Title" />, <PartLink part="List.Detail" />,{' '}
        <PartLink part="List.Image" />, <PartLink part="List.Accessory" />,{' '}
        <PartLink part="List.Checkmark" />, <PartLink part="List.DrillIn" />,{' '}
        <PartLink part="List.Disclosure" />, <PartLink part="List.Text" />,{' '}
        <PartLink part="List.Supertitle" />, <PartLink part="List.Action" /> and{' '}
        <PartLink part="List.Button" />. Glyphs are drawn as SVG strokes and
        borders.
      </li>
    </ul>

    <Heading
      id="pressable-rows"
      level={2}
    >
      Pressable rows
    </Heading>
    <ul>
      <li>
        A row is pressable when its title renders a link or a button. The
        title’s hit area then covers the row, beneath the trailing controls.
      </li>
      <li>
        A row with its own click handler is pressable too. It’s marked as
        pressed, unless the press is on one of its own controls.
      </li>
      <li>
        <code>forwardClick</code> passes a row’s click on to a control inside
        it, such as a switch, unless the click was the control’s own.
      </li>
      <li>
        It dispatches the click as it was, a pointer’s or a keyboard’s. A
        control’s <code>click()</code> would count as a keyboard click, and
        menus would open with their first item highlighted.
      </li>
      <li>
        Rows, actions and buttons can take a secondary click: a right click, or
        a held touch.
      </li>
    </ul>

    <Heading
      id="edit-modes"
      level={2}
    >
      Edit modes
    </Heading>
    <ul>
      <li>
        <code>editing</code> can be set on the root, a section, a group or a
        row. Each one inherits the setting around it unless it has its own.
      </li>
      <li>
        Each row marks its leading and trailing side as editing, not editing, or
        not managed. Its parts react to that by their <code>whileEditing</code>.
      </li>
      <li>
        In a managed row, the leading and trailing slots slide in and out, and
        the content makes room. Each slot’s width is measured into a custom
        property, again whenever it resizes. That happens before the row is
        first shown, so nothing slides from an unmeasured size.
      </li>
      <li>
        <PartLink part="List.EditButton" /> is a remove or add button, in a
        circle of its tint. When a <PartLink part="List.SwipeActionsTrigger" />{' '}
        renders it, it opens the row’s actions.
      </li>
    </ul>

    <Heading
      id="collapsible-rows"
      level={2}
    >
      Collapsible rows
    </Heading>
    <ul>
      <li>
        <PartLink part="List.CollapsibleRoot" />,{' '}
        <PartLink part="List.CollapsibleTrigger" /> and{' '}
        <PartLink part="List.CollapsiblePanel" /> are shaped like Base UI’s
        Collapsible. <PartLink part="List.AccordionRoot" /> and{' '}
        <PartLink part="List.AccordionItem" /> are shaped like its Accordion.
      </li>
      <li>
        None of them renders an element. A group’s rows have to stay its
        children, because a list has no other elements among its rows.
      </li>
      <li>
        The trigger is a button, or whatever it renders, such as a row’s title.
        It has <code>aria-expanded</code>, and <code>aria-controls</code> lists
        the ids of the panel’s rows.
      </li>
      <li>A panel inside another panel closes along with it.</li>
      <li>
        Each row animates its own height and padding over 300ms. Its open height
        is measured as it opens. When it closes, the row is marked closed once
        its animation finishes, so a scroll container doesn’t scroll back as the
        content shrinks. Closed rows are inert.
      </li>
      <li>
        <code>useCollapsible</code> and <code>useExpandedOpen</code> let a
        control open its own rows, or close along with them, as a{' '}
        <a href={publicUrl('date-picker')}>Date Picker</a> does.
      </li>
    </ul>
    <CodeView code={expandCode} />

    <Heading
      id="the-index"
      level={2}
    >
      The index
    </Heading>
    <ul>
      <li>
        The stylesheet places <PartLink part="List.Index" /> at the list’s end
        edge. It’s sticky and centered on the part of the list that’s in view,
        above a plain list’s sticky titles.
      </li>
      <li>
        You scrub it with one pointer (<code>usePointerDrag</code>). It clicks
        each <PartLink part="List.IndexItem" /> once as the pointer reaches it,
        with no text selected meanwhile.
      </li>
      <li>
        An item jumps at once to the first section or row with its value. If
        there’s none, it uses the next value after it that has one. It scrolls
        that section to the top of its scroll container, below the scroll
        padding, for example under a page’s bar.
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
        <strong>From Base UI:</strong> the checkbox and the radio, and the
        shapes of Collapsible and Accordion.
      </li>
      <li>
        <strong>From the library’s utilities:</strong> the drag, edge scrolling
        and secondary clicks.
      </li>
      <li>
        <strong>Out:</strong> its rows hold a{' '}
        <a href={publicUrl('text-field')}>Text Field</a>, a{' '}
        <a href={publicUrl('date-picker')}>Date Picker</a>, an{' '}
        <a href={publicUrl('activity-view')}>Activity View</a>’s actions, a{' '}
        <a href={publicUrl('color-picker')}>Color Picker</a>’s named colors and{' '}
        <PartLink
          component="control-cards"
          part="ControlCards.List"
        />
        . Its collapsible rows are what{' '}
        <a href={publicUrl('collapsible')}>Collapsible</a> and{' '}
        <a href={publicUrl('accordion')}>Accordion</a> use inside a list. Cards
        use <code>forwardClick</code>, and <a href={publicUrl('grid')}>Grid</a>{' '}
        uses <code>reorder</code>.
      </li>
    </ul>
  </>
);

const sessionCode = `// createSession, in short: the grabbed rows lift (their room closing, a
// gap opening where they were), follow the pointer stacked behind the
// first, and open the gap nearest them; near an end, the scroller scrolls.
const followPointer = (pointer, time) => {
  scroller.scrollTop += edgeScrollDelta(pointer.clientY, top, bottom, elapsed);
  const lead = pointer.clientY - pointer.offset;
  place(items.map((_, index) => lead + index * stackOffset)); // eased in
  choose(contentY(scroller, lead) + heights[0] / 2);           // a gap opens
};`;

const reorderSections: readonly Section[] = [
  ['a-handle-rows-and-targets', 'A handle, rows and targets'],
  ['gaps', 'Gaps'],
  ['lifted-and-moved', 'Lifted and moved'],
  ['dropped', 'Dropped'],
  ['keys-and-the-app', 'Keys and the app'],
];

/** `/list/architecture/reordering`: rows reordered by a handle. */
export const ListReorderingArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={reorderSections} />
    <ul className="demo-lead">
      <li>
        Rows are reordered by a handle, across groups and lists (
        <code>reorder.ts</code>). You can drag them by their grabbers, move them
        by keys, or move them from your app. The list never reorders itself. It
        reports a change, and your app reorders its data. For the rest of the
        list, see its <a href={publicUrl('list/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="a-handle-rows-and-targets"
      level={2}
    >
      A handle, rows and targets
    </Heading>
    <ul>
      <li>
        <PartLink part="List.createReorderHandle" /> makes a handle. Rows that
        you give it, with <code>reorderHandle</code> and named by their{' '}
        <code>dropName</code>, register with it while they’re mounted. So do
        targets. That way, the handle knows which rows it moves, and where they
        can go.
      </li>
      <li>
        A target can be a <PartLink part="List.DropTarget" />, an empty, hidden
        element that marks a gap where you place it.
      </li>
      <li>
        A target can also be a range of gaps, before, between and after its
        rows. That’s a <PartLink part="List.DropGroup" />, or a{' '}
        <PartLink part="List.Group" /> that has the handle. A drop group has no
        element of its own, only a marker for when it’s empty.
      </li>
      <li>
        A row can have several handles, in order of priority. Rows grabbed
        together move by the handles they all share. A target takes them by the
        first of those handles it has.
      </li>
    </ul>

    <Heading
      id="gaps"
      level={2}
    >
      Gaps
    </Heading>
    <ul>
      <li>
        When rows are grabbed, the handle’s targets are measured into gaps, top
        to bottom, in the scroller’s content, without the grabbed rows.
      </li>
      <li>
        Where several gaps meet at one place, only one is kept: a drop target
        first, then a drop group, then a group. A range’s end comes after its
        starts.
      </li>
      <li>
        A gap opens by a margin on the row after it, or by padding at the end of
        its container, as high as the grabbed rows. The layout makes room around
        it, so groups and what follows them move.
      </li>
      <li>Corners and separators follow the order on screen.</li>
      <li>
        Meanwhile, the rows’ groups, and the groups they can go to, stop
        clipping. So the lifted rows and their shadows show.
      </li>
    </ul>

    <Heading
      id="lifted-and-moved"
      level={2}
    >
      Lifted and moved
    </Heading>
    <ul>
      <li>
        <PartLink part="List.Grabber" /> captures the pointer, and the rows
        lift. Their room closes by a negative margin, and a gap opens where they
        were. Over 300ms, they gather into a stack behind the first row, 6px
        apart.
      </li>
      <li>
        On each frame, the rows follow the pointer by a translation, and the gap
        nearest their center opens. Near an end of the scroll container, it
        scrolls, faster the closer you get to the end (
        <code>edgeScrollDelta</code>).
      </li>
      <li>Escape puts the rows back.</li>
      <li>
        If the rows unmount in the meantime, the grab is dropped at once. If
        they’re already settling, the drop is kept.
      </li>
    </ul>
    <CodeView code={sessionCode} />

    <Heading
      id="dropped"
      level={2}
    >
      Dropped
    </Heading>
    <ul>
      <li>
        When you let go, the rows settle into the gap. Then the handle’s{' '}
        <code>onReorder</code> is called with what moved and where, and the drop
        is announced. That doesn’t happen when the rows were dropped where their
        order wouldn’t change.
      </li>
      <li>
        Your app reorders its data, for example with{' '}
        <PartLink part="List.reorder" />. That applies a change to a list of
        rows, or to several lists by name.
      </li>
      <li>
        Once the rows’ order in the document changes, they’re laid out as before
        at once. If the order doesn’t change, they slide back after 300ms.
      </li>
      <li>
        The click that ends a drag stays with the grabber, so the row doesn’t
        act on it.
      </li>
    </ul>

    <Heading
      id="keys-and-the-app"
      level={2}
    >
      Keys and the app
    </Heading>
    <ul>
      <li>
        When a grabber has focus, its arrow keys move its row to the previous or
        the next gap at once, and the move is announced. The grabber keeps
        focus, even when the row lands in another group as a new row.
      </li>
      <li>
        Your app can grab rows itself by their names (<code>grab</code>), for
        example several selected rows. They lift where the first one is.
      </li>
      <li>
        Their grabbers then drag them together. The arrow keys step them from
        gap to gap, until Enter or Space drops them. <code>move</code>,{' '}
        <code>drop</code> and <code>cancel</code> do the same from code.
      </li>
      <li>Only one grab can be under way at a time.</li>
    </ul>
  </>
);

const selectCode = `// dragToSelect, in short: once a press on a checkbox moves 8px, mostly
// vertically, the first checkbox flips, and every row between it and the
// one under the pointer takes its new state; rows dragged back over return.
const update = () => {
  const end = nearestTo(checkboxes, y);
  const [from, to] = start < end ? [start, end] : [end, start];
  for (const [index, each] of checkboxes.entries()) {
    const state = index >= from && index <= to ? target : original[index];
    if (states[index] === state) continue;
    states[index] = state;
    each.click();                       // Base UI's own toggling
  }
};`;

const selectionSections: readonly Section[] = [
  ['checkboxes-and-radios', 'Checkboxes and radios'],
  ['dragging-to-select', 'Dragging to select'],
];

/** `/list/architecture/selection`: selecting rows. */
export const ListSelectionArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={selectionSections} />
    <ul className="demo-lead">
      <li>
        Rows are selected by Base UI checkboxes or radios in their leading slot.
        You can also drag along the rows’ checkboxes to select many at once (
        <code>select.ts</code>). For the rest of the list, see its{' '}
        <a href={publicUrl('list/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="checkboxes-and-radios"
      level={2}
    >
      Checkboxes and radios
    </Heading>
    <ul>
      <li>
        <PartLink part="List.Checkbox" /> is a{' '}
        <PartLink
          component="checkbox"
          part="Checkbox.Root"
        />
        , marked as the row’s edit control. So it slides in and out with edit
        mode, by its <code>whileEditing</code>.
      </li>
      <li>
        <PartLink part="List.Radio" /> is Base UI’s radio, set up the same way.
        Its group is a Base UI radio group, which can render a{' '}
        <PartLink part="List.Group" />, for example.
      </li>
      <li>
        Their state is your app’s, controlled or not, as in Base UI. A row’s{' '}
        <code>selected</code> also marks it as current.
      </li>
    </ul>

    <Heading
      id="dragging-to-select"
      level={2}
    >
      Dragging to select
    </Heading>
    <ul>
      <li>
        With the root’s <code>dragToSelect</code>, which is on by default, a
        press on a checkbox is tracked.
      </li>
      <li>
        Once it moves 8px, mostly vertically, the first checkbox flips. Every
        row from it to the row under the pointer takes that new state. Rows you
        drag back over return to their earlier state.
      </li>
      <li>
        Each change is the checkbox’s own <code>click()</code>. So Base UI
        toggles it and calls <code>onCheckedChange</code>, controlled or not.
        Only checkboxes that are shown and enabled count.
      </li>
      <li>
        Near the ends of the scroll container, the list scrolls along, the way a
        text selection does, and the rows under the pointer change.
      </li>
      <li>
        When you let go, the press’s own click is swallowed, because the first
        checkbox has already flipped.
      </li>
      <li>
        The checkbox carries Base UI’s swipe ignore, so the drag doesn’t swipe a
        sheet away. It also prevents its touch moves, because iOS doesn’t always
        keep its <code>touch-action</code>.
      </li>
    </ul>
    <CodeView code={selectCode} />
  </>
);

const settleCode = `// settle, in short: at rest (scrollend, or 150ms quiet; not touched),
// the row is closed, open, or overswiped, and goes where it may rest.
const offset = offsetOf(item);                        // from the scroll position
const side = offset > 0 ? 'leading' : 'trailing';
if (Math.abs(offset) < 1) return restClosed(item);
if (overswipesNow(side) && Math.abs(offset) > arm) return settleOverswiped(side);
const nearest = restingDistance(side, Math.abs(offset)); // closed or open
if (Math.abs(Math.abs(offset) - nearest) >= 1) return scrollToTarget(nearest);
if (nearest === width) context.open(side);`;

const swipeSections: readonly Section[] = [
  ['a-row-that-scrolls', 'A row that scrolls'],
  ['actions-pinned-beneath', 'Actions pinned beneath'],
  ['coming-to-rest', 'Coming to rest'],
  ['overswiping', 'Overswiping'],
  ['the-mouse-and-the-keyboard', 'The mouse and the keyboard'],
];

/** `/list/architecture/swipe-actions`: rows swiped to show actions. */
export const ListSwipeActionsArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={swipeSections} />
    <ul className="demo-lead">
      <li>
        A row with swipe actions is a horizontal scroller. The browser scrolls
        it, with its own momentum and snapping, and the row reads where it came
        to rest. Its actions sit beneath it, and scale in from the scroll
        position alone. For the rest of the list, see its{' '}
        <a href={publicUrl('list/architecture')}>main page</a>.
      </li>
    </ul>

    <Heading
      id="a-row-that-scrolls"
      level={2}
    >
      A row that scrolls
    </Heading>
    <ul>
      <li>
        With <PartLink part="List.SwipeActions" /> in it, a row’s box scrolls
        sideways, without a scroll bar. Touch, trackpads and wheels all scroll
        it.
      </li>
      <li>
        Its track has room before and after the row for the actions. So the
        row’s offset is its scroll position.
      </li>
      <li>
        The track holds snap points: closed, open on each side, and, with
        overswiping, armed and across the whole row.
      </li>
      <li>
        Closed and open stop the row even when you flick it. So closing one side
        doesn’t open the other.
      </li>
      <li>
        Points are only shown or hidden at rest, or as a touch starts. Browsers
        snap at once when the points change during a scroll.
      </li>
      <li>
        The room grows at once, but only narrows at rest, and never to less than
        where the row is. While the row is open, the other side’s points are
        hidden. So scrolling past closed snaps it shut.
      </li>
      <li>
        While the row is swiped, it’s clipped to a path that’s rounded at the
        side its content leaves. So the content slides away beneath a round end.
      </li>
      <li>Only one row is open at a time.</li>
    </ul>

    <Heading
      id="actions-pinned-beneath"
      level={2}
    >
      Actions pinned beneath
    </Heading>
    <ul>
      <li>
        The actions are portaled into a layer beneath the row. That layer is as
        wide as the row, and sticky at the start of the scroll area. So it stays
        in place while the row scrolls, natively, on every frame.
      </li>
      <li>
        Each <PartLink part="List.SwipeAction" /> scales and fades in over the
        stretch of scroll that uncovers it, one after another from the edge.
      </li>
      <li>
        That’s a scroll-driven animation on the row’s own scroll timeline. Its
        range is set as custom properties when the row is laid out.
      </li>
      <li>
        Safari keeps running a reveal for its old range, so the reveal is
        restarted when the room changes.
      </li>
      <li>
        An action is a circle or a rounded rectangle as tall as the row, with an
        optional label. Clicking an action closes the actions.
      </li>
    </ul>

    <Heading
      id="coming-to-rest"
      level={2}
    >
      Coming to rest
    </Heading>
    <ul>
      <li>Nothing is decided while the row scrolls.</li>
      <li>
        It comes to rest on <code>scrollend</code>, or after 150ms without a
        scroll, with no touch down. Then it’s closed, open or overswiped. If iOS
        stopped it short, it goes to the nearest place it may rest.
      </li>
      <li>
        When the row opens or closes by itself, its snapping is off until it
        arrives. It’s brought back there if Safari’s snapping, or an early{' '}
        <code>scrollend</code>, fights the smooth scroll. A touch takes over.
      </li>
      <li>
        When a wheel or a trackpad scrolls the row open, it only counts as
        resting open once the wheel has been quiet for 300ms. That way, the same
        scroll doesn’t overswipe.
      </li>
      <li>
        <code>allowSwipe</code> can keep a side from being swiped open or
        closed. When it can’t be swiped open, its actions are inert while
        closed. When it can’t be swiped closed, it reopens, and ignores presses
        outside while open.
      </li>
    </ul>
    <CodeView code={settleCode} />

    <Heading
      id="overswiping"
      level={2}
    >
      Overswiping
    </Heading>
    <ul>
      <li>
        With <code>overswipe</code>, swiping past the actions stretches the
        outermost action from the edge up to the others. The others follow the
        row and fade.
      </li>
      <li>
        Past the arming distance, it’s armed. That’s about five actions’ width,
        or half the row on a narrow screen. When armed, its symbol moves to the
        row’s end, and its label hides.
      </li>
      <li>
        A touch or a mouse drag overswipes in one go. A wheel or a trackpad only
        overswipes once the row rests open. Swiped across the whole row, the
        outermost action pushes the others out.
      </li>
      <li>
        It only triggers once the scroll comes to rest across the row, so
        scrolling back disarms it. When it triggers, the outermost action is
        clicked, or <code>onOverswipe</code> is called and the row closes.
      </li>
    </ul>

    <Heading
      id="the-mouse-and-the-keyboard"
      level={2}
    >
      The mouse and the keyboard
    </Heading>
    <ul>
      <li>
        A mouse has no sideways scroll gesture here. So dragging moves the
        scroll position directly, once the mouse moves 8px sideways rather than
        down. Snapping is off and the pointer is captured.
      </li>
      <li>
        When you let go, the row opens if you dragged it past half the actions,
        or flicked it 10px toward them quickly. Otherwise it closes.
      </li>
      <li>
        Presses on the row’s own controls, such as a switch being dragged,
        aren’t taken.
      </li>
      <li>
        A tap on an open row closes it. So does a press outside it, or focus
        moving somewhere else. Focusing an action opens the actions.
      </li>
      <li>
        <PartLink part="List.SwipeActionsTrigger" /> opens a row’s actions and
        focuses the first one. It works from inside the row, or from anywhere
        with a handle (<PartLink part="List.createSwipeActionsHandle" />
        ). The actions attach to that handle while they’re mounted.
      </li>
    </ul>
  </>
);
