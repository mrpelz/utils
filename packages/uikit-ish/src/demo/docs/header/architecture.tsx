import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/header/architecture`: how Header is built, and what flows into it.

const fadeCode = `// useTitleFade, in short: measured once a frame while its page scrolls.
const measure = () => {
  // The bar's lower edge: the scroller's top, its padding (the safe area
  // inset), and the bar's height (--uikit-header-bar).
  const line = scrollerTop + paddingTop + barHeight;
  // Bouncing past an end: as it was at that end.
  const progress = clamp((line - title.top - past - 1) / title.height);
  const next = [1 - clamp(progress * 2), clamp(progress * 2 - 1)];
  if (unchanged(next)) return;
  // The large title's text alpha (no layer of its own, in the scroller);
  // the bar's title's opacity (a layer of its own, in the fixed bar).
  title.style.setProperty('--uikit-header-large-title-fade', next[0]);
  barTitle.style.opacity = next[1];
};
scroller.addEventListener('scroll', () => requestAnimationFrame(measure));`;

const treeCode = `<Header.Root>                              <!-- display: contents -->
  <Viewport.BlockStart>                    <!-- the bar, anchored -->
    <Toolbar.Root placement="block-start">
      <Toolbar.Title>…</Toolbar.Title>     <!-- fades in -->
    </Toolbar.Root>
  </Viewport.BlockStart>
  <Page.Root>                              <!-- its scroller -->
    <Viewport.Padding edge="block-start" /> <!-- room under the bar -->
    <Header.LargeTitle>…</Header.LargeTitle> <!-- fades out -->
    <Header.Accessory>…</Header.Accessory>   <!-- sticks below the bar -->
    …
  </Page.Root>
</Header.Root>`;

const sections: readonly Section[] = [
  ['a-bar-and-a-page-tied-together', 'A bar and a page tied together'],
  ['the-title-fade', 'The title fade'],
  ['the-accessory', 'The accessory'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/header/architecture`: how it's built, and what flows into it. */
export const HeaderArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A header ties a bar over a page to that page’s large title. As the large
        title scrolls under the bar, it fades out, and the bar’s title fades in.
        The bar itself is a <a href={publicUrl('toolbar')}>Toolbar</a> in a
        Viewport anchor. The header only adds the large title, the accessory and
        the fade. To learn how to use it, see its{' '}
        <a href={publicUrl('header/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="a-bar-and-a-page-tied-together"
      level={2}
    >
      A bar and a page tied together
    </Heading>
    <ul>
      <li>
        <PartLink part="Header.Root" /> renders a <code>div</code> with{' '}
        <code>display: contents</code>, so it has no box. The bar’s anchor and
        the page lay out as if it weren’t there.
      </li>
      <li>
        The root holds a context that the large title registers with. While a
        large title is mounted, the root is marked <code>data-large-title</code>
        . That hides the bar’s own title until the fade shows it.
      </li>
      <li>
        The root reads the height of the tallest bar at the top of its scope (
        <code>useAnchorSize</code>, from Viewport). It sets that height as{' '}
        <code>--uikit-header-bar</code>, so the large title and the accessory
        follow the bar’s height as it changes.
      </li>
      <li>
        The room under the bar isn’t the header’s job. The page’s{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        makes it, so your app can leave it out while its bar is empty.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="the-title-fade"
      level={2}
    >
      The title fade
    </Heading>
    <ul>
      <li>
        <PartLink part="Header.LargeTitle" /> finds its scroller, the nearest
        ancestor that scrolls vertically. It listens to that scroller’s scroll,
        and measures at most once a frame. It also watches the scroller’s size
        and its own.
      </li>
      <li>
        The fade runs over the title’s height as the title passes the bar’s
        lower edge. The first half fades the large title out. The second half
        fades the bar’s title in. Values are only written when they change.
      </li>
      <li>
        The fade is written to the two titles alone, never to a shared ancestor.
        The large title’s text color takes an alpha. It stays in the scroller
        with no layer of its own. The bar’s title takes an opacity, since it’s
        in a fixed bar that’s a layer anyway.
      </li>
      <li>
        The fade isn’t a scroll-driven animation, and it isn’t a property on the
        root. Both of those would change layers under a scroll, which iOS
        handles badly (see{' '}
        <a href={publicUrl('ios-quirks#layers-under-a-scroll')}>iOS Quirks</a>).
      </li>
      <li>
        While the page bounces past an end, the fade holds the value it had at
        that end. On iOS, a fade that changed during a bounce ended the bounce.
      </li>
      <li>
        The large title is a <code>div</code> with the heading role at level 1,
        rendered through <code>useRender</code>.
      </li>
    </ul>
    <CodeView code={fadeCode} />

    <Heading
      id="the-accessory"
      level={2}
    >
      The accessory
    </Heading>
    <ul>
      <li>
        <PartLink part="Header.Accessory" /> scrolls along with the large title,
        then sticks below the bar. CSS does this.
      </li>
      <li>
        While it’s stuck, it registers with Viewport’s edge (
        <code>useViewportEdgeElement</code>). The bar’s scroll edge effect then
        reaches beneath it too, so content scrolling under it is blurred.
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
        <strong>From Viewport:</strong> the bar’s height, the anchor, the room
        under the bar, and the edge effect.
      </li>
      <li>
        <strong>From Toolbar:</strong> the bar and its title. The fade finds the
        title by its part attribute.
      </li>
      <li>
        <strong>From its page:</strong> the scroll position, and the page’s top
        padding for the safe area inset.
      </li>
      <li>
        <strong>Out:</strong> it’s the screen structure that a{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />{' '}
        holds, and the one each page of a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />{' '}
        uses.
      </li>
    </ul>
  </>
);
