import type { Drawer as BaseDrawer } from '@base-ui/react/drawer';

/** The side a drawer is at (and hides towards). */
export type DrawerSide = 'inline-end' | 'inline-start';

// (Snap points: a vertical drawer's only, e.g. a sheet's.)
export type DrawerRootProps<Payload = unknown> = Omit<
  BaseDrawer.Root.Props<Payload>,
  | 'defaultSnapPoint'
  | 'onSnapPointChange'
  | 'snapPoint'
  | 'snapPoints'
  | 'snapToSequentialPoints'
  | 'swipeDirection'
> & {
  /**
   * Its side: its popup floats over the content from there, hidden until
   * opened (swiped in from its `SwipeArea`, or by a `Trigger`), swiped back
   * towards it to close.
   * @default 'inline-start'
   */
  side?: DrawerSide;
};

export type DrawerPopupProps = Omit<BaseDrawer.Popup.Props, 'ref'> & {
  /**
   * A parent element to render the portal element into (else the provided
   * one, see `PortalContainerContext`, or the body).
   */
  container?: BaseDrawer.Portal.Props['container'];
  /**
   * Without a background or shadow of its own: its content floats itself
   * (e.g. a floating `Sidebar`).
   */
  floating?: boolean;
  /**
   * Its size (px), at most the container's less 44px.
   * @default 320
   */
  size?: number;
};

export type DrawerSwipeAreaProps = Omit<
  BaseDrawer.SwipeArea.Props,
  'ref' | 'swipeDirection'
> & {
  /**
   * Its width (px): how far from the drawer's edge a swipe starts.
   * @default 20
   */
  width?: number;
};

/** A handle linking a drawer to its triggers outside it. */
export type DrawerHandle<Payload = unknown> = BaseDrawer.Handle<Payload>;
