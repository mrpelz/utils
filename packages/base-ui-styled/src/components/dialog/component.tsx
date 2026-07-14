import { CommonDialog } from './common.js';
import { closeConfirmation } from './variants/close-confirmation.js';
import { controlledModeWithMultipleTriggers } from './variants/controlled-mode-with-multiple-triggers.js';
import { detachedTriggers } from './variants/detached-triggers.js';
import { insideScrollDialog } from './variants/inside-scroll-dialog.js';
import { main } from './variants/main.js';
import { nestedDialogs } from './variants/nested-dialogs.js';
import { outsideScrollDialog } from './variants/outside-scroll-dialog.js';
import { placingElementsOutsideThePopup } from './variants/placing-elements-outside-the-popup.js';

export const variants = {
  main,
  nestedDialogs,
  closeConfirmation,
  outsideScrollDialog,
  insideScrollDialog,
  placingElementsOutsideThePopup,
  detachedTriggers,
  controlledModeWithMultipleTriggers,
};

export const Dialog = {
  ...CommonDialog,
  variants,
};

export { CommonDialog, dialogButtonStyles } from './common.js';
