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
        A layout is a row of columns, each its own screen for what’s in it. Its
        sizing is CSS, driven by custom properties; its script handles resizing
        by a divider, opening and closing with a slide, and a floating column
        that others keep clear of. For using it, see its{' '}
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
        <PartLink part="Layout.Root" /> is a flex row filling its container.
        Each <PartLink part="Layout.Column" /> takes a size or shares the free
        space; its size, minimum and maximum are custom properties for the
        stylesheet.
      </li>
      <li>
        Each column provides its own Viewport scope and is the containing block
        of the fixed layers inside it, so a header’s bar in a column spans that
        column, not the screen. A{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />{' '}
        in it scrolls on its own.
      </li>
      <li>
        Where columns have no background, what’s behind the layout shows, for
        example a{' '}
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
        A <code>resizable</code> column renders a divider at its end: a
        focusable element with the separator role, its hit area wider than the
        hairline. Dragging it captures the pointer and resizes the column by the
        distance moved toward the end, by the layout’s direction. The arrow keys
        step it (further with Shift), Home and End go to its limits.
      </li>
      <li>
        Its size is the app’s (<code>size</code>, reported by{' '}
        <code>onSizeChange</code>) or its own, always clamped to its minimum and
        maximum. A flexible column’s current size is read from its box when a
        drag starts.
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
        A closed column is <code>inert</code> and slides out: a floating one off
        its edge, others by a negative margin at their size, so the columns
        beside take their place and its content is never squeezed. It keeps the
        size it had open, observed while it was open, for the slide.
      </li>
      <li>
        Transitions run only while a column opens or closes, not when it’s first
        laid out or resized. The column marks itself moving in the same render
        as its change, before anything measures it; the layout is marked
        transitioning until the column’s own animations have finished.
      </li>
      <li>
        Afterwards, the layout’s scrollers each get a layer for two frames, then
        lose it: iOS keeps tiles it drew off screen as they were, and this
        redraws them at rest (see{' '}
        <a href={publicUrl('ios-quirks#layers-under-a-scroll')}>iOS Quirks</a>
        ).
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
        start; the others span the whole layout under it. It publishes its
        visible size as <code>--uikit-layout-floating-size</code> on the layout,
        as it’s resized, and frame by frame while it slides.
      </li>
      <li>
        A <code>clearFloating</code> column turns that into{' '}
        <code>--uikit-layout-inset-start</code>, which its pages and bars pad
        by: their content stays clear of the floating column while their
        backgrounds run beneath it.
      </li>
      <li>
        It’s an inherited property changing every frame, which the iOS rules
        otherwise avoid, but only during a sidebar’s slide, now and then, and it
        isn’t registered or transitioned.
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
        <strong>From the app:</strong> sizes, open or closed, which columns
        float. Whether a column is a <a href={publicUrl('drawer')}>Drawer</a>{' '}
        instead, when compact, is the app’s choice too.
      </li>
      <li>
        <strong>From Viewport:</strong> a scope per column.
      </li>
      <li>
        <strong>Out:</strong> its inset to{' '}
        <PartLink
          component="page"
          part="Page.Root"
        />{' '}
        and bars in a column clear of a floating one, and the room a{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />{' '}
        is placed in.
      </li>
    </ul>
  </>
);
