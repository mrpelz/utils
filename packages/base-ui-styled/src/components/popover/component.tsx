import { CommonPopover } from './common.js';
import { animatingThePopover } from './variants/animating-the-popover.js';
import { controlledModeWithMultipleTriggers } from './variants/controlled-mode-with-multiple-triggers.js';
import { detachedTriggers } from './variants/detached-triggers.js';
import { main } from './variants/main.js';
import { openingOnHover } from './variants/opening-on-hover.js';

export const variants = {
  main,
  openingOnHover,
  detachedTriggers,
  controlledModeWithMultipleTriggers,
  animatingThePopover,
};

export const Popover = {
  ...CommonPopover,
  variants,
};

export { CommonPopover, popoverButtonStyles } from './common.js';
