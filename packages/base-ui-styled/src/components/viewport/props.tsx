import type { ComponentProps, ReactNode, RefObject } from 'react';

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
   * The scroll container tracked (default: the document's scrolling
   * element).
   */
  scroller?: RefObject<HTMLElement | null>;
  /** How far to scroll before the direction changes (default: 8px). */
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
  /** The safe area insets kept clear (default: `all`). */
  safeArea?: ViewportSafeArea;
};

export type ViewportContentProps = ComponentProps<'div'> & {
  /**
   * With the on-screen keyboard: resized to what's above it (default, so
   * its end scrolls into view), or overlaid by it.
   */
  keyboard?: 'overlay' | 'resize';
  /** The safe area insets kept clear (default: `all`). */
  safeArea?: ViewportSafeArea;
};
