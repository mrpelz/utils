import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/drawer/architecture`: how Drawer is built, and what flows into it.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const rootCode = `// Drawer.Root, in short: its logical side, as Base UI's swipe direction.
const closingDirection = (side, isRightToLeft) =>
  (side === 'inline-start') === isRightToLeft ? 'right' : 'left';

<SideContext.Provider value={side}>
  <BaseDrawer.Root swipeDirection={closingDirection(side, isRightToLeft)} />
</SideContext.Provider>`;

const lockCode = `// useSwipeScrollLock, in short: a touch moving sideways first is a swipe,
// and its moves don't scroll the page.
const onTouchMove = (event) => {
  if (isSwipe === undefined) {
    const x = Math.abs(touch.clientX - start.clientX);
    const y = Math.abs(touch.clientY - start.clientY);
    if (Math.max(x, y) < 6) return;        // not decided yet
    isSwipe = x > y;
  }
  if (isSwipe && event.cancelable) event.preventDefault();
};
area.addEventListener('touchmove', onTouchMove, { passive: false });`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const sections: readonly Section[] = [
  ['base-ui-s-drawer-from-a-side', 'Base UI’s drawer, from a side'],
  ['one-popup-part', 'One popup part'],
  ['swiping-it-in', 'Swiping it in'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/drawer/architecture`: how it's built, and what flows into it. */
export const DrawerArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A drawer is Base UI’s drawer, opening from a logical side. The library
        folds its portal, backdrop and viewport into one popup part. It also
        adds a swipe area that keeps the page still while you swipe the drawer
        in. To learn how to use it, see its{' '}
        <a href={publicUrl('drawer/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-drawer-from-a-side"
      level={2}
    >
      Base UI’s drawer, from a side
    </Heading>
    <ul>
      <li>
        Base UI’s drawer is swiped closed in a physical direction.{' '}
        <PartLink part="Drawer.Root" /> takes a logical <code>side</code>{' '}
        instead, and turns it into Base UI’s <code>swipeDirection</code> using
        the document’s direction. So a drawer at the inline start is swiped left
        to close in a left-to-right layout, and right in a right-to-left one.
      </li>
      <li>
        The root reads the document’s direction once, when it mounts. If the
        direction changes later, the swipe doesn’t flip.
      </li>
      <li>
        The side goes into a context for the popup and the swipe area. Both mark
        themselves with it (<code>data-side</code>) for their stylesheet.
      </li>
      <li>
        Opening and closing, the handle, the triggers and the close buttons are
        Base UI’s.
      </li>
    </ul>
    <CodeView code={rootCode} />

    <Heading
      id="one-popup-part"
      level={2}
    >
      One popup part
    </Heading>
    <ul>
      <li>
        <PartLink part="Drawer.Popup" /> renders Base UI’s portal, backdrop,
        viewport and popup together. It uses the library’s portal container and
        the providers’ settings. Its <code>size</code> becomes{' '}
        <code>--uikit-drawer-size</code>.
      </li>
      <li>
        The popup stays mounted while the drawer is closed. So the pages in it
        keep their state and scroll positions between openings.
      </li>
      <li>
        It provides its own Viewport scope, the same way a sidebar does. Bars
        anchored inside it are fixed to the drawer, not to the screen behind it.
      </li>
    </ul>

    <Heading
      id="swiping-it-in"
      level={2}
    >
      Swiping it in
    </Heading>
    <ul>
      <li>
        <PartLink part="Drawer.SwipeArea" /> is Base UI’s. It’s a strip at the
        drawer’s edge, 20px wide by default, that you swipe the drawer in from.
        Where you render it decides where it works, for example at your app’s
        root or in a layout’s column.
      </li>
      <li>
        Base UI leaves vertical panning on the strip to the browser, and doesn’t
        cancel a swipe’s moves. Because of that, a swipe that drifted vertically
        scrolled the page.
      </li>
      <li>
        The library adds a touch listener on the strip. Once a touch has moved
        6px, the larger axis decides. If it’s sideways, its moves are cancelled,
        so nothing scrolls while you swipe.
      </li>
    </ul>
    <CodeView code={lockCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Base UI:</strong> opening, closing, swiping, the backdrop,
        modality and the handle.
      </li>
      <li>
        <strong>From Viewport:</strong> the portal container, and a scope of its
        own.
      </li>
      <li>
        <strong>From the app:</strong> whether content is a drawer at all.
        Layout doesn’t switch by itself. Your app renders a drawer in place of a{' '}
        <PartLink
          component="layout"
          part="Layout.Column"
        />
        , for example a sidebar in a compact width, and decides by the size
        class (
        <PartLink
          component="viewport"
          part="useSizeClass"
        />
        ).
      </li>
      <li>
        <strong>Out:</strong> nothing.
      </li>
    </ul>
  </>
);
