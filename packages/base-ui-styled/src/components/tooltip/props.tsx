import type { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';

import type { LogicalSide } from '../utils/main.js';

export type TooltipTriggerProps = Omit<BaseTooltip.Trigger.Props, 'ref'>;

export type TooltipPositionerProps = Omit<
  BaseTooltip.Positioner.Props,
  'ref' | 'side'
> & {
  /**
   * Its side of its anchor (logical).
   * @default 'block-start'
   */
  side?: LogicalSide;
};
