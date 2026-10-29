import type { ComponentProps, ReactNode, RefObject } from 'react';

import type { PortalContainer } from '../utils/main.js';
import type { ViewportAnchorHandle } from './padding.js';

/**
 * The window's horizontal size class (UIKit's): `regular` from 768px (an
 * iPad's window, full or split), `compact` below (a phone's).
 */
export type SizeClass = 'compact' | 'regular';

/** The visual viewport, and the keyboard's height (0 without one). */
export type VisualViewportState = {
  height: number;
  /** What the visual viewport doesn't show of the layout viewport's bottom. */
  keyboardInset: number;
  left: number;
  top: number;
  width: number;
};

export type ViewportScrollEvent = {
  /** Scrolled to (or past) the end. */
  atBottom: boolean;
  /** Scrolled to (or past) the start. */
  atTop: boolean;
  /**
   * The direction scrolled in, past the threshold (until then: none); not
   * changed by overscrolling (e.g. bouncing back from the end).
   */
  direction: 'down' | 'up' | undefined;
  /**
   * Overscrolling held: a touch, or a wheel (until quiet), pulling it (e.g.
   * to act on release); once not, it's released, bouncing back.
   */
  isHeld: boolean;
  /**
   * How far it's pulled past an end (px, damped as rubber-banding):
   * negative past the start (e.g. pulling to refresh), positive past the
   * end; 0 within. Safari's own bounce, or (elsewhere) touches and wheels
   * at an end.
   */
  overscroll: number;
  /** The scroll position, within the scroll range (overscrolled: its end). */
  position: number;
};

export type Listener = (event: ViewportScrollEvent) => void;

export type ViewportScrollOptions = {
  /**
   * How far to scroll before the direction changes (px): more for a
   * steadier direction (e.g. over a device's jitter).
   * @default 8
   */
  threshold?: number;
};

export type ViewportProviderProps = {
  children?: ReactNode;
  /**
   * The app's screen, when it isn't the window (e.g. a device's frame in a
   * page): the visual viewport within it (the keyboard's inset over its
   * bottom), its custom properties on it.
   * @default the provided portal container (`PortalContainerContext`), or
   * none: the window
   */
  screen?: PortalContainer | null;
  /**
   * The scroll container tracked.
   * @default the document's scrolling element
   */
  scroller?: RefObject<HTMLElement | null>;
};

/** The edge of the viewport an anchor floats at. */
export type ViewportEdge =
  'block-end' | 'block-start' | 'inline-end' | 'inline-start';

/**
 * The safe area insets kept clear (as padding): all, those of the block
 * (top, bottom) or inline (left, right) dimension only, or none.
 */
export type ViewportSafeArea = 'all' | 'block' | 'inline' | 'none';

export type ViewportAnchorProps = ComponentProps<'div'> & {
  /**
   * The edge it floats at (e.g. `block-start`: a toolbar; `block-end`: a tab
   * bar).
   */
  edge: ViewportEdge;
  /**
   * Its handle (see `Viewport.createAnchorHandle`), linking it to the
   * paddings given it (`anchor`, alone or among others): as high as it, or
   * the tallest of their anchors.
   */
  handle?: ViewportAnchorHandle;
  /**
   * At the block end: pushed up by the on-screen keyboard (default, e.g.
   * a message field), or covered by it (e.g. a tab bar).
   */
  keyboard?: 'cover' | 'push';
  /**
   * The safe area insets kept clear.
   * @default 'all'
   */
  safeArea?: ViewportSafeArea;
};

