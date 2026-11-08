import type { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { Properties } from 'csstype';
import type { ComponentProps } from 'react';

import type { ViewportEdgeEffect } from '../viewport/main.js';

export type SheetDetent = 'large' | 'medium';

/** What a sheet is in a regular width (see `Sheet.Popup`'s `regular`). */
export type SheetRegular = 'card' | 'form';

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

export type SheetTriggerProps<Payload = unknown> = Omit<
  BaseDrawer.Trigger.Props<Payload>,
  'ref'
> & {
  /**
   * The stop it opens the sheet at (a snap group's `value`, see
   * `Sheet.SnapGroup`): a deep link into it; left out, the root's
   * `defaultSnapPoint`.
   */
  snapPoint?: string;
};

export type SheetSnapGroupProps = ComponentProps<'div'> & {
  /**
   * Its snap point's name: the sheet snaps to show everything up to its
   * end (its header too), named so in the root's `snapPoint`,
   * `defaultSnapPoint` and `onSnapPointChange`.
   */
  value: string;
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
   * A sheet from the bottom (`detent`), or (not compact) what `regular`
   * says.
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
  /**
   * What it is in a regular width (a tablet's; not `compact`): `form`, a
   * form sheet, centered (e.g. for editing); `card`, a card from the bottom
   * at the leading edge (as a regular `Island`: 375px wide, 10px in), its
   * `detent`, swiping and snapping kept (e.g. over a map).
   * @default 'form'
   */
  regular?: SheetRegular;
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
