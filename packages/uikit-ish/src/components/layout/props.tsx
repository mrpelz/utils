import type { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { ComponentProps } from 'react';

export type LayoutColumnProps = ComponentProps<'div'> & {
  /**
   * Next to a floating column (see `floating`): its pages' content inset by
   * the floating column's size (`--uikit-layout-inset-start`), their
   * backgrounds running underneath it.
   */
  clearFloating?: boolean;
  /** Its initial size (px, uncontrolled); without a size, it's flexible. */
  defaultSize?: number;
  /**
   * Floating over the others at the layout's start (e.g. a `Sidebar`), which
   * span the layout underneath it (see `clearFloating`); compact, in a
   * `Drawer`, without a background or shadow of its own.
   */
  floating?: boolean;
  /**
   * Its largest size (px) when resized.
   * @default none
   */
  maxSize?: number;
  /**
   * Its smallest size (px).
   * @default 240 (a list's)
   */
  minSize?: number;
  /** Called while it's resized (by its divider). */
  onSizeChange?: (size: number) => void;
  /** Resized by dragging its divider (at its end), or by keys on it. */
  resizable?: boolean;
  /** Its size (px, controlled). */
  size?: number;
};

export type LayoutRootProps = ComponentProps<'div'> & {
  /**
   * Compact (e.g. on an iPhone, by its width): its `Drawer`s' columns float
   * over the others, hidden until opened.
   */
  compact?: boolean;
};

/** The layout's side a drawer is at (and hides towards). */
export type LayoutDrawerSide = 'inline-end' | 'inline-start';

// (Snap points: a vertical drawer's only.)
export type LayoutDrawerProps<Payload = unknown> = Omit<
  BaseDrawer.Root.Props<Payload>,
  | 'defaultSnapPoint'
  | 'onSnapPointChange'
  | 'snapPoint'
  | 'snapPoints'
  | 'snapToSequentialPoints'
  | 'swipeDirection'
> & {
  /**
   * Its side: compact, its column floats over the others from there, hidden
   * until opened (swiped in from its `DrawerSwipeArea`, or by a
   * `DrawerTrigger`), swiped back towards it to close.
   * @default 'inline-start'
   */
  side?: LayoutDrawerSide;
};

export type LayoutDrawerSwipeAreaProps = Omit<
  BaseDrawer.SwipeArea.Props,
  'ref' | 'swipeDirection'
> & {
  /**
   * Its width (px): how far from the drawer's edge a swipe starts.
   * @default 20
   */
  width?: number;
};
