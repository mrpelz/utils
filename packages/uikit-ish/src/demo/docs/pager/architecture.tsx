import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/pager/architecture`: how Pager is built, and what flows into it.

const cssCode = `.uikit-pager-root {
  display: flex;
  overflow: auto hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;

  &[data-orientation='vertical'] {
    flex-direction: column;
    overflow: hidden auto;
    scroll-snap-type: y mandatory;
  }
}

.uikit-pager-page {
  flex: none;
  inline-size: 100%; /* vertical: block-size too */
  scroll-snap-align: start;
  scroll-snap-stop: always;
}`;

const sections: readonly Section[] = [
  ['native-snapping', 'Native snapping'],
  ['its-page-as-its-scrolled', 'Its page as it’s scrolled'],
  ['only-at-rest', 'Only at rest'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/pager/architecture`: how it's built, and what flows into it. */
export const PagerArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Pager is the library’s own: a scroller that snaps, with its page
        reported as it scrolls. To learn how to use it, see its{' '}
        <a href={publicUrl('pager/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="native-snapping"
      level={2}
    >
      Native snapping
    </Heading>
    <ul>
      <li>
        The browser moves it. CSS scroll snapping stops it on a page, and{' '}
        <code>scroll-snap-stop: always</code> keeps a fling to one page. A
        finger, a trackpad’s momentum and the arrow keys all feel like the
        platform’s.
      </li>
      <li>
        The mouse has no native swipe, so a drag with it moves the scroll
        position directly, without snapping. Let go, it scrolls to the nearer
        page, or on to the next one if it was flicked.
      </li>
      <li>
        <code>overscroll-behavior: contain</code> keeps its scrolls from passing
        on to the page around it.
      </li>
    </ul>
    <CodeView code={cssCode} />

    <Heading
      id="its-page-as-its-scrolled"
      level={2}
    >
      Its page as it’s scrolled
    </Heading>
    <ul>
      <li>
        On every scroll, its page is the one mostly in view: its scroll position
        over a page’s size, rounded. Sizes are read as laid out, with fractions,
        so the count doesn’t drift on later pages.
      </li>
      <li>
        It reports a page as it changes (<code>onValueChange</code>), so dots
        follow the swipe. Its own report coming back as <code>value</code>{' '}
        scrolls nothing.
      </li>
      <li>
        A <code>value</code> your app sets is scrolled to, smoothly or at once
        with motion reduced. The pages passed on the way aren’t reported, so
        dots that went ahead stay where they went.
      </li>
    </ul>

    <Heading
      id="only-at-rest"
      level={2}
    >
      Only at rest
    </Heading>
    <ul>
      <li>
        Nothing is written to its scroll position while a finger holds it or
        it’s still moving. Touch scrolling on iOS runs on its own, and a
        script’s scroll at the same time fights it. A page set meanwhile is
        scrolled to once it’s at rest.
      </li>
      <li>
        At rest means the scroll ended (<code>scrollend</code>, or 120ms without
        a scroll), no finger is down, and it sits on a page.
      </li>
      <li>
        Pages out of view turn inert only at rest too, so the page being swiped
        to isn’t changed mid-swipe.
      </li>
      <li>
        Resized (for example rotated), it goes back to its page at once, unless
        a finger holds it.
      </li>
      <li>
        <a href={publicUrl('date-picker')}>Date Picker</a>’s months follow the
        same rules.
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
        In: <code>value</code> or <code>defaultValue</code>, and its{' '}
        <code>orientation</code>. Its pages are its children:{' '}
        <PartLink
          component="pager"
          part="Pager.Page"
        />
        s, which may come from any components. Each one finds its place (“2 of
        5”) among its pager’s children in the page.
      </li>
      <li>
        Out: <code>onValueChange</code> with the page and why (
        <code>swipe</code> or <code>keyboard</code>).
      </li>
      <li>
        Reduced motion (from{' '}
        <PartLink
          component="settings"
          part="Settings.Provider"
        />
        ): a page your app sets is jumped to. What a finger swipes still follows
        it.
      </li>
      <li>
        It has no count of its own to share. A{' '}
        <a href={publicUrl('page-control')}>Page Control</a> gets its{' '}
        <code>count</code> from your app, the same list the pages come from.
      </li>
    </ul>
  </>
);