export type ViewportOverscrollProps = ComponentProps<'div'> & {
  /**
   * The bars it's below (or above, at the end): their handles, one or
   * several (the tallest of them, see `Viewport.createAnchorHandle`);
   * instead of the tallest at its edge. `null`: none (from the screen's
   * edge, inside the safe area).
   */
  anchor?: ViewportAnchorHandle | readonly ViewportAnchorHandle[] | null;
  /**
   * The end it's at: past the content's start (e.g. pulling to refresh), or
   * its end.
   * @default 'block-start'
   */
  edge?: 'block-end' | 'block-start';
  /**
   * Kept shown at rest (UIKit's content inset), e.g. while refreshing: the
   * `Viewport.Padding` at its edge making room for it beyond the bars,
   * settling there (and back once closed).
   * @default false
   */
  open?: boolean;
  /**
   * The safe area insets it shows only clear of while pulled in (as
   * `Content`'s: all, those of the block dimension, top and bottom, or the
   * inline one, left and right, only, or none). Not kept clear, it shows in
   * the inset too (e.g. behind the status bar), there even at rest, just
   * past the content's end (e.g. faded by its progress, see
   * `--uikit-viewport-overscroll-progress`); open, it rests clear of it all
   * the same.
   * @default 'all'
   */
  safeArea?: ViewportSafeArea;
};

export type ViewportPaddingProps = Omit<ComponentProps<'div'>, 'children'> & {
  /**
   * The anchors it's as high as (the tallest of them): their handles, one
   * or several (see `Viewport.createAnchorHandle`), wherever they are;
   * instead of the tallest at its edge. `null`: none, whatever anchors are
   * in its scope (its margin alone, e.g. a gap of the app's).
   */
  anchor?: ViewportAnchorHandle | readonly ViewportAnchorHandle[] | null;
  /**
   * The edge whose anchors it makes room for (the tallest of them, in its
   * scope): its scroll container's start (`block-start`, e.g. a bar) or end
   * (`block-end`, e.g. a tab bar).
   * @default 'block-start'
   */
  edge?: ViewportEdge;
  /**
   * The gap between the content and its container's edge, beyond the
   * anchors (px, or a CSS length): instead of the library's content margin
   * (`--uikit-content-margin-block-start`/`-end`, 16px; none before a large
   * title).
   */
  margin?: number | string;
};

export type ViewportContentProps = ComponentProps<'div'> & {
  /**
   * Bouncing even when its content fits (UIKit's `alwaysBounceVertical`):
   * at least 1px to scroll, so a drag on it is its own (rubber-banding
   * here, the bars staying), not the document's (on iOS, moving the whole
   * app). Off: only content taller than it scrolls.
   * @default while it holds its content itself; not while its child
   * scrolls on its own (a `Page`, a `Header` around one, a `Layout`, a
   * `Navigation`: bouncing it would move them whole)
   */
  alwaysBounce?: boolean;
  /**
   * With the on-screen keyboard: resized to what's above it (default, so
   * its end scrolls into view), or overlaid by it.
   */
  keyboard?: 'overlay' | 'resize';
  /**
   * The safe area insets kept clear.
   * @default 'all'
   */
  safeArea?: ViewportSafeArea;
};

export type ElementVisibilityOptions = {
  /**
   * Grows (or shrinks) the area counted as visible, as CSS margins (e.g.
   * `'100% 0px'`: a screen above and below).
   * @default '0px'
   */
  rootMargin?: string;
  /**
   * The scroll container whose box is the visible area.
   * @default the viewport (the layout viewport)
   */
  scroller?: RefObject<HTMLElement | null>;
  /**
   * How much of the element (0–1) must be visible to count (0: any of it,
   * even an edge).
   * @default 0
   */
  threshold?: number;
};

export type ElementGeometryOptions = {
  /**
   * The scroll container whose box is the visible area.
   * @default the viewport (the layout viewport)
   */
  scroller?: RefObject<HTMLElement | null>;
};

/**
 * Where an element is in the visible area (px; distances positive while
 * the element's edge is inside the area's, negative past it).
 */
export type ElementGeometry = {
  /** From the area's bottom edge to the element's. */
  bottom: number;
  /** The element's height. */
  height: number;
  /** From the area's left edge to the element's. */
  left: number;
  /** From the area's right edge to the element's. */
  right: number;
  /** From the area's top edge to the element's. */
  top: number;
  /** How much of the element's height is visible. */
  visibleHeight: number;
  /** How much of the element's height is visible (0–1). */
  visibleHeightRatio: number;
  /** How much of the element's area is visible (0–1). */
  visibleRatio: number;
  /** How much of the element's width is visible. */
  visibleWidth: number;
  /** How much of the element's width is visible (0–1). */
  visibleWidthRatio: number;
  /** The element's width. */
  width: number;
};
