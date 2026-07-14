import { CommonToast } from './common.js';
import { anchoredToasts } from './variants/anchored-toasts.js';
import { custom } from './variants/custom.js';
import { customPosition } from './variants/custom-position.js';
import { deduplicatedToast } from './variants/deduplicated-toast.js';
import { main } from './variants/main.js';
import { promise } from './variants/promise.js';
import { undoAction } from './variants/undo-action.js';
import { varyingHeights } from './variants/varying-heights.js';

export const variants = {
  main,
  anchoredToasts,
  customPosition,
  undoAction,
  promise,
  custom,
  deduplicatedToast,
  varyingHeights,
};

export const Toast = {
  ...CommonToast,
  variants,
};

export { CommonToast, toastButtonStyles } from './common.js';
