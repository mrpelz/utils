import type { ComponentProps, ReactNode, RefObject } from 'react';

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
  /** The direction scrolled in, past the threshold (until then: none). */
  direction: 'down' | 'up' | undefined;
  /** The scroll position. */
  position: number;
};

export type Listener = (event: ViewportScrollEvent) => void;

export type ViewportProviderProps = {
  children?: ReactNode;
  /**
   * The scroll container tracked.
   * @default the document's scrolling element
   */
  scroller?: RefObject<HTMLElement | null>;
  /**
   * How far to scroll before the direction changes (px).
   * @default 8
   */
  threshold?: number;
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

export type ViewportContentProps = ComponentProps<'div'> & {
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
