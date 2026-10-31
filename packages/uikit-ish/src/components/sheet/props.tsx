import type { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import type { Properties } from 'csstype';
import type { ComponentProps } from 'react';

export type SheetDetent = 'large' | 'medium';

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
