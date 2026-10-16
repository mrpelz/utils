import type { Popover as BasePopover } from '@base-ui/react/popover';

import type { LogicalSide } from '../utils/main.js';

export type PopoverAlign = 'center' | 'end' | 'start';

// Its trigger (for its alignment), and whether its popup has an arrow (for
// its distance).
export type PopoverState = {
  arrow: boolean;
  setArrow: (arrow: boolean) => void;
  setTrigger: (trigger: HTMLElement | null) => void;
  trigger: HTMLElement | null;
};

export type PopoverPositionerProps = Omit<
  BasePopover.Positioner.Props,
  'align' | 'ref' | 'side'
> & {
  /**
   * Its alignment to its anchor.
   * @default its end in a list row, otherwise centered
   */
  align?: PopoverAlign;
  /**
   * Its side of its anchor (logical).
   * @default 'block-end'
   */
  side?: LogicalSide;
};

export type Nose = 'bottom' | 'left' | 'right' | 'top';
