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
        A header ties a bar anchored over a page to that page’s large title: as
        the title scrolls under the bar, it fades out and the bar’s title fades
        in. The bar is a <a href={publicUrl('toolbar')}>Toolbar</a> in a
        Viewport anchor; the header only adds the large title, the accessory,
        and the fade. For using it, see its{' '}
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
        <code>display: contents</code>, so it has no box: the bar’s anchor and
        the page lay out as if it weren’t there. It holds a context that the
        large title registers with, and marks itself{' '}
        <code>data-large-title</code> while one is mounted, which hides the
        bar’s own title until the fade shows it.
      </li>
      <li>
        It reads the height of the tallest bar anchored at the block start in
        its scope (<code>useAnchorSize</code>, Viewport’s) and sets it as{' '}
        <code>--uikit-header-bar</code>, so the large title and the accessory
        follow the bar’s height, live.
      </li>
      <li>
        The room under the bar is not the header’s: the page’s{' '}
        <PartLink
          component="viewport"
          part="Viewport.Padding"
        />{' '}
        makes it, so an app can leave it out while its bar is empty.
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
        <PartLink part="Header.LargeTitle" /> finds its scroller (the nearest
        ancestor that scrolls vertically) and listens to its scroll, measuring
        at most once a frame, and to its size and the title’s.
      </li>
      <li>
        The fade runs over the title’s height as it passes the bar’s lower edge:
        the first half fades the large title out, the second fades the bar’s
        title in. Values are written only when they change.
      </li>
      <li>
        It’s written to the two titles alone, never to a shared ancestor: the
        large title’s text color takes an alpha (it stays in the scroller with
        no layer of its own), and the bar’s title takes an opacity (it’s in a
        fixed bar, a layer anyway). Not a scroll-driven animation, and not a
        property on the root: both change layers under a scroll, which iOS
        handles badly (see{' '}
        <a href={publicUrl('ios-quirks#layers-under-a-scroll')}>iOS Quirks</a>
        ).
      </li>
      <li>
        While the page bounces past an end, the fade holds where it was at that
        end. A fade changing during a bounce ended the bounce on iOS.
      </li>
      <li>
        The large title is a <code>div</code> with the heading role, at level 1,
        through <code>useRender</code>.
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
        <PartLink part="Header.Accessory" /> scrolls with the large title, then
        sticks below the bar, by CSS. While it’s stuck, it registers with
        Viewport’s edge (<code>useViewportEdgeElement</code>), so the bar’s
        scroll edge effect reaches beneath it too and content scrolling under it
        blurs.
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
        under it, and the edge effect.
      </li>
      <li>
        <strong>From Toolbar:</strong> the bar and its title, which the fade
        finds by its part attribute.
      </li>
      <li>
        <strong>From its page:</strong> the scroll position, and its top padding
        (the safe area inset).
      </li>
      <li>
        <strong>Out:</strong> it’s the screen structure that a{' '}
        <PartLink
          component="sidebar"
          part="Sidebar.Root"
        />{' '}
        holds, and each page of a{' '}
        <PartLink
          component="navigation"
          part="Navigation.Stack"
        />
        .
      </li>
    </ul>
  </>
);
