import { CommonTooltip } from './common.js';
import { animatingTheTooltip } from './variants/animating-the-tooltip.js';
import { controlledModeWithMultipleTriggers } from './variants/controlled-mode-with-multiple-triggers.js';
import { detachedTriggers } from './variants/detached-triggers.js';
import { main } from './variants/main.js';

export const variants = {
  main,
  detachedTriggers,
  controlledModeWithMultipleTriggers,
  animatingTheTooltip,
};

export const Tooltip = {
  ...CommonTooltip,
  variants,
};

export { CommonTooltip, tooltipButtonStyles } from './common.js';
