import type { Progress as BaseProgress } from '@base-ui/react/progress';
import type { ReactNode } from 'react';

export type ProgressRootProps = Omit<BaseProgress.Root.Props, 'ref'> & {
  /**
   * The fill's color.
   * @default system blue
   */
  tint?: string;
};

/** Where a label or value is (see `Root`). */
export type ProgressPlacement =
  'block-end' | 'block-start' | 'inline-end' | 'inline-start';

export type ProgressLabelProps = Omit<BaseProgress.Label.Props, 'ref'> & {
  /** @default 'block-start' */
  placement?: ProgressPlacement;
};

export type ProgressValueProps = Omit<BaseProgress.Value.Props, 'ref'> & {
  /**
   * Placed (see `ProgressPlacement`), or in a tooltip at the fill's end:
   * always, or momentary (while the bar is hovered or focused by keyboard;
   * it's focusable then).
   * @default 'block-start'
   */
  placement?: ProgressPlacement | 'momentary-tooltip' | 'tooltip';
};

export type ActivityIndicatorMovement = 'fade' | 'rotate' | 'stepped';

export type ActivityIndicatorProps = Omit<
  BaseProgress.Root.Props,
  'children' | 'ref' | 'value'
> & {
  /**
   * Spinning (UIKit `startAnimating`, `stopAnimating`); stopped, it rests.
   * @default true
   */
  animating?: boolean;
  /** A label after it (Figma “Label”). */
  children?: ReactNode;
  /**
   * The spokes' color (UIKit `color`).
   * @default the secondary label color
   */
  color?: string;
  /**
   * Seconds a turn takes (its speed).
   * @default 1
   */
  duration?: number;
  /**
   * How it spins: a spoke at a time (as UIKit), smoothly, or its spokes
   * staying in place, fading in turn.
   * @default 'stepped'
   */
  movement?: ActivityIndicatorMovement;
  /**
   * Figma “Size” (Regular: 30px, Small: 22px).
   * @default 'regular'
   */
  size?: 'regular' | 'small';
};
