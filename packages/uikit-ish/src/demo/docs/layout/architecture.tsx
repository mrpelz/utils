import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/layout/architecture`: how Layout is built, and what flows into it.

const floatingCode = `// useFloatingSize, in short: a floating column's visible size, published on
// its layout for the columns clear of it; while it slides, every frame.
const publish = (size) =>
  root.style.setProperty('--uikit-layout-floating-size', \`\${size}px\`);

const follow = () => {
  if (column.getAnimations().length === 0) return settle(); // slid
  publish(visibleSize(column, root));
  frame = requestAnimationFrame(follow);
};

/* style.css: a column clear of it insets its content by it. */
.uikit-layout-column[data-clear-floating] {
  --uikit-layout-inset-start: var(--uikit-layout-floating-size, 0px);
}`;

const openCode = `// useOpenTransition, in short: marked in the same commit as the change,
// unmarked once its own transitions have finished.
if (wasOpenShown !== isOpen) {
  setWasOpenShown(isOpen);
  setIsMoving(true);                       // data-moving, this render
}
useLayoutEffect(() => {
  root.toggleAttribute('data-transitioning', true);
  if (!isOpen) column.style.setProperty('--uikit-layout-column-closing-size', lastOpenSize);
  requestAnimationFrame(() =>
    Promise.allSettled(column.getAnimations().map((a) => a.finished)).then(() => {
      delete root.dataset.transitioning;
      setIsMoving(false);
      repaintScrollers(root);              // iOS's stale tiles redrawn
    }),
  );
}, [isOpen]);`;

const sections: readonly Section[] = [
  ['columns-in-a-row', 'Columns in a row'],
  ['resizing', 'Resizing'],
  ['opening-and-closing', 'Opening and closing'],
  ['floating-and-clear-of-it', 'Floating, and clear of it'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/layout/architecture`: how it's built, and what flows into it. */
export const LayoutArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A layout is a row of columns. Each column is its own screen for what’s
        inside it. CSS does the sizing, driven by custom properties. The script
        handles three things: resizing a column by its divider, opening and
        closing a column with a slide, and a floating column that the others
        keep clear of. To learn how to use it, see its{' '}
        <a href={publicUrl('layout/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="columns-in-a-row"
      level={2}
    >
      Columns in a row
    </Heading>
    <ul>
      <li>
        <PartLink part="Layout.Root" /> is a flex row that fills its container.
      </li>
      <li>
        Each <PartLink part="Layout.Column" /> takes a size, or shares the free
        space. Its size, minimum and maximum are custom properties for the
        stylesheet.
      </li>
      <li>
        Each column provides its own Viewport scope, and it’s the containing
        block for the fixed layers inside it. So a header’s bar in a column
        spans that column, not the whole screen. A{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />{' '}
        in a column scrolls on its own.
      </li>
      <li>
        Where columns have no background, what’s behind the layout shows
        through, for example a{' '}
        <PartLink
          component="viewport"
          part="Viewport.Background"
        />
        .
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
        A <code>resizable</code> column renders a divider at its end. The
        divider is a focusable element with the separator role. Its hit area is
        wider than the hairline you see.
      </li>
      <li>
        Dragging the divider captures the pointer. The column grows or shrinks
        by the distance you move toward its end, following the layout’s
        direction.
      </li>
      <li>
        With the keyboard, the arrow keys step the size, further with Shift.
        Home and End go to the column’s limits.
      </li>
      <li>
        The size is your app’s (<code>size</code>, reported by{' '}
        <code>onSizeChange</code>), or the column’s own. Either way, it’s always
        clamped to the minimum and maximum. For a flexible column, the current
        size is read from its box when a drag starts.
      </li>
      <li>
        With <code>closeOnDrag</code>, a drag that goes past half the minimum
        closes the column, and coming back past that point opens it again. The
        divider reports each change through <code>onOpenChange</code>, with the
        reason <code>divider-drag</code>. Closing also puts back the size from
        when the drag started.
      </li>
      <li>
        A closed column is inert, but not while the drag that closed it is still
        going on. Otherwise its divider would lose the pointer, and the column
        couldn’t open again within the same drag.
      </li>
    </ul>

    <Heading
      id="opening-and-closing"
      level={2}
    >
      Opening and closing
    </Heading>
    <ul>
      <li>
        A closed column is <code>inert</code> and slides out. A floating column
        slides off its edge. Other columns slide out by a negative margin at
        their size. The columns beside it take its place, and its content is
        never squeezed.
      </li>
      <li>
        A closing column keeps the size it had while open, for the slide. That
        size is observed while the column is open.
      </li>
      <li>
        Transitions only run while a column opens or closes. They don’t run when
        the column is first laid out, or when it’s resized.
      </li>
      <li>
        The column marks itself as moving in the same render as its change,
        before anything measures it. The layout is marked as transitioning until
        the column’s own animations have finished.
      </li>
      <li>
        Afterwards, each of the layout’s scrollers gets a layer for two frames,
        then loses it again. iOS keeps tiles it drew off screen as they were,
        and this redraws them at rest (see{' '}
        <a href={publicUrl('ios-quirks#layers-under-a-scroll')}>iOS Quirks</a>).
      </li>
    </ul>
    <CodeView code={openCode} />

    <Heading
      id="floating-and-clear-of-it"
      level={2}
    >
      Floating, and clear of it
    </Heading>
    <ul>
      <li>
        A <code>floating</code> column sits over the others at the layout’s
        start. The other columns span the whole layout underneath it.
      </li>
      <li>
        The floating column publishes how much of it is visible as{' '}
        <code>--uikit-layout-floating-size</code> on the layout. It updates that
        as it’s resized, and on every frame while it slides.
      </li>
      <li>
        A <code>clearFloating</code> column turns that size into{' '}
        <code>--uikit-layout-inset-start</code>. Its pages and bars pad by it.
        Their content stays clear of the floating column, while their
        backgrounds run beneath it.
      </li>
      <li>
        This is an inherited property that changes on every frame, which the iOS
        rules otherwise avoid. It only happens during a sidebar’s slide, now and
        then, and the property isn’t registered or transitioned.
      </li>
    </ul>
    <CodeView code={floatingCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From the app:</strong> the sizes, which columns are open or
        closed, and which ones float. Whether a column becomes a{' '}
        <a href={publicUrl('drawer')}>Drawer</a> in a compact width is your
        app’s choice too.
      </li>
      <li>
        <strong>From Viewport:</strong> a scope for each column.
      </li>
      <li>
        <strong>Out:</strong> its inset, to the{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />{' '}
        and the bars in a column clear of a floating one. It also gives a{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />{' '}
        the room it’s placed in.
      </li>
    </ul>
  </>
);
