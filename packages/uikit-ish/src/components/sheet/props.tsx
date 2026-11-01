import type { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { Properties } from 'csstype';
import type { ComponentProps } from 'react';

import type { ViewportEdgeEffect } from '../viewport/main.js';

export type SheetDetent = 'large' | 'medium';

/**
 * The direction a sheet is swiped away in (Base UI's `Drawer`'s), or
 * `none`: not swiped away at all.
 */
export type SheetSwipeDirection = 'down' | 'left' | 'none' | 'right' | 'up';

export type SheetRootProps<Payload = unknown> = Omit<
  BaseDrawer.Root.Props<Payload>,
  'swipeDirection'
> & {
  /**
   * The direction it's swiped away in (also its exit then: following the
   * flick, out through that edge), or `none`: not swiped away (closed by
   * a press outside it, Escape, or its close button only).
   * @default 'down'
   */
  swipeDirection?: SheetSwipeDirection;
};

export type SheetPopupProps = Omit<BaseDrawer.Popup.Props, 'ref'> & {
  /**
   * Its background (as a page's, see `Page.Root`): `grouped` for grouped
   * lists in it (their own background then transparent), `plain` for plain
   * lists and other content. Not the medium detent's (glass).
   * @default 'plain'
   */
  background?: 'grouped' | 'plain';
  /**
   * A sheet from the bottom (`detent`), or (not compact) a form sheet,
   * centered.
   * @default by the window's width (compact below 768px)
   */
  compact?: boolean;
  /**
   * Where its portal renders it (Base UI's `Drawer.Portal`), e.g. a
   * frame of the app's, fixed to it if it's a containing block (and
   * `overflow: clip`, not `hidden`: focus moving into the sheet, still
   * below it, would scroll it).
   * @default document.body
   */
  container?: BaseDrawer.Portal.Props['container'];
  /**
   * Its height in a compact width (a phone's): the whole screen, or its
   * content's (a floating glass panel).
   * @default 'large'
   */
  detent?: SheetDetent;
};

export type SheetHeaderProps = ComponentProps<'div'> & {
  /**
   * Its scroll edge effect, as the content scrolls under it (see
   * `Viewport.Anchor`): `soft`, a blur fading out away from it; `hard`, a
   * solid backing with a dividing line; `none`. Only a grabber: none.
   * @default 'soft'
   */
  edgeEffect?: ViewportEdgeEffect;
  /**
   * A color for its edge effect, shown at rest too (see `Viewport.Anchor`).
   */
  edgeTint?: string;
};

export type SheetContentProps = Omit<BaseDrawer.Content.Props, 'ref'>;

/** A handle linking a sheet to its triggers outside it. */
export type SheetHandle<Payload = unknown> = BaseDrawer.Handle<Payload>;

export type SheetGrabberProps = ComponentProps<'div'> & {
  /**
   * The cursor (where the pointer hovers; while the sheet is swiped,
   * `grabbing`).
   * @default 'grab'
   */
  cursor?: Properties['cursor'];
};
