import { CommonDrawer } from './common.js';
import { actionSheetWithSeparateDestructiveAction } from './variants/action-sheet-with-separate-destructive-action.js';
import { closeConfirmation } from './variants/close-confirmation.js';
import { indentEffect } from './variants/indent-effect.js';
import { main } from './variants/main.js';
import { mobileNavigation } from './variants/mobile-navigation.js';
import { nested } from './variants/nested.js';
import { nonModal } from './variants/non-modal.js';
import { position } from './variants/position.js';
import { snapPoints } from './variants/snap-points.js';
import { swipeToOpen } from './variants/swipe-to-open.js';
import { virtualKeyboardAware } from './variants/virtual-keyboard-aware.js';

export const variants = {
  main,
  position,
  nested,
  snapPoints,
  virtualKeyboardAware,
  indentEffect,
  nonModal,
  mobileNavigation,
  swipeToOpen,
  closeConfirmation,
  actionSheetWithSeparateDestructiveAction,
};

export const Drawer = {
  ...CommonDrawer,
  variants,
};

export { drawerButtonStyles, CommonDrawer } from './common.js';
