import '../toolbar/style.css';
import '../viewport/style.css';
import './style.css';

import { useRender } from '@base-ui/react/use-render';
import {
  createContext,
  CSSProperties,
  forwardRef,
  FunctionComponent,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

import { cn, useForwardedRef } from '../utils/main.js';
import { useAnchorSize, useViewportEdgeElement } from '../viewport/main.js';
import type {
  HeaderAccessoryProps,
  HeaderContextValue,
  HeaderLargeTitleProps,
  HeaderRootProps,
} from './props.js';

export type {
  HeaderAccessoryProps,
  HeaderLargeTitleProps,
  HeaderRootProps,
} from './props.js';

// A top toolbar with a large title, the titles in the label colors.
// Behavior after Framework7's large navbar (`navbar.less`,
// `navbar.js`: `.navbar-large`, collapsing on scroll).
//
// A page's header: the
// app's top `Toolbar` (`placement="block-start"`) in a
// `Viewport.BlockStart` (staying where it is, as the page scrolls or
// bounces under it), and a large title in the page below it (`LargeTitle`,
// Large Title Emphasized, 16px from the sides, with an optional
// `Toolbar.Subtitle` in 15px, 510), scrolling with the page. `Root` ties
// them: around the anchor and the `Page` (or within the page, e.g. a tab's
// panel rendered as one); the page's content starts below the bar by a
// `Viewport.Padding` at its start (the app's: e.g. none while the bar is
// empty). As the
// large title scrolls under the bar, it fades out and the bar's own
// `Toolbar.Title` fades in: without a large title, the bar's title just
// shows. The fade follows a scroll listener (`useTitleFade`), written to
// the two titles alone, only as it changes: the large title's text alpha
// (inside the page's scroller, it never has a layer of its own), the bar
// title's opacity (a layer of its own throughout, in the fixed bar). Not
// scroll-driven animations, nor a property on the root (see the docs' iOS
// Quirks: layers changing under a scroll; moving values and memory). Content
// scrolled under the bar blurs beneath it (the scroll edge effect: its
// anchor's, see `Viewport`; its accessory, stuck, covered too).
//
// An accessory (`Accessory`: a search field, a segmented control) scrolls
// with the large title, then sticks below the bar, 16px from
// the sides, 8px above the content.
//
// Also:
// - Pulled down, the large title doesn't grow.
// - The page's content makes room for the bar with a `Viewport.Padding`
//   (the app's, at the page's start: as high as the bar, live); the large
//   title and the accessory follow the bar's height too.
// - The scroll edge effect (the anchor's) is an approximation.

const HeaderContext = createContext<HeaderContextValue>({
  hasLargeTitle: false,
});

/**
 * A page's header: its bar (a `Toolbar` in a `Viewport.BlockStart`, its
 * child) and its page's `LargeTitle` (and `Accessory`), around the page (or
 * within it). It has no box of its own.
 */
const Root: FunctionComponent<HeaderRootProps> = ({ children }) => {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const [largeTitles, setLargeTitles] = useState(0);
  const markLargeTitle = useCallback(() => {
    setLargeTitles((count) => count + 1);
    return () => setLargeTitles((count) => count - 1);
  }, []);
  const value = useMemo(
    () => ({ hasLargeTitle: largeTitles > 0, markLargeTitle, root }),
    [largeTitles, markLargeTitle, root],
  );
  // Its bar's height (the tallest at the block start, in its scope: see
  // Viewport.Padding), for its large title and accessory.
  const barSize = useAnchorSize('block-start');

  return (
    <HeaderContext.Provider value={value}>
      <div
        ref={setRoot}
        className="uikit-header-root"
        data-header-part="root"
        data-large-title={value.hasLargeTitle ? '' : undefined}
        style={
          {
            '--uikit-header-bar': `${String(barSize)}px`,
          } as CSSProperties
        }
      >
        {children}
      </div>
    </HeaderContext.Provider>
  );
};

/** Its scroll container: the nearest ancestor scrolling vertically. */
const scrollerOf = (element: HTMLElement) => {
  for (
    let parent = element.parentElement;
    parent && parent !== document.body;
    parent = parent.parentElement
  ) {
    const { overflowY } = getComputedStyle(parent);
    if (overflowY === 'auto' || overflowY === 'scroll') return parent;
  }
  return undefined;
};

const clampUnit = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * Fades the large title out, and its bar's title in, as it scrolls under
 * the bar (see the top): how far it's past the bar's lower edge (the
 * page's safe area inset, its top padding, and the bar's height below its
 * scroller's top), over its own height; the first half fading it out, the
 * second the bar's title in. Pulled past an end, as it was at that end
 * (nothing changes during a bounce), its first pixel none. Measured as its
 * scroller scrolls (once a frame) or resizes.
 */
const useTitleFade = (
  titleRef: { current: HTMLElement | null },
  root: HTMLElement | null | undefined,
) => {
  useLayoutEffect(() => {
    const { current: title } = titleRef;
    const scroller = title ? scrollerOf(title) : undefined;
    if (!title || !root || !scroller) return undefined;

    const barTitleSelector =
      ':scope > .uikit-viewport-anchor[data-edge="block-start"] > .uikit-toolbar-root > [data-toolbar-part="title"]';
    let frame = 0;
    let written: [string, string] | undefined;
    let barTitle: HTMLElement | null = null;

    const measure = () => {
      frame = 0;
      const own = title.getBoundingClientRect();
      const { top } = scroller.getBoundingClientRect();
      // (The page's safe area inset: its top padding, see Page; the bar's
      // height: set as a length, see Root.)
      const line =
        top +
        (Number.parseFloat(getComputedStyle(scroller).paddingTop) || 0) +
        (Number.parseFloat(
          getComputedStyle(title).getPropertyValue('--uikit-header-bar'),
        ) || 0);
      // (Pulled past an end, bouncing: where it was at that end. A fade
      // changing during a bounce ends the bounce on iOS: the page let go
      // while still pulled.)
      const { clientHeight, scrollHeight, scrollTop } = scroller;
      const past =
        scrollTop -
        Math.min(
          Math.max(scrollTop, 0),
          Math.max(scrollHeight - clientHeight, 0),
        );
      // (A pixel's none: a page bouncing always scrolls by one, see Page,
      // as the edge effect's, see Viewport.)
      const progress =
        own.height > 0
          ? clampUnit((line - own.top - past - 1) / own.height)
          : 0;
      const next: [string, string] = [
        String(1 - clampUnit(progress * 2)),
        String(clampUnit(progress * 2 - 1)),
      ];
      if (!barTitle?.isConnected) {
        barTitle = root.querySelector<HTMLElement>(barTitleSelector);
        written = undefined;
      }
      if (written?.[0] === next[0] && written[1] === next[1]) return;
      written = next;
      title.style.setProperty('--uikit-header-large-title-fade', next[0]);
      if (barTitle) barTitle.style.opacity = next[1];
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    scroller.addEventListener('scroll', schedule, { passive: true });
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(scroller);
    resizeObserver.observe(title);

    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', schedule);
      resizeObserver.disconnect();
      title.style.removeProperty('--uikit-header-large-title-fade');
      barTitle?.style.removeProperty('opacity');
    };
  }, [root, titleRef]);
};

/**
 * The header's large title (with an optional `Toolbar.Subtitle`), at its
 * page's start (below the bar), scrolling with the page.
 */
const LargeTitle = forwardRef<HTMLDivElement, HeaderLargeTitleProps>(
  ({ className, render, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    const { markLargeTitle, root } = useContext(HeaderContext);
    useLayoutEffect(() => markLargeTitle?.(), [markLargeTitle]);
    useTitleFade(ref, root);

    return useRender({
      defaultTagName: 'div',
      props: {
        'aria-level': 1,
        'data-header-part': 'large-title',
        role: 'heading',
        ...props,
        className: cn('uikit-header-large-title', className),
      },
      ref,
      render,
    });
  },
);

/**
 * What stays with the bar (a search field, a segmented control): below the large title, scrolling
 * with it, then sticking below the bar, the content beneath it blurred.
 */
const Accessory = forwardRef<HTMLDivElement, HeaderAccessoryProps>(
  ({ className, render, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    // Stuck below the bar: the bar's edge effect reaching under it.
    useViewportEdgeElement(ref, 'block-start');

    return useRender({
      defaultTagName: 'div',
      props: {
        'data-header-part': 'accessory',
        ...props,
        className: cn('uikit-header-accessory', className),
      },
      ref,
      render,
    });
  },
);

export const Header = {
  Root,
  LargeTitle,
  Accessory,
};
