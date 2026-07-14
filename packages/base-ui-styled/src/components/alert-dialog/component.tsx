import { CommonAlertDialog } from './common.js';
import { closeConfirmation } from './variants/close-confirmation.js';
import { controlledModeWithMultipleTriggers } from './variants/controlled-mode-with-multiple-triggers.js';
import { detachedTriggers } from './variants/detached-triggers.js';
import { main } from './variants/main.js';

export const variants = {
  main,
  closeConfirmation,
  detachedTriggers,
  controlledModeWithMultipleTriggers,
};

export const AlertDialog = {
  ...CommonAlertDialog,
  variants,
};

export { alertDialogButtonStyles, CommonAlertDialog } from './common.js';
