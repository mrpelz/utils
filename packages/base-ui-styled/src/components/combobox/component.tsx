import { CommonCombobox } from './common.js';
import { asyncSearchMultiple } from './variants/async-search-multiple.js';
import { asyncSearchSingle } from './variants/async-search-single.js';
import { creatable } from './variants/creatable.js';
import { grouped } from './variants/grouped.js';
import { inputInsidePopup } from './variants/input-inside-popup.js';
import { main } from './variants/main.js';
import { multipleSelect } from './variants/multiple-select.js';
import { virtualized } from './variants/virtualized.js';

export const variants = {
  main,
  multipleSelect,
  inputInsidePopup,
  grouped,
  asyncSearchSingle,
  asyncSearchMultiple,
  creatable,
  virtualized,
};

export const Combobox = {
  ...CommonCombobox,
  variants,
};

export { iconButtonStyles, CommonCombobox, itemBaseStyles } from './common.js';
