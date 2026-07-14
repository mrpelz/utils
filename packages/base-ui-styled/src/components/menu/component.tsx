import { CommonMenu } from './common.js';
import { animatingTheMenu } from './variants/animating-the-menu.js';
import { arrow } from './variants/arrow.js';
import { checkboxItems } from './variants/checkbox-items.js';
import { controlledModeWithMultipleTriggers } from './variants/controlled-mode-with-multiple-triggers.js';
import { detachedTriggers } from './variants/detached-triggers.js';
import { groupLabels } from './variants/group-labels.js';
import { main } from './variants/main.js';
import { nestedMenu } from './variants/nested-menu.js';
import { openOnHover } from './variants/open-on-hover.js';
import { radioItems } from './variants/radio-items.js';

export const variants = {
  main,
  openOnHover,
  checkboxItems,
  radioItems,
  groupLabels,
  nestedMenu,
  detachedTriggers,
  controlledModeWithMultipleTriggers,
  arrow,
  animatingTheMenu,
};

export const Menu = {
  ...CommonMenu,
  variants,
};

export { CommonMenu } from './common.js';
