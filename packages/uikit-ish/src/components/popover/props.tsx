import type { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps } from 'react';

import type { LogicalSide } from '../utils/main.js';
import type { ViewportEdgeEffect } from '../viewport/main.js';

export type PopoverAlign = 'center' | 'end' | 'start';

// Whether its popup has an arrow (for its distance).
export type PopoverState = {
  hasArrow: boolean;
  setHasArrow: (hasArrow: boolean) => void;
};

/** A handle linking a popover to its triggers outside it. */
export type PopoverHandle<Payload = unknown> = BasePopover.Handle<Payload>;

export type PopoverPositionerProps = Omit<
  BasePopover.Positioner.Props,
  'align' | 'ref' | 'side'
> & {
  /**
   * Its alignment to its anchor (in a list row, aligned with the row's
   * end: `end`).
   * @default 'center'
   */
  align?: PopoverAlign;
  /**
   * Its side of its anchor (logical).
   * @default 'block-end'
   */
  side?: LogicalSide;
};

export type PopoverHeaderProps = ComponentProps<'div'> & {
  /**
   * Its scroll edge effect, as the body scrolls under it (see
   * `Viewport.Anchor`): `soft`, the body fading out under it (on the
   * popover's glass, no blur); `hard`, a solid backing with a dividing line;
   * `none`.
   * @default 'soft'
   */
  edgeEffect?: ViewportEdgeEffect;
  /**
   * A color for its edge effect, shown at rest too (see `Viewport.Anchor`).
   */
  edgeTint?: string;
};

export type Nose = 'bottom' | 'left' | 'right' | 'top';
