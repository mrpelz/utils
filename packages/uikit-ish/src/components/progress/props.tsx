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

/**
 * How it shows (see `display`): spinning; stopped (at rest at once,
 * frozen where it is, or finishing its turn first); or hidden (once
 * finished, or at once).
 */
export type ActivityIndicatorDisplay =
  'animate' | 'finish' | 'finish-and-hide' | 'freeze' | 'none' | 'reset';

export type ActivityIndicatorProps = Omit<
  BaseProgress.Root.Props,
  'children' | 'ref' | 'value'
> & {
  /** A label after it. */
  children?: ReactNode;
  /**
   * The spokes' color.
   * @default the secondary label color
   */
  color?: string;
  /**
   * How it shows: spinning (`animate`); stopped, at rest at once
   * (`reset`), frozen
   * where it is (`freeze`), or finishing its turn first, then resting (no
   * jump: `finish`); finishing, then hidden (`finish-and-hide`), or
   * hidden at once (`none`). Hidden, it takes no
   * room.
   * @default 'animate'
   */
  display?: ActivityIndicatorDisplay;
  /**
   * Seconds a turn takes (its speed).
   * @default 1
   */
  duration?: number;
  /**
   * How it spins: a spoke at a time, smoothly, or its spokes
   * staying in place, fading in turn.
   * @default 'stepped'
   */
  movement?: ActivityIndicatorMovement;
  /**
   * How far along a turn it is (turns: 0 to 1; below 0, turned back; past
   * 1, further turns): at rest, set by hand (e.g. following a pull, see
   * `Viewport.Overscroll`); spinning, where it starts from (changes after
   * not restarting it). Rotating, the spinner turned that far; otherwise
   * its brightest spoke moved on.
   * @default 0
   */
  progress?: number;
  /**
   * Its size (regular: 30px, small: 22px).
   * @default 'regular'
   */
  size?: 'regular' | 'small';
};
