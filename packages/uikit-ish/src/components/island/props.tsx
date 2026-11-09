import type { ComponentProps } from 'react';

import type { ViewportEdgeEffect } from '../viewport/main.js';

/** A stop chosen by the user (cancelable: then not the root's own). */
export type IslandSnapPointChangeDetails = {
  cancel: () => void;
  event: Event;
  readonly isCanceled: boolean;
};

export type IslandRootProps = ComponentProps<'div'> & {
  /**
   * The stop it shows at first (a snap group's `value`, see
   * `Island.SnapGroup`), uncontrolled; left out, its lowest.
   */
  defaultSnapPoint?: string;
  /** A stop chosen by the user (swiped to it), by its group's `value`. */
  onSnapPointChange?: (
    snapPoint: string,
    details: IslandSnapPointChangeDetails,
  ) => void;
  /**
   * The stop it shows (a snap group's `value`), controlled: set by the app,
   * scrolled to.
   */
  snapPoint?: string;
};

export type IslandHeaderProps = ComponentProps<'div'> & {
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

export type IslandGrabberProps = ComponentProps<'div'> & {
  /**
   * The cursor over it, as a pointer hovers it (where one does).
   * @default 'grab'
   */
  cursor?: string;
};

export type IslandContentProps = ComponentProps<'div'>;

export type IslandSnapGroupProps = ComponentProps<'div'> & {
  /**
   * Its stop's name: the island shows everything up to its end (its header
   * too), named so in the root's `snapPoint`, `defaultSnapPoint` and
   * `onSnapPointChange`. Empty, after the content's start: its header
   * alone, its bar centered; empty, in the header right after its grabber:
   * a sliver, its grabber alone.
   */
  value: string;
};
